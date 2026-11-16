
const ForgePlanGenerator = (() => {
  const EXERCISES = [
    { id: "squat", name: "اسکوات", muscle: "پا", group: "lower", equipment: ["none"], level: 1, goals: ["muscle", "strength", "fitness"] },
    { id: "backpack-squat", name: "اسکوات با کوله‌پشتی", muscle: "پا", group: "lower", equipment: ["bag"], level: 2, goals: ["muscle", "strength"] },
    { id: "stationary-lunge", name: "لانج درجا", muscle: "پا", group: "lower", equipment: ["none"], level: 1, goals: ["muscle", "fitness"] },
    { id: "glute-bridge", name: "پل باسن", muscle: "باسن", group: "lower", equipment: ["none"], level: 1, goals: ["muscle", "fitness"] },
    { id: "calf-raise", name: "ساق پا ایستاده", muscle: "ساق", group: "lower", equipment: ["none"], level: 1, goals: ["muscle", "fitness"] },

    { id: "wall-pushup", name: "شنا روی دیوار", muscle: "سینه", group: "push", equipment: ["none"], level: 1, goals: ["muscle", "strength", "fitness"] },
    { id: "incline-pushup", name: "شنا روی سطح بلند", muscle: "سینه", group: "push", equipment: ["none"], level: 1, goals: ["muscle", "strength"] },
    { id: "dumbbell-chest-press", name: "پرس سینه با دمبل", muscle: "سینه", group: "push", equipment: ["dumbbell"], level: 2, goals: ["muscle", "strength"] },
    { id: "dumbbell-shoulder-press", name: "پرس سرشانه با دمبل", muscle: "سرشانه", group: "push", equipment: ["dumbbell"], level: 2, goals: ["muscle", "strength"] },
    { id: "lateral-raise", name: "نشر جانب با بطری", muscle: "سرشانه", group: "push", equipment: ["bottle"], level: 1, goals: ["muscle"] },
    { id: "bottle-triceps", name: "پشت بازو با بطری", muscle: "پشت بازو", group: "push", equipment: ["bottle"], level: 1, goals: ["muscle"] },

    { id: "bottle-curl", name: "جلو بازو با بطری", muscle: "جلو بازو", group: "pull", equipment: ["bottle"], level: 1, goals: ["muscle"] },
    { id: "dumbbell-curl", name: "جلو بازو با دمبل", muscle: "جلو بازو", group: "pull", equipment: ["dumbbell"], level: 2, goals: ["muscle", "strength"] },
    { id: "band-row", name: "قایقی با کش", muscle: "پشت", group: "pull", equipment: ["band"], level: 2, goals: ["muscle", "strength"] },
    { id: "bent-over-row", name: "پارویی با کوله‌پشتی", muscle: "پشت", group: "pull", equipment: ["bag"], level: 2, goals: ["muscle", "strength"] },
    { id: "scapular-retraction", name: "جمع کردن کتف‌ها", muscle: "پشت", group: "pull", equipment: ["none"], level: 1, goals: ["fitness", "muscle"] },

    { id: "dead-bug", name: "ددباگ", muscle: "شکم", group: "core", equipment: ["none"], level: 1, goals: ["muscle", "fitness"] },
    { id: "bird-dog", name: "برد داگ", muscle: "شکم", group: "core", equipment: ["none"], level: 1, goals: ["fitness"] },
    { id: "short-plank", name: "پلانک کوتاه", muscle: "شکم", group: "core", equipment: ["none"], level: 1, goals: ["muscle", "fitness"] },
    { id: "marching", name: "راه رفتن درجا", muscle: "هوازی", group: "cardio", equipment: ["none"], level: 1, goals: ["fitness"] },
    { id: "low-impact-jack", name: "جامپینگ جک کم‌فشار", muscle: "هوازی", group: "cardio", equipment: ["none"], level: 1, goals: ["fitness"] }
  ];

  const DAY_NAMES = [
    "شنبه", "یکشنبه", "دوشنبه",
    "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"
  ];

  function normalize(value) {
    if (Array.isArray(value)) {
      return value.map(item => String(item ?? "")).join(" ").toLowerCase();
    }

    return String(value ?? "").trim().toLowerCase();
  }

  function getNumber(value, fallback) {
    const number = Number(value);

    return Number.isFinite(number) && number > 0
      ? number
      : fallback;
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
    if (/muscle|عضله|حجم/.test(text)) return "muscle";
    if (/fitness|سلامت|تناسب|استقامت/.test(text)) return "fitness";

    return "fitness";
  }

  function getTrainingDays(value) {
    if (Array.isArray(value)) {
      const selected = value.map(day => {
        if (typeof day === "number") {
          return DAY_NAMES[((day % 7) + 7) % 7];
        }

        return String(day).trim();
      });

      return [...new Set(selected)].filter(day =>
        DAY_NAMES.includes(day)
      ).slice(0, 6);
    }

    const count = Math.min(6, Math.max(1, getNumber(value, 3)));

    if (count === 5) {
      return ["شنبه", "یکشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه"];
    }

    return DAY_NAMES.slice(0, count);
  }

  function getEquipment(training) {
    const rawEquipment =
      training.equipment ??
      training.availableEquipment ??
      "";

    const text = normalize(rawEquipment);
    const location = normalize(training.location);

    const equipment = ["none"];

    if (/بطری|bottle/.test(text)) {
      equipment.push("bottle");
    }

    if (/دمبل|dumbbell/.test(text)) {
      equipment.push("dumbbell");
    }

    if (/کش|band/.test(text)) {
      equipment.push("band");
    }

    if (/کوله|کیف|bag|کوله‌پشتی/.test(text)) {
      equipment.push("bag");
    }

    if (/میله|bar/.test(text)) {
      equipment.push("bar");
    }

    if (/gym|باشگاه/.test(location)) {
      equipment.push("dumbbell", "band", "bag");
    }

    return [...new Set(equipment)];
  }

  function getRecoveryLevel(recovery = {}) {
    const sleep = normalize(recovery.sleepQuality);
    const fatigue = normalize(recovery.fatigue);

    const hours = Number(
      recovery.sleepDuration ||
      recovery.sleepHours ||
      0
    );

    let score = 0;

    if (/ضعیف|poor|بد/.test(sleep)) score++;
    if (/زیاد|high|شدید/.test(fatigue)) score++;
    if (hours > 0 && hours < 7) score++;

    return score;
  }

  function getIntensity(experience, age, recoveryScore, preference) {
    let level = Math.min(experience, age < 18 ? 2 : 3);

    if (recoveryScore >= 2) {
      level = 1;
    } else if (recoveryScore === 1) {
      level = Math.max(1, level - 1);
    }

    const preferenceText = normalize(preference);

    if (/آسان|easy/.test(preferenceText)) {
      level = 1;
    }

    if (/متوسط|moderate/.test(preferenceText)) {
      level = Math.min(level, 2);
    }

    if (age < 18) {
      level = Math.min(level, 2);
    }

    return {
      value: level,
      label: level === 1
        ? "آسان"
        : level === 2
          ? "متوسط"
          : "پیشرفته"
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

    if (!text) return true;

    const noLimitationPatterns = [
      /^ندارم$/,
      /^هیچ$/,
      /^هیچ محدودیتی ندارم$/,
      /^مشکلی ندارم$/,
      /^بدون محدودیت$/,
      /^none$/,
      /^no limitation$/
    ];

    if (noLimitationPatterns.some(pattern => pattern.test(text))) {
      return true;
    }

    const warningGroups = [
      {
        words: ["زانو", "knee"],
        muscles: ["پا", "ساق", "باسن"]
      },
      {
        words: ["شانه", "سرشانه", "shoulder"],
        muscles: ["سرشانه", "سینه", "پشت بازو"]
      },
      {
        words: ["مچ", "wrist"],
        muscles: ["سینه", "پشت بازو", "جلو بازو"]
      },
      {
        words: ["کمر", "back pain", "دیسک"],
        muscles: ["پشت", "پا", "شکم", "باسن"]
      }
    ];

    const muscle = normalize(exercise.muscle);

    for (const group of warningGroups) {
      const mentionsProblem = group.words.some(word =>
        text.includes(word)
      );

      const affectsMuscle = group.muscles.some(item =>
        muscle.includes(item)
      );

      if (mentionsProblem && affectsMuscle) {
        return false;
      }
    }

    return true;
  }

  function getExerciseDetails(exercise) {
    if (
      typeof ForgeExerciseLibrary !== "undefined" &&
      typeof ForgeExerciseLibrary.getById === "function"
    ) {
      return ForgeExerciseLibrary.getById(exercise.id);
    }

    return null;
  }

  function chooseExercises(
    group,
    goal,
    equipment,
    level,
    limitations,
    used
  ) {
    const groupMap = {
      full: ["lower", "push", "pull", "core"],
      upper: ["push", "pull"],
      lower: ["lower", "core"],
      push: ["push"],
      pull: ["pull"]
    };

    const allowedGroups = groupMap[group] || groupMap.full;

    return EXERCISES.filter(exercise =>
      allowedGroups.includes(exercise.group) &&
      exercise.goals.includes(goal) &&
      exercise.equipment.some(item => equipment.includes(item)) &&
      exercise.level <= level &&
      matchesLimitations(exercise, limitations) &&
      !used.has(exercise.id)
    );
  }

  function buildSession(day, split, settings) {
    const used = new Set();

    const candidates = chooseExercises(
      split,
      settings.goal,
      settings.equipment,
      settings.intensity.value,
      settings.limitations,
      used
    );

    const selected = [];

    const maxExercises =
      settings.duration <= 20
        ? 4
        : settings.duration <= 35
          ? 5
          : 6;

    const requiredGroups = split === "full"
      ? ["lower", "push", "pull", "core"]
      : split === "upper"
        ? ["push", "pull"]
        : split === "lower"
          ? ["lower", "core"]
          : [split, "core"];

    for (const group of requiredGroups) {
      const exercise = candidates.find(item =>
        item.group === group &&
        !used.has(item.id)
      );

      if (exercise && selected.length < maxExercises) {
        selected.push(exercise);
        used.add(exercise.id);
      }
    }

    for (const exercise of candidates) {
      if (selected.length >= maxExercises) break;

      if (!used.has(exercise.id)) {
        selected.push(exercise);
        used.add(exercise.id);
      }
    }

    const sets = settings.age < 18
      ? 2
      : settings.intensity.value === 1
        ? 2
        : 3;

    const reps = settings.goal === "strength"
      ? "8 تا 10"
      : "10 تا 12";

    const rest = settings.age < 18 ? 90 : 120;

    return {
      day,
      title: split === "full"
        ? "تمرین کل بدن"
        : split === "upper"
          ? "تمرین بالاتنه"
          : split === "lower"
            ? "تمرین پایین‌تنه"
            : split === "push"
              ? "تمرین عضلات فشاری"
              : "تمرین عضلات کششی",
      duration: settings.duration,
      level: settings.intensity.label,

      exercises: selected.map(exercise => {
        const details = getExerciseDetails(exercise);

        return {
          id: exercise.id,
          name: exercise.name,
          muscle: exercise.muscle,
          category: exercise.muscle,
          muscles: details?.muscles || [exercise.muscle],
          equipment: details?.equipment || exercise.equipment[0],
          instructions: details?.instructions || [],
          mistakes: details?.mistakes || [],
          safety: details?.safety || "",
          sets,
          reps,
          rest,
          restLabel: rest + " ثانیه"
        };
      })
    };
  }

  function generate(profile = {}, training = {}) {
    const age = getNumber(profile.age, 18);
    const goal = getGoal(profile.goal);
    const experience = getExperienceLevel(profile.experience);

    const days = getTrainingDays(
      training.days ?? training.trainingDays
    );

    const duration = Math.min(
      60,
      getNumber(training.duration, 30)
    );

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

    const settings = {
      age,
      goal,
      duration,
      equipment,
      intensity,
      limitations
    };

    const sessions = days.map((day, index) =>
      buildSession(day, split[index], settings)
    ).filter(session => session.exercises.length > 0);

    return {
      createdAt: new Date().toISOString(),
      goal,
      sessions
    };
  }

  return {
    generate
  };
})();
