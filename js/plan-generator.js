
const ForgePlanGenerator = (() => {
  const EXERCISES = [
    { name: "اسکوات", muscle: "پا", group: "lower", equipment: ["none"], level: 1, goals: ["muscle", "strength", "fitness"] },
    { name: "اسکوات با کوله‌پشتی", muscle: "پا", group: "lower", equipment: ["bag"], level: 2, goals: ["muscle", "strength"] },
    { name: "لانج درجا", muscle: "پا", group: "lower", equipment: ["none"], level: 2, goals: ["muscle", "fitness"] },
    { name: "پل باسن", muscle: "باسن", group: "lower", equipment: ["none"], level: 1, goals: ["muscle", "fitness"] },
    { name: "ساق پا ایستاده", muscle: "ساق", group: "lower", equipment: ["none"], level: 1, goals: ["muscle", "fitness"] },

    { name: "شنا روی دیوار", muscle: "سینه", group: "push", equipment: ["none"], level: 1, goals: ["muscle", "strength", "fitness"] },
    { name: "شنا روی سطح بلند", muscle: "سینه", group: "push", equipment: ["none"], level: 2, goals: ["muscle", "strength"] },
    { name: "پرس سینه با دمبل", muscle: "سینه", group: "push", equipment: ["dumbbell"], level: 2, goals: ["muscle", "strength"] },
    { name: "پرس سرشانه با دمبل", muscle: "سرشانه", group: "push", equipment: ["dumbbell"], level: 2, goals: ["muscle", "strength"] },
    { name: "نشر جانب با بطری", muscle: "سرشانه", group: "push", equipment: ["bottle"], level: 1, goals: ["muscle"] },
    { name: "پشت بازو با بطری", muscle: "پشت بازو", group: "push", equipment: ["bottle"], level: 1, goals: ["muscle"] },

    { name: "جلو بازو با بطری", muscle: "جلو بازو", group: "pull", equipment: ["bottle"], level: 1, goals: ["muscle"] },
    { name: "جلو بازو با دمبل", muscle: "جلو بازو", group: "pull", equipment: ["dumbbell"], level: 2, goals: ["muscle", "strength"] },
    { name: "قایقی با کش", muscle: "پشت", group: "pull", equipment: ["band"], level: 2, goals: ["muscle", "strength"] },
    { name: "پارویی با کوله‌پشتی", muscle: "پشت", group: "pull", equipment: ["bag"], level: 2, goals: ["muscle", "strength"] },
    { name: "جمع کردن کتف‌ها", muscle: "پشت", group: "pull", equipment: ["none"], level: 1, goals: ["fitness"] },

    { name: "ددباگ", muscle: "شکم", group: "core", equipment: ["none"], level: 1, goals: ["muscle", "fitness"] },
    { name: "برد داگ", muscle: "شکم", group: "core", equipment: ["none"], level: 1, goals: ["fitness"] },
    { name: "پلانک کوتاه", muscle: "شکم", group: "core", equipment: ["none"], level: 2, goals: ["muscle", "fitness"] },
    { name: "راه رفتن درجا", muscle: "هوازی", group: "cardio", equipment: ["none"], level: 1, goals: ["fitness"] },
    { name: "جامپینگ جک کم‌فشار", muscle: "هوازی", group: "cardio", equipment: ["none"], level: 1, goals: ["fitness"] }
  ];

  const DAY_NAMES = [
    "شنبه", "یکشنبه", "دوشنبه",
    "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"
  ];

  function normalize(value) {
    if (Array.isArray(value)) return value.join(" ").toLowerCase();
    return String(value ?? "").toLowerCase();
  }

  function getNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : fallback;
  }

  function getExperienceLevel(value) {
    const text = normalize(value);

    if (/advanced|پیشرفته|حرفه/.test(text)) return 3;
    if (/intermediate|متوسط/.test(text)) return 2;

    return 1;
  }

  function getGoal(value) {
    const text = normalize(value);

    if (/strength|قدرت/.test(text)) return "strength";
    if (/fitness|سلامت|تناسب|استقامت/.test(text)) return "fitness";
    if (/muscle|عضله|حجم/.test(text)) return "muscle";

    return "fitness";
  }

  function getTrainingDays(value) {
    if (Array.isArray(value)) {
      return value.map(day => {
        if (typeof day === "number") return DAY_NAMES[day % 7];
        return String(day);
      }).slice(0, 6);
    }

    const count = Math.min(6, Math.max(1, getNumber(value, 3)));
    return DAY_NAMES.slice(0, count);
  }

  function getEquipment(training) {
    const text = normalize(training.equipment || training.availableEquipment || "");
    const location = normalize(training.location);

    const equipment = ["none"];

    if (/بطری|bottle/.test(text)) equipment.push("bottle");
    if (/دمبل|dumbbell/.test(text)) equipment.push("dumbbell");
    if (/کش|band/.test(text)) equipment.push("band");
    if (/کوله|کیف|bag/.test(text)) equipment.push("bag");

    if (/gym|باشگاه/.test(location)) {
      equipment.push("dumbbell", "band", "bag");
    }

    if (/میله|bar/.test(text)) equipment.push("bar");

    return [...new Set(equipment)];
  }

  function getRecoveryLevel(recovery) {
    const sleep = normalize(recovery.sleepQuality);
    const fatigue = normalize(recovery.fatigue);
    const hours = Number(recovery.sleepDuration || recovery.sleepHours || 0);

    let score = 0;

    if (/ضعیف|poor|بد/.test(sleep)) score++;
    if (/زیاد|high|شدید/.test(fatigue)) score++;
    if (hours > 0 && hours < 7) score++;

    return score;
  }

  function getIntensity(experience, age, recoveryScore, preference) {
    let level = experience;

    if (age < 18) level = Math.min(level, 2);
    if (recoveryScore >= 2) level = 1;
    else if (recoveryScore === 1) level = Math.max(1, level - 1);

    const preferenceText = normalize(preference);

    if (/آسان|easy/.test(preferenceText)) level = 1;
    if (/متوسط|moderate/.test(preferenceText)) level = Math.min(level, 2);

    if (age < 18) level = Math.min(level, 2);

    return {
      value: level,
      label: level === 1 ? "آسان" : level === 2 ? "متوسط" : "پیشرفته"
    };
  }

  function getSplit(days) {
    if (days <= 2) return ["full", "full"];
    if (days === 3) return ["full", "full", "full"];
    if (days === 4) return ["upper", "lower", "upper", "lower"];
    if (days === 5) return ["push", "pull", "lower", "upper", "full"];

    return ["push", "pull", "lower", "upper", "full", "full"];
  }

  function matchesLimitations(exercise, limitations) {
    const text = normalize(limitations);

    if (!text || /ندارم|هیچ|none|no limitation/.test(text)) return true;

    const muscle = normalize(exercise.muscle);

    const warningGroups = [
      { words: ["زانو", "knee"], muscles: ["پا", "ساق", "باسن"] },
      { words: ["شانه", "سرشانه", "shoulder"], muscles: ["سرشانه", "سینه", "پشت بازو"] },
      { words: ["مچ", "wrist"], muscles: ["سینه", "پشت بازو", "جلو بازو"] },
      { words: ["کمر", "back pain", "دیسک"], muscles: ["پشت", "پا", "شکم"] }
    ];

    for (const group of warningGroups) {
      if (group.words.some(word => text.includes(word)) &&
          group.muscles.some(item => muscle.includes(item))) {
        return false;
      }
    }

    return true;
  }

  function chooseExercises(group, goal, equipment, level, limitations, used) {
    const groupMap = {
      full: ["lower", "push", "pull", "core"],
      upper: ["push", "pull"],
      lower: ["lower", "core"],
      push: ["push"],
      pull: ["pull"]
    };

    const allowedGroups = groupMap[group] || groupMap.full;

    let candidates = EXERCISES.filter(exercise =>
      allowedGroups.includes(exercise.group) &&
      exercise.goals.includes(goal) &&
      exercise.equipment.some(item => equipment.includes(item)) &&
      exercise.level <= level &&
      matchesLimitations(exercise, limitations) &&
      !used.has(exercise.name)
    );

    if (candidates.length < 3) {
      candidates = EXERCISES.filter(exercise =>
        allowedGroups.includes(exercise.group) &&
        exercise.equipment.some(item => equipment.includes(item)) &&
        exercise.level <= level &&
        matchesLimitations(exercise, limitations) &&
        !used.has(exercise.name)
      );
    }

    return candidates;
  }

  function buildSession(day, index, split, settings) {
    const used = settings.used;
    const candidates = chooseExercises(
      split,
      settings.goal,
      settings.equipment,
      settings.intensity.value,
      settings.limitations,
      used
    );

    const selected = [];
    const maxExercises = settings.duration <= 20 ? 4 : settings.duration <= 35 ? 5 : 6;

    for (const group of (split === "full"
      ? ["lower", "push", "pull", "core"]
      : split === "upper"
        ? ["push", "pull"]
        : split === "lower"
          ? ["lower", "core"]
          : [split, "core"])) {

      const exercise = candidates.find(item => item.group === group && !used.has(item.name));

      if (exercise && selected.length < maxExercises) {
        selected.push(exercise);
        used.add(exercise.name);
      }
    }

    for (const exercise of candidates) {
      if (selected.length >= maxExercises) break;
      if (used.has(exercise.name)) continue;

      selected.push(exercise);
      used.add(exercise.name);
    }

    const sets = settings.age < 18 ? 2 : settings.intensity.value === 1 ? 2 : 3;
    const reps = settings.goal === "strength" ? "8 تا 10" : "10 تا 12";

    return {
      day,
      title: split === "full" ? "تمرین کل بدن" :
        split === "upper" ? "تمرین بالاتنه" :
        split === "lower" ? "تمرین پایین‌تنه" :
        split === "push" ? "تمرین عضلات فشاری" : "تمرین عضلات کششی",
      duration: settings.duration,
      level: settings.intensity.label,
      exercises: selected.map(exercise => ({
        name: exercise.name,
        muscle: exercise.muscle,
        sets,
        reps,
        rest: settings.age < 18 ? "۶۰ تا ۹۰ ثانیه" : "۶۰ تا ۱۲۰ ثانیه"
      }))
    };
  }

  function generate(profile = {}, training = {}) {
    const age = getNumber(profile.age, 18);
    const goal = getGoal(profile.goal);
    const experience = getExperienceLevel(profile.experience);

    const days = getTrainingDays(training.days || training.trainingDays);
    const duration = Math.min(60, getNumber(training.duration, 30));
    const equipment = getEquipment(training);

    const recovery = training.recovery || {};
    const recoveryScore = getRecoveryLevel(recovery);

    const intensity = getIntensity(
      experience,
      age,
      recoveryScore,
      recovery.intensityPreference || recovery.preference
    );

    const limitations = [
      training.limitations,
      training.limitationDetails,
      training.healthNotes,
      recovery.notes
    ].filter(Boolean).join(" ");

    const split = getSplit(days.length);
    const used = new Set();

    const settings = {
      age,
      goal,
      duration,
      equipment,
      intensity,
      limitations,
      used
    };

    const sessions = days.map((day, index) =>
      buildSession(day, index, split[index], settings)
    ).filter(session => session.exercises.length > 0);

    return {
      createdAt: new Date().toISOString(),
      goal,
      sessions
    };
  }

  return { generate };
})();
