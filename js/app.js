
"use strict";

/* =========================================
   FORGE — MAIN APPLICATION
   ========================================= */

const ForgeApp = (() => {
  const STORAGE = {
    profile: "forge_profile",
    training: "forge_training",
    recovery: "forge_recovery",
    plan: "forge_plan"
  };

  const $ = (selector, root = document) => root.querySelector(selector);

  const read = key => {
    try {
      return JSON.parse(localStorage.getItem(key) || "null");
    } catch {
      return null;
    }
  };

  const save = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const remove = key => localStorage.removeItem(key);

  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);

  const labels = {
    goal: {
      muscle: "عضله‌سازی و افزایش حجم",
      strength: "افزایش قدرت",
      fitness: "تناسب اندام و سلامت",
      endurance: "افزایش استقامت",
      mobility: "انعطاف‌پذیری و تحرک"
    },
    experience: {
      beginner: "مبتدی",
      intermediate: "متوسط",
      advanced: "پیشرفته"
    },
    location: {
      home: "خانه",
      gym: "باشگاه",
      both: "خانه و باشگاه"
    },
    equipment: {
      none: "بدون تجهیزات",
      basic: "تجهیزات ساده خانگی",
      dumbbells: "دمبل و وزنه",
      full: "تجهیزات کامل باشگاهی"
    },
    activity: {
      low: "کم",
      normal: "متوسط",
      high: "زیاد"
    },
    limitations: {
      none: "محدودیت شناخته‌شده ندارم",
      yes: "محدودیت یا آسیب دارم",
      unsure: "مطمئن نیستم"
    },
    sleep: {
      under6: "کمتر از ۶ ساعت",
      "6to7": "۶ تا ۷ ساعت",
      "7to9": "۷ تا ۹ ساعت",
      over9: "بیشتر از ۹ ساعت"
    },
    sleepQuality: {
      poor: "ضعیف",
      normal: "معمولی",
      good: "خوب"
    },
    fatigue: {
      low: "کم",
      normal: "متوسط",
      high: "زیاد"
    },
    intensityPreference: {
      easy: "سبک و آرام",
      moderate: "متوسط و قابل کنترل",
      challenging: "چالش‌برانگیز اما ایمن"
    }
  };

  function translate(group, value) {
    return labels[group]?.[value] || value || "ثبت نشده";
  }

  function setPage(content) {
    const app = $("#app");
    if (app) app.innerHTML = content;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function header(backFunction = "showDashboard") {
    return `
      <header class="app-header">
        <button class="profile-button" onclick="${backFunction}()" aria-label="بازگشت">→</button>
        <div class="brand">
          <span class="brand-icon">F</span>
          <span>FORGE</span>
        </div>
        <button class="profile-button" onclick="showProfile()" aria-label="پروفایل">👤</button>
      </header>
    `;
  }

  function nav(active) {
    const items = [
      ["home", "خانه", "showDashboard"],
      ["library", "حرکات", "showExerciseLibrary"],
      ["progress", "پیشرفت", "showProgress"],
      ["profile", "پروفایل", "showProfile"]
    ];

    return `
      <nav class="bottom-nav">
        ${items.map(([id, title, action]) => `
          <button class="${active === id ? "active" : ""}"
            onclick="${action}()">${title}</button>
        `).join("")}
      </nav>
    `;
  }

  function welcome(eyebrow, title, description) {
    return `
      <section class="welcome-section">
        <p>${eyebrow}</p>
        <h2>${title}</h2>
        <span>${description}</span>
      </section>
    `;
  }

  function field(label, name, options, value = "", required = true) {
    return `
      <label for="${name}">${label}</label>
      <select id="${name}" name="${name}" ${required ? "required" : ""}>
        <option value="">انتخاب کنید</option>
        ${options.map(([key, title]) => `
          <option value="${key}" ${value === key ? "selected" : ""}>${title}</option>
        `).join("")}
      </select>
    `;
  }

  function input(label, name, type, value = "", placeholder = "", attributes = "") {
    return `
      <label for="${name}">${label}</label>
      <input id="${name}" name="${name}" type="${type}"
        value="${escapeHTML(value)}"
        placeholder="${placeholder}"
        ${attributes}>
    `;
  }

  function textArea(label, name, value = "", placeholder = "") {
    return `
      <label for="${name}">${label}</label>
      <textarea id="${name}" name="${name}" rows="3"
        placeholder="${placeholder}">${escapeHTML(value)}</textarea>
    `;
  }

  function formData(form) {
    return Object.fromEntries(new FormData(form).entries());
  }

  function showError(message) {
    alert(message);
  }

  /* =========================================
     DASHBOARD
     ========================================= */

  function showDashboard() {
    const profile = read(STORAGE.profile);
    const plan = read(STORAGE.plan);

    setPage(`
      <main class="dashboard">
        <header class="app-header">
          <div class="brand">
            <span class="brand-icon">F</span>
            <span>FORGE</span>
          </div>
          <button class="profile-button" onclick="showProfile()">👤</button>
        </header>

        ${welcome(
          "مربی هوشمند شخصی تو",
          profile ? "دوباره آماده پیشرفتی؟" : "آماده‌ای قوی‌تر بشی؟",
          "تمرین کن، پیشرفت کن، قوی‌تر شو."
        )}

        <section class="setup-card">
          <div class="setup-icon">⚡</div>
          <h3>برنامه تمرینی اختصاصی</h3>
          <p>با ارزیابی دقیق، برنامه‌ای متناسب با شرایط و هدفت بساز.</p>
          <button class="primary-button" onclick="showAssessment()">
            ${profile ? "ویرایش ارزیابی من ←" : "شروع ارزیابی ←"}
          </button>
        </section>

        <section class="setup-card">
          <h3>تمرین‌های من</h3>
          <p>${plan ? "برنامه تمرینی تو آماده مشاهده است." : "هنوز برنامه‌ای نساختی."}</p>
          <button class="primary-button" onclick="openSavedPlan()">
            مشاهده برنامه ←
          </button>
        </section>

        <section class="setup-card">
          <h3>کتابخانه حرکات</h3>
          <p>حرکات ورزشی را بررسی کن و روش اجرای صحیح آن‌ها را یاد بگیر.</p>
          <button class="primary-button" onclick="showExerciseLibrary()">
            مشاهده حرکات ←
          </button>
        </section>

        ${nav("home")}
      </main>
    `);
  }

  /* =========================================
     ASSESSMENT — STEP 1
     ========================================= */

  function showAssessment() {
    const p = read(STORAGE.profile) || {};

    setPage(`
      <main class="dashboard">
        ${header("showDashboard")}

        ${welcome("ارزیابی هوشمند · مرحله ۱ از ۳",
          "اول خودت رو بشناسیم",
          "اطلاعات اولیه برای طراحی برنامه اختصاصی تو.")}

        <div class="assessment-form">
          <form id="profileForm">
            ${input("سن (سال)", "age", "number", p.age || "",
              "مثلاً ۱۸", 'min="10" max="100" required')}

            ${input("قد (سانتی‌متر)", "height", "number", p.height || "",
              "مثلاً ۱۷۵", 'min="100" max="230" required')}

            ${input("وزن (کیلوگرم)", "weight", "number", p.weight || "",
              "مثلاً ۶۵", 'min="20" max="300" step="0.1" required')}

            ${field("هدف اصلی", "goal", [
              ["muscle", "عضله‌سازی و افزایش حجم"],
              ["strength", "افزایش قدرت"],
              ["fitness", "تناسب اندام و سلامت"],
              ["endurance", "افزایش استقامت"],
              ["mobility", "انعطاف‌پذیری و تحرک"]
            ], p.goal)}

            ${field("سطح تجربه", "experience", [
              ["beginner", "مبتدی"],
              ["intermediate", "متوسط"],
              ["advanced", "پیشرفته"]
            ], p.experience)}

            ${field("سابقه تمرین منظم", "trainingHistory", [
              ["none", "تاکنون تمرین منظم نداشتم"],
              ["under6", "کمتر از ۶ ماه"],
              ["6to12", "۶ تا ۱۲ ماه"],
              ["1to3", "۱ تا ۳ سال"],
              ["over3", "بیشتر از ۳ سال"]
            ], p.trainingHistory)}

            <button class="primary-button" type="submit">مرحله بعد ←</button>
          </form>
        </div>
      </main>
    `);

    $("#profileForm").onsubmit = event => {
      event.preventDefault();

      const data = formData(event.target);
      data.age = Number(data.age);
      data.height = Number(data.height);
      data.weight = Number(data.weight);

      save(STORAGE.profile, data);
      showTrainingAssessment();
    };
  }

  /* =========================================
     ASSESSMENT — STEP 2
     ========================================= */

  function showTrainingAssessment() {
    const t = read(STORAGE.training) || {};

    setPage(`
      <main class="dashboard">
        ${header("showAssessment")}

        ${welcome("ارزیابی هوشمند · مرحله ۲ از ۳",
          "شرایط تمرینت چطوره؟",
          "محل، امکانات و زمان تمرینت رو مشخص کن.")}

        <div class="assessment-form">
          <form id="trainingForm">
            ${field("محل تمرین", "location", [
              ["home", "خانه"],
              ["gym", "باشگاه"],
              ["both", "خانه و باشگاه"]
            ], t.location)}

            ${field("تجهیزات در دسترس", "equipment", [
              ["none", "بدون تجهیزات"],
              ["basic", "وسایل ساده خانگی"],
              ["dumbbells", "دمبل و وزنه"],
              ["full", "تجهیزات کامل باشگاهی"]
            ], t.equipment)}

            ${field("روزهای تمرین در هفته", "days", [
              ["2", "۲ روز"],
              ["3", "۳ روز"],
              ["4", "۴ روز"],
              ["5", "۵ روز"],
              ["6", "۶ روز"]
            ], String(t.days || ""))}

            ${field("زمان هر جلسه", "duration", [
              ["20", "۲۰ دقیقه"],
              ["30", "۳۰ دقیقه"],
              ["45", "۴۵ دقیقه"],
              ["60", "۶۰ دقیقه"],
              ["90", "۹۰ دقیقه"]
            ], String(t.duration || ""))}

            ${field("میزان فعالیت روزانه خارج از ورزش", "dailyActivity", [
              ["low", "کم؛ بیشتر روز می‌نشینم"],
              ["normal", "متوسط؛ کمی پیاده‌روی دارم"],
              ["high", "زیاد؛ بیشتر روز در حرکتم"]
            ], t.dailyActivity)}

            ${field("محدودیت یا آسیب‌دیدگی", "limitations", [
              ["none", "محدودیت شناخته‌شده‌ای ندارم"],
              ["yes", "بله، محدودیت یا آسیب دارم"],
              ["unsure", "مطمئن نیستم"]
            ], t.limitations)}

            ${textArea("توضیح محدودیت یا آسیب (اختیاری)",
              "limitationDetails", t.limitationDetails || "",
              "در صورت تمایل توضیح بده...")}

            <button class="primary-button" type="submit">مرحله بعد ←</button>
          </form>
        </div>
      </main>
    `);

    $("#trainingForm").onsubmit = event => {
      event.preventDefault();
      const data = formData(event.target);

      data.days = Number(data.days);
      data.duration = Number(data.duration);

      save(STORAGE.training, data);
      showRecoveryAssessment();
    };
  }

  /* =========================================
     ASSESSMENT — STEP 3
     ========================================= */

  function showRecoveryAssessment() {
    const r = read(STORAGE.recovery) || {};

    setPage(`
      <main class="dashboard">
        ${header("showTrainingAssessment")}

        ${welcome("ارزیابی هوشمند · مرحله ۳ از ۳",
          "ریکاوری و سبک زندگی",
          "برای تنظیم بهتر فشار تمرین، به چند سؤال پاسخ بده.")}

        <div class="assessment-form">
          <form id="recoveryForm">
            ${field("معمولاً چند ساعت می‌خوابی؟", "sleep", [
              ["under6", "کمتر از ۶ ساعت"],
              ["6to7", "۶ تا ۷ ساعت"],
              ["7to9", "۷ تا ۹ ساعت"],
              ["over9", "بیشتر از ۹ ساعت"]
            ], r.sleep)}

            ${field("کیفیت خواب", "sleepQuality", [
              ["poor", "ضعیف"],
              ["normal", "معمولی"],
              ["good", "خوب"]
            ], r.sleepQuality)}

            ${field("میزان خستگی معمول بعد از فعالیت", "fatigue", [
              ["low", "کم"],
              ["normal", "متوسط"],
              ["high", "زیاد"]
            ], r.fatigue)}

            ${field("شدت تمرین مورد علاقه", "intensityPreference", [
              ["easy", "سبک و آرام"],
              ["moderate", "متوسط و قابل کنترل"],
              ["challenging", "چالش‌برانگیز اما ایمن"]
            ], r.intensityPreference)}

            ${textArea("توضیحات تکمیلی (اختیاری)", "notes",
              r.notes || "", "هر نکته‌ای که به تنظیم تمرین کمک می‌کند...")}

            <button class="primary-button" type="submit">
              تکمیل ارزیابی و ساخت برنامه ←
            </button>
          </form>
        </div>
      </main>
    `);

    $("#recoveryForm").onsubmit = event => {
      event.preventDefault();
      save(STORAGE.recovery, formData(event.target));
      generatePersonalPlan();
    };
  }

  /* =========================================
     PLAN GENERATOR
     ========================================= */

  function generatePersonalPlan() {
    const profile = read(STORAGE.profile);
    const training = read(STORAGE.training);
    const recovery = read(STORAGE.recovery);

    if (!profile || !training || !recovery) {
      showError("اطلاعات ارزیابی کامل نیست.");
      showAssessment();
      return;
    }

    if (typeof ForgePlanGenerator === "undefined") {
      showError("موتور برنامه‌ساز بارگذاری نشده است. فایل plan-generator.js را بررسی کن.");
      return;
    }

    try {
      const plan = ForgePlanGenerator.generate(profile, {
        ...training,
        recovery
      });

      if (!plan || !Array.isArray(plan.sessions)) {
        throw new Error("ساختار برنامه تولیدشده معتبر نیست.");
      }

      save(STORAGE.plan, plan);
      showWorkoutPlan(plan);
    } catch (error) {
      console.error("FORGE Plan Error:", error);
      showError("ساخت برنامه با خطا مواجه شد: " + error.message);
    }
  }

  function openSavedPlan() {
    const plan = read(STORAGE.plan);

    if (!plan) {
      showError("هنوز برنامه‌ای نساختی. ابتدا ارزیابی رو کامل کن.");
      showAssessment();
      return;
    }

    showWorkoutPlan(plan);
  }

  function showWorkoutPlan(plan) {
    if (!plan || !Array.isArray(plan.sessions)) {
      showError("برنامه تمرینی معتبر نیست.");
      return;
    }

    const sessionsHTML = plan.sessions.map((session, index) => `
      <section class="setup-card">
        <p style="color:#00D4FF">جلسه ${index + 1}</p>
        <h3>${escapeHTML(session.title)}</h3>
        <p>زمان پیشنهادی: ${escapeHTML(session.duration)} دقیقه</p>
        <p>سطح: ${escapeHTML(translate("experience", session.level))}</p>

        ${(session.exercises || []).map(exercise => `
          <div class="exercise-row">
            <div>
              <strong>${escapeHTML(exercise.name)}</strong>
              <p>${escapeHTML(exercise.muscle || "")}</p>
            </div>
            <span>${escapeHTML(exercise.sets)} ست × ${escapeHTML(exercise.reps)}</span>
          </div>
        `).join("")}

        <button class="primary-button" onclick="startForgeSession(${index})">
          شروع این جلسه ←
        </button>
      </section>
    `).join("");

    setPage(`
      <main class="dashboard">
        ${header("showDashboard")}

        ${welcome("برنامه اختصاصی تو",
          "مسیر قوی‌تر شدن شروع شد!",
          "جلسه موردنظرت رو انتخاب کن.")}

        ${sessionsHTML || `<section class="setup-card">جلسه‌ای در برنامه وجود ندارد.</section>`}

        <button class="primary-button" onclick="showDashboard()">بازگشت به خانه</button>
      </main>
    `);
  }

  /* =========================================
     WORKOUT TRACKER
     ========================================= */

  function startForgeSession(sessionIndex) {
    if (typeof ForgeWorkoutTracker === "undefined") {
      showError("موتور ثبت تمرین بارگذاری نشده است.");
      return;
    }

    const plan = read(STORAGE.plan);

    if (!plan || !plan.sessions?.[sessionIndex]) {
      showError("جلسه تمرینی پیدا نشد.");
      return;
    }

    try {
      const record = ForgeWorkoutTracker.completeSession(plan.sessions[sessionIndex]);
      showActiveForgeWorkout(record);
    } catch (error) {
      console.error(error);
      showError("شروع جلسه با خطا مواجه شد.");
    }
  }

  function showActiveForgeWorkout(record) {
    const completed = record.exercises.filter(item => item.completed).length;
    const total = record.exercises.length;
    const progress = total ? Math.round(completed / total * 100) : 0;

    setPage(`
      <main class="dashboard">
        ${header("showDashboard")}

        ${welcome("تمرین فعال",
          escapeHTML(record.title),
          "با تمرکز و اجرای صحیح حرکت‌ها تمرین کن.")}

        <section class="setup-card">
          <h3>پیشرفت جلسه</h3>
          <h2 id="workoutProgress">${progress}٪</h2>
          <div style="height:9px;background:#25283B;border-radius:20px;overflow:hidden;margin-top:12px">
            <div id="workoutProgressBar"
              style="height:100%;width:${progress}%;background:linear-gradient(90deg,#9878FF,#00D4FF);border-radius:20px">
            </div>
          </div>
          <p id="workoutCount" style="margin-top:12px">
            ${completed} از ${total} حرکت انجام شده
          </p>
        </section>

        ${record.exercises.map((exercise, index) => `
          <section class="setup-card">
            <h3>${escapeHTML(exercise.name)}</h3>
            <p>${escapeHTML(exercise.sets)} ست × ${escapeHTML(exercise.reps)}</p>
            <button class="primary-button"
              onclick="toggleForgeExercise(${record.id},${index})"
              style="${exercise.completed ? "background:#173D3A;color:#7FFFD0" : ""}">
              ${exercise.completed ? "✓ انجام شد" : "علامت‌گذاری به‌عنوان انجام‌شده"}
            </button>
          </section>
        `).join("")}

        <button class="primary-button" onclick="finishForgeSession(${record.id})">
          پایان جلسه
        </button>
      </main>
    `);
  }

  function toggleForgeExercise(recordId, exerciseIndex) {
    if (typeof ForgeWorkoutTracker === "undefined") return;

    const updated = ForgeWorkoutTracker.toggleExercise(recordId, exerciseIndex);
    if (updated) showActiveForgeWorkout(updated);
  }

  function finishForgeSession(recordId) {
    if (typeof ForgeWorkoutTracker === "undefined") return;

    const record = ForgeWorkoutTracker.getHistory()
      .find(item => item.id === recordId);

    if (!record) {
      showError("جلسه موردنظر پیدا نشد.");
      return;
    }

    const completed = record.exercises.filter(item => item.completed).length;

    alert(`آفرین! ${completed} حرکت از ${record.exercises.length} حرکت انجام شد.`);
    showProgress();
  }

  /* =========================================
     EXERCISE LIBRARY
     ========================================= */

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/ي/g, "ی")
      .replace(/ك/g, "ک")
      .trim();
  }

  function categoryMatches(item, selected) {
    if (selected === "all") return true;

    const aliases = {
      "پا": ["پا", "legs", "leg"],
      "سینه": ["سینه", "سینه و پشت بازو", "chest"],
      "سرشانه": ["سرشانه", "شانه", "shoulder"],
      "باسن": ["باسن", "glutes", "glute"],
      "جلو بازو": ["جلو بازو", "بازو", "biceps"],
      "هوازی": ["هوازی", "کاردیو", "cardio"]
    };

    const values = [
      item.category,
      item.muscles,
      item.name
    ].flat().map(normalize);

    return (aliases[selected] || [selected])
      .map(normalize)
      .some(alias => values.some(value => value.includes(alias)));
  }

  function showExerciseLibrary() {
    if (typeof ForgeExerciseLibrary === "undefined") {
      showError("کتابخانه حرکات بارگذاری نشده است.");
      return;
    }

    setPage(`
      <main class="dashboard">
        ${header("showDashboard")}

        ${welcome("بانک حرکات FORGE",
          "کتابخانه حرکات",
          "حرکت موردنظرت رو پیدا کن و روش اجرای صحیحش رو یاد بگیر.")}

        <input id="exerciseSearch" class="exercise-search"
          type="search" placeholder="جست‌وجوی حرکت یا عضله...">

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
        ${nav("library")}
      </main>
    `);

    let selectedCategory = "all";

    function renderExercises() {
      const query = normalize($("#exerciseSearch").value);
      let results = ForgeExerciseLibrary.getAll();

      if (query) {
        results = results.filter(item => {
          const searchable = [
            item.name,
            item.category,
            item.muscles,
            item.equipment
          ].flat().join(" ");

          return normalize(searchable).includes(query);
        });
      }

      results = results.filter(item => categoryMatches(item, selectedCategory));

      $("#exerciseList").innerHTML = results.length
        ? results.map(item => `
          <button class="exercise-card" data-id="${escapeHTML(item.id)}">
            <div class="exercise-card-icon">🏋️</div>
            <div>
              <strong>${escapeHTML(item.name)}</strong>
              <p>${escapeHTML(item.category)} · ${escapeHTML(translate("experience", item.level))}</p>
            </div>
            <span>←</span>
          </button>
        `).join("")
        : `<p class="empty-exercises">حرکتی با این مشخصات پیدا نشد.</p>`;

      document.querySelectorAll(".exercise-card").forEach(card => {
        card.onclick = () => showExerciseDetail(card.dataset.id);
      });
    }

    $("#exerciseSearch").addEventListener("input", renderExercises);

    document.querySelectorAll(".category-btn").forEach(button => {
      button.onclick = () => {
        selectedCategory = button.dataset.category;

        document.querySelectorAll(".category-btn").forEach(btn =>
          btn.classList.remove("active")
        );

        button.classList.add("active");
        renderExercises();
      };
    });

    renderExercises();
  }

  function showExerciseDetail(id) {
    const exercise = ForgeExerciseLibrary.getById(id);
    if (!exercise) {
      showError("حرکت موردنظر پیدا نشد.");
      return;
    }

    setPage(`
      <main class="dashboard">
        ${header("showExerciseLibrary")}

        ${welcome("راهنمای حرکت",
          escapeHTML(exercise.name),
          escapeHTML(exercise.category))}

        <section class="setup-card">
          <h3>عضلات درگیر</h3>
          <p>${escapeHTML((exercise.muscles || []).join("، "))}</p>
        </section>

        <section class="setup-card">
          <h3>نحوه اجرای حرکت</h3>
          ${(exercise.instructions || []).map((step, index) => `
            <p class="guide-step">${index + 1}. ${escapeHTML(step)}</p>
          `).join("")}
        </section>

        <section class="setup-card">
          <h3>اشتباهات رایج</h3>
          ${(exercise.mistakes || []).map(mistake => `
            <p class="guide-step">⚠️ ${escapeHTML(mistake)}</p>
          `).join("")}
        </section>

        <section class="setup-card">
          <h3>نکته ایمنی</h3>
          <p>${escapeHTML(exercise.safety || "حرکت را با فرم صحیح و بدون درد انجام بده.")}</p>
        </section>

        <button class="primary-button" onclick="showExerciseLibrary()">
          بازگشت به کتابخانه
        </button>
      </main>
    `);
  }

  /* =========================================
     PROGRESS
     ========================================= */

  function showProgress() {
    if (typeof ForgeWorkoutTracker === "undefined") {
      showError("موتور ثبت تمرین بارگذاری نشده است.");
      return;
    }

    const stats = ForgeWorkoutTracker.getStats();
    const history = ForgeWorkoutTracker.getHistory();

    const historyHTML = history.length
      ? [...history].reverse().map(record => {
          const completed = record.exercises.filter(item => item.completed).length;

          return `
            <section class="setup-card">
              <h3>${escapeHTML(record.title)}</h3>
              <p>${new Date(record.date).toLocaleDateString("fa-IR")}</p>
              <p>${completed} از ${record.exercises.length} حرکت انجام شده</p>
            </section>
          `;
        }).join("")
      : `<section class="setup-card"><p>هنوز تمرینی ثبت نکردی. اولین جلسه‌ات رو شروع کن!</p></section>`;

    setPage(`
      <main class="dashboard">
        ${header("showDashboard")}

        ${welcome("گزارش عملکرد",
          "مسیر پیشرفت تو",
          "پیشرفت واقعی با استمرار و تمرین اصولی ساخته می‌شه.")}

        <section class="setup-card">
          <h3>جلسات ثبت‌شده</h3>
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
        ${nav("progress")}
      </main>
    `);
  }

  /* =========================================
     PROFILE
     ========================================= */

  function showProfile() {
    const p = read(STORAGE.profile);
    const t = read(STORAGE.training);
    const r = read(STORAGE.recovery);

    setPage(`
      <main class="dashboard">
        ${header("showDashboard")}

        ${welcome("حساب کاربری",
          "پروفایل من",
          "اطلاعات ارزیابی و شرایط تمرین تو.")}

        <section class="setup-card">
          <h3>اطلاعات شخصی</h3>
          <p>سن: ${p ? escapeHTML(p.age) + " سال" : "ثبت نشده"}</p>
          <p>قد: ${p ? escapeHTML(p.height) + " سانتی‌متر" : "ثبت نشده"}</p>
          <p>وزن: ${p ? escapeHTML(p.weight) + " کیلوگرم" : "ثبت نشده"}</p>
          <p>هدف: ${p ? escapeHTML(translate("goal", p.goal)) : "ثبت نشده"}</p>
          <p>سطح: ${p ? escapeHTML(translate("experience", p.experience)) : "ثبت نشده"}</p>
          <p>سابقه: ${p ? escapeHTML(p.trainingHistory || "ثبت نشده") : "ثبت نشده"}</p>
        </section>

        <section class="setup-card">
          <h3>شرایط تمرین</h3>
          <p>محل: ${t ? escapeHTML(translate("location", t.location)) : "ثبت نشده"}</p>
          <p>تجهیزات: ${t ? escapeHTML(translate("equipment", t.equipment)) : "ثبت نشده"}</p>
          <p>روزهای تمرین: ${t ? escapeHTML(t.days) + " روز" : "ثبت نشده"}</p>
          <p>زمان جلسه: ${t ? escapeHTML(t.duration) + " دقیقه" : "ثبت نشده"}</p>
          <p>فعالیت روزانه: ${t ? escapeHTML(translate("activity", t.dailyActivity)) : "ثبت نشده"}</p>
          <p>محدودیت: ${t ? escapeHTML(translate("limitations", t.limitations)) : "ثبت نشده"}</p>
        </section>

        <section class="setup-card">
          <h3>ریکاوری</h3>
          <p>مدت خواب: ${r ? escapeHTML(translate("sleep", r.sleep)) : "ثبت نشده"}</p>
          <p>کیفیت خواب: ${r ? escapeHTML(translate("sleepQuality", r.sleepQuality)) : "ثبت نشده"}</p>
          <p>خستگی: ${r ? escapeHTML(translate("fatigue", r.fatigue)) : "ثبت نشده"}</p>
          <p>شدت ترجیحی: ${r ? escapeHTML(translate("intensityPreference", r.intensityPreference)) : "ثبت نشده"}</p>
        </section>

        <button class="primary-button" onclick="showAssessment()">ویرایش ارزیابی</button>
        ${nav("profile")}
      </main>
    `);
  }

  return {
    showDashboard,
    showAssessment,
    showTrainingAssessment,
    showRecoveryAssessment,
    generatePersonalPlan,
    openSavedPlan,
    showWorkoutPlan,
    startForgeSession,
    showActiveForgeWorkout,
    toggleForgeExercise,
    finishForgeSession,
    showExerciseLibrary,
    showExerciseDetail,
    showProgress,
    showProfile
  };
})();

/* =========================================
   GLOBAL ACTIONS
   ========================================= */

const showDashboard = () => ForgeApp.showDashboard();
const showAssessment = () => ForgeApp.showAssessment();
const showTrainingAssessment = () => ForgeApp.showTrainingAssessment();
const showRecoveryAssessment = () => ForgeApp.showRecoveryAssessment();
const generatePersonalPlan = () => ForgeApp.generatePersonalPlan();
const openSavedPlan = () => ForgeApp.openSavedPlan();
const showWorkoutPlan = plan => ForgeApp.showWorkoutPlan(plan);
const startForgeSession = index => ForgeApp.startForgeSession(index);
const showActiveForgeWorkout = record => ForgeApp.showActiveForgeWorkout(record);
const toggleForgeExercise = (id, index) => ForgeApp.toggleForgeExercise(id, index);
const finishForgeSession = id => ForgeApp.finishForgeSession(id);
const showExerciseLibrary = () => ForgeApp.showExerciseLibrary();
const showExerciseDetail = id => ForgeApp.showExerciseDetail(id);
const showProgress = () => ForgeApp.showProgress();
const showProfile = () => ForgeApp.showProfile();

/* =========================================
   APP START
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    showDashboard();
  }, 1800);
});
