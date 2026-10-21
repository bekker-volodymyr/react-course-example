import { use, useState, useTransition, useOptimistic } from 'react';
import { ModuleCheckbox } from './ModuleCheckBox';
import { type CourseDetails, type Module } from '../data/courses';

interface CourseProgressContentProps {
  courseId: string;
  coursePromise: Promise<CourseDetails>;
  onToggleModule: (courseId: string, moduleName: string) => void;
}

export default function CourseProgressContent({
  courseId,
  coursePromise,
  onToggleModule,
}: CourseProgressContentProps) {
  // 1. Початковий рендер (чекає проміс, показує fallback у батька)
  const initialDetails = use(coursePromise);

  // 2. Локальний стейт. Ініціалізується один раз завдяки key={courseId} на Suspense.
  const [localDetails, setLocalDetails] =
    useState<CourseDetails>(initialDetails);

  const [isPending, startTransition] = useTransition();

  // 3. Оптимістичний UI завжди базується на локальному стейті
  const [optimisticDetails, setOptimisticDetails] = useOptimistic(
    localDetails,
    (currentDetails, toggledModuleName: string) => {
      const updatedModules = currentDetails.modules.map((m) =>
        m.name === toggledModuleName
          ? { ...m, isCompleted: !m.isCompleted }
          : m,
      );

      const completedCount = updatedModules.filter((m) => m.isCompleted).length;

      return {
        ...currentDetails,
        modules: updatedModules,
        completedModules: completedCount,
      };
    },
  );

  const progressPercentage = Math.round(
    (optimisticDetails.completedModules / optimisticDetails.modules.length) *
      100,
  );

  const handleToggleModule = async (module: Module) => {
    startTransition(async () => {
      // Застосовуємо оптимістичний UI
      setOptimisticDetails(module.name);

      try {
        // Запит на сервер (зміна статусу в БД)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (Math.random() > 0.8) {
          throw new Error('Fake server error');
        }

        // Синхронізація глобального стейту в App (якщо потрібно)
        onToggleModule(courseId, module.name);

        // УСПІХ: Оновлюємо локальний стейт без рефетчу
        const updatedModules = localDetails.modules.map((m) =>
          m.name === module.name ? { ...m, isCompleted: !m.isCompleted } : m,
        );

        setLocalDetails({
          ...localDetails,
          modules: updatedModules,
          completedModules: updatedModules.filter((m) => m.isCompleted).length,
        });
      } catch (error) {
        // У разі помилки ми просто не викликаємо setLocalDetails.
        // Оскільки транзакція завершиться, useOptimistic автоматично
        // відкотиться до незміненого localDetails.
        alert(
          `Не вдалося зберегти прогрес для "${module.name}". Спробуйте ще раз.`,
        );
      }
    });
  };

  return (
    <div className="bg-white p-6 mt-5 rounded-xl shadow-sm border border-gray-200">
      <h3
        className="font-bold text-lg text-gray-800 mb-4 truncate"
        title={optimisticDetails.title}
      >
        📈 {optimisticDetails.title}
      </h3>

      <p className="text-sm text-gray-500 mb-1">
        Викладач: {optimisticDetails.teacher}
      </p>

      <p className="text-xs text-gray-500 mb-2">
        {optimisticDetails.description}
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-600">
              Пройдено матеріалів:
            </span>
            <span className="font-bold text-blue-600">
              {optimisticDetails.completedModules} /{' '}
              {optimisticDetails.modules.length}
            </span>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progressPercentage}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="space-y-2">
          {optimisticDetails.modules.map((m, index) => (
            <div
              key={m.name}
              className="flex justify-between items-center bg-gray-50 p-2 rounded"
            >
              <div>
                <span className="text-sm text-gray-500 font-mono mr-1">
                  {index + 1}.
                </span>
                <span className="text-sm text-gray-700">{m.name}</span>
              </div>
              <ModuleCheckbox
                module={m}
                isPending={isPending}
                onToggleComplete={handleToggleModule}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
