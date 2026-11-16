
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

  let restInterval = null;
  let restRemaining = 0;

  const read = key => {
    try {
      return JSON.parse(localStorage.getItem(key) || "null");
    } catch {
      return null;
    }
  };

  const save = (key, value) =>
    localStorage.setItem(key, JSON.stringify(value));

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
    stopRestTimer();
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
      ["rewards", "جوایز", "showRewards"],
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
          <option value="${key}" ${String(value) === String(key) ? "selected" : ""}>${title}</option>
        `).join("")}
      </select>
    `;
  }

  function input(label, name, type, value = "", placeholder = "", attributes = "") {
    return `
      <label for="${name}">${label}</label>
      <input id="${name}" name="${name}" type="${type}"
        value="${escapeHTML(value)}"
        placeholder="${placeholder}" ${attributes}>
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

    const rewardStats = typeof ForgeRewards !== "undefined"
      ? ForgeRewards.getStats()
      : null;

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

        ${rewardStats ? `
          <section class="setup-card">
            <p style="color:#00D4FF">سطح ${rewardStats.level}</p>
            <h2>${rewardStats.xp} XP</h2>
            <p>${rewardStats.unlockedCount} دستاورد از ${rewardStats.totalAchievements}</p>
            <div style="height:9px;background:#25283B;border-radius:20px;overflow:hidden">
              <div style="height:100%;width:${rewardStats.progress}%;background:linear-gradient(90deg,#9878FF,#00D4FF)"></div>
            </div>
            <button class="primary-button" onclick="showRewards()">مشاهده جوایز ←</button>
          </section>
        ` : ""}

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
          <button class="primary-button" onclick="openSavedPlan()">مشاهده برنامه ←</button>
        </section>

        <section class="setup-card">
          <h3>کتابخانه حرکات</h3>
          <p>حرکات ورزشی را بررسی کن و روش اجرای صحیح آن‌ها را یاد بگیر.</p>
          <button class="primary-button" onclick="showExerciseLibrary()">مشاهده حرکات ←</button>
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
            ${input("سن (سال)", "age", "number", p.age || "", "مثلاً ۱۸", 'min="10" max="100" required')}
            ${input("قد (سانتی‌متر)", "height", "number", p.height || "", "مثلاً ۱۷۵", 'min="100" max="230" required')}
            ${input("وزن (کیلوگرم)", "weight", "number", p.weight || "", "مثلاً ۶۵", 'min="20" max="300" step="0.1" required')}

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
              ["home", "خانه"], ["gym", "باشگاه"], ["both", "خانه و باشگاه"]
            ], t.location)}

            ${field("تجهیزات در دسترس", "equipment", [
              ["none", "بدون تجهیزات"],
              ["basic", "وسایل ساده خانگی"],
              ["dumbbells", "دمبل و وزنه"],
              ["full", "تجهیزات کامل باشگاهی"]
            ], t.equipment)}

            ${field("روزهای تمرین در هفته", "days", [
              ["2", "۲ روز"], ["3", "۳ روز"], ["4", "۴ روز"],
              ["5", "۵ روز"], ["6", "۶ روز"]
            ], String(t.days || ""))}

            ${field("زمان هر جلسه", "duration", [
              ["20", "۲۰ دقیقه"], ["30", "۳۰ دقیقه"],
              ["45", "۴۵ دقیقه"], ["60", "۶۰ دقیقه"],
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

            ${textArea("توضیح محدودیت یا آسیب (اختیاری)", "limitationDetails",
              t.limitationDetails || "", "در صورت تمایل توضیح بده...")}

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
              ["under6", "کمتر از ۶ ساعت"], ["6to7", "۶ تا ۷ ساعت"],
              ["7to9", "۷ تا ۹ ساعت"], ["over9", "بیشتر از ۹ ساعت"]
            ], r.sleep)}

            ${field("کیفیت خواب", "sleepQuality", [
              ["poor", "ضعیف"], ["normal", "معمولی"], ["good", "خوب"]
            ], r.sleepQuality)}

            ${field("میزان خستگی معمول بعد از فعالیت", "fatigue", [
              ["low", "کم"], ["normal", "متوسط"], ["high", "زیاد"]
            ], r.fatigue)}

            ${field("شدت تمرین مورد علاقه", "intensityPreference", [
              ["easy", "سبک و آرام"],
              ["moderate", "متوسط و قابل کنترل"],
              ["challenging", "چالش‌برانگیز اما ایمن"]
            ], r.intensityPreference)}

            ${textArea("توضیحات تکمیلی (اختیاری)", "notes",
              r.notes || "", "هر نکته‌ای که به تنظیم تمرین کمک می‌کند...")}

            <button class="primary-button" type="submit">تکمیل ارزیابی و ساخت برنامه ←</button>
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
      showError("موتور برنامه‌ساز بارگذاری نشده است.");
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
        ${welcome("برنامه اختصاصی تو", "مسیر قوی‌تر شدن شروع شد!", "جلسه موردنظرت رو انتخاب کن.")}
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
      const record = ForgeWorkoutTracker.completeSession(
        plan.sessions[sessionIndex]
      );

      if (!record) throw new Error("جلسه ساخته نشد.");

      showActiveForgeWorkout(record);
    } catch (error) {
      console.error(error);
      showError("شروع جلسه با خطا مواجه شد.");
    }
  }

  function getCurrentSession(recordId) {
    return ForgeWorkoutTracker.getSession(recordId);
  }

  function showActiveForgeWorkout(record) {
    if (typeof ForgeWorkoutTracker === "undefined") return;

    const latest = getCurrentSession(record.id) || record;
    const exercises = latest.exercises || [];

    const totalSets = exercises.reduce(
      (sum, exercise) => sum + (Number(exercise.sets) || 0), 0
    );

    const completedSets = exercises.reduce(
      (sum, exercise) => sum + (Number(exercise.completedSets) || 0), 0
    );

    const progress = totalSets
      ? Math.round(completedSets / totalSets * 100)
      : 0;

    const exerciseHTML = exercises.map((exercise, index) => {
      const sets = exercise.setLogs || [];
      const exerciseId = escapeHTML(exercise.id);

      return `
        <section class="setup-card" style="margin-bottom:18px">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
            <div>
              <p style="color:#00D4FF;font-size:12px">حرکت ${index + 1}</p>
              <h3>${escapeHTML(exercise.name)}</h3>
            </div>
            <span style="color:#00D4FF;font-weight:700">
              ${exercise.completedSets || 0}/${exercise.sets}
            </span>
          </div>

          <p style="margin:8px 0;color:#9296AA">
            هدف: ${escapeHTML(exercise.sets)} ست × ${escapeHTML(exercise.reps)} تکرار
          </p>

          <div style="display:grid;gap:12px;margin-top:16px">
            ${sets.map((set, setIndex) => `
              <div style="
                background:#101321;
                border:1px solid ${set.completed ? "#9878FF" : "#292D42"};
                border-radius:14px;
                padding:13px;
              ">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
                  <strong>ست ${setIndex + 1}</strong>
                  <span style="font-size:12px;color:${set.completed ? "#7FFFD0" : "#9296AA"}">
                    ${set.completed ? "✓ تکمیل‌شده" : "در انتظار"}
                  </span>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
                  <label style="font-size:12px">
                    تکرار
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value="${set.reps || exercise.reps || 0}"
                      onchange="updateForgeSet('${latest.id}','${exerciseId}',${setIndex},'reps',this.value)"
                      style="width:100%;margin-top:6px"
                    >
                  </label>

                  <label style="font-size:12px">
                    وزنه (کیلوگرم)
                    <input
                      type="number"
                      min="0"
                      max="500"
                      step="0.5"
                      value="${set.weight || 0}"
                      onchange="updateForgeSet('${latest.id}','${exerciseId}',${setIndex},'weight',this.value)"
                      style="width:100%;margin-top:6px"
                    >
                  </label>
                </div>

                <button
                  class="primary-button"
                  style="margin-top:12px;background:${set.completed ? "#173D3A" : "linear-gradient(120deg,#9878FF,#6941D9)"};color:${set.completed ? "#7FFFD0" : "#fff"}"
                  onclick="toggleForgeSet('${latest.id}','${exerciseId}',${setIndex})"
                >
                  ${set.completed ? "✓ ثبت شد؛ لغو ثبت" : "ثبت تکمیل ست"}
                </button>
              </div>
            `).join("")}
          </div>

          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">
            <button class="secondary-button" onclick="startForgeRest(30)">استراحت ۳۰ ثانیه</button>
            <button class="secondary-button" onclick="startForgeRest(60)">استراحت ۶۰ ثانیه</button>
            <button class="secondary-button" onclick="startForgeRest(90)">استراحت ۹۰ ثانیه</button>
          </div>
        </section>
      `;
    }).join("");

    setPage(`
      <main class="dashboard">
        ${header("showWorkoutPlanFromSaved")}
        ${welcome("تمرین فعال", escapeHTML(latest.title), "هر ست رو بعد از اجرای صحیح ثبت کن.")}

        <section class="setup-card">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <h3>پیشرفت جلسه</h3>
            <strong style="color:#00D4FF">${progress}٪</strong>
          </div>

          <div style="height:10px;background:#25283B;border-radius:20px;overflow:hidden;margin:14px 0">
            <div style="height:100%;width:${progress}%;background:linear-gradient(90deg,#9878FF,#00D4FF);transition:width .3s"></div>
          </div>

          <p>${completedSets} از ${totalSets} ست تکمیل شده</p>
        </section>

        <section class="setup-card" id="restTimerCard" style="text-align:center">
          <p style="color:#00D4FF">تایمر استراحت</p>
          <h2 id="restTimerDisplay" style="font-size:42px;margin:10px">00:00</h2>
          <p id="restTimerStatus">برای شروع، زمان استراحت رو انتخاب کن.</p>
          <button class="secondary-button" onclick="stopForgeRest()">توقف تایمر</button>
        </section>

        ${exerciseHTML}

        <section class="setup-card">
          <h3>پایان تمرین</h3>
          <p>بعد از ثبت ست‌هایی که انجام دادی، می‌تونی جلسه رو به پایان برسونی.</p>
          <button class="primary-button" onclick="finishForgeSession('${latest.id}')">
            پایان جلسه و دریافت امتیاز
          </button>
        </section>
      </main>
    `);
  }

  function updateForgeSet(recordId, exerciseId, setIndex, field, value) {
    if (typeof ForgeWorkoutTracker === "undefined") return;

    const updates = {};

    if (field === "reps" || field === "weight") {
      updates[field] = Math.max(0, Number(value) || 0);
    } else {
      return;
    }

    ForgeWorkoutTracker.updateSet(
      recordId,
      exerciseId,
      setIndex,
      updates
    );
  }

  function toggleForgeSet(recordId, exerciseId, setIndex) {
    if (typeof ForgeWorkoutTracker === "undefined") return;

    const success = ForgeWorkoutTracker.toggleSet(
      recordId,
      exerciseId,
      setIndex
    );

    if (!success) {
      showError("ثبت این ست انجام نشد.");
      return;
    }

    const record = getCurrentSession(recordId);
    if (record) showActiveForgeWorkout(record);
  }

  function toggleForgeExercise(recordId, exerciseIndex) {
    const record = getCurrentSession(recordId);

    if (!record) {
      showError("جلسه تمرینی پیدا نشد.");
      return;
    }

    const exercise = record.exercises[exerciseIndex];

    if (!exercise) return;

    const success = ForgeWorkoutTracker.toggleExercise(
      recordId,
      exercise.id
    );

    if (success) {
      const updated = getCurrentSession(recordId);
      showActiveForgeWorkout(updated);
    }
  }

  /* =========================================
     REST TIMER
     ========================================= */

  function startForgeRest(seconds) {
    stopRestTimer();

    restRemaining = Math.max(1, Number(seconds) || 60);

    updateRestTimerDisplay();

    const status = $("#restTimerStatus");
    if (status) status.textContent = "زمان استراحت شروع شد.";

    restInterval = setInterval(() => {
      restRemaining--;
      updateRestTimerDisplay();

      if (restRemaining <= 0) {
        stopRestTimer(false);

        const display = $("#restTimerDisplay");
        const timerStatus = $("#restTimerStatus");

        if (display) display.textContent = "00:00";
        if (timerStatus) timerStatus.textContent = "زمان استراحت تموم شد! آماده حرکت بعدی؟";

        if ("vibrate" in navigator) navigator.vibrate([150, 80, 150]);
      }
    }, 1000);
  }

  function updateRestTimerDisplay() {
    const display = $("#restTimerDisplay");
    if (!display) return;

    const minutes = Math.floor(restRemaining / 60);
    const seconds = restRemaining % 60;

    display.textContent =
      String(minutes).padStart(2, "0") + ":" +
      String(seconds).padStart(2, "0");
  }

  function stopRestTimer(updateStatus = true) {
    if (restInterval) {
      clearInterval(restInterval);
      restInterval = null;
    }

    if (updateStatus) {
      const status = $("#restTimerStatus");
      if (status) status.textContent = "تایمر متوقف شد.";
    }
  }

  function stopForgeRest() {
    stopRestTimer();
    restRemaining = 0;
    updateRestTimerDisplay();
  }

  /* =========================================
     FINISH SESSION + REWARDS
     ========================================= */

  function finishForgeSession(recordId) {
    if (typeof ForgeWorkoutTracker === "undefined") return;

    const record = getCurrentSession(recordId);

    if (!record) {
      showError("جلسه موردنظر پیدا نشد.");
      return;
    }

    if (record.status === "completed") {
      showError("این جلسه قبلاً پایان یافته است.");
      showProgress();
      return;
    }

    const completedSets = record.exercises.reduce(
      (sum, exercise) => sum + (exercise.completedSets || 0),
      0
    );

    if (completedSets === 0) {
      const proceed = confirm("هنوز هیچ ستی ثبت نکردی. مطمئنی می‌خوای جلسه رو پایان بدی؟");
      if (!proceed) return;
    }

    const finished = ForgeWorkoutTracker.finishSession(recordId);

    if (!finished) {
      showError("ثبت پایان تمرین با خطا مواجه شد.");
      return;
    }

    const stats = ForgeWorkoutTracker.getStats();
    let rewardResult = null;

    if (typeof ForgeRewards !== "undefined") {
      rewardResult = ForgeRewards.awardCompletedSession(recordId, {
        sessions: stats.completedSessions,
        sets: stats.completedSets
      });
    }

    const earned = rewardResult?.awarded ? rewardResult.earnedXP : 0;
    const newAchievements = rewardResult?.achievements || [];

    let message = rewardResult?.awarded
      ? `${earned} امتیاز XP دریافت کردی.`
      : "جلسه ثبت شد.";

    if (newAchievements.length) {
      message += "\n\nدستاوردهای جدید:\n" +
        newAchievements.map(item =>
          `${item.icon} ${item.title} (+${item.xp} XP)`
        ).join("\n");
    }

    if (rewardResult?.awarded) {
      const current = ForgeRewards.getStats();
      message += `\n\nمجموع امتیاز: ${current.xp} XP`;
      message += `\nسطح فعلی: ${current.level}`;
    }

    alert(message);
    showRewards();
  }

  /* =========================================
     REWARDS PAGE
     ========================================= */

  function showRewards() {
    if (typeof ForgeRewards === "undefined") {
      showError("سیستم جوایز بارگذاری نشده است.");
      return;
    }

    const stats = ForgeRewards.getStats();
    const achievements = ForgeRewards.getAchievements();

    const achievementHTML = achievements.map(item => `
      <section class="setup-card" style="${item.unlocked ? "border:1px solid #9878FF" : "opacity:.7"}">
        <div style="display:flex;align-items:center;gap:12px">
          <span style="font-size:30px">${item.unlocked ? item.icon : "🔒"}</span>
          <div style="flex:1">
            <h3>${escapeHTML(item.title)}</h3>
            <p>${escapeHTML(item.description)}</p>
            <p style="color:#00D4FF">${item.xp} XP</p>
          </div>
          <strong>${item.unlocked ? "✓" : "قفل"}</strong>
        </div>
      </section>
    `).join("");

    setPage(`
      <main class="dashboard">
        ${header("showDashboard")}
        ${welcome("FORGE REWARDS", "تالار افتخارات", "هر تمرین، یک قدم به سطح بعدی نزدیک‌ترت می‌کنه.")}

        <section class="setup-card">
          <p style="color:#00D4FF">سطح فعلی</p>
          <h1 style="font-size:48px;margin:8px 0">${stats.level}</h1>
          <h3>${stats.xp} XP</h3>
          <div style="height:12px;background:#25283B;border-radius:20px;overflow:hidden;margin:16px 0">
            <div style="height:100%;width:${stats.progress}%;background:linear-gradient(90deg,#9878FF,#00D4FF);border-radius:20px"></div>
          </div>
          <p>${stats.currentLevelXP} تا ${stats.nextLevelXP} XP</p>
          <p>${stats.progress}٪ مسیر تا سطح بعدی</p>
        </section>

        <section class="setup-card">
          <h3>دستاوردهای بازشده</h3>
          <h2>${stats.unlockedCount} / ${stats.totalAchievements}</h2>
        </section>

        <h3 style="margin:24px 0 14px">دستاوردها</h3>
        ${achievementHTML}

        ${nav("rewards")}
      </main>
    `);
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

    const values = [item.category, item.muscles, item.name]
      .flat().map(normalize);

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
        ${welcome("بانک حرکات FORGE", "کتابخانه حرکات", "حرکت موردنظرت رو پیدا کن و روش اجرای صحیحش رو یاد بگیر.")}

        <input id="exerciseSearch" class="exercise-search" type="search"
          placeholder="جست‌وجوی حرکت یا عضله...">

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
          const searchable = [item.name, item.category, item.muscles, item.equipment]
            .flat().join(" ");
          return normalize(searchable).includes(query);
        });
      }

      results = results.filter(item =>
        categoryMatches(item, selectedCategory)
      );

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
        ${welcome("راهنمای حرکت", escapeHTML(exercise.name), escapeHTML(exercise.category))}

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

        <button class="primary-button" onclick="showExerciseLibrary()">بازگشت به کتابخانه</button>
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
          const sets = record.exercises.reduce(
            (sum, item) => sum + (item.completedSets || 0), 0
          );

          return `
            <section class="setup-card">
              <h3>${escapeHTML(record.title)}</h3>
              <p>${new Date(record.date).toLocaleDateString("fa-IR")}</p>
              <p>${completed} از ${record.exercises.length} حرکت کامل شده</p>
              <p>${sets} ست ثبت شده</p>
              <p>${record.status === "completed" ? "✓ جلسه پایان‌یافته" : "در حال انجام"}</p>
              ${record.status !== "completed" ? `
                <button class="primary-button" onclick="resumeForgeSession('${record.id}')">
                  ادامه تمرین
                </button>
              ` : ""}
            </section>
          `;
        }).join("")
      : `<section class="setup-card"><p>هنوز تمرینی ثبت نکردی. اولین جلسه‌ات رو شروع کن!</p></section>`;

    setPage(`
      <main class="dashboard">
        ${header("showDashboard")}
        ${welcome("گزارش عملکرد", "مسیر پیشرفت تو", "پیشرفت واقعی با استمرار و تمرین اصولی ساخته می‌شه.")}

        <section class="setup-card">
          <h3>جلسات کامل‌شده</h3>
          <h2>${stats.completedSessions}</h2>
        </section>

        <section class="setup-card">
          <h3>حرکات انجام‌شده</h3>
          <h2>${stats.completedExercises}</h2>
        </section>

        <section class="setup-card">
          <h3>ست‌های کامل‌شده</h3>
          <h2>${stats.completedSets}</h2>
        </section>

        <section class="setup-card">
          <h3>درصد تکمیل تمرین‌ها</h3>
          <h2>${stats.completionRate}٪</h2>
        </section>

        <h3 style="margin:25px 0 15px">تاریخچه تمرین‌ها</h3>
        ${historyHTML}
        ${nav("progress")}
      </main>
    `);
  }

  function resumeForgeSession(recordId) {
    const record = getCurrentSession(recordId);

    if (!record) {
      showError("جلسه تمرینی پیدا نشد.");
      return;
    }

    showActiveForgeWorkout(record);
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
        ${welcome("حساب کاربری", "پروفایل من", "اطلاعات ارزیابی و شرایط تمرین تو.")}

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
    updateForgeSet,
    toggleForgeSet,
    startForgeRest,
    stopForgeRest,
    finishForgeSession,
    resumeForgeSession,
    showRewards,
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
const updateForgeSet = (id, exerciseId, index, field, value) =>
  ForgeApp.updateForgeSet(id, exerciseId, index, field, value);
const toggleForgeSet = (id, exerciseId, index) =>
  ForgeApp.toggleForgeSet(id, exerciseId, index);
const startForgeRest = seconds => ForgeApp.startForgeRest(seconds);
const stopForgeRest = () => ForgeApp.stopForgeRest();
const finishForgeSession = id => ForgeApp.finishForgeSession(id);
const resumeForgeSession = id => ForgeApp.resumeForgeSession(id);
const showRewards = () => ForgeApp.showRewards();
const showExerciseLibrary = () => ForgeApp.showExerciseLibrary();
const showExerciseDetail = id => ForgeApp.showExerciseDetail(id);
const showProgress = () => ForgeApp.showProgress();
const showProfile = () => ForgeApp.showProfile();
const showWorkoutPlanFromSaved = () => ForgeApp.openSavedPlan();

/* =========================================
   APP START
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(showDashboard, 1800);
});
