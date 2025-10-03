'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import WeekView from '@/components/WeekView';
import MonthView from '@/components/MonthView';
import ManageView from '@/components/ManageView';

type ActiveTab = 'week' | 'month' | 'manage';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('week');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'week':
        return <WeekView key="week-view" />;
      case 'month':
        return <MonthView />;
      case 'manage':
        return <ManageView />;
      default:
        return <WeekView />;
    }
  };

  return (
    <main className="min-h-screen">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="pb-8">
        {renderActiveView()}
      </div>
    </main>
  );
}
