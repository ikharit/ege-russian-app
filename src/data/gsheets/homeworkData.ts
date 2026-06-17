export interface HomeworkEntry {
  date: string;
  homework: string;
  status: string;
  comment: string;
  variants: Array<{
    name: string;
    success_rate?: string;
    task_number?: string;
    max_points?: string;
    actual_points?: string;
  }>;
  summary: Record<string, string>;
}

export interface StudentHomework {
  name: string;
  current: {
    date: string;
    homework: string;
    status: string;
    comment: string;
  } | null;
  history: HomeworkEntry[];
}

// Данные из Google Sheets (экспортированы через ege-app/src/export_data.py)
import екуData from './students/ЕКу.json';
import югData from './students/ЮГ.json';
import мгData from './students/МГ.json';
import зкData from './students/ЗК.json';
import мрData from './students/МР.json';
import хнData from './students/ХН.json';
import агData from './students/АГ.json';
import викторияData from './students/Виктория.json';
import левData from './students/Лев.json';

const rawData: Record<string, any[]> = {
  'ЕКу': екуData,
  'ЮГ': югData,
  'МГ': мгData,
  'ЗК': зкData,
  'МР': мрData,
  'ХН': хнData,
  'АГ': агData,
  'Виктория': викторияData,
  'Лев': левData,
};

function parseDate(dateStr: string): Date | null {
  if (!dateStr?.trim()) return null;
  const monthsRu: Record<string, number> = {
    'январь': 1, 'февраль': 2, 'март': 3, 'апрель': 4,
    'май': 5, 'июнь': 6, 'июль': 7, 'август': 8,
    'сентябрь': 9, 'октябрь': 10, 'ноябрь': 11, 'декабрь': 12,
    'янв': 1, 'фев': 2, 'мар': 3, 'апр': 4,
    'июн': 6, 'июл': 7, 'авг': 8, 'сен': 9, 'окт': 10, 'ноя': 11, 'дек': 12,
  };
  const ds = dateStr.trim().toLowerCase();
  if (monthsRu[ds]) {
    return new Date(2025, monthsRu[ds] - 1, 1);
  }
  const parts = ds.split('.');
  if (parts.length === 3) {
    const [d, m, y] = parts;
    let year = parseInt(y);
    if (year < 100) year += 2000;
    return new Date(year, parseInt(m) - 1, parseInt(d));
  }
  return null;
}

function isRealHomework(hw: string): boolean {
  if (!hw) return false;
  const lower = hw.toLowerCase();
  const skip = ['баллы', 'всего', 'сделано', 'не сделано', 'отчасти', 'посещение', 'сочинения', 'номера:', 'див/0', 'ref!', 'выполненные'];
  return !skip.some(k => lower.includes(k));
}

export const allHomework: Record<string, StudentHomework> = {};

for (const [name, entries] of Object.entries(rawData)) {
  const valid = entries
    .map(e => ({ ...e, _parsed: parseDate(e.date) }))
    .filter((e: any) => e._parsed && isRealHomework(e.homework))
    .sort((a: any, b: any) => a._parsed.getTime() - b._parsed.getTime());

  const current = valid.length > 0 ? valid[valid.length - 1] : null;

  allHomework[name] = {
    name,
    current: current ? {
      date: current.date,
      homework: current.homework,
      status: current.status || '',
      comment: current.comment || '',
    } : null,
    history: valid as HomeworkEntry[],
  };
}

export const nonstandardStudents = Object.entries(allHomework)
  .filter(([_, hw]) => hw.current === null)
  .map(([name]) => name);

export const studentsWithHomework = Object.entries(allHomework)
  .filter(([_, hw]) => hw.current !== null)
  .map(([name]) => name);
