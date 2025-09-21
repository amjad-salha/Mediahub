import { db } from './firebase.js';
import { collection, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

export async function loadVideos() {
  const grid = document.getElementById('videoGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const q = query(collection(db, 'videos'), orderBy('created', 'desc'));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    grid.innerHTML = '<div style="color:#ff9900;font-size:1.1rem;text-align:center;padding:40px 0;">لا توجد فيديوهات بعد</div>';
    return;
  }
  snapshot.forEach(doc => {
    const vid = doc.data();
    grid.innerHTML += `
      <div class="video-card">
        <video class="video-thumb" src="${vid.url}" controls poster="">
        </video>
        <div class="video-info">
          <div class="video-title">${vid.title}</div>
          <div class="video-meta">${vid.category} - ${vid.views || 0} مشاهدة</div>
          <div class="video-actions">
            <a href="${vid.url}" target="_blank">مشاهدة</a>
          </div>
        </div>
      </div>
    `;
  });
}

window.loadVideos = loadVideos;
window.onload = loadVideos;
