
const ForgeWorkoutTracker = (() => {
  const STORAGE_KEY = "forge_workout_history";

  function getHistory() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function saveHistory(history) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }

  function createId() {
    return Date.now() + Math.floor(Math.random() * 10000);
  }

  function completeSession(session) {
    if (!session || !Array.isArray(session.exercises)) return null;

    const history = getHistory();

    const record = {
      id: createId(),
      title: session.title || "جلسه تمرینی",
      day: session.day || "",
      date: new Date().toISOString(),
      status: "in_progress",
      finishedAt: null,
      exercises: session.exercises.map(exercise => ({
        name: exercise.name || "حرکت بدون نام",
        muscle: exercise.muscle || "",
        sets: Number(exercise.sets) || 2,
        reps: exercise.reps || "10 تا 12",
        rest: exercise.rest || "۶۰ ثانیه",
        completed: false,
        completedSets: 0,
        actualReps: [],
        weight: 0,
        notes: ""
      }))
    };

    history.push(record);
    saveHistory(history);

    return record;
  }

  function findRecord(history, recordId) {
    return history.find(item => String(item.id) === String(recordId));
  }

  function toggleExercise(recordId, exerciseIndex) {
    const history = getHistory();
    const record = findRecord(history, recordId);

    if (!record || !record.exercises[exerciseIndex]) return null;

    const exercise = record.exercises[exerciseIndex];
    exercise.completed = !exercise.completed;
    exercise.completedSets = exercise.completed
      ? exercise.sets
      : 0;

    saveHistory(history);
    return record;
  }

  function updateExercise(recordId, exerciseIndex, updates = {}) {
    const history = getHistory();
    const record = findRecord(history, recordId);

    if (!record || !record.exercises[exerciseIndex]) return null;

    const exercise = record.exercises[exerciseIndex];

    if (updates.completedSets !== undefined) {
      exercise.completedSets = Math.max(
        0,
        Math.min(exercise.sets, Number(updates.completedSets) || 0)
      );

      exercise.completed = exercise.completedSets >= exercise.sets;
    }

    if (updates.weight !== undefined) {
      exercise.weight = Math.max(0, Number(updates.weight) || 0);
    }

    if (updates.actualReps !== undefined && Array.isArray(updates.actualReps)) {
      exercise.actualReps = updates.actualReps.map(value =>
        Math.max(0, Number(value) || 0)
      );
    }

    if (updates.notes !== undefined) {
      exercise.notes = String(updates.notes).slice(0, 500);
    }

    saveHistory(history);
    return record;
  }

  function finishSession(recordId) {
    const history = getHistory();
    const record = findRecord(history, recordId);

    if (!record) return null;

    record.status = "completed";
    record.finishedAt = new Date().toISOString();

    saveHistory(history);
    return record;
  }

  function deleteSession(recordId) {
    const history = getHistory();
    const updated = history.filter(
      item => String(item.id) !== String(recordId)
    );

    if (updated.length === history.length) return false;

    saveHistory(updated);
    return true;
  }

  function getStats() {
    const history = getHistory();

    const completedSessions = history.filter(
      session => session.status === "completed"
    );

    const completedExercises = history.reduce((total, session) => {
      return total + session.exercises.filter(
        exercise => exercise.completed
      ).length;
    }, 0);

    const totalExercises = history.reduce((total, session) => {
      return total + session.exercises.length;
    }, 0);

    const completedSets = history.reduce((total, session) => {
      return total + session.exercises.reduce(
        (sum, exercise) => sum + (Number(exercise.completedSets) || 0),
        0
      );
    }, 0);

    return {
      totalSessions: history.length,
      completedSessions: completedSessions.length,
      completedExercises,
      totalExercises,
      completedSets,
      completionRate: totalExercises
        ? Math.round(completedExercises / totalExercises * 100)
        : 0
    };
  }

  function getRecentSessions(limit = 7) {
    return getHistory()
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, Math.max(1, Number(limit) || 7));
  }

  function getExerciseProgress(exerciseName) {
    const history = getHistory();
    const results = [];

    history.forEach(session => {
      session.exercises.forEach(exercise => {
        if (exercise.name === exerciseName) {
          results.push({
            date: session.date,
            weight: Number(exercise.weight) || 0,
            completedSets: Number(exercise.completedSets) || 0,
            completed: Boolean(exercise.completed)
          });
        }
      });
    });

    return results.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  return {
    getHistory,
    completeSession,
    toggleExercise,
    updateExercise,
    finishSession,
    deleteSession,
    getStats,
    getRecentSessions,
    getExerciseProgress
  };
})();
