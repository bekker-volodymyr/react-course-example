const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Секретні ключі для підпису токенів (у реальному житті зберігаються в .env)
const ACCESS_SECRET = 'secret-access-key';
const REFRESH_SECRET = 'secret-refresh-key';

// 1. Логін (ігнорує email/пароль і просто видає токени)
app.post('/api/login', (req, res) => {
  // Access Token живе всього 15 секунд — ідеально для тестування рефрешу на уроці
  const accessToken = jwt.sign({ role: 'student' }, ACCESS_SECRET, { expiresIn: '15s' });
  const refreshToken = jwt.sign({ role: 'student' }, REFRESH_SECRET, { expiresIn: '1d' });

  res.json({
    accessToken,
    refreshToken,
    user: { name: 'Студент', email: req.body.email || 'student@diary.com' }
  });
});

// 2. Оновлення токена (Refresh)
app.post('/api/refresh', (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token відсутній' });
  }

  // Перевіряємо валідність Refresh токена
  jwt.verify(refreshToken, REFRESH_SECRET, (err) => {
    if (err) return res.status(403).json({ message: 'Refresh token недійсний' });
    
    // Якщо все ок, видаємо новий короткостроковий Access Token
    const newAccessToken = jwt.sign({ role: 'student' }, ACCESS_SECRET, { expiresIn: '15s' });
    res.json({ accessToken: newAccessToken });
  });
});

const courseDetailsData = [
  {
    id: "c1",
    title: "Основи HTML та CSS",
    description: "Фундаментальний курс з верстки веб-сторінок. Вивчіть семантичний HTML та сучасний CSS (Flexbox, Grid) для створення стильних та адаптивних сайтів.",
    teacher: "Олексій Іванов",
    modules: [
      { name: "Вступ до веб-технологій", isCompleted: true },
      { name: "Семантична розмітка HTML5", isCompleted: true },
      { name: "Основи стилізації", isCompleted: true },
      { name: "Системи розкладки: Flexbox та Grid", isCompleted: true },
      { name: "Адаптивний та мобільний дизайн", isCompleted: true }
    ],
    completedModules: 5
  },
  {
    id: "c2",
    title: "JavaScript Advanced",
    description: "Поглиблене вивчення JavaScript. Розбираємо під капотом замикання, прототипи, event loop та асинхронне програмування (Promises, async/await).",
    teacher: "Марія Коваленко",
    modules: [
      { name: "Просунута робота з функціями", isCompleted: true },
      { name: "Об'єктно-орієнтований JS", isCompleted: true },
      { name: "Асинхронність та Event Loop", isCompleted: true },
      { name: "Робота з мережею (Fetch API)", isCompleted: true },
      { name: "Маніпуляції з DOM-деревом", isCompleted: true }
    ],
    completedModules: 5
  },
  {
    id: "c3",
    title: "React Frontend",
    description: "Сучасна розробка інтерактивних інтерфейсів. Компонентний підхід, глибоке розуміння хуків, управління станом та життєвий цикл компонентів.",
    teacher: "Володимир Юркевич",
    modules: [
      { name: "Вступ до JSX та Компонентів", isCompleted: true },
      { name: "Локальний стан та Пропси", isCompleted: true },
      { name: "Побічні ефекти (useEffect)", isCompleted: false },
      { name: "Робота з формами", isCompleted: false },
      { name: "Маршрутизація", isCompleted: false }
    ],
    completedModules: 2
  },
  {
    id: "c4",
    title: "Програмування на C++",
    description: "Комплексний курс з C++. Від базових конструкцій до ручного керування пам'яттю, вказівників, шаблонів (templates) та роботи з контейнерами STL.",
    teacher: "Володимир Юркевич",
    modules: [
      { name: "Базовий синтаксис та типи даних", isCompleted: false },
      { name: "Вказівники та динамічна пам'ять", isCompleted: false },
      { name: "Об'єктно-орієнтоване програмування", isCompleted: false },
      { name: "Шаблони класів та функцій", isCompleted: false },
      { name: "Алгоритми та структури даних STL", isCompleted: false }
    ],
    completedModules: 0
  },
  {
    id: "c5",
    title: "Fullstack на Next.js",
    description: "Створення повноцінних веб-додатків. Використання Next.js (App Router), серверних компонентів, інтеграція з базою даних (Supabase/Prisma) та стилізація через Tailwind.",
    teacher: "Макс",
    modules: [
      { name: "Архітектура Next.js (App Router)", isCompleted: true },
      { name: "Серверні vs Клієнтські компоненти", isCompleted: true },
      { name: "Інтеграція з базою даних", isCompleted: true },
      { name: "Аутентифікація користувачів", isCompleted: false },
      { name: "Деплой та оптимізація продуктивності", isCompleted: false }
    ],
    completedModules: 3
  }
];

// 3. Захищений ендпоінт: Список курсів щоденника
app.get('/api/courses', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Немає доступу (відсутній токен)' });
  }

  const token = authHeader.split(' ')[1];

  // Перевіряємо, чи не "протух" Access Token
  jwt.verify(token, ACCESS_SECRET, (err) => {
    if (err) {
      // Саме цю 401 помилку має відловити Axios Interceptor на фронтенді
      return res.status(401).json({ message: 'Токен прострочений (Token Expired)' });
    }

    // Дані для електронного щоденника
    res.json(courseDetailsData);
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Сервер щоденника запущено на http://localhost:${PORT}`);
  console.log(`Access Token налаштовано на 15 секунд для зручного тестування.`);
});