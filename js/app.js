
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(showDashboard, 3000);
});

// =====================================
// 1. MAIN DASHBOARD
// =====================================

function showDashboard() {
  document.getElementById("app").innerHTML = `
    <main class="dashboard">
      <header class="app-header">
        <div class="brand">
          <span class="brand-icon">F</span>
          <span>FORGE</span>
        </div>
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
        <button class="primary-button" id="startAssessment">
          شروع ارزیابی ←
        </button>
      </section>

      <section class="setup-card">
        <h3>تمرین‌های من</h3>
        <p>برنامه تمرینی ذخیره‌شده‌ات رو مشاهده کن.</p>
        <button class="primary-button" onclick="openSavedPlan()">
          مشاهده برنامه ←
        </button>
      </section>

      <nav class="bottom-nav">
        <button class="active" onclick="showDashboard()">خانه</button>
        <button onclick="showExerciseLibrary()">کتابخانه</button>
        <button onclick="showProgress()">پیشرفت</button>
        <button onclick="showProfile()">پروفایل</button>
      </nav>
    </main>
  `;

  document.getElementById("startAssessment").onclick = showAssessment;
}

// =====================================
// 2. PERSONAL ASSESSMENT
// =====================================

function showAssessment() {
  document.getElementById("app").innerHTML = `
    <main class="dashboard">
      <header class="app-header">
        <button class="profile-button" onclick="showDashboard()">→</button>
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

  document.getElementById("assessmentForm").onsubmit = event => {
    event.preventDefault();

    const profile = Object.fromEntries(new FormData(event.target).entries());

    localStorage.setItem("forge_profile", JSON.stringify(profile));
    showTrainingAssessment();
  };
}

// =====================================
// 3. TRAINING ASSESSMENT
// =====================================

function showTrainingAssessment() {
  document.getElementById("app").innerHTML = `
    <main class="dashboard">
      <header class="app-header">
        <button class="profile-button" onclick="showAssessment()">→</button>
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

  document.getElementById("trainingForm").onsubmit = event => {
    event.preventDefault();

    const training = Object.fromEntries(new FormData(event.target).entries());

    localStorage.setItem("forge_training", JSON.stringify(training));
    generatePersonalPlan();
  };
}

// =====================================
// 4. PLAN GENERATOR CONNECTION
// =====================================

function generatePersonalPlan() {
  const profile = JSON.parse(localStorage.getItem("forge_profile") || "null");
  const training = JSON.parse(localStorage.getItem("forge_training") || "null");

  if (!profile || !training) {
    alert("اطلاعات ارزیابی کامل نیست.");
    showDashboard();
    return;
  }

  if (typeof ForgePlanGenerator === "undefined") {
    alert("موتور برنامه‌ساز بارگذاری نشده است.");
    return;
  }

  try {
    const plan = ForgePlanGenerator.generate(profile, training);
    localStorage.setItem("forge_plan", JSON.stringify(plan));
    showWorkoutPlan(plan);
  } catch (error) {
    alert("خطا در ساخت برنامه: " + error.message);
  }
}

// =====================================
// 5. WORKOUT PLAN
// =====================================

function openSavedPlan() {
  const plan = JSON.parse(localStorage.getItem("forge_plan") || "null");

  if (!plan) {
    alert("هنوز برنامه‌ای نساختی. ابتدا ارزیابی رو انجام بده.");
    showAssessment();
    return;
  }

  showWorkoutPlan(plan);
}

function showWorkoutPlan(plan) {
  const sessionsHTML = plan.sessions.map((session, index) => `
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

      <button class="primary-button" onclick="startForgeSession(${index})">
        شروع این جلسه ←
      </button>
    </section>
  `).join("");

  document.getElementById("app").innerHTML = `
    <main class="dashboard">
      <header class="app-header">
        <button class="profile-button" onclick="showDashboard()">⌂</button>
        <div class="brand"><span class="brand-icon">F</span><span>FORGE</span></div>
      </header>

      <section class="welcome-section">
        <p>برنامه اختصاصی تو</p>
        <h2>مسیر قوی‌تر شدن شروع شد!</h2>
        <span>جلسه موردنظرت رو انتخاب کن.</span>
      </section>

      <div style="margin-top:25px">
        ${sessionsHTML}
      </div>

      <button class="primary-button" onclick="showDashboard()">بازگشت به خانه</button>
    </main>
  `;
}

// =====================================
// 6. WORKOUT TRACKER
// =====================================

function startForgeSession(sessionIndex) {
  if (typeof ForgeWorkoutTracker === "undefined") {
    alert("موتور ثبت تمرین بارگذاری نشده است.");
    return;
  }

  const plan = JSON.parse(localStorage.getItem("forge_plan") || "null");

  if (!plan || !plan.sessions[sessionIndex]) {
    alert("جلسه تمرینی پیدا نشد.");
    return;
  }

  const record = ForgeWorkoutTracker.completeSession(plan.sessions[sessionIndex]);

  showActiveForgeWorkout(record);
}

function showActiveForgeWorkout(record) {
  const completed = record.exercises.filter(item => item.completed).length;
  const total = record.exercises.length;
  const progress = total ? Math.round(completed / total * 100) : 0;

  document.getElementById("app").innerHTML = `
    <main class="dashboard">
      <header class="app-header">
        <button class="profile-button" onclick="showDashboard()">⌂</button>
        <div class="brand"><span class="brand-icon">F</span><span>FORGE</span></div>
      </header>

      <section class="welcome-section">
        <p>ACTIVE WORKOUT</p>
        <h2>${record.title}</h2>
        <span>تمرینت رو با تمرکز و فرم صحیح انجام بده.</span>
      </section>

      <section class="setup-card">
        <h3>پیشرفت جلسه</h3>
        <h2 id="workoutProgress">${progress}٪</h2>
        <div style="height:9px;background:#25283B;border-radius:20px;overflow:hidden;margin-top:12px">
          <div id="workoutProgressBar" style="height:100%;width:${progress}%;background:linear-gradient(90deg,#9878FF,#00D4FF);border-radius:20px"></div>
        </div>
        <p id="workoutCount" style="margin-top:12px">${completed} از ${total} حرکت انجام شده</p>
      </section>

      <div>
        ${record.exercises.map((exercise, index) => `
          <section class="setup-card">
            <h3>${exercise.name}</h3>
            <p>${exercise.sets} ست × ${exercise.reps}</p>
            <button
              class="primary-button"
              onclick="toggleForgeExercise(${record.id}, ${index})"
              style="${exercise.completed ? "background:#173D3A;color:#7FFFD0" : ""}"
            >
              ${exercise.completed ? "✓ انجام شد" : "علامت‌گذاری به‌عنوان انجام‌شده"}
            </button>
          </section>
        `).join("")}
      </div>

      <button class="primary-button" onclick="finishForgeSession(${record.id})">
        پایان جلسه
      </button>
    </main>
  `;
}

function toggleForgeExercise(recordId, exerciseIndex) {
  const updated = ForgeWorkoutTracker.toggleExercise(recordId, exerciseIndex);

  if (updated) {
    showActiveForgeWorkout(updated);
  }
}

function finishForgeSession(recordId) {
  const history = ForgeWorkoutTracker.getHistory();
  const record = history.find(item => item.id === recordId);

  if (!record) return;

  const completed = record.exercises.filter(item => item.completed).length;

  alert(`آفرین! ${completed} حرکت از ${record.exercises.length} حرکت انجام شد.`);

  showProgress();
}

// =====================================
// 7. EXERCISE LIBRARY
// =====================================

function showExerciseLibrary() {
  if (typeof ForgeExerciseLibrary === "undefined") {
    alert("کتابخانه حرکات بارگذاری نشده است.");
    return;
  }

  document.getElementById("app").innerHTML = `
    <main class="dashboard">
      <header class="app-header">
        <button class="profile-button" onclick="showDashboard()">→</button>
        <div class="brand"><span class="brand-icon">F</span><span>FORGE</span></div>
      </header>

      <section class="welcome-section">
        <p>FORGE EXERCISE DATABASE</p>
        <h2>کتابخانه حرکات</h2>
        <span>حرکت مناسب خودت رو پیدا کن و اصولی یاد بگیر.</span>
      </section>

      <input
        id="exerciseSearch"
        class="exercise-search"
        type="search"
        placeholder="جست‌وجوی حرکت یا عضله..."
      >

      <div class="exercise-categories">
        <button class="category-btn active" data-category="all">همه</button>
        <button class="category-btn" data-category="پا">پا</button>
        <button class="category-btn" data-category="سینه">سینه</button>
        <button class="category-btn" data-category="سرشانه">سرشانه</button>
        <button class="category-btn" data-category="باسن">باسن</button>
        <button class="category-btn" data-category="جلو بازو">جلو بازو</button>
        <button class="category-btn" data-category="هوازی">هوازی</button>
      </div>

      <div id="exerciseList" class="exercise-list"></div>

      <nav class="bottom-nav">
        <button onclick="showDashboard()">خانه</button>
        <button class="active" onclick="showExerciseLibrary()">کتابخانه</button>
        <button onclick="showProgress()">پیشرفت</button>
        <button onclick="showProfile()">پروفایل</button>
      </nav>
    </main>
  `;

  let selectedCategory = "all";

  function renderExercises() {
    const query = document.getElementById("exerciseSearch").value.trim();
    let results = ForgeExerciseLibrary.search(query);

    if (selectedCategory !== "all") {
      results = results.filter(item => item.category === selectedCategory);
    }

    document.getElementById("exerciseList").innerHTML = results.length
      ? results.map(item => `
          <button class="exercise-card" data-id="${item.id}">
            <div class="exercise-card-icon">🏋️</div>
            <div>
              <strong>${item.name}</strong>
              <p>${item.category} · ${item.level}</p>
            </div>
            <span>←</span>
          </button>
        `).join("")
      : `<p class="empty-exercises">حرکتی پیدا نشد.</p>`;

    document.querySelectorAll(".exercise-card").forEach(card => {
      card.onclick = () => showExerciseDetail(card.dataset.id);
    });
  }

  document.getElementById("exerciseSearch").addEventListener("input", renderExercises);

  document.querySelectorAll(".category-btn").forEach(button => {
    button.onclick = () => {
      selectedCategory = button.dataset.category;

      document.querySelectorAll(".category-btn").forEach(btn => {
        btn.classList.remove("active");
      });

      button.classList.add("active");
      renderExercises();
    };
  });

  renderExercises();
}

function showExerciseDetail(id) {
  const exercise = ForgeExerciseLibrary.getById(id);

  if (!exercise) return;

  document.getElementById("app").innerHTML = `
    <main class="dashboard">
      <header class="app-header">
        <button class="profile-button" onclick="showExerciseLibrary()">→</button>
        <div class="brand"><span class="brand-icon">F</span><span>FORGE</span></div>
      </header>

      <section class="welcome-section">
        <p>EXERCISE GUIDE</p>
        <h2>${exercise.name}</h2>
        <span>${exercise.category}</span>
      </section>

      <section class="setup-card">
        <h3>عضلات درگیر</h3>
        <p>${exercise.muscles.join("، ")}</p>
      </section>

      <section class="setup-card">
        <h3>نحوه اجرای حرکت</h3>
        ${exercise.instructions.map((step, index) => `
          <p class="guide-step">${index + 1}. ${step}</p>
        `).join("")}
      </section>

      <section class="setup-card">
        <h3>اشتباهات رایج</h3>
        ${exercise.mistakes.map(mistake => `
          <p class="guide-step">⚠️ ${mistake}</p>
        `).join("")}
      </section>

      <section class="setup-card">
        <h3>نکته ایمنی</h3>
        <p>${exercise.safety}</p>
      </section>

      <button class="primary-button" onclick="showExerciseLibrary()">
        بازگشت به کتابخانه
      </button>
    </main>
  `;
}

// =====================================
// 8. PROGRESS
// =====================================

function showProgress() {
  if (typeof ForgeWorkoutTracker === "undefined") {
    alert("موتور ثبت تمرین بارگذاری نشده است.");
    return;
  }

  const stats = ForgeWorkoutTracker.getStats();
  const history = ForgeWorkoutTracker.getHistory();

  const historyHTML = history.length
    ? [...history].reverse().map(record => {
        const completed = record.exercises.filter(item => item.completed).length;

        return `
          <section class="setup-card">
            <h3>${record.title}</h3>
            <p>${new Date(record.date).toLocaleDateString("fa-IR")}</p>
            <p>${completed} از ${record.exercises.length} حرکت انجام شده</p>
          </section>
        `;
      }).join("")
    : `<section class="setup-card"><p>هنوز تمرینی ثبت نکردی. اولین جلسه‌ات رو شروع کن!</p></section>`;

  document.getElementById("app").innerHTML = `
    <main class="dashboard">
      <header class="app-header">
        <button class="profile-button" onclick="showDashboard()">→</button>
        <div class="brand"><span class="brand-icon">F</span><span>FORGE</span></div>
      </header>

      <section class="welcome-section">
        <p>YOUR PROGRESS</p>
        <h2>مسیر پیشرفت تو</h2>
        <span>هر قدم کوچیک، یک پیشرفت بزرگه.</span>
      </section>

      <section class="setup-card">
        <h3>تعداد جلسات ثبت‌شده</h3>
        <h2>${stats.totalSessions}</h2>
      </section>

      <section class="setup-card">
        <h3>حرکات انجام‌شده</h3>
        <h2>${stats.completedExercises}</h2>
      </section>

      <section class="setup-card">
        <h3>کل حرکات ثبت‌شده</h3>
        <h2>${stats.totalExercises}</h2>
      </section>

      <h3 style="margin:25px 0 15px">تاریخچه تمرین‌ها</h3>
      ${historyHTML}

      <nav class="bottom-nav">
        <button onclick="showDashboard()">خانه</button>
        <button onclick="showExerciseLibrary()">کتابخانه</button>
        <button class="active" onclick="showProgress()">پیشرفت</button>
        <button onclick="showProfile()">پروفایل</button>
      </nav>
    </main>
  `;
}

// =====================================
// 9. PROFILE
// =====================================

function showProfile() {
  const profile = JSON.parse(localStorage.getItem("forge_profile") || "null");
  const training = JSON.parse(localStorage.getItem("forge_training") || "null");

  document.getElementById("app").innerHTML = `
    <main class="dashboard">
      <header class="app-header">
        <button class="profile-button" onclick="showDashboard()">→</button>
        <div class="brand"><span class="brand-icon">F</span><span>FORGE</span></div>
      </header>

      <section class="welcome-section">
        <p>MY PROFILE</p>
        <h2>پروفایل من</h2>
        <span>اطلاعات ثبت‌شده در FORGE</span>
      </section>

      <section class="setup-card">
        <h3>اطلاعات شخصی</h3>
        <p>سن: ${profile ? profile.age + " سال" : "ثبت نشده"}</p>
        <p>قد: ${profile ? profile.height + " سانتی‌متر" : "ثبت نشده"}</p>
        <p>وزن: ${profile ? profile.weight + " کیلوگرم" : "ثبت نشده"}</p>
        <p>هدف: ${profile ? profile.goal : "ثبت نشده"}</p>
        <p>سطح: ${profile ? profile.experience : "ثبت نشده"}</p>
      </section>

      <section class="setup-card">
        <h3>شرایط تمرین</h3>
        <p>محل: ${training ? training.location : "ثبت نشده"}</p>
        <p>تعداد روز: ${training ? training.days : "ثبت نشده"}</p>
        <p>زمان جلسه: ${training ? training.duration + " دقیقه" : "ثبت نشده"}</p>
      </section>

      <button class="primary-button" onclick="showAssessment()">
        ویرایش اطلاعات
      </button>

      <nav class="bottom-nav">
        <button onclick="showDashboard()">خانه</button>
        <button onclick="showExerciseLibrary()">کتابخانه</button>
        <button onclick="showProgress()">پیشرفت</button>
        <button class="active" onclick="showProfile()">پروفایل</button>
      </nav>
    </main>
  `;
}
