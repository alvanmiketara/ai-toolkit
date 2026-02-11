import React, { useState, useEffect } from 'react';
import { GpuInfo } from '@/types';
import { Thermometer, Zap, Fan, Cpu, HardDrive } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import classNames from 'classnames';

interface GPUWidgetProps {
  gpu: GpuInfo;
}

const MAX_HISTORY = 30;

export default function GPUWidget({ gpu }: GPUWidgetProps) {
  const [history, setHistory] = useState<{ time: number; load: number; memory: number }[]>([]);

  // Effect to update history when gpu prop changes (every 1s)
  useEffect(() => {
    setHistory(prev => {
      const newPoint = {
        time: Date.now(),
        load: gpu.utilization.gpu,
        memory: (gpu.memory.used / gpu.memory.total) * 100
      };

      const newHistory = [...prev, newPoint];
      if (newHistory.length > MAX_HISTORY) {
        return newHistory.slice(newHistory.length - MAX_HISTORY);
      }
      return newHistory;
    });
  }, [gpu.utilization.gpu, gpu.memory.used]);

  const formatMemory = (mb: number): string => {
    return mb >= 1024 ? `${(mb / 1024).toFixed(1)}GB` : `${mb}MB`;
  };

  const getUtilizationColor = (value: number): string => {
    return value < 30 ? 'text-emerald-400' : value < 70 ? 'text-amber-400' : 'text-rose-400';
  };

  const memoryPercent = (gpu.memory.used / gpu.memory.total) * 100;

  return (
    <div className="bg-zinc-900/50 backdrop-blur-md rounded-xl border border-zinc-800 shadow-lg overflow-hidden flex flex-col hover:border-zinc-700 transition-colors group relative">
      {/* Header */}
      <div className="bg-zinc-900/80 px-4 py-3 flex items-center justify-between border-b border-zinc-800/50 z-10 relative">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 bg-zinc-800 rounded-lg">
             <Cpu className="w-4 h-4 text-primary-400" />
          </div>
          <div>
            <h2 className="font-semibold text-zinc-100 text-sm tracking-wide">{gpu.name}</h2>
            <div className="flex items-center space-x-2">
               <span className="text-xs text-zinc-500 font-mono">#{gpu.index}</span>
               <span className="text-xs text-zinc-700">•</span>
               <div className="flex items-center space-x-1">
                 <Thermometer size={10} className={gpu.temperature > 80 ? 'text-rose-500' : 'text-emerald-500'} />
                 <span className={classNames("text-xs font-mono", gpu.temperature > 80 ? 'text-rose-400' : 'text-emerald-400')}>{gpu.temperature}°C</span>
               </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
           <span className={classNames("text-lg font-mono font-bold leading-none", getUtilizationColor(gpu.utilization.gpu))}>
             {gpu.utilization.gpu}%
           </span>
           <span className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Load</span>
        </div>
      </div>

      {/* Sparkline Chart */}
      <div className="h-32 w-full bg-zinc-900/20 relative mt-[-1px]">
        {history.length > 2 && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="load"
                stroke="#8b5cf6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorLoad)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Stats Grid */}
      <div className="p-4 pt-2 space-y-4 bg-zinc-900/30">
        {/* VRAM Progress */}
        <div className="space-y-1">
           <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400 flex items-center gap-1.5 font-medium"><HardDrive size={12}/> VRAM Usage</span>
              <span className="text-zinc-300 font-mono">{memoryPercent.toFixed(1)}%</span>
           </div>
           <div className="relative h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
             <div
               className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300 ease-out"
               style={{ width: `${memoryPercent}%` }}
             />
           </div>
           <div className="flex justify-between text-[10px] text-zinc-500 font-mono pt-1">
              <span>{formatMemory(gpu.memory.used)}</span>
              <span>{formatMemory(gpu.memory.total)}</span>
           </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/50">
            <div className="bg-zinc-800/40 rounded-lg p-2 flex items-center justify-between group/metric hover:bg-zinc-800/60 transition-colors">
                <div className="flex items-center space-x-2">
                   <Fan size={14} className="text-zinc-500 group-hover/metric:text-blue-400 transition-colors" />
                   <span className="text-xs text-zinc-400">Fan</span>
                </div>
                <span className="text-xs font-mono text-zinc-200">{gpu.fan.speed}%</span>
            </div>
            <div className="bg-zinc-800/40 rounded-lg p-2 flex items-center justify-between group/metric hover:bg-zinc-800/60 transition-colors">
                <div className="flex items-center space-x-2">
                   <Zap size={14} className="text-zinc-500 group-hover/metric:text-amber-400 transition-colors" />
                   <span className="text-xs text-zinc-400">Power</span>
                </div>
                <span className="text-xs font-mono text-zinc-200">{gpu.power.draw?.toFixed(0)}W</span>
            </div>
        </div>
      </div>
    </div>
  );
}
