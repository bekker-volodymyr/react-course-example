// 1. Обов'язково імпортуємо хук з React
import { useState } from 'react';
import clsx from 'clsx'; // npm i clsx

interface CourseCardProps {
  title: string;
  teacher: string;
  credits?: number;
  isActive: boolean;
}

export function CourseCard({
  title,
  teacher,
  credits = 0,
  isActive,
}: CourseCardProps) {
  // 2. Ініціалізуємо стейт. За замовчуванням деталі приховані (false)
  // Викликаємо на самому верхньому рівні компонента!
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={clsx(
        'p-5 m-2 rounded-lg border-2 shadow-sm transition-all hover:shadow-md w-72',
        isActive ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white',
      )}
    >
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>

      {/* 3. Кнопка, яка викликає функцію оновлення стейту */}
      {/* Ми передаємо нове значення, протилежне поточному (!isOpen) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-blue-600 underline text-sm mt-2 hover:text-blue-800"
      >
        {isOpen ? 'Сховати деталі' : 'Показати деталі'}
      </button>

      {isOpen && (
        <div className="mt-3 p-3 bg-white/50 rounded border border-gray-200">
          <p className="text-gray-600 text-sm">Викладач: {teacher}</p>
          <p className="text-gray-600 mt-2">Кредити: {credits}</p>
          <p className="text-gray-600 text-sm mt-1">
            Статус: {isActive ? 'В процесі' : 'Завершено'}
          </p>
        </div>
      )}
    </div>
  );
}
