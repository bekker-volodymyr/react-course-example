import { useEffect, useState } from 'react';
import { Suspense } from 'react';

import { courseDetailsData, type CourseDetails } from '../data/courses';
import CourseProgressContent from './CourseProgressContent';

const fetchCourseDetails = (id: string): Promise<CourseDetails> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const targetCourse = courseDetailsData.find((c) => c.id === id);
      if (targetCourse) resolve(targetCourse);
    }, 1500);
  });
};

interface CourseProgressProps {
  courseId?: string | null;
  onToggleModule: (courseId: string, moduleName: string) => void;
}

export function CourseProgress({
  courseId,
  onToggleModule,
}: CourseProgressProps) {
  const [coursePromise, setCoursePromise] =
    useState<Promise<CourseDetails> | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    if (!courseId) {
      setCoursePromise(null);
      return;
    }

    setCoursePromise(
      fetchCourseDetails(courseId).then((res) => {
        if (ignore) throw new Promise(() => {});
        return res;
      }),
    );

    return () => {
      ignore = true;
    };
  }, [courseId, refreshKey]);

  if (!courseId || !coursePromise) {
    return (
      <div className="bg-white p-6 mt-5 rounded-xl shadow-sm border border-dashed border-gray-300 text-center text-gray-500">
        <p>👈 Оберіть курс зі списку, щоб переглянути детальний прогрес</p>
      </div>
    );
  }

  return (
    <Suspense
      key={courseId}
      fallback={
        <div className="bg-white p-6 mt-5 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center items-center h-[300px]">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
          <p className="text-blue-600 font-medium">Завантаження курсу...</p>
        </div>
      }
    >
      <CourseProgressContent
        courseId={courseId}
        coursePromise={coursePromise}
        onToggleModule={onToggleModule}
        onTriggerRefetch={() => setRefreshKey((prev) => prev + 1)}
      />
    </Suspense>
  );
}
