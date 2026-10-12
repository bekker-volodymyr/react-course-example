import { useState } from 'react';

export function ModuleProgress() {
  // 1. Стейт кількості пройдених матеріалів (демонстрація updater function)
  const [completedLessons, setCompletedLessons] = useState(0);
  // 2. Стейт номера поточного уроку
  const [currentLesson, setCurrentLesson] = useState(1);
  // 3. Стейт статусу (для фіксації часу або текстового стану)
  const [lastActivity, setLastActivity] = useState('Ще не починали');

  const totalLessons = 12; // Всього лекцій у модулі
  const progressPercentage = Math.round(
    (completedLessons / totalLessons) * 100,
  );

  // Для демонстрації батчінгу в консолі
  console.log('🔄 Ререндер компонента ModuleProgress');

  const handleCompleteLesson = () => {
    if (completedLessons >= totalLessons) return;

    // ВИКОРИСТАННЯ UPDATER FUNCTION:
    // Безпечно додаємо +1, покладаючись на попереднє значення (prev), а не на поточний стейт
    setCompletedLessons((prev) => prev + 1);
    setCurrentLesson((prev) => prev + 1);

    const currentTime = new Date().toLocaleTimeString('uk-UA');
    setLastActivity(`Оновлено о ${currentTime}`);

    // ПАСТКА АСИНХРОННОСТІ:
    // Показуємо студентам, що тут буде виведено старе значення, бо ререндер ще не відбувся!
    console.log(
      'Прогрес одразу після кліку (старе значення):',
      completedLessons,
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-sm">
      <h3 className="font-bold text-lg text-gray-800 mb-4">
        📈 Прогрес модуля "React Hooks"
      </h3>

      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-600">
              Пройдено матеріалів:
            </span>
            <span className="font-bold text-blue-600">
              {completedLessons} / {totalLessons}
            </span>
          </div>

          {/* Класичний прогрес-бар */}
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p>
            <span className="font-medium">Наступна тема:</span> Урок{' '}
            {currentLesson}
          </p>
          <p>
            <span className="font-medium">Активність:</span> {lastActivity}
          </p>
        </div>
      </div>

      <button
        onClick={handleCompleteLesson}
        disabled={completedLessons === totalLessons}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-green-500 disabled:cursor-not-allowed text-white font-bold py-2.5 px-4 rounded-lg transition-colors"
      >
        {completedLessons === totalLessons
          ? '🎉 Модуль завершено!'
          : 'Позначити урок як пройдений'}
      </button>
    </div>
  );
}
