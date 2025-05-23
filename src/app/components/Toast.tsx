"use client";

import React, { useEffect, useState } from 'react';
import { FiX, FiCheck, FiAlertCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { ToastProps } from './ToastProvider';

interface ToastComponentProps extends ToastProps {
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastComponentProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation after mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for exit animation to complete
    const timer = setTimeout(onClose, 300);
    return () => clearTimeout(timer);
  };

  const getToastIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheck className="w-5 h-5" />;
      case 'error':
        return <FiAlertCircle className="w-5 h-5" />;
      case 'warning':
        return <FiAlertTriangle className="w-5 h-5" />;
      case 'info':
      default:
        return <FiInfo className="w-5 h-5" />;
    }
  };

  const getToastStyles = () => {
    const baseStyles = "rounded-lg shadow-lg p-4 flex items-start gap-3 max-w-md transform transition-all duration-300";
    const visibilityStyles = isVisible
      ? "translate-x-0 opacity-100"
      : "translate-x-full opacity-0";

    let typeStyles = "";

    switch (type) {
      case 'success':
        typeStyles = "bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300";
        break;
      case 'error':
        typeStyles = "bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300";
        break;
      case 'warning':
        typeStyles = "bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300";
        break;
      case 'info':
      default:
        typeStyles = "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300";
        break;
    }

    return `${baseStyles} ${typeStyles} ${visibilityStyles}`;
  };

  const getIconStyles = () => {
    switch (type) {
      case 'success':
        return "text-green-500 dark:text-green-400";
      case 'error':
        return "text-red-500 dark:text-red-400";
      case 'warning':
        return "text-yellow-500 dark:text-yellow-400";
      case 'info':
      default:
        return "text-blue-500 dark:text-blue-400";
    }
  };

  return (
    <div className={getToastStyles()}>
      <div className={`flex-shrink-0 ${getIconStyles()}`}>
        {getToastIcon()}
      </div>
      <div className="flex-1 pt-0.5">
        <p className="text-sm">{message}</p>
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
        aria-label="Close"
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
}
