
// ======================================
// FORGE - Exercise Library
// ======================================

const ForgeExerciseLibrary = (() => {

  const exercises = [
    {
      id: "body-squat",
      name: "اسکوات",
      category: "پا",
      muscles: ["چهارسر ران", "باسن"],
      equipment: ["بدون تجهیزات"],
      level: "beginner",
      instructions: [
        "پاها را به اندازه عرض شانه باز کن.",
        "باسن را به سمت عقب و پایین ببر.",
        "زانوها را در راستای پنجه پا نگه دار.",
        "با کنترل به حالت ایستاده برگرد."
      ],
      mistakes: [
        "جمع شدن زانوها به سمت داخل",
        "بلند شدن پاشنه از زمین",
        "پایین رفتن بیش از محدوده کنترل"
      ],
      safety: "در محدوده بدون درد و با کنترل حرکت کن."
    },

    {
      id: "wall-pushup",
      name: "شنا روی دیوار",
      category: "سینه",
      muscles: ["سینه", "پشت بازو", "سرشانه"],
      equipment: ["دیوار"],
      level: "beginner",
      instructions: [
        "روبه‌روی دیوار بایست.",
        "کف دست‌ها را روی دیوار قرار بده.",
        "آرنج‌ها را خم کن و بدن را به دیوار نزدیک کن.",
        "با کنترل به نقطه شروع برگرد."
      ],
      mistakes: [
        "قوس بیش از حد کمر",
        "باز کردن بیش از حد آرنج‌ها",
        "حرکت سریع و بدون کنترل"
      ],
      safety: "فاصله از دیوار را طوری تنظیم کن که حرکت راحت و بدون درد باشد."
    },

    {
      id: "glute-bridge",
      name: "پل باسن",
      category: "باسن",
      muscles: ["باسن", "همسترینگ"],
      equipment: ["بدون تجهیزات"],
      level: "beginner",
      instructions: [
        "به پشت دراز بکش و زانوها را خم کن.",
        "کف پاها را روی زمین قرار بده.",
        "باسن را به آرامی بالا ببر.",
        "چند لحظه مکث کن و پایین بیا."
      ],
      mistakes: [
        "قوس دادن بیش از حد کمر",
        "بالا بردن سریع باسن",
        "فشار آوردن به گردن"
      ],
      safety: "حرکت را با دامنه راحت و کنترل‌شده انجام بده."
    },

    {
      id: "bottle-curl",
      name: "جلو بازو با بطری",
      category: "جلو بازو",
      muscles: ["دوسر بازویی"],
      equipment: ["بطری آب"],
      level: "beginner",
      instructions: [
        "یک بطری سبک در هر دست بگیر.",
        "آرنج‌ها را نزدیک بدن نگه دار.",
        "ساعدها را به سمت شانه بالا بیاور.",
        "بطری‌ها را آرام پایین ببر."
      ],
      mistakes: [
        "تاب دادن بدن",
        "جلو بردن آرنج‌ها",
        "استفاده از وزنه بیش از توان"
      ],
      safety: "وزنه سبک انتخاب کن و از تاب دادن بدن خودداری کن."
    },

    {
      id: "bottle-lateral-raise",
      name: "نشر جانب با بطری",
      category: "سرشانه",
      muscles: ["دلتوئید میانی"],
      equipment: ["بطری سبک"],
      level: "beginner",
      instructions: [
        "بطری‌های سبک را کنار بدن نگه دار.",
        "آرنج‌ها را کمی خم کن.",
        "دست‌ها را تا محدوده راحت به طرفین بالا ببر.",
        "به آرامی پایین بیاور."
      ],
      mistakes: [
        "بالا بردن بیش از حد دست‌ها",
        "تاب دادن بدن",
        "انتخاب وزنه سنگین"
      ],
      safety: "با وزنه بسیار سبک و بدون درد اجرا کن."
    },

    {
      id: "marching",
      name: "راه رفتن درجا",
      category: "هوازی",
      muscles: ["عضلات پا", "عضلات مرکزی"],
      equipment: ["بدون تجهیزات"],
      level: "beginner",
      instructions: [
        "صاف بایست.",
        "یک زانو را به آرامی بالا بیاور.",
        "پا را پایین بگذار.",
        "با پای دیگر تکرار کن."
      ],
      mistakes: [
        "عجله در اجرای حرکت",
        "از دست دادن تعادل"
      ],
      safety: "فضای کافی داشته باش و با سرعت راحت شروع کن."
    }
  ];

  function getAll() {
    return exercises.map(item => ({ ...item }));
  }

  function getById(id) {
    const exercise = exercises.find(item => item.id === id);
    return exercise ? { ...exercise } : null;
  }

  function search(query) {
    const value = query.trim().toLowerCase();

    return exercises
      .filter(item =>
        item.name.toLowerCase().includes(value) ||
        item.category.toLowerCase().includes(value) ||
        item.muscles.some(muscle => muscle.toLowerCase().includes(value))
      )
      .map(item => ({ ...item }));
  }

  return {
    getAll,
    getById,
    search
  };

})();
