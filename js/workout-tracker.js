
const ForgeWorkoutTracker = (() => {
  const STORAGE_KEY = "forge_workout_history";

  function getHistory() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  }

  function saveHistory(history) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }

  function completeSession(session) {
    const history = getHistory();

    const record = {
      id: Date.now(),
      title: session.title,
      date: new Date().toISOString(),
      exercises: session.exercises.map(exercise => ({
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        completed: false
      }))
    };

    history.push(record);
    saveHistory(history);

    return record;
  }

  function toggleExercise(recordId, exerciseIndex) {
    const history = getHistory();
    const record = history.find(item => item.id === recordId);

    if (!record || !record.exercises[exerciseIndex]) return;

    record.exercises[exerciseIndex].completed =
      !record.exercises[exerciseIndex].completed;

    saveHistory(history);
    return record;
  }

  function getStats() {
    const history = getHistory();

    const totalSessions = history.length;

    const completedExercises = history.reduce((total, session) => {
      return total + session.exercises.filter(item => item.completed).length;
    }, 0);

    const totalExercises = history.reduce((total, session) => {
      return total + session.exercises.length;
    }, 0);

    return {
      totalSessions,
      completedExercises,
      totalExercises
    };
  }

  return {
    getHistory,
    completeSession,
    toggleExercise,
    getStats
  };
})();
