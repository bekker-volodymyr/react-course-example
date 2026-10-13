import { useState, useEffect } from 'react';

interface StudentData {
  name: string;
}

interface HeaderProps {
  id: number;
}

export default function Header({ id }: HeaderProps) {
  const [student, setStudent] = useState<null | StudentData>(null);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then((response) => response.json())
      .then((json) => setStudent(json));
  }, []);

  return (
    <header className="bg-blue-900 text-white text-center py-3">
      {student === null ? (
        <p>Завантаження...</p>
      ) : (
        <>
          <h2 className="text-2xl font-bold">Електронний щоденник студента</h2>
          <p className="text-l">Вітаємо, {student.name}! Гарного навчання!</p>
        </>
      )}
    </header>
  );
}
