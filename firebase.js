// استيراد خدمات Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-storage.js";

// إعدادات مشروعك
const firebaseConfig = {
  apiKey: "AIzaSyDm5AKi6naZi87rWsj6rE1qUM-UWzVr7U4",
  authDomain: "mediahub-2fd0c.firebaseapp.com",
  projectId: "mediahub-2fd0c",
  storageBucket: "mediahub-2fd0c.appspot.com",
  messagingSenderId: "562549895016",
  appId: "1:562549895016:web:c901c652f95fe29f4730dd",
  measurementId: "G-CJZ7WG8PYJ"
};

// تفعيل Firebase
const app = initializeApp(firebaseConfig);

// خدمات Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
