import { useState } from 'react';
import { Header } from './components/Header';
import { CourseCard } from './components/CourseCard';
import { Section } from './components/Section';
import { CourseProgress } from './components/CourseProgression';
import { FocusTimer } from './components/FocusTimer';

const initialCourses = [
  {
    id: 'c1',
    title: 'Основи HTML/CSS',
    teacher: 'Олексій Іванов',
    isActive: false,
    completedLessons: 12,
    totalLessons: 12,
  },
  {
    id: 'c2',
    title: 'JavaScript Advanced',
    teacher: 'Марія Коваленко',
    isActive: true,
    completedLessons: 5,
    totalLessons: 20,
  },
  {
    id: 'c3',
    title: 'React Frontend',
    teacher: 'Володимир Юркевич',
    isActive: true,
    completedLessons: 2,
    totalLessons: 15,
  },
];

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const [userProfile, setUserProfile] = useState({
    name: 'Володимир',
    group: 'FE-1',
    isOnline: true,
  });

  const handleTransfer = () => {
    setUserProfile({
      ...userProfile,
      group: 'FE-Advanced',
    });
  };

  // Підняті стейти
  const [courses, setCourses] = useState(initialCourses);

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCompleteLesson = (courseId: string) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === courseId
          ? { ...course, completedLessons: course.completedLessons + 1 }
          : course,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header studentName={userProfile.name} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-2 bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
          <div>
            <p className="font-bold">Студент: {userProfile.name}</p>
            <p className="text-gray-600">Поточна група: {userProfile.group}</p>
          </div>
          <button
            onClick={handleTransfer}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
          >
            Перевести в Advanced
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <aside className="w-full md:w-1/3 flex flex-col gap-6">
            <CourseProgress
              course={selectedCourse}
              onCompleteLesson={() =>
                selectedCourseId && handleCompleteLesson(selectedCourseId)
              }
            />

            <FocusTimer />
          </aside>

          <Section title="Мої поточні курси">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Пошук курсів..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-2">
                Ви шукаєте: {searchQuery}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  {...course}
                  isSelected={selectedCourseId === course.id}
                  onSelect={() => setSelectedCourseId(course.id)}
                />
              ))}
            </div>
          </Section>

          <Section title="Останні оцінки">
            <p className="text-gray-500 italic">
              Тут скоро будуть ваші оцінки за домашки...
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}

export default App;
