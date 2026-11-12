import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { ModuleCheckbox } from './ModuleCheckBox';
import { type CourseDetails, type Module } from '../data/courses';
import api from '../lib/axios';

interface CourseProgressContentProps {
  courseId: string;
}

const fetchCourseDetails = async (id: string): Promise<CourseDetails> => {
  const response = await api.get<CourseDetails>(`/api/courses/${id}`);
  return response.data;
};

export default function CourseProgressContent({
  courseId,
}: CourseProgressContentProps) {
  const queryClient = useQueryClient();

  const { data: courseDetails } = useSuspenseQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourseDetails(courseId),
  });

  const toggleModuleMutation = useMutation({
    mutationFn: async (moduleName: string) => {
      await api.patch(`/api/courses/${courseId}/toggle-module`, { moduleName });
    },
    onMutate: async (moduleName) => {
      await queryClient.cancelQueries({ queryKey: ['course', courseId] });
      const previousDetails = queryClient.getQueryData<CourseDetails>([
        'course',
        courseId,
      ]);

      queryClient.setQueryData<CourseDetails>(['course', courseId], (old) => {
        if (!old) return old;

        const updatedModules = old.modules.map((m) =>
          m.name === moduleName ? { ...m, isCompleted: !m.isCompleted } : m,
        );
        const completedCount = updatedModules.filter(
          (m) => m.isCompleted,
        ).length;

        return {
          ...old,
          modules: updatedModules,
          completedModules: completedCount,
        };
      });

      return { previousDetails };
    },
    onError: (error, moduleName, context) => {
      if (context?.previousDetails) {
        queryClient.setQueryData(['course', courseId], context.previousDetails);
      }
      alert(
        `Не вдалося зберегти прогрес для "${moduleName}". Спробуйте ще раз.`,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
    },
  });

  const progressPercentage = Math.round(
    (courseDetails.completedModules / courseDetails.modules.length) * 100,
  );

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
          {courseDetails.modules.map((m, index) => {
            const isThisModulePending =
              toggleModuleMutation.isPending &&
              toggleModuleMutation.variables === m.name;

            return (
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
                  isPending={isThisModulePending}
                  onToggleComplete={(module: Module) =>
                    toggleModuleMutation.mutate(module.name)
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
