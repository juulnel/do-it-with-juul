import { supabase } from './supabase';
import { Todo, Settings, Reward, MonthlyStats } from '@/types';
import { getCurrentMonth, getCurrentYear, getPointsForImpact, generateWeeklyTodos, getCurrentWeek } from './utils';

export async function getTodos(): Promise<Todo[]> {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getSettings(): Promise<Settings> {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .limit(1)
    .single();
  
  if (error) throw error;
  return data;
}

export async function getRewards(): Promise<Reward[]> {
  const { data, error } = await supabase
    .from('rewards')
    .select('*')
    .order('threshold_points', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function createTodo(todo: Omit<Todo, 'id' | 'created_at' | 'updated_at'>): Promise<Todo> {
  const { data, error } = await supabase
    .from('todos')
    .insert(todo)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
  const { data, error } = await supabase
    .from('todos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function completeTodo(id: string): Promise<Todo> {
  return updateTodo(id, { completed_at: new Date().toISOString() });
}

export async function getWeeklyTodos(): Promise<Todo[]> {
  const currentWeek = getCurrentWeek();
  
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('last_planned_week', currentWeek);
  
  if (error) throw error;
  return data || [];
}

export async function generateNewWeek(): Promise<Todo[]> {
  const [todos, settings] = await Promise.all([
    getTodos(),
    getSettings()
  ]);
  
  const selectedTodos = generateWeeklyTodos(
    todos,
    settings.week_size,
    settings.max_high_per_week,
    settings.max_medium_per_week
  );
  
  const currentWeek = getCurrentWeek();
  
  // First, clear last_planned_week for all completed todos from this week
  await supabase
    .from('todos')
    .update({ last_planned_week: null })
    .eq('last_planned_week', currentWeek)
    .not('completed_at', 'is', null);
  
  // Update selected todos with current week
  const updates = selectedTodos.map(todo => 
    updateTodo(todo.id, { last_planned_week: currentWeek })
  );
  
  await Promise.all(updates);
  
  return selectedTodos;
}

export async function getMonthlyStats(): Promise<MonthlyStats> {
  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();
  
  const startOfMonth = new Date(currentYear, currentMonth - 1, 1).toISOString();
  const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59).toISOString();
  
  const { data: completedTodos, error } = await supabase
    .from('todos')
    .select('*')
    .gte('completed_at', startOfMonth)
    .lte('completed_at', endOfMonth)
    .not('completed_at', 'is', null);
  
  if (error) throw error;
  
  const todos = completedTodos || [];
  const totalPoints = todos.reduce((sum, todo) => sum + getPointsForImpact(todo.impact), 0);
  
  const rewards = await getRewards();
    const earnedRewards = rewards.filter(reward => 
    totalPoints >= reward.threshold_points && !reward.claimed
  );
  
  // Calculate available points (total minus cost of claimed rewards)
  const claimedRewards = rewards.filter(reward => reward.claimed);
  const spentPoints = claimedRewards.reduce((sum, reward) => sum + reward.threshold_points, 0);
  const availablePoints = totalPoints - spentPoints;
  
  return {
    total_points: totalPoints,
    available_points: availablePoints,
    completed_todos: todos,
    earned_rewards: earnedRewards
  };
}

export async function addReward(thresholdPoints: number, rewardName: string): Promise<Reward> {
  const { data, error } = await supabase
    .from('rewards')
    .insert({
      threshold_points: thresholdPoints,
      reward_name: rewardName
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateSettings(updates: Partial<Omit<Settings, 'id' | 'created_at' | 'updated_at'>>): Promise<Settings> {
  const settings = await getSettings();
  
  const { data, error } = await supabase
    .from('settings')
    .update(updates)
    .eq('id', settings.id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function selectReward(id: string): Promise<Reward> {
  const { data, error } = await supabase
    .from('rewards')
    .update({ 
      selected: true, 
      selected_at: new Date().toISOString() 
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function confirmReward(id: string): Promise<Reward> {
  const { data, error } = await supabase
    .from('rewards')
    .update({ 
      claimed: true, 
      claimed_at: new Date().toISOString() 
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deselectReward(id: string): Promise<Reward> {
  const { data, error } = await supabase
    .from('rewards')
    .update({ 
      selected: false, 
      selected_at: null 
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}