import { Header } from './components/Header';
import { CourseCard } from './components/CourseCard';
import { Section } from './components/Section';

// Масив даних
const myCourses = [
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
  return (
    <div className="min-h-screen bg-gray-50">
      <Header studentName="Володимир" />

      <div className="container mx-auto px-4 py-8">
        <Section title="Мої поточні курси">
          <div className="flex flex-wrap gap-4">
            {myCourses.map((course) => (
              <CourseCard
                key={course.id}
                title={course.title}
                teacher={course.teacher}
                credits={course.credits}
                isActive={course.isActive}
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
  );
}

export default App;
