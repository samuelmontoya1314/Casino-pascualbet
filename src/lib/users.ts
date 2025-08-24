
export type User = {
  id: string;
  password: string; 
  name: string;
  role: 'admin' | 'user';
  balance: number;
};

// This is a temporary in-memory "database".
// In a real application, you would use a proper database like Firestore, PostgreSQL, etc.
const USERS_DB: User[] = [
    {
      id: 'admin',
      password: 'password_admin_hashed',
      name: 'Admin User',
      role: 'admin',
      balance: 10000,
    },
    {
      id: 'user123',
      password: 'password_user_hashed',
      name: 'Regular User',
      role: 'user',
      balance: 1000,
    },
];


export function getAllUsers(): User[] {
    return USERS_DB;
}


export function findUserById(id: string): User | undefined {
    return USERS_DB.find(u => u.id === id);
}


export function addUser(user: User): void {
    if (findUserById(user.id)) {
        console.warn(`User with id ${user.id} already exists.`);
        return;
    }
    USERS_DB.push(user);
}
