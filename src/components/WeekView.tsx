'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, Trophy } from 'lucide-react';
import { Todo } from '@/types';
import { getWeeklyTodos, generateNewWeek, completeTodo } from '@/lib/database';
import { getPointsForImpact } from '@/lib/utils';
import TodoCard from './TodoCard';
import { cn } from '@/lib/utils';

export default function WeekView() {
  const [weeklyTodos, setWeeklyTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [lastReload, setLastReload] = useState(Date.now());

  useEffect(() => {
    loadWeeklyTodos();
  }, []);

  // Reload when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadWeeklyTodos();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const loadWeeklyTodos = async () => {
    try {
      setLoading(true);
      const todos = await getWeeklyTodos();
      setWeeklyTodos(todos);
    } catch (error) {
      console.error('Error loading weekly todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateWeek = async () => {
    try {
      setGenerating(true);
      const newTodos = await generateNewWeek();
      setWeeklyTodos(newTodos);
    } catch (error) {
      console.error('Error generating week:', error);
    } finally {
      setGenerating(false);
    }
  };

const handleCompleteTodo = async (id: string) => {
  try {
    const completedTodo = await completeTodo(id);
    // Update the todo in the list instead of removing it
    setWeeklyTodos(prev => prev.map(todo => 
      todo.id === id ? completedTodo : todo
    ));
  } catch (error) {
    console.error('Error completing todo:', error);
  }
};

  const activeTodos = weeklyTodos.filter(todo => !todo.completed_at);
  const completedTodos = weeklyTodos.filter(todo => todo.completed_at);
  const completedCount = completedTodos.length;
  
  // Calculate week points
  const weekPoints = completedTodos.reduce((total, todo) => 
    total + getPointsForImpact(todo.impact), 0
  );

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-4">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-primary-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Deze Week</h2>
        
        {/* Week Points Circle */}
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex flex-col items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">{weekPoints}</span>
            <span className="text-xs text-primary-100 font-medium">punten</span>
          </div>
        </div>
        
        <p className="text-gray-600">
          {activeTodos.length} taken over • {completedCount} afgerond
        </p>
      </div>

      {/* Progress */}
      {weeklyTodos.length > 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Voortgang</span>
            <span className="text-sm text-gray-600">
              {completedCount}/{weeklyTodos.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${weeklyTodos.length > 0 ? (completedCount / weeklyTodos.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Generate Week Button */}
      {activeTodos.length === 0 && (
        <div className="text-center space-y-6">
          {/* Start Image */}
          <div className="flex justify-center">
            <img 
              src="/DoItWithJuul.png" 
              alt="Multitasking vrouw" 
              className="w-96 h-auto object-cover rounded-2xl shadow-lg"
            />
          </div>
          
          {/* Welcome Message */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-800">
              Klaar voor een nieuwe week? 🚀
            </h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              Genereer je persoonlijke takenlijst en begin met het verdienen van punten!
            </p>
          </div>
          
          <button
            onClick={handleGenerateWeek}
            disabled={generating}
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-xl shadow-lg transition-all duration-200',
              generating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:scale-105'
            )}
          >
            {generating ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            {generating ? 'Genereren...' : 'Genereer Nieuwe Week'}
          </button>
        </div>
      )}

      {/* All Todos */}
      {weeklyTodos.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Deze week</h3>
          {weeklyTodos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onComplete={handleCompleteTodo}
              showCompleteButton
              completed={!!todo.completed_at}
            />
          ))}
        </div>
      )}

      {/* Regenerate Button */}
      {activeTodos.length > 0 && (
        <div className="text-center pt-4">
          <button
            onClick={handleGenerateWeek}
            disabled={generating}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
          >
            Nieuwe week genereren
          </button>
        </div>
      )}
    </div>
  );
}
