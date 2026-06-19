import { PredictiveScore } from '../types';
import type { ProgressState } from '../stores/progressStore';

type PredictiveScoreInput = Pick<ProgressState, 'taskStats' | 'examResults' | 'userStats' | 'lessonProgress' | 'wrongAnswers' | 'examDate'> & {
  srsData?: Record<string, any>;
  atomProgress?: Record<string, any>;
};

const MAX_PRIMARY_TOTAL = 58;
const SECONDARY_MULTIPLIER = 100 / MAX_PRIMARY_TOTAL;

const NUM_TASKS = 26;
const FEATURE_COUNT = NUM_TASKS + 5;

const LEARNING_RATE = 0.01;
const WEIGHTS_KEY = 'ege-predictive-weights';
const BIAS_KEY = 'ege-predictive-bias';

function extractFeatures(state: PredictiveScoreInput): number[] {
  const features: number[] = [];

  for (let i = 1; i <= NUM_TASKS; i++) {
    const stat = state.taskStats?.[String(i)];
    if (stat && stat.total > 0) {
      features.push(stat.correct / stat.total);
    } else {
      features.push(0.5);
    }
  }

  features.push(Math.min((state.userStats?.streak || 0) / 30, 1));

  const totalAnswered = state.userStats?.totalQuestionsAnswered || 0;
  features.push(Math.min(totalAnswered / 500, 1));

  const daysToExam = state.examDate
    ? Math.max(0, Math.ceil((new Date(state.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 180;
  features.push(Math.min(daysToExam / 365, 1));

  const weakAtoms = Object.values(state.atomProgress || {}).filter((a: any) => a && a.accuracy < 50).length;
  features.push(Math.min(weakAtoms / 20, 1));

  const now = new Date().toISOString();
  const dueCount = Object.values(state.srsData || {}).filter((item: any) => item.nextReview <= now).length;
  features.push(Math.min(dueCount / 50, 1));

  return features;
}

function loadWeights(): { weights: number[]; bias: number } {
  try {
    const w = localStorage.getItem(WEIGHTS_KEY);
    const b = localStorage.getItem(BIAS_KEY);
    if (w && b) {
      return { weights: JSON.parse(w), bias: JSON.parse(b) };
    }
  } catch {}
  return {
    weights: Array(FEATURE_COUNT).fill(0.02),
    bias: 30,
  };
}

function saveWeights(weights: number[], bias: number): void {
  try {
    localStorage.setItem(WEIGHTS_KEY, JSON.stringify(weights));
    localStorage.setItem(BIAS_KEY, JSON.stringify(bias));
  } catch {}
}

function predict(features: number[], weights: number[], bias: number): number {
  let score = bias;
  for (let i = 0; i < features.length; i++) {
    score += features[i] * weights[i];
  }
  return Math.max(0, Math.min(100, score));
}

export function trainPredictiveModel(
  state: PredictiveScoreInput,
  actualSecondaryScore: number
): void {
  const features = extractFeatures(state);
  const { weights, bias } = loadWeights();

  const predicted = predict(features, weights, bias);
  const error = predicted - actualSecondaryScore;

  const newBias = bias - LEARNING_RATE * error;
  const newWeights = weights.map((w, i) => w - LEARNING_RATE * error * features[i]);

  saveWeights(newWeights, newBias);
}

export function getPredictiveScore(state: PredictiveScoreInput, daysToExam = 180): PredictiveScore {
  const features = extractFeatures(state);
  const { weights, bias } = loadWeights();
  const predictedSecondary = predict(features, weights, bias);

  const breakdown: Record<number, number> = {};
  let predictedPrimary = 0;
  for (let i = 1; i <= NUM_TASKS; i++) {
    const taskAcc = features[i - 1];
    const maxScore = i <= 24 ? 2 : i === 25 ? 6 : 4;
    const taskPredicted = Math.round(taskAcc * maxScore * 10) / 10;
    breakdown[i] = taskPredicted;
    predictedPrimary += taskPredicted;
  }

  const secondary = Math.round(predictedSecondary * 10) / 10;
  const primary = Math.round(predictedPrimary * 10) / 10;

  // Calculate needed scores for milestones
  const neededForThreshold = Math.max(0, 36 - primary);
  const neededForGood = Math.max(0, 60 - primary);
  const neededForExcellent = Math.max(0, 80 - primary);
  const recommendedDaily = daysToExam > 0 ? Math.ceil((neededForGood * 45) / daysToExam) : 45;

  return {
    predictedPrimary: primary,
    predictedSecondary: secondary,
    breakdown,
    confidence: 0.7,
    neededForThreshold,
    neededForGood,
    neededForExcellent,
    timeToExam: daysToExam,
    recommendedDaily,
  };
}

export function getWeakTasks(breakdown: Record<number, number>, limit = 5): { taskNumber: number; predictedScore: number; gap: number }[] {
  const maxScores: Record<number, number> = {};
  for (let i = 1; i <= 26; i++) {
    maxScores[i] = i <= 24 ? 2 : i === 25 ? 6 : 4;
  }
  return Object.entries(breakdown)
    .map(([task, score]) => ({
      taskNumber: Number(task),
      predictedScore: score,
      gap: maxScores[Number(task)] - score,
    }))
    .sort((a, b) => a.predictedScore - b.predictedScore)
    .slice(0, limit);
}
