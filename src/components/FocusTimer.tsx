import { useState, useRef } from 'react';

export function FocusTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [note, setNote] = useState('');

  // 1. Ref для збереження ID таймера (значення, яке не впливає на UI)
  // Типізуємо як number | null, бо setInterval повертає число
  const intervalRef = useRef<number | null>(null);

  // 2. Ref для прямого доступу до DOM-елемента інпута
  // Типізуємо специфічно для HTML-інпута
  const inputRef = useRef<HTMLInputElement>(null);

  const startTimer = () => {
    if (isActive) return;
    setIsActive(true);

    // Запускаємо таймер і записуємо його ID у "коробочку" ref
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    setIsActive(false);

    // Дістаємо ID з "коробочки" і вбиваємо інтервал
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Магія доступу до DOM: автоматично ставимо фокус в інпут
    // Використовуємо опціональний ланцюжок (?.), бо на старті current може бути null
    inputRef.current?.focus();
  };

  // Форматуємо секунди у вигляд 00:00
  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="font-bold text-lg text-gray-800 mb-4">
        ⏱️ Таймер фокусування
      </h3>

      <div className="text-center mb-6">
        <span className="text-4xl font-mono font-bold text-blue-600">
          {formatTime(seconds)}
        </span>
      </div>

      <div className="flex gap-2 mb-4">
        {isActive ? (
          <button
            onClick={stopTimer}
            className="flex-1 bg-red-100 text-red-700 hover:bg-red-200 font-bold py-2 px-4 rounded-lg transition-colors"
          >
            ⏸ Пауза
          </button>
        ) : (
          <button
            onClick={startTimer}
            className="flex-1 bg-green-100 text-green-700 hover:bg-green-200 font-bold py-2 px-4 rounded-lg transition-colors"
          >
            ▶ Старт
          </button>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Що ви щойно вивчили?
        </label>
        <input
          // Прив'язуємо наш DOM-ref до реального HTML-елемента
          ref={inputRef}
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Напишіть коротку нотатку..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
