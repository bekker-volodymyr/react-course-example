import { useEffect, useState } from 'react';

// Краще уникати any і описати інтерфейс очікуваних даних
interface Student {
  name: string;
  phone: string;
  email: string;
}

interface StudentProfileCardProps {
  id: number;
}

export default function StudentProfileCard({ id }: StudentProfileCardProps) {
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then((response) => response.json())
      .then((json) => setStudent(json));
  }, [id]);

  if (!student) {
    return <div style={{ padding: '10px' }}>Завантаження...</div>;
  }

  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '10px',
        margin: '10px',
        borderRadius: '8px',
      }}
    >
      <h3>{student.name}</h3>
      <p>{student.phone}</p>
      <p>{student.email}</p>
    </div>
  );
}
