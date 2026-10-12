import { useState } from 'react';
import clsx from 'clsx';

interface CourseCardProps {
  title: string;
  teacher: string;
  isActive: boolean;
  completedLessons: number;
  totalLessons: number;
  isSelected: boolean;
  onSelect: () => void;
}

export function CourseCard({
  title,
  teacher,
  isActive,
  completedLessons,
  totalLessons,
  isSelected,
  onSelect,
}: CourseCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onClick={onSelect}
      className={clsx(
        'p-5 rounded-lg border-2 shadow-sm w-72 transition-all cursor-pointer relative',
        isActive
          ? 'border-green-500 bg-green-50 hover:bg-green-100'
          : 'border-gray-300 bg-white hover:bg-gray-50',
        isSelected && 'ring-4 ring-blue-400 transform -translate-y-1 shadow-md',
      )}
    >
      <div className="pr-2">
        <h3 className="text-xl font-bold text-gray-800 leading-tight">
          {title}
        </h3>

        <p className="text-xs font-semibold text-gray-500 mt-2">
          Прогрес: {completedLessons}/{totalLessons}
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="text-blue-600 underline text-sm mt-2 hover:text-blue-800"
        >
          {isOpen ? 'Сховати деталі' : 'Показати деталі'}
        </button>
      </div>

      {isOpen && (
        <div className="mt-3 p-3 bg-white/60 rounded border border-gray-200">
          <p className="text-gray-600 text-sm">Викладач: {teacher}</p>
          <p className="text-gray-600 text-sm mt-1">
            Статус: {isActive ? 'В процесі' : 'Завершено'}
          </p>
        </div>
      )}
    </div>
  );
}
