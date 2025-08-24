
export type User = {
  id: string;
  password: string; 
  name: string;
  role: 'admin' | 'user';
  balance: number;
};

// This is a temporary in-memory "database".
// In a real application, you would use a proper database like Firestore, PostgreSQL, etc.
// We use a global variable to prevent the DB from being reset during hot-reloads in development.
declare global {
  var USERS_DB: User[];
}

const initialUsers: User[] = [
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

if (process.env.NODE_ENV === 'production') {
  global.USERS_DB = initialUsers;
} else {
  if (!global.USERS_DB) {
    global.USERS_DB = initialUsers;
  }
}


export function getAllUsers(): User[] {
    return global.USERS_DB;
}


export function findUserById(id: string): User | undefined {
    return global.USERS_DB.find(u => u.id === id);
}


export function addUser(user: User): void {
    if (findUserById(user.id)) {
        console.warn(`User with id ${user.id} already exists.`);
        return;
    }
    global.USERS_DB.push(user);
}
