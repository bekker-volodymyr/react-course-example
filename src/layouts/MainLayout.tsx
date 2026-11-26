import Header from '@/components/Header';
import { useTheme } from '@/context/ThemeContext';
import { Outlet } from 'react-router';

export default function MainLayout() {
  const { theme } = useTheme();
  return (
    <div
      className={`flex flex-col min-h-dvh gap-4 ${theme === 'light' ? 'text-black bg-gray-50' : 'text-white bg-blue-950'}`}
    >
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
