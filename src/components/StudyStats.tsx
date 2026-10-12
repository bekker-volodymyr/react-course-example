import { useState } from 'react';

export function StudyStats() {
  // Маємо три незалежні стейти
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [energyLevel, setEnergyLevel] = useState(100);
  const [status, setStatus] = useState('Готовий до навчання');

  // Цей лог буде спрацьовувати щоразу, коли React перемальовує компонент
  console.log('Ререндер компонента StudyStats');

  const handleIntenseStudySession = () => {
    // Змінюємо всі три стейти одночасно
    setTasksCompleted(tasksCompleted + 5);
    setEnergyLevel(energyLevel - 30);
    setStatus('Втомлений, але продуктивний');

    // Демонстрація асинхронності: показуємо, що стейт ще не змінився
    console.log('Значення енергії одразу після setEnergyLevel:', energyLevel);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-sm">
      <h3 className="font-bold text-lg text-gray-800 mb-4">
        📊 Статистика сесії
      </h3>

      <div className="space-y-3 mb-6">
        <p className="text-gray-700">
          <span className="font-semibold">Виконано завдань:</span>{' '}
          {tasksCompleted}
        </p>

        {/* Простий прогрес-бар для візуалізації енергії */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-semibold text-gray-700">Енергія:</span>
            <span
              className={
                energyLevel > 50 ? 'text-green-600' : 'text-orange-600'
              }
            >
              {energyLevel}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${energyLevel > 50 ? 'bg-green-500' : 'bg-orange-500'}`}
              style={{ width: `${energyLevel}%` }}
            ></div>
          </div>
        </div>

        <p className="text-gray-700">
          <span className="font-semibold">Статус:</span> {status}
        </p>
      </div>

      <button
        onClick={handleIntenseStudySession}
        // Блокуємо кнопку, якщо енергії замало
        disabled={energyLevel < 30}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        Розпочати інтенсив (5 завдань)
      </button>
    </div>
  );
}
