import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Impact, Todo, WeeklyTodo } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPointsForImpact(impact: Impact): number {
  switch (impact) {
    case 'laag': return 5;
    case 'middel': return 10;
    case 'hoog': return 20;
    default: return 0;
  }
}

export function getCurrentWeek(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.floor(diff / oneWeek) + 1;
}

export function getCurrentMonth(): number {
  return new Date().getMonth() + 1;
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function getWeeksSinceCompleted(completedAt: string | null): number {
  if (!completedAt) return 999;
  
  const completed = new Date(completedAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - completed.getTime());
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
  
  return diffWeeks;
}

export function isAvailableForSelection(todo: Todo): boolean {
  if (!todo.active) return false;
  
  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();
  
  // Check if completed this month
  if (todo.completed_at) {
    const completedDate = new Date(todo.completed_at);
    const completedMonth = completedDate.getMonth() + 1;
    const completedYear = completedDate.getFullYear();
    
    if (completedYear === currentYear && completedMonth === currentMonth) {
      if (!todo.can_repeat) return false;
    }
  }
  
  // Check minimum weeks between if repeatable
  if (todo.can_repeat && todo.completed_at) {
    const weeksSince = getWeeksSinceCompleted(todo.completed_at);
    if (weeksSince < todo.min_weeks_between) return false;
  }
  
  return true;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateWeeklyTodos(
  todos: Todo[],
  weekSize: number = 5,
  maxHigh: number = 2,
  maxMedium: number = 2
): Todo[] {
  const available = todos.filter(isAvailableForSelection);
  
  const high = shuffleArray(available.filter(t => t.impact === 'hoog')).slice(0, maxHigh);
  const medium = shuffleArray(available.filter(t => t.impact === 'middel')).slice(0, maxMedium);
  
  const remainingSlots = weekSize - high.length - medium.length;
  const low = shuffleArray(available.filter(t => t.impact === 'laag')).slice(0, remainingSlots);
  
  return [...high, ...medium, ...low];
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}
