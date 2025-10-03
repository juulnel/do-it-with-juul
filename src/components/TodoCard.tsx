'use client';

import { Check, Heart, Home, Music } from 'lucide-react';
import { Todo, Impact } from '@/types';
import { getPointsForImpact, cn } from '@/lib/utils';

interface TodoCardProps {
  todo: Todo;
  onComplete?: (id: string) => void;
  showCompleteButton?: boolean;
  completed?: boolean;
}

const impactConfig = {
  laag: { 
    color: 'text-green-600', 
    bg: 'bg-green-50 border-green-200',
    badge: 'bg-green-100 text-green-700'
  },
  middel: { 
    color: 'text-yellow-600', 
    bg: 'bg-yellow-50 border-yellow-200',
    badge: 'bg-yellow-100 text-yellow-700'
  },
  hoog: { 
    color: 'text-red-600', 
    bg: 'bg-red-50 border-red-200',
    badge: 'bg-red-100 text-red-700'
  }
};

const categoryConfig = {
  huis: { 
    icon: Home, 
    color: 'text-blue-600',
    bg: 'bg-blue-100'
  },
  DJ: { 
    icon: Music, 
    color: 'text-purple-600',
    bg: 'bg-purple-100'
  },
  persoonlijk: { 
    icon: Heart, 
    color: 'text-pink-600',
    bg: 'bg-pink-100'
  }
};

export default function TodoCard({ todo, onComplete, showCompleteButton = false, completed = false }: TodoCardProps) {
  const config = impactConfig[todo.impact];
  const categoryConf = categoryConfig[todo.category];
  const CategoryIcon = categoryConf.icon;
  const points = getPointsForImpact(todo.impact);

  return (
    <div className={cn(
      'p-4 rounded-xl border-2 transition-all duration-200',
      completed ? 'bg-gray-50 border-gray-200 opacity-75' : config.bg,
      showCompleteButton && !completed && 'hover:shadow-md cursor-pointer'
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <CategoryIcon className={cn('w-4 h-4', completed ? 'text-gray-400' : categoryConf.color)} />
            <span className={cn(
              'text-xs px-2 py-1 rounded-full font-medium', 
              completed ? 'bg-gray-100 text-gray-500' : config.badge
            )}>
              {todo.impact} • {points}pt
            </span>
          </div>
          
          <h3 className={cn(
            'font-medium text-gray-900 leading-tight',
            completed && 'line-through text-gray-500'
          )}>
            {todo.title}
          </h3>
          
          {todo.can_repeat && (
            <p className="text-xs text-gray-500 mt-1">
              Herhaalbaar • Min {todo.min_weeks_between} weken tussen
            </p>
          )}
        </div>
        
        {showCompleteButton && (
          <button
            onClick={() => !completed && onComplete?.(todo.id)}
            disabled={completed}
            className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border-2",
              completed 
                ? "bg-primary-500 border-primary-500 text-white cursor-default"
                : "bg-white border-primary-300 hover:border-primary-500 hover:bg-primary-50 text-primary-500 hover:scale-105"
            )}
          >
            {completed && <Check size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}
