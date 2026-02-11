import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GPUApiResponse } from '@/types';
import Loading from '@/components/Loading';
import GPUWidget from '@/components/GPUWidget';
import { apiClient } from '@/utils/api';
import { AlertTriangle } from 'lucide-react';

const GpuMonitor: React.FC = () => {
  const [gpuData, setGpuData] = useState<GPUApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isFetchingGpuRef = useRef(false);

  useEffect(() => {
    const fetchGpuInfo = async () => {
      if (isFetchingGpuRef.current) {
        return;
      }
      // Don't set loading true on interval updates to avoid flicker
      if (!gpuData) setLoading(true);

      isFetchingGpuRef.current = true;
      apiClient
        .get('/api/gpu')
        .then(res => res.data)
        .then(data => {
          setGpuData(data);
          setError(null);
        })
        .catch(err => {
          setError(`Failed to fetch GPU data: ${err instanceof Error ? err.message : String(err)}`);
        })
        .finally(() => {
          isFetchingGpuRef.current = false;
          setLoading(false);
        });
    };

    fetchGpuInfo();
    const intervalId = setInterval(fetchGpuInfo, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const content = useMemo(() => {
    if (loading && !gpuData) {
      return (
        <div className="flex justify-center items-center h-32">
           <Loading />
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl flex items-center space-x-3" role="alert">
          <AlertTriangle className="w-5 h-5" />
          <div>
            <strong className="font-bold block">Error!</strong>
            <span className="block text-sm"> {error}</span>
          </div>
        </div>
      );
    }

    if (!gpuData) {
      return (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-3 rounded-xl flex items-center space-x-3" role="alert">
          <AlertTriangle className="w-5 h-5" />
          <span className="block sm:inline">No GPU data available.</span>
        </div>
      );
    }

    if (!gpuData.hasNvidiaSmi) {
      return (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-3 rounded-xl" role="alert">
          <div className="flex items-center space-x-2 mb-1">
             <AlertTriangle className="w-5 h-5" />
             <strong className="font-bold">No NVIDIA GPUs detected!</strong>
          </div>
          <span className="block text-sm"> nvidia-smi is not available on this system.</span>
          {gpuData.error && <p className="mt-2 text-xs opacity-75 font-mono">{gpuData.error}</p>}
        </div>
      );
    }

    if (gpuData.gpus.length === 0) {
      return (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-3 rounded-xl flex items-center space-x-3" role="alert">
          <AlertTriangle className="w-5 h-5" />
          <span className="block sm:inline">No GPUs found, but nvidia-smi is available.</span>
        </div>
      );
    }

    // Use responsive grid instead of manual cols
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {gpuData.gpus.map((gpu, idx) => (
          <GPUWidget key={idx} gpu={gpu} />
        ))}
      </div>
    );
  }, [loading, gpuData, error]);

  return (
    <div className="w-full animate-in fade-in duration-500">
      {content}
    </div>
  );
};

export default GpuMonitor;
