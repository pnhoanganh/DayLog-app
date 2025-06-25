import dayjs from "dayjs";

export const getWeeklyDayStats = async (db, habit_id) => {
  try {
    const logs = await db.getAllAsync(
      `SELECT created_at FROM check_ins_log WHERE habit_id = ?`,
      [habit_id]
    );

    const dayCounts = {
      Sun: 0,
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
    };

    for (const { created_at } of logs) {
      const day = dayjs(created_at).format("ddd");
      if (dayCounts[day] !== undefined) {
        dayCounts[day]++;
      }
    }

    return Object.entries(dayCounts).map(([label, value]) => ({
      label,
      value,
    }));
  } catch (error) {
    console.error("getWeeklyDayStats error:", error);
    return [];
  }
};
