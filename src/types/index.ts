export type Impact = 'laag' | 'middel' | 'hoog';
export type Category = 'huis' | 'DJ' | 'persoonlijk';

export interface Todo {
  id: string;
  title: string;
  category: Category;
  impact: Impact;
  active: boolean;
  can_repeat: boolean;
  min_weeks_between: number;
  last_planned_week?: number;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  id: string;
  week_size: number;
  max_high_per_week: number;
  max_medium_per_week: number;
  created_at: string;
  updated_at: string;
}

export interface Reward {
  id: string;
  threshold_points: number;
  reward_name: string;
  selected: boolean;
  selected_at?: string;
  claimed: boolean;
  claimed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface WeeklyTodo extends Todo {
  points: number;
  is_available: boolean;
  weeks_since_completed: number;
}

export interface MonthlyStats {
  total_points: number;
  available_points: number;
  completed_todos: Todo[];
  earned_rewards: Reward[];
}