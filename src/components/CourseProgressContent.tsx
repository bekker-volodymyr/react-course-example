import { use, useTransition, useOptimistic } from 'react';
import { ModuleCheckbox } from './ModuleCheckBox';
import {
  type CourseDetails,
  type Module,
  courseDetailsData,
} from '../data/courses';

interface CourseProgressContentProps {
  courseId: string;
  coursePromise: Promise<CourseDetails>;
  onToggleModule: (courseId: string, moduleName: string) => void;
  onTriggerRefetch: () => void;
}

export default function CourseProgressContent({
  courseId,
  coursePromise,
  onToggleModule,
  onTriggerRefetch,
}: CourseProgressContentProps) {
  const details = use(coursePromise);
  const [isPending, startTransition] = useTransition();

  const [optimisticDetails, setOptimisticDetails] = useOptimistic(
    details,
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
      // 1. МИТТЄВО оновлюємо оптимістичний стейт (передаємо назву модуля)
      setOptimisticDetails(module.name);

      try {
        // 2. Симулюємо запит на бекенд
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (Math.random() > 0.8) {
          throw new Error('Fake server error');
        }

        // 3. Зберігаємо зміни у глобальний стейт App
        onToggleModule(courseId, module.name);

        const targetCourse = courseDetailsData.find((c) => c.id === details.id);
        if (targetCourse) {
          const targetMod = targetCourse.modules.find(
            (m) => m.name === module.name,
          );
          if (targetMod) {
            targetMod.isCompleted = !targetMod.isCompleted;
            targetCourse.completedModules = targetCourse.modules.filter(
              (m) => m.isCompleted,
            ).length;
          }
        }

        onTriggerRefetch();
      } catch (error) {
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
