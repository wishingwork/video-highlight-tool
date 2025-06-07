import { initializeApp } from 'firebase/app';
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MSG_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function uploadVideo(file) {
  const videoRef = ref(storage, `videos/${file.name}`);
  await uploadBytes(videoRef, file);
  return await getDownloadURL(videoRef);
}
