import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedRoute() {
  const { data: user, isPending, isError } = useAuth();

  // 1. Поки запит /api/me ще йде, чекаємо, щоб не зробити хибний редірект
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Завантаження...
      </div>
    );
  }

  // 2. Якщо запит впав (401) або даних немає — перекидаємо на сторінку логіну
  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Якщо авторизація пройшла успішно — рендеримо вкладені маршрути (HomePage тощо)
  return <Outlet />;
}
