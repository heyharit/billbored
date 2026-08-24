import React from 'react';
import type { ActivityItem } from '../types';
import { formatMoney, formatTimeAgo } from '../utils';

interface Props {
  activities: ActivityItem[];
}

export const LatestActivity: React.FC<Props> = ({ activities }) => {
  return (
    <div className="border border-[#333] bg-black">
      <div className="p-3 border-b border-[#333] bg-white text-black font-black uppercase text-sm tracking-widest flex justify-between items-center">
        <span>Trading Tape</span>
        <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
      </div>
      
      <div className="flex flex-col">
        {activities.map((act, i) => (
          <div 
            key={act.id} 
            className={`p-3 font-mono text-xs flex flex-col gap-1 ${
              i !== activities.length - 1 ? 'border-b border-[#333]' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="text-white font-bold truncate max-w-[150px]">
                {act.url}
              </span>
              <span className="text-gray-500 text-[10px]">
                {formatTimeAgo(act.timestamp)}
              </span>
            </div>
            
            <div className="flex justify-between items-center mt-1">
              {act.type === 'BUYOUT' ? (
                <>
                  <span className="text-red-500 bg-red-500/10 px-1 border border-red-500/30">
                    BOUGHT RANK #{act.rank}
                  </span>
                  <span className="text-white">{formatMoney(act.pricePaid)}</span>
                </>
              ) : (
                <>
                  <span className="text-green-500 bg-green-500/10 px-1 border border-green-500/30">
                    NEW LISTING #{act.rank}
                  </span>
                  <span className="text-white">{formatMoney(act.pricePaid)}</span>
                </>
              )}
            </div>
            
            {act.profitMade > 0 && (
              <div className="text-[10px] text-green-500 mt-1">
                ↳ PREVIOUS OWNER MADE +{formatMoney(act.profitMade)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
