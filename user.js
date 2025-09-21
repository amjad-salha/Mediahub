import { auth, db, storage } from './firebase.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-storage.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

// تسجيل مستخدم جديد
if (document.getElementById('registerForm')) {
  document.getElementById('registerForm').onsubmit = async function(e) {
    e.preventDefault();
    let username = this.username.value.trim();
    let email = this.email.value.trim();
    let password = this.password.value.trim();
    let msg = document.getElementById('registerMessage');

    if (username.length < 3) {
      msg.textContent = "اسم المستخدم يجب أن يكون 3 أحرف أو أكثر.";
      return;
    }
    if (!email.match(/^[\w\.-]+@[\w\.-]+\.\w{2,4}$/)) {
      msg.textContent = "يرجى إدخال بريد إلكتروني صحيح.";
      return;
    }
    if (password.length < 4) {
      msg.textContent = "كلمة المرور قصيرة جداً.";
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // حفظ اسم المستخدم في قاعدة البيانات
      await addDoc(collection(db, 'users'), {
        uid: userCredential.user.uid,
        username: username,
        email: email
      });
      msg.style.color = "#28c76f";
      msg.textContent = "تم التسجيل بنجاح! يمكنك الآن تسجيل الدخول.";
      this.reset();
    } catch (error) {
      msg.style.color = "#ff9900";
      msg.textContent = error.message;
    }
  };
}

// تسجيل الدخول
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').onsubmit = async function(e) {
    e.preventDefault();
    let email = this.email.value.trim();
    let password = this.password.value.trim();
    let msg = document.getElementById('loginMessage');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      msg.style.color = "#28c76f";
      msg.textContent = "تم تسجيل الدخول بنجاح!";
      setTimeout(()=>{ window.location.href = "index.html"; }, 1200);
    } catch (error) {
      msg.style.color = "#ff9900";
      msg.textContent = "بيانات الدخول غير صحيحة أو الحساب غير موجود.";
    }
  };
}

// كشف حالة تسجيل الدخول (يظهر زر رفع الفيديو فقط للمسجلين)
onAuthStateChanged(auth, user => {
  const uploadArea = document.getElementById('uploadArea');
  if (uploadArea) {
    uploadArea.style.display = user ? "block" : "none";
  }
});

// إظهار نموذج الرفع
if (document.getElementById('showUploadForm')) {
  document.getElementById('showUploadForm').onclick = function () {
    document.getElementById('uploadForm').style.display = "block";
    this.style.display = "none";
  };
}

// رفع الفيديو وحفظ بياناته في Firebase
if (document.getElementById('uploadForm')) {
  document.getElementById('uploadForm').onsubmit = async function (e) {
    e.preventDefault();
    const title = document.getElementById('vidTitle').value.trim();
    const category = document.getElementById('vidCategory').value.trim();
    const file = document.getElementById('vidFile').files[0];
    const msg = document.getElementById('uploadMsg');
    if (!title || !category || !file) {
      msg.textContent = "يرجى تعبئة جميع الحقول واختيار ملف فيديو.";
      return;
    }
    msg.textContent = "جاري رفع الفيديو ...";
    try {
      const user = auth.currentUser;
      if (!user) {
        msg.textContent = "يجب تسجيل الدخول أولاً.";
        return;
      }
      // رفع الفيديو إلى storage
      const storagePath = `videos/${user.uid}/${Date.now()}_${file.name}`;
      const storageRefObj = ref(storage, storagePath);
      await uploadBytes(storageRefObj, file);
      const videoURL = await getDownloadURL(storageRefObj);
      // حفظ بيانات الفيديو في Firestore
      await addDoc(collection(db, 'videos'), {
        title,
        category,
        url: videoURL,
        user: user.uid,
        username: user.displayName || user.email,
        created: serverTimestamp(),
        views: 0
      });
      msg.style.color = "#28c76f";
      msg.textContent = "تم رفع الفيديو بنجاح!";
      this.reset();
      document.getElementById('uploadForm').style.display = "none";
      document.getElementById('showUploadForm').style.display = "block";
      // إعادة تحميل الفيديوهات في المعرض تلقائياً
      if (window.loadVideos) window.loadVideos();
    } catch (error) {
      msg.style.color = "#ff9900";
      msg.textContent = "خطأ أثناء رفع الفيديو: " + error.message;
    }
  };
}
