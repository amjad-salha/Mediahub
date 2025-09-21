// بيانات فيديوهات افتراضية - يمكنك تعديلها لاحقًا
const videos = [
  {
    title: "تقنية الواقع الافتراضي",
    category: "تقنية",
    views: 1200,
    thumb: "images/vid1.jpg",
    link: "#"
  },
  {
    title: "مباراة مثيرة - ملخص",
    category: "رياضة",
    views: 980,
    thumb: "images/vid2.jpg",
    link: "#"
  },
  {
    title: "تعلم البرمجة من الصفر",
    category: "تعليم",
    views: 1500,
    thumb: "images/vid3.jpg",
    link: "#"
  },
  {
    title: "أفضل عروض ترفيهية",
    category: "ترفيه",
    views: 700,
    thumb: "images/vid4.jpg",
    link: "#"
  },
  {
    title: "ابتكارات مستقبلية",
    category: "تقنية",
    views: 430,
    thumb: "images/vid5.jpg",
    link: "#"
  }
];

// دالة عرض الفيديوهات
function renderVideos(list) {
  const grid = document.getElementById('videoGrid');
  grid.innerHTML = '';
  if (list.length === 0) {
    grid.innerHTML = '<div style="color:#ff9900;font-size:1.1rem;text-align:center;padding:40px 0;">لا توجد نتائج مطابقة</div>';
    return;
  }
  list.forEach((vid) => {
    grid.innerHTML += `
      <div class="video-card">
        <img class="video-thumb" src="${vid.thumb}" alt="${vid.title}">
        <div class="video-info">
          <div class="video-title">${vid.title}</div>
          <div class="video-meta">${vid.category} - ${vid.views} مشاهدة</div>
          <div class="video-actions">
            <a href="${vid.link}" target="_blank">مشاهدة</a>
          </div>
        </div>
      </div>
    `;
  });
}

// البحث
document.getElementById('searchBtn').onclick = function () {
  const val = document.getElementById('searchInput').value.trim();
  if (!val) {
    renderVideos(videos);
    return;
  }
  const results = videos.filter(v =>
    v.title.includes(val) || v.category.includes(val)
  );
  renderVideos(results);
};

// دعم البحث الفوري عند الكتابة
document.getElementById('searchInput').oninput = function () {
  const val = this.value.trim();
  if (!val) {
    renderVideos(videos);
    return;
  }
  const results = videos.filter(v =>
    v.title.includes(val) || v.category.includes(val)
  );
  renderVideos(results);
};

// عرض الفيديوهات عند التحميل
window.onload = function () {
  renderVideos(videos);
};
