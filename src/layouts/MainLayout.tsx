import Header from '@/components/Header';
import { Outlet } from 'react-router';

export default function MainLayout() {
  return (
    <div className="flex flex-col h-full gap-4">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
