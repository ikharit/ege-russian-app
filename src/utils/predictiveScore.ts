import { PredictiveScore } from '../types';
import type { ProgressState } from '../stores/progressStore';

type PredictiveScoreInput = Pick<ProgressState, 'taskStats' | 'examResults' | 'userStats' | 'lessonProgress' | 'wrongAnswers'>;

// Max primary scores for EGE tasks (scaled to total 58 for intuitive scale)
// Tasks 1-24: 2 points each, task 25: 6 points, task 26: 4 points
const TASK_MAX_SCORES: Record<number, number> = {
  1: 2, 2: 2, 3: 2, 4: 2, 5: 2, 6: 2, 7: 2, 8: 2, 9: 2, 10: 2,
  11: 2, 12: 2, 13: 2, 14: 2, 15: 2, 16: 2, 17: 2, 18: 2, 19: 2, 20: 2,
  21: 2, 22: 2, 23: 2, 24: 2, 25: 6, 26: 4,
};

const MAX_PRIMARY_TOTAL = 58;
const SECONDARY_MULTIPLIER = 100 / MAX_PRIMARY_TOTAL; // ≈ 1.724

// XP-to-primary ratio approximation (calibrated empirically)
const XP_PER_PRIMARY_POINT = 45;
// Average time per XP in minutes
const AVG_MINUTES_PER_XP = 0.5;

const THRESHOLD_SCORE = 36;
const GOOD_SCORE = 60;
const EXCELLENT_SCORE = 80;

export function getPredictiveScore(state: PredictiveScoreInput, daysToExam = 180): PredictiveScore {
  const taskStats = state.taskStats || {};
  const examResults = state.examResults || [];
  const userStats = state.userStats;
  const lessonProgress = state.lessonProgress || {};

  let totalAnswers = 0;
  let totalCorrect = 0;
  const breakdown: Record<number, number> = {};

  // Calculate per-task accuracy and predicted score
  for (let taskNum = 1; taskNum <= 26; taskNum++) {
    const stat = taskStats[String(taskNum)];
    let accuracy: number;

    if (stat && stat.total > 0) {
      accuracy = stat.correct / stat.total;
      totalAnswers += stat.total;
      totalCorrect += stat.correct;
    } else {
      // No data: default to 50% for unknown tasks, but lower confidence
      accuracy = 0.5;
    }

    const maxScore = TASK_MAX_SCORES[taskNum] || 0;
    breakdown[taskNum] = Math.round(accuracy * maxScore * 10) / 10;
  }

  // Boost accuracy from exam results if available
  if (examResults.length > 0) {
    const latest = examResults[examResults.length - 1];
    if (latest?.taskScores) {
      for (let taskNum = 1; taskNum <= 26; taskNum++) {
        const examScore = latest.taskScores[taskNum];
        if (examScore !== undefined && examScore >= 0) {
          const maxScore = TASK_MAX_SCORES[taskNum] || 1;
          const examAccuracy = examScore / maxScore;
          // Weighted average: 60% practice + 40% exam (exam is more reliable per-question but may have fewer questions)
          const practiceAccuracy = taskStats[String(taskNum)] && taskStats[String(taskNum)].total > 0
            ? taskStats[String(taskNum)].correct / taskStats[String(taskNum)].total
            : 0.5;
          const blendedAccuracy = (practiceAccuracy * 0.6) + (examAccuracy * 0.4);
          breakdown[taskNum] = Math.round(blendedAccuracy * maxScore * 10) / 10;
        }
      }
    }
  }

  // Sum up predicted primary score
  let predictedPrimary = 0;
  for (let taskNum = 1; taskNum <= 26; taskNum++) {
    predictedPrimary += breakdown[taskNum];
  }
  predictedPrimary = Math.round(predictedPrimary * 10) / 10;
  predictedPrimary = Math.min(MAX_PRIMARY_TOTAL, Math.max(0, predictedPrimary));

  // Convert to secondary (test) score
  const predictedSecondary = Math.round(predictedPrimary * SECONDARY_MULTIPLIER);

  // Confidence: based on total answers (more data = higher confidence)
  // Target: 500 answers for 100% confidence
  const confidence = Math.min(1, totalAnswers / 500);

  // Calculate needed XP for each threshold based on current pace
  const totalXP = userStats?.xp || 0;
  const totalLessonsCompleted = Object.values(lessonProgress).filter(l => l.status === 'completed').length;

  // Days since start (heuristic: first lesson completion or 30 days ago if nothing)
  let daysSinceStart = 30;
  const completedDates = Object.values(lessonProgress)
    .filter(l => l.completedAt)
    .map(l => new Date(l.completedAt!).getTime())
    .sort((a, b) => a - b);
  if (completedDates.length > 0) {
    const firstDate = completedDates[0];
    const now = Date.now();
    daysSinceStart = Math.max(1, Math.floor((now - firstDate) / (1000 * 60 * 60 * 24)));
  }

  const xpPerDay = totalXP / daysSinceStart;
  const xpPerPrimaryPoint = XP_PER_PRIMARY_POINT;

  function neededXP(targetSecondary: number): number {
    const neededPrimary = targetSecondary / SECONDARY_MULTIPLIER;
    const primaryGap = Math.max(0, neededPrimary - predictedPrimary);
    return Math.round(primaryGap * xpPerPrimaryPoint);
  }

  const neededForThreshold = neededXP(THRESHOLD_SCORE);
  const neededForGood = neededXP(GOOD_SCORE);
  const neededForExcellent = neededXP(EXCELLENT_SCORE);

  // Recommended daily minutes to reach the closest realistic goal
  const closestGoal = predictedSecondary < THRESHOLD_SCORE ? THRESHOLD_SCORE
    : predictedSecondary < GOOD_SCORE ? GOOD_SCORE
    : predictedSecondary < EXCELLENT_SCORE ? EXCELLENT_SCORE : 100;

  const neededForClosest = neededXP(closestGoal);
  const daysToExamSafe = Math.max(1, daysToExam);

  let recommendedDaily: number;
  if (xpPerDay > 0) {
    const projectedDays = neededForClosest / xpPerDay;
    if (projectedDays <= daysToExamSafe) {
      // On track: maintain current pace
      recommendedDaily = Math.round(xpPerDay * AVG_MINUTES_PER_XP);
    } else {
      // Behind: need to increase pace
      const neededXpPerDay = neededForClosest / daysToExamSafe;
      recommendedDaily = Math.round(neededXpPerDay * AVG_MINUTES_PER_XP);
    }
  } else {
    // No XP yet: estimate from scratch
    recommendedDaily = Math.round((neededForClosest / daysToExamSafe) * AVG_MINUTES_PER_XP);
  }
  recommendedDaily = Math.max(10, Math.min(240, recommendedDaily));

  // Cap predictions realistically
  const finalPrimary = Math.round(predictedPrimary * 10) / 10;
  const finalSecondary = Math.min(100, Math.max(0, predictedSecondary));

  return {
    predictedPrimary: finalPrimary,
    predictedSecondary: finalSecondary,
    confidence: Math.round(confidence * 100) / 100,
    breakdown,
    neededForThreshold,
    neededForGood,
    neededForExcellent,
    timeToExam: daysToExam,
    recommendedDaily,
  };
}

export function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Отлично', color: 'text-green-600' };
  if (score >= 60) return { label: 'Хорошо', color: 'text-blue-600' };
  if (score >= 36) return { label: 'Проходной балл', color: 'text-yellow-600' };
  return { label: 'Ниже порога', color: 'text-red-600' };
}

export function getWeakTasks(breakdown: Record<number, number>, limit = 3): { taskNumber: number; gap: number }[] {
  const tasks: { taskNumber: number; gap: number }[] = [];
  for (let taskNum = 1; taskNum <= 26; taskNum++) {
    const maxScore = TASK_MAX_SCORES[taskNum] || 0;
    if (maxScore === 0) continue;
    const current = breakdown[taskNum] || 0;
    const gap = maxScore - current;
    if (gap > 0) {
      tasks.push({ taskNumber: taskNum, gap });
    }
  }
  tasks.sort((a, b) => b.gap - a.gap);
  return tasks.slice(0, limit);
}
