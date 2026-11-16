
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(showDashboard, 3000);
});

function showDashboard() {
  document.getElementById("app").innerHTML = `
    <main class="dashboard">
      <header class="app-header">
        <div class="brand"><span class="brand-icon">F</span><span>FORGE</span></div>
        <button class="profile-button">👤</button>
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
        <button class="primary-button" id="startAssessment">شروع ارزیابی ←</button>
      </section>

      <nav class="bottom-nav">
        <button class="active">خانه</button>
        <button>تمرین</button>
        <button>پیشرفت</button>
        <button>پروفایل</button>
      </nav>
    </main>
  `;

  document.getElementById("startAssessment").onclick = showAssessment;
}

function showAssessment() {
  document.getElementById("app").innerHTML = `
    <main class="dashboard">
      <header class="app-header">
        <button class="profile-button" id="backHome">→</button>
        <div class="brand"><span class="brand-icon">F</span><span>FORGE</span></div>
      </header>

      <section class="welcome-section">
        <p>مرحله ۱ از ۲</p>
        <h2>اول خودت رو بشناسیم</h2>
        <span>اطلاعات اولیه‌ات رو وارد کن.</span>
      </section>

      <form id="assessmentForm" class="assessment-form">
        <label>سن (سال)</label>
        <input name="age" type="number" min="10" max="100" placeholder="مثلاً ۱۸" required>

        <label>قد (سانتی‌متر)</label>
        <input name="height" type="number" min="100" max="230" placeholder="مثلاً ۱۷۵" required>

        <label>وزن (کیلوگرم)</label>
        <input name="weight" type="number" min="20" max="300" step="0.1" placeholder="مثلاً ۶۵" required>

        <label>هدف اصلی</label>
        <select name="goal" required>
          <option value="">انتخاب هدف</option>
          <option value="muscle">عضله‌سازی و افزایش حجم</option>
          <option value="strength">افزایش قدرت</option>
          <option value="fitness">تناسب اندام</option>
          <option value="endurance">افزایش استقامت</option>
          <option value="mobility">افزایش انعطاف‌پذیری</option>
        </select>

        <label>سطح تجربه</label>
        <select name="experience" required>
          <option value="">انتخاب سطح</option>
          <option value="beginner">مبتدی</option>
          <option value="intermediate">متوسط</option>
          <option value="advanced">پیشرفته</option>
        </select>

        <button class="primary-button" type="submit">مرحله بعد ←</button>
      </form>
    </main>
  `;

  document.getElementById("backHome").onclick = showDashboard;

  document.getElementById("assessmentForm").onsubmit = (event) => {
    event.preventDefault();
    const profile = Object.fromEntries(new FormData(event.target).entries());
    localStorage.setItem("forge_profile", JSON.stringify(profile));
    showTrainingAssessment();
  };
}

function showTrainingAssessment() {
  document.getElementById("app").innerHTML = `
    <main class="dashboard">
      <header class="app-header">
        <button class="profile-button" id="backAssessment">→</button>
        <div class="brand"><span class="brand-icon">F</span><span>FORGE</span></div>
      </header>

      <section class="welcome-section">
        <p>مرحله ۲ از ۲</p>
        <h2>چطور تمرین می‌کنی؟</h2>
        <span>شرایط تمرینت رو مشخص کن.</span>
      </section>

      <form id="trainingForm" class="assessment-form">
        <label>محل تمرین</label>
        <select name="location" required>
          <option value="">انتخاب محل</option>
          <option value="home">خانه</option>
          <option value="gym">باشگاه</option>
          <option value="both">خانه و باشگاه</option>
        </select>

        <label>تجهیزات در دسترس</label>
        <select name="equipment" required>
          <option value="">انتخاب تجهیزات</option>
          <option value="none">بدون تجهیزات</option>
          <option value="basic">تجهیزات ساده خانگی</option>
          <option value="full">تجهیزات کامل باشگاهی</option>
        </select>

        <label>روزهای تمرین در هفته</label>
        <select name="days" required>
          <option value="">انتخاب تعداد روز</option>
          <option value="2">۲ روز</option>
          <option value="3">۳ روز</option>
          <option value="4">۴ روز</option>
          <option value="5">۵ روز</option>
          <option value="6">۶ روز</option>
        </select>

        <label>زمان هر جلسه</label>
        <select name="duration" required>
          <option value="">انتخاب زمان</option>
          <option value="20">۲۰ دقیقه</option>
          <option value="30">۳۰ دقیقه</option>
          <option value="45">۴۵ دقیقه</option>
          <option value="60">۶۰ دقیقه</option>
          <option value="90">۹۰ دقیقه</option>
        </select>

        <label>محدودیت یا آسیب‌دیدگی</label>
        <select name="limitations" required>
          <option value="">انتخاب پاسخ</option>
          <option value="none">خیر</option>
          <option value="yes">بله</option>
          <option value="unsure">مطمئن نیستم</option>
        </select>

        <button class="primary-button" type="submit">تکمیل ارزیابی ←</button>
      </form>
    </main>
  `;

  document.getElementById("backAssessment").onclick = showAssessment;

  document.getElementById("trainingForm").onsubmit = (event) => {
    event.preventDefault();

    const training = Object.fromEntries(new FormData(event.target).entries());
    localStorage.setItem("forge_training", JSON.stringify(training));

    showAssessmentComplete();
  };
}

function showAssessmentComplete() {
  const profile = JSON.parse(localStorage.getItem("forge_profile") || "null");
  const training = JSON.parse(localStorage.getItem("forge_training") || "null");

  if (!profile || !training) {
    alert("اطلاعات ارزیابی کامل نیست.");
    showDashboard();
    return;
  }

  if (typeof ForgePlanGenerator === "undefined") {
    alert("موتور برنامه‌ساز بارگذاری نشده است. فایل index.html را بررسی کن.");
    return;
  }

  try {
    const plan = ForgePlanGenerator.generate(profile, training);
    localStorage.setItem("forge_plan", JSON.stringify(plan));
    showWorkoutPlan(plan);
  } catch (error) {
    alert(error.message);
  }
}

function showWorkoutPlan(plan) {
  const app = document.getElementById("app");

  const sessionsHTML = plan.sessions.map(session => `
    <section class="setup-card">
      <p style="color:#00D4FF">جلسه ${session.day}</p>
      <h3>${session.title}</h3>
      <p>زمان پیشنهادی: ${session.duration} دقیقه</p>
      <p>سطح: ${session.level}</p>

      ${session.exercises.map(exercise => `
        <div class="exercise-row">
          <div>
            <strong>${exercise.name}</strong>
            <p>${exercise.muscle}</p>
          </div>
          <span>${exercise.sets} ست × ${exercise.reps}</span>
        </div>
      `).join("")}
    </section>
  `).join("");

  app.innerHTML = `
    <main class="dashboard">
      <header class="app-header">
        <div class="brand">
          <span class="brand-icon">F</span>
          <span>FORGE</span>
        </div>
        <button class="profile-button" onclick="showDashboard()">⌂</button>
      </header>

      <section class="welcome-section">
        <p>برنامه اختصاصی تو</p>
        <h2>مسیر قوی‌تر شدن شروع شد!</h2>
        <span>برنامه اولیه بر اساس اطلاعات ارزیابی تو ساخته شده.</span>
      </section>

      <div style="margin-top:25px">
        ${sessionsHTML}
      </div>

      <button class="primary-button" onclick="showDashboard()">بازگشت به خانه</button>
    </main>
  `;
}
