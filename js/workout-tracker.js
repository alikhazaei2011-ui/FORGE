
/* =========================================
   FORGE - Workout Tracking System
   ========================================= */

const ForgeWorkoutTracker = (() => {
  const STORAGE_KEY = "forge_workout_history";

  function createId() {
    return "workout_" + Date.now() + "_" +
      Math.random().toString(36).slice(2, 8);
  }

  function loadHistory() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("FORGE: Could not load workout history", error);
      return [];
    }
  }

  function saveHistory(history) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      return true;
    } catch (error) {
      console.error("FORGE: Could not save workout history", error);
      return false;
    }
  }

  function normalizeExercise(exercise, index) {
    const sets = Math.max(1, Number(exercise.sets) || 3);
    const completedSets = Number(exercise.completedSets) || 0;

    return {
      id: exercise.id || "exercise_" + index + "_" + Date.now(),
      name: exercise.name || "حرکت تمرینی",
      category: exercise.category || "",
      muscles: exercise.muscles || [],
      instructions: exercise.instructions || "",
      mistakes: exercise.mistakes || [],
      safety: exercise.safety || "",
      equipment: exercise.equipment || [],
      reps: exercise.reps || 10,
      sets,
      rest: Number(exercise.rest) || 60,
      weight: Number(exercise.weight) || 0,
      actualReps: Number(exercise.actualReps) || 0,
      completedSets,
      completed: Boolean(exercise.completed),
      notes: exercise.notes || "",
      setLogs: Array.from({ length: sets }, (_, i) => {
        const oldLog = exercise.setLogs?.[i];

        return {
          setNumber: i + 1,
          reps: Number(oldLog?.reps) || 0,
          weight: Number(oldLog?.weight) || 0,
          completed: Boolean(oldLog?.completed)
        };
      })
    };
  }

  function getHistory() {
    return loadHistory();
  }

  function findSession(history, recordId) {
    return history.find(item => item.id === recordId);
  }

  function completeSession(planSession) {
    const history = loadHistory();

    const session = {
      id: createId(),
      title: planSession?.title || "جلسه تمرینی FORGE",
      day: planSession?.day || "",
      date: new Date().toISOString(),
      startedAt: new Date().toISOString(),
      finishedAt: null,
      status: "in-progress",
      duration: 0,
      exercises: (planSession?.exercises || []).map(
        normalizeExercise
      )
    };

    history.unshift(session);
    saveHistory(history);

    return session;
  }

  function updateExercise(recordId, exerciseId, updates = {}) {
    const history = loadHistory();
    const session = findSession(history, recordId);

    if (!session) return false;

    const exercise = session.exercises.find(
      item => item.id === exerciseId
    );

    if (!exercise) return false;

    const allowed = [
      "actualReps",
      "weight",
      "notes",
      "completedSets",
      "completed"
    ];

    allowed.forEach(key => {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        exercise[key] = updates[key];
      }
    });

    if (exercise.completedSets >= exercise.sets) {
      exercise.completed = true;
    }

    return saveHistory(history);
  }

  function updateSet(recordId, exerciseId, setIndex, updates = {}) {
    const history = loadHistory();
    const session = findSession(history, recordId);

    if (!session) return false;

    const exercise = session.exercises.find(
      item => item.id === exerciseId
    );

    if (!exercise || !exercise.setLogs[setIndex]) return false;

    const set = exercise.setLogs[setIndex];

    if (Object.prototype.hasOwnProperty.call(updates, "reps")) {
      set.reps = Math.max(0, Number(updates.reps) || 0);
    }

    if (Object.prototype.hasOwnProperty.call(updates, "weight")) {
      set.weight = Math.max(0, Number(updates.weight) || 0);
    }

    if (Object.prototype.hasOwnProperty.call(updates, "completed")) {
      set.completed = Boolean(updates.completed);
    }

    exercise.completedSets = exercise.setLogs.filter(
      item => item.completed
    ).length;

    exercise.completed = exercise.completedSets === exercise.sets;

    const completedReps = exercise.setLogs
      .filter(item => item.completed)
      .reduce((total, item) => total + item.reps, 0);

    exercise.actualReps = completedReps;

    return saveHistory(history);
  }

  function toggleSet(recordId, exerciseId, setIndex) {
    const history = loadHistory();
    const session = findSession(history, recordId);

    if (!session) return false;

    const exercise = session.exercises.find(
      item => item.id === exerciseId
    );

    if (!exercise || !exercise.setLogs[setIndex]) return false;

    return updateSet(recordId, exerciseId, setIndex, {
      completed: !exercise.setLogs[setIndex].completed
    });
  }

  function toggleExercise(recordId, exerciseId) {
    const history = loadHistory();
    const session = findSession(history, recordId);

    if (!session) return false;

    const exercise = session.exercises.find(
      item => item.id === exerciseId
    );

    if (!exercise) return false;

    exercise.completed = !exercise.completed;

    exercise.setLogs.forEach(set => {
      set.completed = exercise.completed;
    });

    exercise.completedSets = exercise.completed
      ? exercise.sets
      : 0;

    return saveHistory(history);
  }

  function finishSession(recordId) {
    const history = loadHistory();
    const session = findSession(history, recordId);

    if (!session) return false;

    session.status = "completed";
    session.finishedAt = new Date().toISOString();

    const start = new Date(session.startedAt).getTime();
    const end = new Date(session.finishedAt).getTime();

    session.duration = Math.max(
      0,
      Math.round((end - start) / 60000)
    );

    return saveHistory(history);
  }

  function deleteSession(recordId) {
    const history = loadHistory().filter(
      item => item.id !== recordId
    );

    return saveHistory(history);
  }

  function getStats() {
    const history = loadHistory();
    const completedSessions = history.filter(
      item => item.status === "completed"
    );

    const allExercises = history.flatMap(
      item => item.exercises || []
    );

    const completedExercises = allExercises.filter(
      item => item.completed
    );

    const totalSets = allExercises.reduce(
      (sum, item) => sum + item.sets,
      0
    );

    const completedSets = allExercises.reduce(
      (sum, item) => sum + item.completedSets,
      0
    );

    return {
      totalSessions: history.length,
      completedSessions: completedSessions.length,
      completedExercises: completedExercises.length,
      totalExercises: allExercises.length,
      totalSets,
      completedSets,
      completionRate: totalSets
        ? Math.round((completedSets / totalSets) * 100)
        : 0,
      totalMinutes: completedSessions.reduce(
        (sum, item) => sum + (item.duration || 0),
        0
      )
    };
  }

  function getRecentSessions(limit = 5) {
    return loadHistory().slice(0, limit);
  }

  function getExerciseProgress(exerciseName) {
    const history = loadHistory();
    const records = [];

    history.forEach(session => {
      session.exercises.forEach(exercise => {
        if (exercise.name === exerciseName) {
          records.push({
            date: session.date,
            weight: exercise.weight || 0,
            reps: exercise.actualReps || 0,
            completedSets: exercise.completedSets || 0
          });
        }
      });
    });

    return records.reverse();
  }

  function getSession(recordId) {
    return loadHistory().find(
      item => item.id === recordId
    ) || null;
  }

  function clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    getHistory,
    getSession,
    completeSession,
    updateExercise,
    updateSet,
    toggleSet,
    toggleExercise,
    finishSession,
    deleteSession,
    getStats,
    getRecentSessions,
    getExerciseProgress,
    clearHistory
  };
})();
