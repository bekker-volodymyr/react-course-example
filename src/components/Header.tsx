// Описуємо дані, що очікує Header
interface HeaderProps {
  studentName: string;
}

// Проводимо декструктурізацію об'єкта в окремі змінні
export function Header({ studentName }: HeaderProps) {
  return (
    <header
      style={{ backgroundColor: '#282c34', color: 'white', padding: '20px' }}
    >
      <h2>Електронний щоденник студента</h2>
      {/* Інтерполюємо дані всередину розмітки */}
      <p>Вітаємо, {studentName}! Гарного навчання!</p>
    </header>
  );
}
