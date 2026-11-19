import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

export default function PublicRoute() {
  const { data: user, isPending } = useAuth();

  // 1. Поки перевіряємо сесію, чекаємо (щоб форма логіну не мигнула на секунду)
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Завантаження...
      </div>
    );
  }

  // 2. Якщо користувач УЖЕ залогінений — не пускаємо на /login, кидаємо на головну
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Якщо не залогінений — рендеримо сторінку логіну (або реєстрації)
  return <Outlet />;
}
