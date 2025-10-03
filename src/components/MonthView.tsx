'use client';

import { useState, useEffect } from 'react';
import { Trophy, Star, Calendar, Gift, Check } from 'lucide-react';
import { MonthlyStats } from '@/types';
import { getMonthlyStats, selectReward, confirmReward, deselectReward } from '@/lib/database';
import TodoCard from './TodoCard';
import { formatDate, cn } from '@/lib/utils';

export default function MonthView() {
  const [stats, setStats] = useState<MonthlyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectingReward, setSelectingReward] = useState<string | null>(null);
  const [confirmingReward, setConfirmingReward] = useState<string | null>(null);
    const [showAllTodos, setShowAllTodos] = useState(false);

  useEffect(() => {
    loadMonthlyStats();
  }, []);

  const loadMonthlyStats = async () => {
    try {
      setLoading(true);
      const monthlyStats = await getMonthlyStats();
      setStats(monthlyStats);
    } catch (error) {
      console.error('Error loading monthly stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectReward = async (rewardId: string) => {
    try {
      setSelectingReward(rewardId);
      await selectReward(rewardId);
      await loadMonthlyStats();
    } catch (error) {
      console.error('Error selecting reward:', error);
    } finally {
      setSelectingReward(null);
    }
  };

  const handleConfirmReward = async (rewardId: string) => {
    try {
      setConfirmingReward(rewardId);
      await confirmReward(rewardId);
      await loadMonthlyStats();
    } catch (error) {
      console.error('Error confirming reward:', error);
    } finally {
      setConfirmingReward(null);
    }
  };

  const handleDeselectReward = async (rewardId: string) => {
    try {
      setSelectingReward(rewardId);
      await deselectReward(rewardId);
      await loadMonthlyStats();
    } catch (error) {
      console.error('Error deselecting reward:', error);
    } finally {
      setSelectingReward(null);
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

  if (!stats) {
    return (
      <div className="max-w-md mx-auto p-4">
        <div className="text-center py-12">
          <p className="text-gray-500">Geen data beschikbaar</p>
        </div>
      </div>
    );
  }
    console.log('Claimed rewards:', stats.earned_rewards.filter(r => r.claimed));

  const currentMonth = new Date().toLocaleDateString('nl-NL', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {currentMonth}
        </h2>
        <div className="flex items-center justify-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">
            {stats.completed_todos.length} taken afgerond
          </span>
        </div>
      </div>

       {/* Points Card */}
      <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-100 text-sm font-medium">Beschikbare Punten</p>
            <p className="text-3xl font-bold">{stats.available_points}</p>
            <p className="text-xs text-primary-200 mt-1">
              Totaal: {stats.total_points} punten
            </p>
          </div>
          <Trophy className="w-12 h-12 text-primary-200" />
        </div>
      </div>

      {/* Rewards */}
      {stats.earned_rewards.length > 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Gift className="w-5 h-5 text-accent-500" />
            <h3 className="font-semibold text-gray-900">Behaalde Beloningen</h3>
          </div>
          
          <div className="space-y-3">
            {stats.earned_rewards.map((reward) => {
              const canAfford = stats.available_points >= reward.threshold_points;
              const isSelected = reward.selected && !reward.claimed;
              const isClaimed = reward.claimed;
              
              return (
                <div 
                  key={reward.id} 
                  className={cn(
                    "rounded-lg p-3 border transition-all",
                    isClaimed 
                      ? "bg-gray-50 border-gray-200 opacity-60"
                      : isSelected
                      ? "bg-gradient-to-r from-accent-100 to-primary-100 border-accent-300"
                      : "bg-gradient-to-r from-accent-50 to-primary-50 border-accent-200"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={cn(
                        "font-medium",
                        isClaimed ? "line-through text-gray-500" : "text-gray-900"
                      )}>
                        {reward.reward_name}
                      </p>
                      <p className={cn(
                        "text-sm",
                        isClaimed ? "text-gray-400" : "text-gray-600"
                      )}>
                        {reward.threshold_points} punten
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Select/Deselect Button */}
                      {!isClaimed && (
                        <button
                          onClick={() => isSelected ? handleDeselectReward(reward.id) : handleSelectReward(reward.id)}
                          disabled={selectingReward === reward.id || (!canAfford && !isSelected)}
                          className={cn(
                            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border-2",
                            isSelected
                              ? "bg-accent-500 border-accent-500 text-white hover:bg-accent-600"
                              : canAfford
                              ? "bg-white border-accent-300 hover:border-accent-500 hover:bg-accent-50 text-accent-500"
                              : "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                          )}
                          title={isSelected ? "Klik om te deselecteren" : "Klik om te selecteren"}
                        >
                          {selectingReward === reward.id ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          ) : isSelected ? (
                            <Check size={16} />
                          ) : null}
                        </button>
                      )}
                      
                      {/* Confirm Button */}
                      {isSelected && !isClaimed && (
                        <button
                          onClick={() => handleConfirmReward(reward.id)}
                          disabled={confirmingReward === reward.id}
                          className="px-3 py-1 bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white text-xs font-medium rounded-full transition-colors"
                        >
                          {confirmingReward === reward.id ? (
                            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            'Bevestigen'
                          )}
                        </button>
                      )}
                      
                      {/* Claimed Checkmark */}
                      {isClaimed && (
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                          <Check size={16} className="text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!canAfford && !isSelected && !isClaimed && (
                    <p className="text-xs text-red-500 mt-1">
                      Niet genoeg punten (nog {reward.threshold_points - stats.available_points} nodig)
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No Rewards Yet */}
      {stats.earned_rewards.length === 0 && stats.total_points > 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center">
          <Gift className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 text-sm">
            Nog geen beloningen behaald dit maand
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Blijf taken afvinken voor je eerste beloning!
          </p>
        </div>
      )}

      {/* Completed Todos */}
      {stats.completed_todos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Afgeronde Taken</h3>
            <span className="text-sm text-gray-500">
              {stats.completed_todos.length} taken
            </span>
          </div>
          <div className="space-y-2">
            {stats.completed_todos
              .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
              .slice(0, showAllTodos ? undefined : 5)
              .map((todo) => (
                <div key={todo.id} className="space-y-1">
                  <TodoCard todo={todo} completed />
                  {todo.completed_at && (
                    <p className="text-xs text-gray-500 pl-4">
                      Afgerond op {formatDate(todo.completed_at)}
                    </p>
                  )}
                </div>
              ))}
          </div>
          
          {stats.completed_todos.length > 5 && (
            <div className="text-center">
              <button
                onClick={() => setShowAllTodos(!showAllTodos)}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
              >
                {showAllTodos 
                  ? `Toon minder (${stats.completed_todos.length - 5} verbergen)`
                  : `Toon alle ${stats.completed_todos.length} taken`
                }
              </button>
            </div>
          )}
        </div>
      )}

      {/* Claimed Rewards Section */}
      {stats.earned_rewards.some(reward => reward.claimed) && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-accent-500" />
            <h3 className="text-lg font-semibold text-gray-900">Geïnde Beloningen</h3>
          </div>
          
          <div className="space-y-2">
            {stats.earned_rewards
              .filter(reward => reward.claimed)
              .sort((a, b) => new Date(b.claimed_at!).getTime() - new Date(a.claimed_at!).getTime())
              .map((reward) => (
                <div key={reward.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 opacity-75">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-500 line-through">
                        {reward.reward_name}
                      </p>
                      <p className="text-sm text-gray-400">
                        {reward.threshold_points} punten • Geïnd op {formatDate(reward.claimed_at!)}
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                      <Check size={16} className="text-white" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {stats.completed_todos.length === 0 && (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-1">Nog geen taken afgerond deze maand</p>
          <p className="text-sm text-gray-400">
            Ga naar 'Deze Week' om te beginnen!
          </p>
        </div>
      )}
    </div>
  );
}
