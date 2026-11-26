import ThemeSwitch from '@/ui/ThemeSwitch';
import { Link, NavLink } from 'react-router';
import { useAppSelector } from '@/store/hooks';

export default function Header() {
  const remainingModules = useAppSelector((state) =>
    state.courses.items.reduce(
      (total, course) =>
        total + (course.modules.length - course.completedModules),
      0,
    ),
  );

  return (
    <header className="bg-blue-900 text-white py-3 px-6 flex items-center justify-between shadow-md">
      <Link
        to="/dashboard"
        className="text-2xl font-bold tracking-wider hover:text-blue-200 transition-colors"
      >
        Електронний щоденник студента
      </Link>

      <div className="flex flex-row justify-center items-center gap-5">
        <div className="flex items-center gap-2 bg-blue-800/80 border border-blue-600/50 px-3 py-1.5 rounded-full text-sm">
          <span className="text-blue-200">Залишилось модулів:</span>
          <span className="bg-amber-400 text-blue-950 font-bold px-2 py-0.5 rounded-full text-xs">
            {remainingModules}
          </span>
        </div>

        <nav className="flex items-center gap-4">
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-white text-blue-900 shadow-sm font-semibold'
                  : 'bg-blue-800/70 text-blue-100 hover:bg-blue-700 hover:text-white'
              }`
            }
          >
            <span>Каталог курсів</span>
          </NavLink>
        </nav>

        <ThemeSwitch />
      </div>
    </header>
  );
}
