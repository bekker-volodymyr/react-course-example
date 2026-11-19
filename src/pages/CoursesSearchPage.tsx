import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Search, Loader2, BookOpen } from 'lucide-react';
import api from '@/lib/axios';

interface SearchCourseResult {
  id: string;
  title: string;
}

const searchCourses = async (query: string): Promise<SearchCourseResult[]> => {
  const response = await api.get<SearchCourseResult[]>('/api/courses/search', {
    params: { q: query },
  });
  return response.data;
};

export default function CoursesSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';

  // Локальний стан для миттєвого введення в інпут без лагів
  const [inputValue, setInputValue] = useState(urlQuery);

  // Debounce: оновлюємо URL (?q=...) через 400 мс після того, як користувач перестав друкувати
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams(
        (prev) => {
          const trimmed = inputValue.trim();
          if (trimmed) {
            prev.set('q', trimmed);
          } else {
            prev.delete('q');
          }
          return prev;
        },
        { replace: true },
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [inputValue, setSearchParams]);

  // Запит до бекенду автоматично запускається при зміні urlQuery
  const {
    data: courses = [],
    isFetching,
    isError,
  } = useQuery({
    queryKey: ['courses-search', urlQuery],
    queryFn: () => searchCourses(urlQuery),
    enabled: urlQuery.length > 0, // Не робимо запит, якщо рядок пошуку порожній
  });

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-blue-950 mb-6">Пошук курсів</h1>

      {/* Поле пошуку */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Введіть назву технології або курсу (наприклад, React, Python, SQL)..."
          className="w-full pl-11 pr-10 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        />
        {isFetching && (
          <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-600 w-5 h-5 animate-spin" />
        )}
      </div>

      {/* Стани відображення результатів */}
      {isError && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          Сталася помилка під час пошуку курсів. Спробуйте пізніше.
        </div>
      )}

      {!urlQuery && !isFetching && (
        <div className="text-center py-12 text-gray-500">
          Почніть вводити назву курсу вище, щоб побачити результати
        </div>
      )}

      {urlQuery && !isFetching && !isError && courses.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          За запитом{' '}
          <span className="font-semibold text-gray-800">«{urlQuery}»</span>{' '}
          нічого не знайдено
        </div>
      )}

      {/* Список знайдених курсів */}
      {courses.length > 0 && (
        <ul className="flex flex-col gap-3">
          {courses.map((course) => (
            <li key={course.id}>
              <Link
                to={`/courses/${course.id}`}
                className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <div className="p-2 bg-blue-50 text-blue-700 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-gray-900 group-hover:text-blue-700">
                    {course.title}
                  </h2>
                  <span className="text-xs text-gray-400">ID: {course.id}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
