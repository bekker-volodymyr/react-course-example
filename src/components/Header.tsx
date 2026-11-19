import { Link, NavLink } from 'react-router';

export default function Header() {
  return (
    <header className="bg-blue-900 text-white py-3 px-6 flex items-center justify-between shadow-md">
      <Link
        to="/dashboard"
        className="text-2xl font-bold tracking-wider hover:text-blue-200 transition-colors"
      >
        Електронний щоденник студента
      </Link>

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
    </header>
  );
}
