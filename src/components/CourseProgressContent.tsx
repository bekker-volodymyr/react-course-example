import { useState } from 'react';
import { ModuleCheckbox } from './ModuleCheckBox';
import { type Module } from '../data/courses';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  toggleModuleOptimistic,
  toggleModuleThunk,
} from '@/store/slices/coursesSlice';

interface CourseProgressContentProps {
  courseId: string;
}

export default function CourseProgressContent({
  courseId,
}: CourseProgressContentProps) {
  const dispatch = useAppDispatch();
  const [pendingModule, setPendingModule] = useState<string | null>(null);

  const courseDetails = useAppSelector((state) =>
    state.courses.items.find((c) => c.id === courseId),
  );

  if (!courseDetails) {
    return (
      <div className="bg-white p-6 mt-5 rounded-xl shadow-sm border border-gray-200 text-center text-gray-500">
        <p>Курс не знайдено</p>
      </div>
    );
  }

  const handleToggleModule = async (module: Module) => {
    setPendingModule(module.name);
    dispatch(toggleModuleOptimistic({ courseId, moduleName: module.name }));

    try {
      await dispatch(
        toggleModuleThunk({ courseId, moduleName: module.name }),
      ).unwrap();
    } catch {
      alert(
        `Не вдалося зберегти прогрес для "${module.name}". Спробуйте ще раз.`,
      );
    } finally {
      setPendingModule(null);
    }
  };

  const progressPercentage =
    courseDetails.modules.length > 0
      ? Math.round(
          (courseDetails.completedModules / courseDetails.modules.length) * 100,
        )
      : 0;

  return (
    <div className="bg-white p-6 mt-5 rounded-xl shadow-sm border border-gray-200">
      <h3
        className="font-bold text-lg text-gray-800 mb-4 truncate"
        title={courseDetails.title}
      >
        📈 {courseDetails.title}
      </h3>
      <p className="text-sm text-gray-500 mb-1">
        Викладач: {courseDetails.teacher}
      </p>
      <p className="text-xs text-gray-500 mb-2">{courseDetails.description}</p>

      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-600">
              Пройдено матеріалів:
            </span>
            <span className="font-bold text-blue-600">
              {courseDetails.completedModules} / {courseDetails.modules.length}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-2">
          {courseDetails.modules.map((m, index) => (
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
                isPending={pendingModule === m.name}
                onToggleComplete={handleToggleModule}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
