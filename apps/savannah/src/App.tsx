import { useUsers } from './entityHooks/useUsers';
import './App.css';
import logo from '/zesty zebra.png';

const FIRST_NAMES = [
  'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry',
  'Ivy', 'Jack', 'Kate', 'Liam', 'Mia', 'Noah', 'Olivia', 'Paul',
  'Quinn', 'Rachel', 'Sam', 'Tina', 'Uma', 'Victor', 'Wendy', 'Xavier',
  'Yara', 'Zoe'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor',
  'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Clark'
];

function generateRandomUser() {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return { first_name: firstName, last_name: lastName };
}

function App() {
  const { users, createUser, isCreating } = useUsers();

  const handleCreateRandomUser = () => {
    const randomUser = generateRandomUser();
    createUser(randomUser);
  };

  return (
    <>
      <div>
        <h1>Welcome to the Savannah</h1>
      </div>
      <div>
        <img src={logo} style={{ height: '50vh' }} alt="Savannah" />
      </div>
      <div>
        <button onClick={handleCreateRandomUser} disabled={isCreating}>
          {isCreating ? 'Creating...' : 'Create Random User'}
        </button>
      </div>
      {users && users.length > 0 && (
        <div>
          <h2>Users ({users.length})</h2>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.first_name} {user.last_name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default App;
