
// =================================
// FORGE - Main Application
// =================================

const FORGE = {
  name: "FORGE",
  version: "1.0.0",
  tagline: "مربی هوشمند شخصی تو برای ساختن بدن قوی‌تر"
};

// Start Application
document.addEventListener("DOMContentLoaded", () => {
  console.log("FORGE is starting...");

  startApp();
});

// Splash Screen
function startApp() {
  setTimeout(() => {
    showDashboard();
  }, 3000);
}

// Dashboard
function showDashboard() {
  const app = document.getElementById("app");

  if (!app) return;

  app.innerHTML = `
    <main class="dashboard">

      <header class="app-header">
        <div class="brand">
          <span class="brand-icon">F</span>
          <span>FORGE</span>
        </div>

        <button class="profile-button" aria-label="پروفایل">
          <span>👤</span>
        </button>
      </header>

      <section class="welcome-section">
        <p>به FORGE خوش آمدی</p>
        <h2>آماده‌ای قوی‌تر بشی؟</h2>
        <span>مسیر پیشرفتت از اینجا شروع می‌شه.</span>
      </section>

      <section class="setup-card">
        <div class="setup-icon">⚡</div>
        <h3>برنامه تمرینی اختصاصی خودت رو بساز</h3>
        <p>
          با ارزیابی هوشمند، برنامه‌ای متناسب
          با شرایط و هدف خودت دریافت کن.
        </p>
        <button class="primary-button" id="startAssessment">
          شروع ارزیابی
          <span>←</span>
        </button>
      </section>

      <nav class="bottom-nav">
        <button class="active">خانه</button>
        <button>تمرین</button>
        <button>پیشرفت</button>
        <button>پروفایل</button>
      </nav>

    </main>
  `;

  console.log("FORGE Dashboard loaded");
}
