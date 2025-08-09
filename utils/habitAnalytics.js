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
  let expectedDate = dayjs().startOf("day");

  for (const date of dates) {
    if (date.isSame(expectedDate, "day")) {
      streak++;
      expectedDate = expectedDate.subtract(1, "day");
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

export const getTotalCheckinsInWeek = async (db, habit_id, weekStartDate) => {
  const startDate = dayjs(weekStartDate).startOf("week");
  const endDate = dayjs(weekStartDate).endOf("week");

  const result = await db.getFirstAsync(
    `SELECT COUNT(*) as total FROM check_ins_log 
     WHERE habit_id = ? AND DATE(created_at) BETWEEN ? AND ?`,
    [habit_id, startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD")]
  );
  return result?.total || 0;
};

export const getMissedDaysInWeek = async (db, habit_id, weekStartDate) => {
  const start = dayjs(weekStartDate).startOf("week");
  const end = dayjs().isBefore(start.endOf("week"))
    ? dayjs().endOf("day")
    : start.endOf("week");

  const logs = await db.getAllAsync(
    `SELECT DISTINCT DATE(created_at) as date FROM check_ins_log
     WHERE habit_id = ? AND DATE(created_at) BETWEEN ? AND ?`,
    [habit_id, start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD")]
  );
  const checkinDates = logs.map((row) => dayjs(row.date).format("ddd"));

  const activeDays = [];
  for (let i = 0; i < 7; i++) {
    const day = start.add(i, "day");
    if (day.isAfter(end, "day")) break;
    activeDays.push(day.format("ddd"));
  }
  const missedDays = activeDays.filter((d) => !checkinDates.includes(d));
  return missedDays;
};

export const getCheckinDatesInMonth = async (db, habit_id, monthDate) => {
  const start = dayjs(monthDate).startOf("month").format("YYYY-MM-DD");
  const end = dayjs(monthDate).endOf("month").format("YYYY-MM-DD");

  const rows = await db.getAllAsync(
    `SELECT DISTINCT DATE(created_at) as date 
     FROM check_ins_log 
     WHERE habit_id = ? AND DATE(created_at) BETWEEN ? AND ?`,
    [habit_id, start, end]
  );

  return rows.map((row) => row.date);
};

export const getMonthlyCheckinDates = async (db, habit_id, year) => {
  const result = await db.getAllAsync(
    `SELECT strftime('%m', created_at) AS month, COUNT(*) as total 
     FROM check_ins_log 
     WHERE habit_id = ? AND strftime('%Y', created_at) = ? 
     GROUP BY month 
     ORDER BY month`,
    [habit_id, year.toString()]
  );

  const monthStats = Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, "0");
    const match = result.find((r) => r.month === month);
    return {
      label: month,
      value: match ? match.total : 0,
    };
  });

  return monthStats;
};

export const getCheckinInHour = async (db, habit_id, date) => {
  try {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    const logs = await db.getAllAsync(
      `SELECT created_at FROM check_ins_log 
     WHERE habit_id = ? AND DATE(created_at) = ?`,
      [habit_id, formattedDate]
    );

    const hourCounts = Array(24).fill(0);

    for (const { created_at } of logs) {
      const hour = dayjs(created_at).hour();
      hourCounts[hour]++;
    }

    return hourCounts.map((count, i) => ({
      label: `${i}h`,
      value: count,
    }));
  } catch (error) {
    console.error("getCheckinInHour error: ", error);
    return [];
  }
};
