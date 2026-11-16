
const FORGE = {
  name: "FORGE",
  version: "1.0.0"
};

document.addEventListener("DOMContentLoaded", () => {
  startApp();
});

function startApp() {
  setTimeout(showDashboard, 3000);
}

function showDashboard() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <main class="dashboard">
      <header class="app-header">
        <div class="brand">
          <span class="brand-icon">F</span>
          <span>FORGE</span>
        </div>
        <button class="profile-button" aria-label="پروفایل">👤</button>
      </header>

      <section class="welcome-section">
        <p>به FORGE خوش آمدی</p>
        <h2>آماده‌ای قوی‌تر بشی؟</h2>
        <span>مسیر پیشرفتت از اینجا شروع می‌شه.</span>
      </section>

      <section class="setup-card">
        <div class="setup-icon">⚡</div>
        <h3>برنامه تمرینی اختصاصی خودت رو بساز</h3>
        <p>با ارزیابی هوشمند، برنامه‌ای متناسب با شرایط و هدف خودت دریافت کن.</p>
        <button class="primary-button" id="startAssessment">
          شروع ارزیابی <span>←</span>
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

  document
    .getElementById("startAssessment")
    .addEventListener("click", showAssessment);
}

function showAssessment() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <main class="dashboard">
      <header class="app-header">
        <button class="profile-button" id="backHome">→</button>
        <div class="brand">
          <span class="brand-icon">F</span>
          <span>FORGE</span>
        </div>
      </header>

      <section class="welcome-section">
        <p>مرحله ۱ از ارزیابی</p>
        <h2>اول خودت رو بشناسیم</h2>
        <span>اطلاعات اولیه‌ات رو وارد کن تا برنامه مناسب‌تری طراحی کنیم.</span>
      </section>

      <form id="assessmentForm" class="assessment-form">

        <label for="age">سن (سال)</label>
        <input id="age" name="age" type="number" min="10" max="100" placeholder="مثلاً ۱۸" required>

        <label for="height">قد (سانتی‌متر)</label>
        <input id="height" name="height" type="number" min="100" max="230" placeholder="مثلاً ۱۷۵" required>

        <label for="weight">وزن (کیلوگرم)</label>
        <input id="weight" name="weight" type="number" min="20" max="300" step="0.1" placeholder="مثلاً ۶۵" required>

        <label for="goal">هدف اصلی تو چیه؟</label>
        <select id="goal" name="goal" required>
          <option value="">انتخاب هدف</option>
          <option value="muscle">عضله‌سازی و افزایش حجم</option>
          <option value="strength">افزایش قدرت</option>
          <option value="fitness">تناسب اندام و آمادگی جسمانی</option>
          <option value="endurance">افزایش استقامت</option>
          <option value="mobility">افزایش انعطاف‌پذیری</option>
        </select>

        <label for="experience">سطح تجربه ورزشی</label>
        <select id="experience" name="experience" required>
          <option value="">انتخاب سطح</option>
          <option value="beginner">مبتدی</option>
          <option value="intermediate">متوسط</option>
          <option value="advanced">پیشرفته</option>
        </select>

        <button class="primary-button" type="submit">
          ادامه ارزیابی ←
        </button>
      </form>
    </main>
  `;

  document.getElementById("backHome").addEventListener("click", showDashboard);

  document.getElementById("assessmentForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const profile = Object.fromEntries(formData.entries());

    localStorage.setItem("forge_profile", JSON.stringify(profile));

    alert("اطلاعات اولیه ذخیره شد. مرحله بعدی ارزیابی را می‌سازیم.");
  });
}
