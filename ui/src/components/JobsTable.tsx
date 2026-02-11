import { useMemo } from 'react';
import useJobsList from '@/hooks/useJobsList';
import Link from 'next/link';
import UniversalTable, { TableColumn } from '@/components/UniversalTable';
import { GpuInfo, JobConfig } from '@/types';
import JobActionBar from './JobActionBar';
import { Job, Queue } from '@prisma/client';
import useQueueList from '@/hooks/useQueueList';
import classNames from 'classnames';
import { startQueue, stopQueue } from '@/utils/queue';
import { Loader2, Play, Pause, Square } from 'lucide-react';
import useGPUInfo from '@/hooks/useGPUInfo';
import { motion } from 'framer-motion';

interface JobsTableProps {
  autoStartQueue?: boolean;
  onlyActive?: boolean;
}

export default function JobsTable({ onlyActive = false }: JobsTableProps) {
  const { jobs, status, refreshJobs } = useJobsList(onlyActive, 5000);
  const { queues, status: queueStatus, refreshQueues } = useQueueList();
  const { gpuList, isGPUInfoLoaded } = useGPUInfo();

  const refresh = () => {
    refreshJobs();
    refreshQueues();
  };

  const columns: TableColumn[] = [
    {
      title: 'Name',
      key: 'name',
      render: row => (
        <div className="flex items-center space-x-2">
          {['running', 'stopping'].includes(row.status) && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              <Loader2 className="w-4 h-4 text-primary-400" />
            </motion.div>
          )}
          <Link href={`/jobs/${row.id}`} className="font-medium text-zinc-200 hover:text-primary-400 transition-colors whitespace-nowrap">
            {row.name}
          </Link>
        </div>
      ),
    },
    {
      title: 'Progress',
      key: 'steps',
      render: row => {
        const jobConfig: JobConfig = JSON.parse(row.job_config);
        const totalSteps = jobConfig.config.process[0].train.steps;
        const percent = Math.min(100, (row.step / totalSteps) * 100);

        return (
          <div className="w-full max-w-[140px]">
            <div className="flex justify-between text-[10px] text-zinc-500 mb-1 font-mono">
              <span>{row.step} / {totalSteps}</span>
              <span>{percent.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-primary-600 to-indigo-400 rounded-full"
              />
            </div>
          </div>
        );
      },
    },
    {
      title: 'GPU',
      key: 'gpu_ids',
      render: row => (
        <span className="font-mono text-[10px] text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded border border-zinc-700/50">
           {row.gpu_ids || 'N/A'}
        </span>
      )
    },
    {
      title: 'Status',
      key: 'status',
      render: row => {
        const statusColors: any = {
          completed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
          failed: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
          running: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
          queued: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20',
          stopping: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
          stopped: 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20',
        };
        const isActive = row.status === 'running';

        return (
          <div className="flex items-center space-x-2">
            {isActive && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            )}
            <span className={classNames('px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider', statusColors[row.status] || statusColors.queued)}>
              {row.status}
            </span>
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: row => {
        return <JobActionBar job={row} onRefresh={refreshJobs} autoStartQueue={false} />;
      },
    },
  ];

  const jobsDict = useMemo(() => {
    if (!isGPUInfoLoaded) return {};
    if (jobs.length === 0) return {};
    let jd: { [key: string]: { name: string; jobs: Job[] } } = {};
    gpuList.forEach(gpu => {
      jd[`${gpu.index}`] = { name: `${gpu.name}`, jobs: [] };
    });
    jd['Idle'] = { name: 'Idle', jobs: [] };
    jobs.forEach(job => {
      const gpu = gpuList.find(gpu => job.gpu_ids?.split(',').includes(gpu.index.toString())) as GpuInfo;
      const key = `${gpu?.index || '0'}`;
      if (['queued', 'running', 'stopping'].includes(job.status) && key in jd) {
        jd[key].jobs.push(job);
      } else {
        jd['Idle'].jobs.push(job);
      }
    });
    // sort the queued/running jobs by queue position
    Object.keys(jd).forEach(key => {
      if (key === 'Idle') return;
      jd[key].jobs.sort((a, b) => {
        if (a.queue_position === null) return 1;
        if (b.queue_position === null) return -1;
        return a.queue_position - b.queue_position;
      });
    });
    return jd;
  }, [jobs, queues, isGPUInfoLoaded]);

  let isLoading = status === 'loading' || queueStatus === 'loading' || !isGPUInfoLoaded;

  // if job dict is populated, we are always loaded
  if (Object.keys(jobsDict).length > 0) isLoading = false;

  return (
    <div className="space-y-8">
      {Object.keys(jobsDict)
        .sort()
        .filter(key => key !== 'Idle')
        .map(gpuKey => {
          const queue = queues.find(q => `${q.gpu_ids}` === gpuKey) as Queue;
          return (
            <div key={gpuKey} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div
                className={classNames(
                  'flex items-center justify-between px-4 py-3 rounded-t-xl border-t border-x transition-colors bg-zinc-900/40 backdrop-blur-sm',
                  queue?.is_running
                    ? 'border-emerald-500/20'
                    : 'border-rose-500/20'
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className={classNames("w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]", queue?.is_running ? "bg-emerald-500 shadow-emerald-500/50" : "bg-rose-500 shadow-rose-500/50")} />
                  <h2 className="font-semibold text-zinc-100 tracking-tight">{jobsDict[gpuKey].name}</h2>
                  <span className="px-2 py-0.5 bg-zinc-800/50 border border-zinc-700/50 rounded text-[10px] font-mono text-zinc-400">GPU {queue?.gpu_ids}</span>
                </div>

                <div className="flex items-center">
                  {queue?.is_running ? (
                    <button
                      onClick={async () => {
                        await stopQueue(queue.gpu_ids as string);
                        refresh();
                      }}
                      className="flex items-center space-x-1.5 px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition-all hover:scale-105 active:scale-95"
                    >
                      <Pause size={12} fill="currentColor" />
                      <span>Stop Queue</span>
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        await startQueue(gpuKey);
                        refresh();
                      }}
                      className="flex items-center space-x-1.5 px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg transition-all hover:scale-105 active:scale-95"
                    >
                      <Play size={12} fill="currentColor" />
                      <span>Start Queue</span>
                    </button>
                  )}
                </div>
              </div>
              <UniversalTable
                columns={columns}
                rows={jobsDict[gpuKey].jobs}
                isLoading={isLoading}
                onRefresh={refresh}
                theadClassName="bg-transparent border-t border-zinc-800/50"
              />
            </div>
          );
        })}
      {!onlyActive && Object.keys(jobsDict).includes('Idle') && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 opacity-60 hover:opacity-100 transition-opacity">
          <div className="flex items-center px-4 py-3 bg-zinc-900/20 border border-zinc-800 border-b-0 rounded-t-xl backdrop-blur-sm">
             <div className="w-2 h-2 rounded-full bg-zinc-600 mr-3" />
             <h2 className="font-semibold text-zinc-300 text-sm uppercase tracking-wide">Idle Jobs</h2>
          </div>
          <UniversalTable columns={columns} rows={jobsDict['Idle'].jobs} isLoading={isLoading} onRefresh={refresh} />
        </div>
      )}
    </div>
  );
}
