
const ForgeRewards = (() => {
  const STORAGE_KEY = "forge_rewards_v1";

  const ACHIEVEMENTS = [
    {
      id: "first-workout",
      title: "شروع قدرتمند",
      description: "اولین جلسه تمرینی خود را کامل کن.",
      icon: "🚀",
      xp: 50,
      condition: stats => stats.sessions >= 1
    },
    {
      id: "five-workouts",
      title: "در مسیر پیشرفت",
      description: "۵ جلسه تمرینی کامل کن.",
      icon: "💪",
      xp: 100,
      condition: stats => stats.sessions >= 5
    },
    {
      id: "ten-workouts",
      title: "جنگجوی واقعی",
      description: "۱۰ جلسه تمرینی کامل کن.",
      icon: "⚔️",
      xp: 200,
      condition: stats => stats.sessions >= 10
    },
    {
      id: "twenty-workouts",
      title: "ماشین پیشرفت",
      description: "۲۰ جلسه تمرینی کامل کن.",
      icon: "🔥",
      xp: 350,
      condition: stats => stats.sessions >= 20
    },
    {
      id: "fifty-workouts",
      title: "افسانه FORGE",
      description: "۵۰ جلسه تمرینی کامل کن.",
      icon: "👑",
      xp: 700,
      condition: stats => stats.sessions >= 50
    },
    {
      id: "hundred-sets",
      title: "صد ست تلاش",
      description: "۱۰۰ ست تمرینی را کامل کن.",
      icon: "🏋️",
      xp: 150,
      condition: stats => stats.sets >= 100
    }
  ];

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
        xp: 0,
        unlocked: [],
        claimedSessions: []
      };
    } catch {
      return {
        xp: 0,
        unlocked: [],
        claimedSessions: []
      };
    }
  }

  function save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function getLevel(xp) {
    const level = Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1;
    const currentLevelXP = (level - 1) ** 2 * 100;
    const nextLevelXP = level ** 2 * 100;

    return {
      level,
      currentLevelXP,
      nextLevelXP,
      progress: Math.min(
        100,
        Math.round(
          ((xp - currentLevelXP) /
          (nextLevelXP - currentLevelXP)) * 100
        )
      )
    };
  }

  function getStats() {
    const data = load();
    const level = getLevel(data.xp);

    return {
      xp: data.xp,
      ...level,
      unlockedCount: data.unlocked.length,
      totalAchievements: ACHIEVEMENTS.length
    };
  }

  function checkAchievements(workoutStats) {
    const data = load();
    const newlyUnlocked = [];

    ACHIEVEMENTS.forEach(achievement => {
      const alreadyUnlocked = data.unlocked.some(
        item => item.id === achievement.id
      );

      if (!alreadyUnlocked && achievement.condition(workoutStats)) {
        data.unlocked.push({
          id: achievement.id,
          unlockedAt: new Date().toISOString()
        });

        data.xp += achievement.xp;

        newlyUnlocked.push({
          ...achievement
        });
      }
    });

    save(data);
    return newlyUnlocked;
  }

  function awardCompletedSession(sessionId, workoutStats) {
    const data = load();
    const id = String(sessionId);

    if (data.claimedSessions.includes(id)) {
      return {
        awarded: false,
        xp: data.xp,
        achievements: []
      };
    }

    data.claimedSessions.push(id);
    data.xp += 30;
    save(data);

    const achievements = checkAchievements(workoutStats);

    return {
      awarded: true,
      earnedXP: 30,
      xp: load().xp,
      achievements
    };
  }

  function getAchievements() {
    const data = load();

    return ACHIEVEMENTS.map(achievement => ({
      ...achievement,
      unlocked: data.unlocked.some(
        item => item.id === achievement.id
      )
    }));
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    getStats,
    getLevel,
    checkAchievements,
    awardCompletedSession,
    getAchievements,
    reset
  };
})();
