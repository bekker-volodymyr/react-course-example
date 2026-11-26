import { Link } from 'react-router';

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <p className="font-bold tracking-wide text-4xl">Вітаю, студенте!</p>
      <p className="font-semibold tracking-wide text-2xl">
        Авторизуйся, щоб переглянути свої курси, завдання та навчальні
        матеріали!
      </p>
      <Link
        to="/login"
        className="font-bold text-white bg-blue-950 rounded-sm px-4 py-2 transition-all hover:scale-[1.2]"
      >
        Увійти
      </Link>
    </div>
  );
}
