import { Suspense } from 'react';
import CourseProgressContent from './CourseProgressContent';

interface CourseProgressProps {
  courseId?: string | null;
}

export function CourseProgress({ courseId }: CourseProgressProps) {
  if (!courseId) {
    return (
      <div className="bg-white p-6 mt-5 rounded-xl shadow-sm border border-dashed border-gray-300 text-center text-gray-500">
        <p>👈 Оберіть курс зі списку, щоб переглянути детальний прогрес</p>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="bg-white p-6 mt-5 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center items-center h-[300px]">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
          <p className="text-blue-600 font-medium">Завантаження курсу...</p>
        </div>
      }
    >
      <CourseProgressContent key={courseId} courseId={courseId} />
    </Suspense>
  );
}
