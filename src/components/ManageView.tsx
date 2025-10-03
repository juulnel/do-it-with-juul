'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Save, X } from 'lucide-react';
import { Todo, Category, Impact, Reward } from '@/types';
import { getTodos, createTodo, updateTodo, getRewards, addReward } from '@/lib/database';
import TodoCard from './TodoCard';
import { cn } from '@/lib/utils';

interface TodoFormData {
  title: string;
  category: Category;
  impact: Impact;
  can_repeat: boolean;
  min_weeks_between: number;
  active: boolean;
}

const initialFormData: TodoFormData = {
  title: '',
  category: 'huis',
  impact: 'laag',
  can_repeat: true,
  min_weeks_between: 1,
  active: true,
};

export default function ManageView() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showRewardForm, setShowRewardForm] = useState(false);
  const [formData, setFormData] = useState<TodoFormData>(initialFormData);
  const [rewardForm, setRewardForm] = useState({ points: '', name: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [todosData, rewardsData] = await Promise.all([
        getTodos(),
        getRewards()
      ]);
      setTodos(todosData);
      setRewards(rewardsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newTodo = await createTodo(formData);
      setTodos(prev => [newTodo, ...prev]);
      setFormData(initialFormData);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleSubmitReward = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const points = parseInt(rewardForm.points);
      if (isNaN(points) || points <= 0) return;
      
      const newReward = await addReward(points, rewardForm.name);
      setRewards(prev => [...prev, newReward].sort((a, b) => a.threshold_points - b.threshold_points));
      setRewardForm({ points: '', name: '' });
      setShowRewardForm(false);
    } catch (error) {
      console.error('Error creating reward:', error);
    }
  };

  const toggleTodoActive = async (todo: Todo) => {
    try {
      const updated = await updateTodo(todo.id, { active: !todo.active });
      setTodos(prev => prev.map(t => t.id === todo.id ? updated : t));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-4">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Beheer</h2>
        <p className="text-gray-600">Beheer je taken en beloningen</p>
      </div>

      {/* Add Todo Button */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors"
        >
          <Plus size={16} />
          Nieuwe Taak
        </button>
        
        <button
          onClick={() => setShowRewardForm(!showRewardForm)}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-accent-500 hover:bg-accent-600 text-white font-medium rounded-xl transition-colors"
        >
          <Plus size={16} />
          Beloning
        </button>
      </div>

      {/* Add Todo Form */}
      {showAddForm && (
        <form onSubmit={handleSubmitTodo} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titel
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categorie
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Category }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="huis">Huis</option>
                <option value="DJ">DJ</option>
                <option value="persoonlijk">Persoonlijk</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Impact
              </label>
              <select
                value={formData.impact}
                onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value as Impact }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="laag">Laag (5pt)</option>
                <option value="middel">Middel (10pt)</option>
                <option value="hoog">Hoog (20pt)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.can_repeat}
                onChange={(e) => setFormData(prev => ({ ...prev, can_repeat: e.target.checked }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Herhaalbaar</span>
            </label>

            {formData.can_repeat && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Min weken:</label>
                <input
                  type="number"
                  min="0"
                  max="52"
                  value={formData.min_weeks_between}
                  onChange={(e) => setFormData(prev => ({ ...prev, min_weeks_between: parseInt(e.target.value) || 0 }))}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
            >
              <Save size={16} />
              Opslaan
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </form>
      )}

      {/* Add Reward Form */}
      {showRewardForm && (
        <form onSubmit={handleSubmitReward} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Punten
              </label>
              <input
                type="number"
                min="1"
                value={rewardForm.points}
                onChange={(e) => setRewardForm(prev => ({ ...prev, points: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beloning
              </label>
              <input
                type="text"
                value={rewardForm.name}
                onChange={(e) => setRewardForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-accent-500 hover:bg-accent-600 text-white font-medium rounded-lg transition-colors"
            >
              <Save size={16} />
              Opslaan
            </button>
            <button
              type="button"
              onClick={() => setShowRewardForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </form>
      )}

      {/* Rewards List */}
      {rewards.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Beloningen</h3>
          <div className="space-y-2">
            {rewards.map((reward) => (
              <div key={reward.id} className="bg-white/60 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{reward.reward_name}</p>
                  <p className="text-sm text-gray-600">{reward.threshold_points} punten</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Todos List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">
          Alle Taken ({todos.length})
        </h3>
        
        <div className="space-y-2">
          {todos.map((todo) => (
            <div key={todo.id} className="relative">
              <div className={cn(
                'transition-opacity duration-200',
                !todo.active && 'opacity-50'
              )}>
                <TodoCard todo={todo} />
              </div>
              
              <button
                onClick={() => toggleTodoActive(todo)}
                className={cn(
                  'absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded transition-colors',
                  todo.active 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {todo.active ? 'Actief' : 'Inactief'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
