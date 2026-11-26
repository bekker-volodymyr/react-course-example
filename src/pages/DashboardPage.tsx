import { useEffect } from 'react';

import { CourseCard } from '@/components/CourseCard';
import { Section } from '@/components/Section';
import { CourseProgress } from '@/components/CourseProgress';
import ProfileEditForm from '@/components/ProfileEditForm';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchCoursesThunk,
  selectCourse,
  setSearchQuery,
} from '@/store/slices/coursesSlice';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { items, selectedCourseId, searchQuery, status, error } =
    useAppSelector((state) => state.courses);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCoursesThunk());
    }
  }, [status, dispatch]);

  const filteredCourses = items.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const coursesContent =
    status === 'loading' ? (
      <div>Завантаження курсів...</div>
    ) : status === 'failed' ? (
      <div>Помилка завантаження курсів: {error}</div>
    ) : (
      filteredCourses.map((course) => (
        <CourseCard
          key={course.id}
          {...course}
          totalModules={course.modules.length}
          isSelected={selectedCourseId === course.id}
          onSelect={() => dispatch(selectCourse(course.id))}
        />
      ))
    );

  return (
    <div className="mx-auto grid grid-cols-[2fr_3fr] px-3 gap-6 items-start">
      <aside className="w-full flex flex-col gap-6">
        <CourseProgress courseId={selectedCourseId} />
      </aside>

      <Section title="Мої поточні курси">
        <div className="mb-3">
          <input
            type="text"
            placeholder="Пошук курсів..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-4">{coursesContent}</div>
      </Section>

      <div className="col-span-2">
        <ProfileEditForm />
      </div>
    </div>
  );
}
