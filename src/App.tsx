import { useState } from 'react';
import { Header } from './components/Header';
import { CourseCard } from './components/CourseCard';
import { Section } from './components/Section';

// Масив даних
const initialCourses = [
  {
    id: 'c1',
    title: 'Основи HTML/CSS',
    teacher: 'Олексій Іванов',
    isActive: false,
  },
  {
    id: 'c2',
    title: 'JavaScript Advanced',
    teacher: 'Марія Коваленко',
    credits: 10,
    isActive: true,
  },
  {
    id: 'c3',
    title: 'React Frontend',
    teacher: 'Володимир Юркевич',
    credits: 10,
    isActive: true,
  },
];

function App() {
  // Стейт для зберігання тексту пошуку
  const [searchQuery, setSearchQuery] = useState('');

  const [userProfile, setUserProfile] = useState({
    name: 'Володимир',
    group: 'FE-1',
    isOnline: true,
  });

  const handleTransfer = () => {
    setUserProfile({
      ...userProfile, // Копіюємо всі існуючі поля (name, isOnline)
      group: 'FE-Advanced', // Перезаписуємо лише групу
    });
  };

  const filteredCourses = initialCourses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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

        <Section title="Мої поточні курси">
          {/* Керований інпут */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Пошук курсів..."
              value={searchQuery} // Зв'язуємо значення зі стейтом
              onChange={(e) => setSearchQuery(e.target.value)} // Оновлюємо стейт при вводі
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-2">
              Ви шукаєте: {searchQuery}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            {/* Рендеримо вже відфільтрований масив */}
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))
            ) : (
              <p className="text-gray-500">Курси не знайдено 😢</p>
            )}
          </div>
        </Section>

        <Section title="Останні оцінки">
          <p className="text-gray-500 italic">
            Тут скоро будуть ваші оцінки за домашки...
          </p>
        </Section>
      </div>
    </div>
  );
}

export default App;
