
/* =========================================
   FORGE - Advanced Rewards System
   ========================================= */

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
      const saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY)
      );

      return {
        xp: Math.max(0, Number(saved?.xp) || 0),
        unlocked: Array.isArray(saved?.unlocked)
          ? saved.unlocked
          : [],
        claimedSessions: Array.isArray(saved?.claimedSessions)
          ? saved.claimedSessions
          : []
      };
    } catch (error) {
      console.error("FORGE: Rewards loading failed", error);

      return {
        xp: 0,
        unlocked: [],
        claimedSessions: []
      };
    }
  }

  function save(data) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );
      return true;
    } catch (error) {
      console.error("FORGE: Rewards saving failed", error);
      return false;
    }
  }

  function normalizeWorkoutStats(workoutStats = {}) {
    return {
      sessions: Number(
        workoutStats.sessions ??
        workoutStats.completedSessions ??
        0
      ),
      sets: Number(
        workoutStats.sets ??
        workoutStats.completedSets ??
        0
      )
    };
  }

  function getLevel(xp) {
    xp = Math.max(0, Number(xp) || 0);

    const level =
      Math.floor(Math.sqrt(xp / 100)) + 1;

    const currentLevelXP =
      (level - 1) ** 2 * 100;

    const nextLevelXP =
      level ** 2 * 100;

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

    return {
      xp: data.xp,
      ...getLevel(data.xp),
      unlockedCount: data.unlocked.length,
      totalAchievements: ACHIEVEMENTS.length
    };
  }

  function checkAchievements(workoutStats = {}) {
    const data = load();
    const stats = normalizeWorkoutStats(workoutStats);
    const newlyUnlocked = [];

    ACHIEVEMENTS.forEach(achievement => {
      const alreadyUnlocked = data.unlocked.some(
        item => item.id === achievement.id
      );

      if (
        !alreadyUnlocked &&
        achievement.condition(stats)
      ) {
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

  function awardCompletedSession(sessionId, workoutStats = {}) {
    const data = load();
    const id = String(sessionId);

    if (data.claimedSessions.includes(id)) {
      return {
        awarded: false,
        earnedXP: 0,
        xp: data.xp,
        achievements: []
      };
    }

    data.claimedSessions.push(id);
    data.xp += 30;

    if (!save(data)) {
      return {
        awarded: false,
        earnedXP: 0,
        xp: data.xp,
        achievements: []
      };
    }

    const achievements = checkAchievements(
      workoutStats
    );

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
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error("FORGE: Rewards reset failed", error);
      return false;
    }
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
