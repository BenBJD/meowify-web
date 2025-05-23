"use client";

import { useState, useEffect } from 'react';
import { FiWifi, FiWifiOff, FiServer } from 'react-icons/fi';
import { useToast } from './ToastProvider';

interface ApiStatus {
  nextApi: boolean;
  pythonApi: boolean;
  error?: string;
}

export function ApiStatusIndicator() {
  const [status, setStatus] = useState<ApiStatus | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();

        setStatus({
          nextApi: true,
          pythonApi: data.pythonApi,
          error: data.error
        });

        // Show error toast if Python API is down
        if (!data.pythonApi) {
          showToast(
            `Python API is offline: ${data.error || 'Unknown error'}`,
            'error'
          );
        }
      } catch (error) {
        setStatus({
          nextApi: false,
          pythonApi: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        showToast('Next.js API is offline', 'error');
      }
    };

    // Check immediately
    checkApiStatus();

    // Then check every 30 seconds
    const interval = setInterval(checkApiStatus, 30000);

    return () => clearInterval(interval);
  }, [showToast]);

  if (status === null) {
    return null; // Don't show anything while checking
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Next.js API Status */}
      <div className="flex items-center space-x-1">
        {status.nextApi ? (
          <FiWifi className="w-4 h-4 text-green-500" />
        ) : (
          <FiWifiOff className="w-4 h-4 text-red-500" />
        )}
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Next.js
        </span>
      </div>

      {/* Python API Status */}
      <div className="flex items-center space-x-1">
        {status.pythonApi ? (
          <FiServer className="w-4 h-4 text-green-500" />
        ) : (
          <FiServer className="w-4 h-4 text-red-500" />
        )}
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Python
        </span>
      </div>
    </div>
  );
} 
