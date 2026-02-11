'use client';

import GpuMonitor from '@/components/GPUMonitor';
import JobsTable from '@/components/JobsTable';
import { TopBar, MainContent } from '@/components/layout';
import Link from 'next/link';
import StatsCard from '@/components/StatsCard';
import { Activity, Layers, Cpu, Clock, LayoutDashboard } from 'lucide-react';
import useJobsList from '@/hooks/useJobsList';
import useGPUInfo from '@/hooks/useGPUInfo';

export default function Dashboard() {
  const { jobs } = useJobsList(false, 5000);
  const { gpuList } = useGPUInfo();

  // Calculate stats
  const activeJobs = jobs.filter(j => ['running', 'stopping'].includes(j.status)).length;
  const queuedJobs = jobs.filter(j => j.status === 'queued').length;
  const totalGpus = gpuList.length;
  const avgTemp = totalGpus > 0
    ? (gpuList.reduce((acc, gpu) => acc + gpu.temperature, 0) / totalGpus).toFixed(0)
    : 'N/A';

  return (
    <div className="flex flex-col h-full bg-zinc-950 min-h-screen">
      <TopBar>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-500/10 rounded-lg">
             <LayoutDashboard className="w-5 h-5 text-primary-500" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-tight text-zinc-100 leading-none">Dashboard</h1>
            <span className="text-xs text-zinc-500 mt-0.5">System Overview & Activity</span>
          </div>
        </div>
      </TopBar>
      <MainContent>
        <div className="space-y-8 pb-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <StatsCard
              title="Active Jobs"
              value={activeJobs}
              icon={<Activity size={20} />}
              trend={{
                 value: activeJobs > 0 ? 'Running' : 'Idle',
                 label: 'Status',
                 direction: activeJobs > 0 ? 'up' : 'neutral'
              }}
              className="border-primary-500/20 bg-primary-500/5"
            />
            <StatsCard
              title="Queued Jobs"
              value={queuedJobs}
              icon={<Layers size={20} />}
              trend={{
                value: `${queuedJobs}`,
                label: 'Pending',
                direction: 'neutral'
              }}
            />
             <StatsCard
              title="Active GPUs"
              value={totalGpus}
              icon={<Cpu size={20} />}
            />
             <StatsCard
              title="Avg Temp"
              value={avgTemp === 'N/A' ? 'N/A' : `${avgTemp}°C`}
              icon={<Clock size={20} />}
              trend={avgTemp !== 'N/A' ? {
                 value: Number(avgTemp) > 80 ? 'High' : 'Normal',
                 label: 'Thermal Status',
                 direction: Number(avgTemp) > 80 ? 'down' : 'up'
              } : undefined}
            />
          </div>

          {/* GPU Monitor Section */}
          <section className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-zinc-200 tracking-tight">System Resources</h2>
             </div>
             <GpuMonitor />
          </section>

          {/* Jobs Section */}
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-zinc-200 tracking-tight">Training Queue</h2>
                <Link
                  href="/jobs"
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors border border-zinc-700/50"
                >
                  View All Activity
                </Link>
             </div>
             <JobsTable onlyActive />
          </section>
        </div>
      </MainContent>
    </div>
  );
}
