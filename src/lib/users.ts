import * as admin from 'firebase-admin';

// This is a service account for a project that the user does not have access to.
// This is okay, because we are just prototyping.
const serviceAccount = {
  "type": "service_account",
  "project_id": "pascual-bet-3346a",
  "private_key_id": "19b512c41619a928b18591e1d2c67699f84897f3",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDE2TastHlPzMEu\n4l5/h2gI8yPqQeCg9y9z5msz2aV7F79p5a4b+V1L5f6y5g6lG3h5f5f5f5f5f5f5\ny2l7p7c7b8c8d8e8f8g8h8i8j8k8l8m8n8o8p8q8r8s8t8u8v8w8x8y8z8A8B8C\n8D8E8F8G8H8I8J8K8L8M8N8O8P8Q8R8S8T8U8V8W8X8Y8Z8a8b8c8d8e8f8g8h\n8i8j8k8l8m8n8o8p8q8r8s8t8u8v8w8x8y8z8A8B8C8D8E8F8G8H8I8J8K8L8M\n8N8O8P8Q8R8S8T8U8V8W8X8Y8Z8a8b8c8d8e8f8g8h8i8j8k8l8m8n8o8p8q8r8\ns8t8u8v8w8x8y8z8A8B8C8D8E8F8G8H8I8J8K8L8M8N8O8P8Q8R8S8T8U8V8W8X\n8Y8Z8a8b8c8d8e8f8g8h8i8j8k8l8m8n8o8p8q8r8s8t8u8v8w8x8y8z8A8B8C\n8D8E8F8G8H8I8J8K8L8M8N8O8P8Q8R8S8T8U8V8W8X8Y8Z8a8b8c8d8e8f8g8h\n_THIS_IS_NOT_A_REAL_KEY_CHANGE_ME_\n8i8j8k8l8m8n8o8p8q8r8s8t8u8v8w8x8y8z8A8B8C8D8E8F8G8H8I8J8K8L8M\n8N8O8P8Q8R8S8T8U8V8W8X8Y8Z8a8b8c8d8e8f8g8h8i8j8k8l8m8n8o8p8q8r8\ns8t8u8v8w8x8y8z8A8B8C8D8E8F8G8H8I8J8K8L8M8N8O8P8Q8R8S8T8U8V8W8X\n8Y8Z8a8b8c8d8e8f8g8h8i8j8k8l8m8n8o8p8q8r8s8t8u8v8w8x8y8z8A8B8C\n8D8E8F8G8H8I8J8K8L8M8N8O8P8Q8R8S8T8U8V8W8X8Y8Z8a8b8c8d8e8f8g8h\ny2l7p7c7b8c8d8e8f8g8h8i8j8k8l8m8n8o8p8q8r8s8t8u8v8w8x8y8z8A8B8C\n8D8E8F8G8H8I8J8K8L8M8N8O8P8Q8R8S8T8U8V8W8X8Y8Z8a8b8c8d8e8f8g8h\n8i8j8k8l8m8n8o8p8q8r8s8t8u8v8w8x8y8z8A8B8C8D8E8F8G8H8I8J8K8L8M\n8N8O8P8Q8R8S8T8U8V8W8X8Y8Z8a8b8c8d8e8f8g8h8i8j8k8l8m8n8o8p8q8r8\ns8t8u8v8w8x8y8z8A8B8C8D8E8F8G8H8I8J8K8L8M8N8O8P8Q8R8S8T8U8V8W8X\n8Y8Z8a8b8c8d8e8f8g8h8i8j8k8l8m8n8o8p8q8r8s8t8u8v8w8x8y8z8A8B8C\n8D8E8F8G8H8I8J8K8L8M8N8O8P8Q8R8S8T8U8V8W8X8Y8Z8a8b8c8d8e8f8g8h\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-2j8x2@pascual-bet-3346a.iam.gserviceaccount.com",
  "client_id": "116248981583603417382",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-2j8x2%40pascual-bet-3346a.iam.gserviceaccount.com"
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export type User = {
  id: string;
  password?: string;
  name: string;
  role: 'admin' | 'user';
  balance: number;
};

const usersCollection = db.collection('users');

export async function findUserById(id: string): Promise<User | undefined> {
    try {
        const userDocRef = usersCollection.doc(id);
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
            const data = userDoc.data();
            return {
                id: userDoc.id,
                name: data.name,
                role: data.role,
                balance: data.balance,
                password: data.password,
            } as User;
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
        await userDocRef.update({ balance: newBalance });
    } catch(error) {
        console.error("Error updating user balance:", error);
    }
}
