
// ======================================
// FORGE - Intelligent Plan Generator
// Version 1.0
// ======================================

const ForgePlanGenerator = (() => {

  const exerciseLibrary = {
    muscle: {
      home: [
        { name: "اسکوات", sets: 3, reps: "10-12", muscle: "پا" },
        { name: "پرس سینه با بطری", sets: 3, reps: "10-12", muscle: "سینه" },
        { name: "جلو بازو با بطری", sets: 2, reps: "12", muscle: "جلو بازو" },
        { name: "پشت بازو با بطری", sets: 2, reps: "10-12", muscle: "پشت بازو" },
        { name: "پل باسن", sets: 3, reps: "12", muscle: "باسن" },
        { name: "نشر جانب با بطری سبک", sets: 2, reps: "10-12", muscle: "سرشانه" }
      ],
      gym: [
        { name: "پرس سینه دستگاه", sets: 3, reps: "10-12", muscle: "سینه" },
        { name: "لت سیم‌کش", sets: 3, reps: "10-12", muscle: "پشت" },
        { name: "پرس پا", sets: 3, reps: "10-12", muscle: "پا" },
        { name: "جلو بازو سیم‌کش", sets: 2, reps: "12", muscle: "جلو بازو" },
        { name: "پشت بازو سیم‌کش", sets: 2, reps: "12", muscle: "پشت بازو" }
      ]
    },

    strength: {
      home: [
        { name: "اسکوات وزن بدن", sets: 3, reps: "8-10", muscle: "پا" },
        { name: "شنا روی دیوار", sets: 3, reps: "8-12", muscle: "سینه" },
        { name: "پارویی با کوله سبک", sets: 3, reps: "10", muscle: "پشت" },
        { name: "پل باسن", sets: 2, reps: "12", muscle: "باسن" }
      ],
      gym: [
        { name: "پرس سینه دستگاه", sets: 3, reps: "8-10", muscle: "سینه" },
        { name: "قایقی دستگاه", sets: 3, reps: "8-10", muscle: "پشت" },
        { name: "پرس پا", sets: 3, reps: "8-10", muscle: "پا" }
      ]
    },

    fitness: {
      home: [
        { name: "راه رفتن درجا", sets: 2, reps: "60 ثانیه", muscle: "کل بدن" },
        { name: "اسکوات", sets: 2, reps: "10", muscle: "پا" },
        { name: "شنا روی دیوار", sets: 2, reps: "10", muscle: "سینه" },
        { name: "پل باسن", sets: 2, reps: "12", muscle: "باسن" }
      ],
      gym: [
        { name: "دوچرخه ثابت", sets: 1, reps: "5 دقیقه", muscle: "قلبی عروقی" },
        { name: "پرس پا سبک", sets: 2, reps: "12", muscle: "پا" },
        { name: "پرس سینه دستگاه", sets: 2, reps: "12", muscle: "سینه" }
      ]
    }
  };

  function getLevel(experience) {
    if (experience === "advanced") return "پیشرفته";
    if (experience === "intermediate") return "متوسط";
    return "مبتدی";
  }

  function getExercises(profile, training) {
    const goal = exerciseLibrary[profile.goal] || exerciseLibrary.fitness;
    const location = training.location === "gym" ? "gym" : "home";

    return goal[location];
  }

  function generate(profile, training) {
    if (!profile || !training) {
      throw new Error("اطلاعات ارزیابی کامل نیست.");
    }

    const exercises = getExercises(profile, training);
    const days = Math.min(Number(training.days) || 2, 6);
    const duration = Number(training.duration) || 30;

    const sessions = [];

    for (let day = 1; day <= days; day++) {
      sessions.push({
        day,
        title: `جلسه ${day}`,
        duration,
        level: getLevel(profile.experience),
        exercises: exercises.map(exercise => ({ ...exercise }))
      });
    }

    return {
      createdAt: new Date().toISOString(),
      goal: profile.goal,
      sessions
    };
  }

  return { generate };

})();
