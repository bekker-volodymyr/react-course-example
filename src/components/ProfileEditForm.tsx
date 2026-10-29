import {
  useForm,
  useFieldArray,
  Controller,
  type SubmitHandler,
} from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const profileSchema = z.object({
  birthDate: z
    .date({ message: 'Некоректний формат дати' })
    .nullable()
    .refine((val) => val !== null, { message: 'Будь ласка, оберіть дату' }),

  socials: z.array(
    z.object({
      name: z.string().min(1, "Назва обов'язкова"),
      url: z.string().url('Невірний формат посилання (https://...)'),
    }),
  ),
});

type IProfileForm = z.infer<typeof profileSchema>;

export default function ProfileEditForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      birthDate: null,
      socials: [{ name: '', url: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'socials',
  });

  const onSubmit: SubmitHandler<IProfileForm> = (data) => {
    console.log('Відправлені дані профілю:', data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 w-[60%] max-w-md mx-auto bg-blue-100 rounded-xl border-blue-500 border-2 text-blue-950 text-lg py-6 px-8 shadow-lg mt-10"
    >
      <h2 className="text-2xl font-bold text-center mb-2">
        Редагування профілю
      </h2>

      <div className="flex flex-col gap-1">
        <label htmlFor="birthDate" className="font-semibold text-base">
          Дата народження:
        </label>
        <Controller
          control={control}
          name="birthDate"
          render={({ field }) => (
            <DatePicker
              id="birthDate"
              selected={field.value}
              onChange={(date: Date | null) => field.onChange(date)}
              onBlur={field.onBlur}
              dateFormat="dd.MM.yyyy"
              placeholderText="Оберіть дату..."
              className="w-full bg-blue-50 border border-blue-400 rounded-md p-2 text-base outline-none focus:border-blue-600"
            />
          )}
        />
        {errors.birthDate && (
          <span className="text-red-500 text-sm font-semibold">
            {errors.birthDate.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <label className="font-semibold text-base">Соціальні мережі:</label>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col gap-2 bg-blue-50 p-3 border border-blue-400 rounded-md relative"
          >
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-2 right-2 text-red-500 text-sm font-bold hover:text-red-700"
              >
                ✕
              </button>
            )}

            <input
              placeholder="Назва (напр., Instagram)"
              className="border border-blue-300 rounded-md p-1.5 text-base w-full outline-none focus:border-blue-600"
              {...register(`socials.${index}.name` as const)}
            />
            {errors.socials?.[index]?.name && (
              <span className="text-red-500 text-sm font-semibold">
                {errors.socials[index]?.name?.message}
              </span>
            )}

            <input
              placeholder="Посилання (https://...)"
              className="border border-blue-300 rounded-md p-1.5 text-base w-full outline-none focus:border-blue-600"
              {...register(`socials.${index}.url` as const)}
            />
            {errors.socials?.[index]?.url && (
              <span className="text-red-500 text-sm font-semibold">
                {errors.socials[index]?.url?.message}
              </span>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ name: '', url: '' })}
          className="text-sm font-bold text-blue-900 border-2 border-blue-900 rounded-md py-1 px-3 hover:bg-blue-900 hover:text-white transition-all self-start"
        >
          + Додати соцмережу
        </button>
      </div>

      <button
        type="submit"
        className="mt-2 font-bold text-lg text-white bg-blue-950 rounded-md px-4 py-2 transition-all hover:bg-blue-800"
      >
        Зберегти зміни
      </button>
    </form>
  );
}
