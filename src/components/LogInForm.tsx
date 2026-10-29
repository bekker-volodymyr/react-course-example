import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

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
    formState: { errors, isSubmitting },
  } = useForm<ILoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<ILoginForm> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log('Відправлені дані:', data);
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

      <button
        type="submit"
        className="font-bold text-base text-white bg-blue-950 rounded-sm px-3 py-1 transition-all hover:bg-blue-800"
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Увійти'}
      </button>
    </form>
  );
}
