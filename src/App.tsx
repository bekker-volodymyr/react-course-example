import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import type { CourseDetails } from './data/courses';
import api from './lib/axios';

import Header from './components/Header';
import { CourseCard } from './components/CourseCard';
import { Section } from './components/Section';
import { CourseProgress } from './components/CourseProgress';
import LoginForm from './components/LogInForm';
import ProfileEditForm from './components/ProfileEditForm';

const fetchCourses = async (): Promise<CourseDetails[]> => {
  const response = await api.get<CourseDetails[]>('/api/courses');

  if (!response.status) {
    throw new Error('Failed to load courses');
  }

  return response.data;
};

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoginPopup, setLoginPopup] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });

  const filteredCourses = data
    ? data.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  const coursesContent = isPending ? (
    <div>Завантаження курсів...</div>
  ) : isError ? (
    <div>Помилка завантаження курсів: {error.message}</div>
  ) : (
    filteredCourses.map((course) => (
      <CourseCard
        key={course.id}
        {...course}
        totalModules={course.modules.length}
        isSelected={selectedCourseId === course.id}
        onSelect={() => setSelectedCourseId(course.id)}
      />
    ))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <button
        className="absolute z-100 top-5 right-5 font-bold text-white bg-blue-950 rounded-sm px-4 py-2 transition-all hover:scale-[1.2]"
        onClick={() => setLoginPopup(!isLoginPopup)}
      >
        {isLoginPopup ? 'Закрити' : 'Увійти'}
      </button>

      {isLoginPopup && (
        <div className="absolute z-50 w-full h-full bg-slate-700/35 flex justify-center items-center">
          <LoginForm />
        </div>
      )}

      <Header id={1} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-[1fr_3fr] gap-6 items-start">
          <aside className="w-full flex flex-col gap-6">
            <CourseProgress courseId={selectedCourseId} />
          </aside>

          <Section title="Мої поточні курси">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Пошук курсів..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-4">{coursesContent}</div>
          </Section>

          <div className="col-span-2">
            <ProfileEditForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
