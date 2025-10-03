'use client';

import { useState } from 'react';
import { Calendar, Trophy, Settings, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: 'week' | 'month' | 'manage';
  onTabChange: (tab: 'week' | 'month' | 'manage') => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'week' as const, label: 'Deze Week', icon: CheckSquare },
    { id: 'month' as const, label: 'Maand', icon: Trophy },
    { id: 'manage' as const, label: 'Beheer', icon: Settings },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-primary-200 sticky top-0 z-10">
      <div className="max-w-md mx-auto px-4">
        <div className="flex flex-col items-center justify-center h-20 pb-2">
          <h1 className="text-3xl font-display font-bold text-primary-600 tracking-tight">
            DO IT WITH JUUL! 💜
          </h1>
        </div>
        
        <div className="flex space-x-1 pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-primary-600 hover:bg-primary-100'
                )}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
