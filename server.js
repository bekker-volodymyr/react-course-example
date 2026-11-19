import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import fs from 'fs/promises';
import path from 'path';

const readCoursesFromFile = async () => {
  const filePath = path.join(process.cwd(), 'courses.json');
  const rawData = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(rawData);
};

const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

const ACCESS_SECRET = 'secret-access-key';
const REFRESH_SECRET = 'secret-refresh-key';

app.post('/api/login', (req, res) => {
  const accessToken = jwt.sign({ role: 'student' }, ACCESS_SECRET, {
    expiresIn: '1h', // 1 година
  });
  const refreshToken = jwt.sign({ role: 'student' }, REFRESH_SECRET, {
    expiresIn: '7d', // 7 днів
  });

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000, // 1 година в мілісекундах (3 600 000)
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 днів в мілісекундах
  });

  res.json({
    user: { name: 'Студент', email: req.body.email || 'student@diary.com' },
  });
});

app.post('/api/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res.status(401).json({ message: 'Refresh token відсутній' });

  jwt.verify(refreshToken, REFRESH_SECRET, (err) => {
    if (err)
      return res.status(403).json({ message: 'Refresh token недійсний' });

    const newAccessToken = jwt.sign({ role: 'student' }, ACCESS_SECRET, {
      expiresIn: '1h',
    });

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });
    res.json({ message: 'Токен оновлено' });
  });
});

app.get('/api/me', (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: 'Немає доступу' });
  }

  jwt.verify(token, ACCESS_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Токен прострочений' });
    }

    res.json({ role: decoded.role });
  });
});

const courseDetailsData = [
  {
    id: 'c1',
    title: 'Основи HTML та CSS',
    description:
      'Фундаментальний курс з верстки веб-сторінок. Вивчіть семантичний HTML та сучасний CSS (Flexbox, Grid) для створення стильних та адаптивних сайтів.',
    teacher: 'Олексій Іванов',
    modules: [
      { name: 'Вступ до веб-технологій', isCompleted: true },
      { name: 'Семантична розмітка HTML5', isCompleted: true },
      { name: 'Основи стилізації', isCompleted: true },
      { name: 'Системи розкладки: Flexbox та Grid', isCompleted: true },
      { name: 'Адаптивний та мобільний дизайн', isCompleted: true },
    ],
    completedModules: 5,
  },
  {
    id: 'c2',
    title: 'JavaScript Advanced',
    description:
      'Поглиблене вивчення JavaScript. Розбираємо під капотом замикання, прототипи, event loop та асинхронне програмування (Promises, async/await).',
    teacher: 'Марія Коваленко',
    modules: [
      { name: 'Просунута робота з функціями', isCompleted: true },
      { name: "Об'єктно-орієнтований JS", isCompleted: true },
      { name: 'Асинхронність та Event Loop', isCompleted: true },
      { name: 'Робота з мережею (Fetch API)', isCompleted: true },
      { name: 'Маніпуляції з DOM-деревом', isCompleted: true },
    ],
    completedModules: 5,
  },
  {
    id: 'c3',
    title: 'React Frontend',
    description:
      'Сучасна розробка інтерактивних інтерфейсів. Компонентний підхід, глибоке розуміння хуків, управління станом та життєвий цикл компонентів.',
    teacher: 'Володимир Юркевич',
    modules: [
      { name: 'Вступ до JSX та Компонентів', isCompleted: true },
      { name: 'Локальний стан та Пропси', isCompleted: true },
      { name: 'Побічні ефекти (useEffect)', isCompleted: false },
      { name: 'Робота з формами', isCompleted: false },
      { name: 'Маршрутизація', isCompleted: false },
    ],
    completedModules: 2,
  },
  {
    id: 'c4',
    title: 'Програмування на C++',
    description:
      "Комплексний курс з C++. Від базових конструкцій до ручного керування пам'яттю, вказівників, шаблонів (templates) та роботи з контейнерами STL.",
    teacher: 'Володимир Юркевич',
    modules: [
      { name: 'Базовий синтаксис та типи даних', isCompleted: false },
      { name: "Вказівники та динамічна пам'ять", isCompleted: false },
      { name: "Об'єктно-орієнтоване програмування", isCompleted: false },
      { name: 'Шаблони класів та функцій', isCompleted: false },
      { name: 'Алгоритми та структури даних STL', isCompleted: false },
    ],
    completedModules: 0,
  },
  {
    id: 'c5',
    title: 'Fullstack на Next.js',
    description:
      'Створення повноцінних веб-додатків. Використання Next.js (App Router), серверних компонентів, інтеграція з базою даних (Supabase/Prisma) та стилізація через Tailwind.',
    teacher: 'Макс',
    modules: [
      { name: 'Архітектура Next.js (App Router)', isCompleted: true },
      { name: 'Серверні vs Клієнтські компоненти', isCompleted: true },
      { name: 'Інтеграція з базою даних', isCompleted: true },
      { name: 'Аутентифікація користувачів', isCompleted: false },
      { name: 'Деплой та оптимізація продуктивності', isCompleted: false },
    ],
    completedModules: 3,
  },
];

app.get('/api/courses/search', async (req, res) => {
  try {
    const query = (req.query.q || '').toString().trim().toLowerCase();
    const courses = await readCoursesFromFile();

    // Якщо рядок пошуку порожній — повертаємо порожній масив (або всі курси, якщо прибрати цю умову)
    if (!query) {
      return res.json([]);
    }

    const results = courses
      .filter((course) => course.title.toLowerCase().includes(query))
      .map(({ id, title }) => ({ id, title })); // Повертаємо тільки id та title

    res.json(results);
  } catch (error) {
    console.error('Помилка читання файлу курсів:', error);
    res.status(500).json({ message: 'Не вдалося виконати пошук' });
  }
});

app.get('/api/courses', (req, res) => {
  res.json(courseDetailsData);
});

app.get('/api/courses/:id', (req, res) => {
  const courseId = req.params.id;
  const targetCourse = courseDetailsData.find((c) => c.id === courseId);

  if (!targetCourse) {
    return res.status(404).json({ message: 'Курс не знайдено' });
  }

  res.json(targetCourse);
});

app.patch('/api/courses/:id/toggle-module', (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: 'Немає доступу (відсутній токен)' });
  }

  jwt.verify(token, ACCESS_SECRET, (err) => {
    if (err) {
      return res.status(401).json({ message: 'Токен прострочений' });
    }

    const courseId = req.params.id;
    const { moduleName } = req.body;

    console.log('ID з URL:', courseId, 'Тип:', typeof courseId);
    console.log('Тіло запиту:', req.body);

    const targetCourse = courseDetailsData.find((c) => c.id === courseId);
    if (!targetCourse) {
      return res.status(404).json({ message: 'Курс не знайдено' });
    }

    const targetModule = targetCourse.modules.find(
      (m) => m.name === moduleName,
    );
    if (!targetModule) {
      return res.status(404).json({ message: 'Модуль не знайдено' });
    }

    // Інвертуємо статус
    targetModule.isCompleted = !targetModule.isCompleted;
    // Перераховуємо кількість завершених модулів
    targetCourse.completedModules = targetCourse.modules.filter(
      (m) => m.isCompleted,
    ).length;

    res.json({ message: 'Статус збережено', course: targetCourse });
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Сервер щоденника запущено на http://localhost:${PORT}`);
  console.log(`Access Token налаштовано на 15 секунд для зручного тестування.`);
});
