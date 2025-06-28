import dayjs from "dayjs";

export const getWeeklyDayStats = async (db, habit_id, weekStartDate) => {
  try {
    const startDate = dayjs(weekStartDate).startOf("week");
    const endDate = dayjs(weekStartDate).endOf("week");
    const logs = await db.getAllAsync(
      `SELECT created_at FROM check_ins_log WHERE habit_id = ? AND DATE(created_at) BETWEEN ? AND ?`,
      [habit_id, startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD")]
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

export const getMaxCheckinCount = async (db, habit_id) => {
  const result = await db.getAllAsync(
    `SELECT DATE(created_at) AS date, COUNT(*) AS count FROM check_ins_log WHERE habit_id = ? GROUP BY DATE(created_at)`,
    [habit_id]
  );
  if (result.length === 0) return 1;
  return Math.max(...result.map((r) => r.count));
};

export const getHabitStreak = async (db, habit_id) => {
  const logs = await db.getAllAsync(
    `SELECT DISTINCT DATE(created_at) as date FROM check_ins_log WHERE habit_id = ? ORDER BY date DESC`,
    [habit_id]
  );

  const dates = logs.map((row) => dayjs(row.date));
  if (dates.length === 0) return 0;

  let streak = 0;
  let today = dayjs().startOf("day");

  for (const date of dates) {
    if (date.isSame(today, "day")) {
      streak++;
      today = today.subtract(1, "day");
    } else if (date.isSame(today.subtract(1, "day"), "day")) {
      streak++;
      today = today.subtract(1, "day");
    } else {
      break;
    }
  }

  return streak;
};

export const getTotalCheckins = async (db, habit_id) => {
  try {
    const result = await db.getFirstAsync(
      `SELECT COUNT(*) AS total FROM check_ins_log WHERE habit_id = ?`,
      [habit_id]
    );
    return result?.total || 0;
  } catch (error) {
    console.error("getTotalCheckins error:", error);
    return 0;
  }
};
