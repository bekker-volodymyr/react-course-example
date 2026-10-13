import { CheckCircle2, Check } from 'lucide-react';
import { clsx } from 'clsx';
import type { Module } from '../data/courses';

interface ModuleCheckboxProps {
  module: Module;
  isPending: boolean;
  onToggleComplete: (module: Module) => void;
}

export function ModuleCheckbox({
  module,
  isPending,
  onToggleComplete,
}: ModuleCheckboxProps) {
  return (
    <button
      onClick={() => onToggleComplete(module)}
      disabled={isPending}
      className={clsx(
        'transition-colors duration-200 p-1 rounded hover:bg-gray-200',
        module.isCompleted
          ? 'text-green-500'
          : 'text-gray-300 hover:text-gray-400',
        isPending && 'opacity-50 cursor-not-allowed',
      )}
    >
      {module.isCompleted ? (
        <CheckCircle2 className="w-5 h-5" />
      ) : (
        <Check className="w-5 h-5" />
      )}
    </button>
  );
}
