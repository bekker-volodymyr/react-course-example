import { useState } from 'react';
import Header from './components/Header';
import { CourseCard } from './components/CourseCard';
import { Section } from './components/Section';
import { CourseProgress } from './components/CourseProgress';
import LoginForm from './components/LogInForm';

import { type CourseDetails, courseDetailsData } from './data/courses';
import ProfileEditForm from './components/ProfileEditForm';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const [isLoginPopup, setLoginPopup] = useState(false);

  const [courses, setCourses] = useState(courseDetailsData);

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleToggleModule = (courseId: string, targetModuleName: string) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) => {
        if (course.id !== courseId) return course;

        const updatedModules = course.modules.map((mod) => {
          if (mod.name === targetModuleName) {
            return { ...mod, isCompleted: !mod.isCompleted };
          }
          return mod;
        });

        const completedCount = updatedModules.filter(
          (mod) => mod.isCompleted,
        ).length;

        return {
          ...course,
          modules: updatedModules,
          completedModules: completedCount,
        };
      }),
    );
  };

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
            <CourseProgress
              courseId={selectedCourseId}
              onToggleModule={handleToggleModule}
            />
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

            <div className="flex flex-wrap gap-4">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  {...course}
                  totalModules={course.modules.length}
                  isSelected={selectedCourseId === course.id}
                  onSelect={() => setSelectedCourseId(course.id)}
                />
              ))}
            </div>
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
