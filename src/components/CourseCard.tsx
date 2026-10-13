import clsx from 'clsx';

interface CourseCardProps {
  title: string;
  completedModules: number;
  totalModules: number;
  isSelected: boolean;
  onSelect: () => void;
}

export function CourseCard({
  title,
  completedModules,
  totalModules,
  isSelected,
  onSelect,
}: CourseCardProps) {
  return (
    <div
      onClick={onSelect}
      className={clsx(
        'p-5 rounded-lg border-2 shadow-sm w-72 transition-all cursor-pointer relative',
        completedModules === totalModules
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
          Прогрес: {completedModules}/{totalModules}
        </p>
      </div>
    </div>
  );
}
