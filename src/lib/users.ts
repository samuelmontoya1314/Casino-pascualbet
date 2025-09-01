import admin from 'firebase-admin';

export type User = {
  id: string;
  password?: string; // Password should not be stored in plain text in a real app
  name: string;
  role: 'admin' | 'user';
  balance: number;
};

// This is a service account key for a Firebase project.
// In a real production app, this should be stored securely as an environment variable.
const serviceAccount = {
  "type": "service_account",
  "project_id": "casino-skwof",
  "private_key_id": "9e25c156165c71a8a25d2c2c62c96462725e1a2f",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCxZz7mQn/uA63I\n1vJz1r55dTzG2g5o4b0S/l3n2c5Q6X8X2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z\n6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9\nZ4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j\n4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z\n6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9\nZ4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j\n4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z\n6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9\nZ4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j4e2Z6c9Z4j\nAgMBAAECggEAbI3j6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n\n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n\n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n\n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n\n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n\n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n\n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n\n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n\n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n6k7i8n\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-skwof@casino-skwof.iam.gserviceaccount.com",
  "client_id": "116527581559981657871",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-skwof%40casino-skwof.iam.gserviceaccount.com"
};

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const usersCollection = db.collection('users');

export async function findUserById(id: string): Promise<User | undefined> {
    try {
        const userDocRef = usersCollection.doc(id);
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
            return { id: userDoc.id, ...userDoc.data() } as User;
        }
    } catch (error) {
        console.error("Error finding user by ID:", error);
    }
    return undefined;
}

export async function addUser(user: User): Promise<void> {
    try {
        const userDocRef = usersCollection.doc(user.id);
        await userDocRef.set(user);
    } catch (error) {
        console.error("Error adding user:", error);
    }
}

export async function updateUserBalance(id: string, newBalance: number): Promise<void> {
    try {
        const userDocRef = usersCollection.doc(id);
        await userDocRef.set({ balance: newBalance }, { merge: true });
    } catch(error) {
        console.error("Error updating user balance:", error);
    }
}
