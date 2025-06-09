import React, { createContext, useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import dayjs from "dayjs";
import { useSQLiteContext } from "expo-sqlite";

export const HabitContext = createContext();

export const HabitProvider = ({ children }) => {
  const [habitData, setHabitData] = useState({});
  const [habitList, setHabitList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const db = useSQLiteContext();

  // Load habitData from SQLite
  const loadHabitsList = async () => {
    try {
      const habits = await db.getAllAsync(`SELECT * FROM habit`);
      setHabitList(habits);
    } catch (e) {
      console.log("loadHabitsList error:", e);
    }
  };

  const loadHabitsData = async () => {
    try {
      const checkIns = await db.getAllAsync(
        `SELECT habit_id, created_at FROM check_ins_log`
      );
      const grouped = {};

      checkIns.forEach(({ habit_id, created_at }) => {
        const date = dayjs(created_at).format("YYYY-MM-DD");
        if (!grouped[habit_id]) grouped[habit_id] = {};
        if (!grouped[habit_id][date]) grouped[habit_id][date] = 0;
        grouped[habit_id][date]++;
      });

      const updatedHabitData = {};
      for (const habitId in grouped) {
        updatedHabitData[habitId] = Object.entries(grouped[habitId]).map(
          ([date, count]) => ({
            date,
            count,
          })
        );
      }

      setHabitData(updatedHabitData);
    } catch (e) {
      console.log("loadHabitsData error:", e);
    }
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [habitsResult, habitsDataResult] = await Promise.allSettled([
        loadHabitsList(),
        loadHabitsData(),
      ]);
      if (habitsResult.status === "rejected") {
        console.error("Failed to load habits list:", habitsResult.reason);
      }
      if (habitsDataResult.status === "rejected") {
        console.error("Failed to load habits data:", habitsDataResult.reason);
      }
    } catch (e) {
      console.error("Unexpected error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  const habitCheck = async (habit_id) => {
    const today = dayjs().format("YYYY-MM-DD");
    if (!habit_id) {
      console.error("habitCheck called without valid habit_id");
      return;
    }
    try {
      const timestamp = new Date().toISOString();
      // Insert check-in into DB
      await db.runAsync(
        `INSERT INTO check_ins_log (habit_id, log_id, created_at, updated_at) VALUES (?, ?, ?, ?)`,
        [habit_id, timestamp, timestamp, timestamp]
      );

      const currentData = Array.isArray(habitData[habit_id])
        ? habitData[habit_id]
        : [];
      const existing = currentData.find((item) => item.date === today);

      let newData;
      if (existing) {
        newData = currentData.map((item) =>
          item.date === today ? { ...item, count: item.count + 1 } : item
        );
      } else {
        newData = [...currentData, { date: today, count: 1 }];
      }
      setHabitData({ ...habitData, [habit_id]: newData });

      await db.runAsync(
        `UPDATE habit SET updated_at = CURRENT_TIMESTAMP WHERE habit_id = ? `,
        [habit_id]
      );
    } catch (error) {
      console.error("Error in habitCheck:", error);
    }
  };

  const removeCheckin = async (habit_id, targetDate) => {
    const today = targetDate ?? dayjs().format("YYYY-MM-DD");

    const currentData = Array.isArray(habitData[habit_id])
      ? habitData[habit_id]
      : [];
    const todayCheckin = currentData.find((item) => item.date === today);

    if (!todayCheckin || todayCheckin.count <= 0) return;

    const updatedData = currentData.map((item) => {
      if (item.date === today) {
        return { ...item, count: item.count - 1 };
      }
      return item;
    });

    const updatedHabitData = { ...habitData, [habit_id]: updatedData };
    setHabitData(updatedHabitData);

    try {
      const logs = await db.getAllAsync(
        `SELECT log_id FROM check_ins_log WHERE habit_id = ? AND date(created_at) = ? LIMIT 1`,
        [habit_id, today]
      );
      if (logs.length > 0) {
        await db.runAsync(`DELETE FROM check_ins_log WHERE log_id = ?`, [
          logs[0].log_id,
        ]);
      }

      await db.runAsync(
        `UPDATE habit SET updated_at = CURRENT_TIMESTAMP WHERE habit_id = ?`,
        [habit_id]
      );
    } catch (error) {
      console.error("Error saving habitData:", error);
    }
  };

  const resetHabitData = async () => {
    try {
      await db.runAsync("DELETE FROM check_ins_log");
      setHabitData({});
    } catch (error) {
      console.error("Error resetting habit data:", error);
      alert("Failed to reset habit data. Please try again.");
    }
  };

  const handleDeleteHabit = async (habit_id) => {
    try {
      await db.runAsync("DELETE FROM habit WHERE habit_id = ?", [habit_id]);
      await db.runAsync("DELETE FROM check_ins_log WHERE habit_id = ?", [
        habit_id,
      ]);

      const updatedList = habitList.filter(
        (habit) => habit.habit_id !== habit_id
      );
      setHabitList(updatedList);

      const updatedHabitData = { ...habitData };
      delete updatedHabitData[habit_id];
      setHabitData(updatedHabitData);
    } catch (error) {
      console.error("Error deleting habit:", error);
      alert("Failed to delete habit. Please try again.");
    }
  };

  return (
    <HabitContext.Provider
      value={{
        habitData,
        habitCheck,
        setHabitData,
        removeCheckin,
        resetHabitData,
        habitList,
        handleDeleteHabit,
        loadHabitsList,
        loadAllData,
        loadHabitsData,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};
