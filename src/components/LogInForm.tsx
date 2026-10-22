export default function LoginForm() {
  return (
    <form className="flex flex-col justify-center items-center gap-5 w-[60%] h-[60%] bg-blue-100 rounded-xl border-blue-500 border-2 text-blue-950 text-lg">
      <h2>Ласкаво просимо</h2>
      <label htmlFor="">E-mail: </label>
      <input
        className="bg-blue-200 border border-blue-400 rounded-md p-0.5"
        type="email"
      />
      <label htmlFor="">Пароль: </label>
      <input
        type="password"
        className="bg-blue-200 border border-blue-400 rounded-md p-0.5"
      />
      <button>Увійти</button>
    </form>
  );
}
