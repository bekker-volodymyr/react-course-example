import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import api from '../lib/axios';

const loginSchema = z.object({
  email: z.email('Невірний формат email').min(1, "Email обов'язковий"),
  password: z
    .string()
    .min(1, "Пароль обов'язковий")
    .min(6, 'Мінімум 6 символів'),
});

type ILoginForm = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ILoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<ILoginForm> = async (data) => {
    try {
      const response = await api.post('/api/login', data);

      // Більше не треба діставати токени з response.data і пхати в localStorage.
      // Сервер вже поставив їх у браузер через заголовки Set-Cookie!
      const { user } = response.data;

      console.log('Успішний вхід. Користувач:', user);
    } catch (error) {
      console.error('Помилка логіну:', error);
      setError('root', {
        type: 'server',
        message: 'Не вдалося увійти',
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center items-center gap-3 w-[60%] h-[80%] bg-blue-100 rounded-xl border-blue-500 border-2 text-blue-950 text-lg py-6"
    >
      <h2>Ласкаво просимо</h2>

      <label htmlFor="email">E-mail: </label>
      <input
        id="email"
        type="email"
        className="bg-blue-200 border border-blue-400 rounded-md p-0.5"
        {...register('email')}
      />
      {errors.email && (
        <span className="text-red-500 text-sm font-semibold">
          {errors.email.message}
        </span>
      )}

      <label htmlFor="password">Пароль: </label>
      <input
        id="password"
        type="password"
        className="bg-blue-200 border border-blue-400 rounded-md p-0.5"
        {...register('password')}
      />
      {errors.password && (
        <span className="text-red-500 text-sm font-semibold">
          {errors.password.message}
        </span>
      )}
      {errors.root && (
        <span className="text-red-500 text-sm font-semibold">
          {errors.root.message}
        </span>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="font-bold flex gap-2 items-center text-base text-white bg-blue-950 rounded-sm px-3 py-1 transition-all hover:bg-blue-800 disabled:opacity-50"
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Увійти'}
      </button>
    </form>
  );
}
