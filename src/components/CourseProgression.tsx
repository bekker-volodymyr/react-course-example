interface CourseType {
  id: string;
  title: string;
  completedLessons: number;
  totalLessons: number;
}

interface CourseProgressProps {
  course?: CourseType;
  onCompleteLesson: () => void;
}

// Зверніть увагу: тут більше немає імпорту { useState }
export function CourseProgress({
  course,
  onCompleteLesson,
}: CourseProgressProps) {
  if (!course) {
    return (
      <div className="bg-white p-6 mt-5 rounded-xl shadow-sm border border-dashed border-gray-300 text-center text-gray-500">
        <p>👈 Оберіть курс зі списку, щоб переглянути детальний прогрес</p>
      </div>
    );
  }

  // Обчислюємо відсотки на льоту, базуючись ТІЛЬКИ на пропсах від батька
  const progressPercentage = Math.round(
    (course.completedLessons / course.totalLessons) * 100,
  );
  const isFinished = course.completedLessons >= course.totalLessons;

  return (
    <div className="bg-white p-6 mt-5 rounded-xl shadow-sm border border-gray-200">
      <h3
        className="font-bold text-lg text-gray-800 mb-4 truncate"
        title={course.title}
      >
        📈 {course.title}
      </h3>

      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-600">
              Пройдено матеріалів:
            </span>
            {/* Читаємо виключно з course.completedLessons */}
            <span className="font-bold text-blue-600">
              {course.completedLessons} / {course.totalLessons}
            </span>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <button
        onClick={onCompleteLesson}
        disabled={isFinished}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-green-500 disabled:cursor-not-allowed text-white font-bold py-2.5 px-4 rounded-lg transition-colors"
      >
        {isFinished ? '🎉 Курс завершено!' : 'Позначити урок як пройдений'}
      </button>
    </div>
  );
}
