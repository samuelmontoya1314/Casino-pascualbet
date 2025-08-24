
export type User = {
  id: string;
  password: string; 
  name: string;
  role: 'admin' | 'user';
  balance: number;
};


let users: User[] = [
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
    return users;
}


export function findUserById(id: string): User | undefined {
    return users.find(u => u.id === id);
}


export function addUser(user: User): void {
    if (findUserById(user.id)) {
        console.warn(`User with id ${user.id} already exists.`);
        return;
    }
    users.push(user);
}
