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
    const { users, createUser, isCreating, deleteUser, updateUser } = useUsers();

    const handleCreateRandomUser = () => {
        const randomUser = generateRandomUser();
        createUser(randomUser);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
                <h1>Welcome to the Savannah</h1>
            </div>
            <div>
                <img src={logo} style={{ height: '50vh' }} alt="Savannah" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '10px' }}>

                <div>
                    <button onClick={handleCreateRandomUser} disabled={isCreating}>
                        {isCreating ? 'Creating...' : 'Create Random User'}
                    </button>
                </div>
                {users && users.length > 0 && (
                    <div>
                        <h2>Users ({users.length})</h2>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {users.map((user) => (
                                <li key={user.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                                    <p>
                                        {user.first_name} {user.last_name}
                                    </p>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>

                                        <button onClick={() => deleteUser(user.id)}>Delete</button>
                                        <button onClick={() => updateUser({ id: user.id, first_name: 'Updated ' + user.first_name, })}>Update First Name</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
