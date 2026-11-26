import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { type CourseDetails } from '@/data/courses';
import api from '@/lib/axios';

interface CoursesState {
  items: CourseDetails[];
  selectedCourseId: string | null;
  searchQuery: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CoursesState = {
  items: [],
  selectedCourseId: null,
  searchQuery: '',
  status: 'idle',
  error: null,
};

// 1. Асинхронне завантаження всіх курсів
export const fetchCoursesThunk = createAsyncThunk(
  'courses/fetchAll',
  async () => {
    const response = await api.get<CourseDetails[]>('/api/courses');
    return response.data;
  },
);

// 2. Асинхронне збереження чекбокса модуля на сервері
export const toggleModuleThunk = createAsyncThunk(
  'courses/toggleModule',
  async ({
    courseId,
    moduleName,
  }: {
    courseId: string;
    moduleName: string;
  }) => {
    await api.patch(`/api/courses/${courseId}/toggle-module`, { moduleName });
    return { courseId, moduleName };
  },
);

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    selectCourse(state, action: PayloadAction<string | null>) {
      state.selectedCourseId = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    // Оптимістичне оновлення прогресу в UI (Immer дозволяє мутувати об'єкт напряму)
    toggleModuleOptimistic(
      state,
      action: PayloadAction<{ courseId: string; moduleName: string }>,
    ) {
      const course = state.items.find((c) => c.id === action.payload.courseId);
      if (!course) return;

      const mod = course.modules.find(
        (m) => m.name === action.payload.moduleName,
      );
      if (mod) {
        mod.isCompleted = !mod.isCompleted;
        // Одразу перераховуємо кількість пройдених модулів для картки та бейджа!
        course.completedModules = course.modules.filter(
          (m) => m.isCompleted,
        ).length;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoursesThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCoursesThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCoursesThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Помилка завантаження курсів';
      })
      // Якщо запит на сервер впав — відкочуємо оптимістичну зміну назад
      .addCase(toggleModuleThunk.rejected, (state, action) => {
        const { courseId, moduleName } = action.meta.arg;
        const course = state.items.find((c) => c.id === courseId);
        const mod = course?.modules.find((m) => m.name === moduleName);
        if (course && mod) {
          mod.isCompleted = !mod.isCompleted;
          course.completedModules = course.modules.filter(
            (m) => m.isCompleted,
          ).length;
        }
      });
  },
});

export const { selectCourse, setSearchQuery, toggleModuleOptimistic } =
  coursesSlice.actions;
export default coursesSlice.reducer;
