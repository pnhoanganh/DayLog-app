import React, { createContext, useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import dayjs from "dayjs";
import { useSQLiteContext } from "expo-sqlite";
import { useToastController } from "@tamagui/toast";
import uuid from "react-native-uuid";
import { ExtensionStorage } from "@bacons/apple-targets";

export const HabitContext = createContext();

const widgetStorage = new ExtensionStorage("group.com.pnhoanganh.DayLogapp");

export const HabitProvider = ({ children }) => {
  const [habitData, setHabitData] = useState({});
  const [habitList, setHabitList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const db = useSQLiteContext();
  const toast = useToastController();
  const timestamp = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [currentHabit, setCurrentHabit] = useState({});
  const getLastCheckins = async (id) => {
    if (!db) return null;

    try {
      const logs = await db.getAllAsync(
        `
      SELECT created_at 
      FROM check_ins_log 
      WHERE habit_id = ? 
      ORDER BY created_at DESC 
      LIMIT 1
      `,
        [id]
      );

      if (!logs || logs.length === 0) return null;

      const log = logs[0];
      return {
        rawDate: dayjs(log.created_at).format("YYYY-MM-DD"),
        rawTime: dayjs(log.created_at).format("HH:mm"),
        displayDate: dayjs(log.created_at).format("ddd, D MMMM"),
        displayTime: dayjs(log.created_at).format("h:mm A"),
      };
    } catch (error) {
      console.error("Error in getLastCheckins:", error);
      return null;
    }
  };

  // Save data to widget
  const saveHabitToWidget = async (currentHabitList) => {
    if (!currentHabitList || currentHabitList.length === 0) return;

    try {
      // Save habit_list
      const names = currentHabitList.map((habit) => habit.title);
      await widgetStorage.set("widget_habit_list", JSON.stringify(names));

      // Save icon map: name -> icon
      const iconMap = currentHabitList.reduce((acc, habit) => {
        acc[habit.title] = habit.icon;
        return acc;
      }, {});
      await widgetStorage.set("widget_habit_icons", JSON.stringify(iconMap));

      // Save lastCheckin map
      const lastCheckinResults = await Promise.all(
        currentHabitList.map(async (habit) => {
          const lastCheckin = await getLastCheckins(habit.habit_id);
          return {
            name: habit.title,
            value: lastCheckin
              ? `${lastCheckin.displayDate} at ${lastCheckin.displayTime}`
              : "No check-in yet",
          };
        })
      );

      const lastCheckinMap = lastCheckinResults.reduce((acc, item) => {
        acc[item.name] = item.value;
        return acc;
      }, {});

      await widgetStorage.set(
        "widget_habit_last_checkins",
        JSON.stringify(lastCheckinMap)
      );

      // Reload widget
      ExtensionStorage.reloadWidget();
    } catch (error) {
      console.error("Error saving to widgetStorage:", error);
    }
  };

  // Load habitData from SQLite
  const loadHabitsList = async () => {
    try {
      const habits = await db.getAllAsync(`SELECT * FROM habit`);
      setHabitList(habits);
      // Update widget when habit_list changed
      await saveHabitToWidget(habits);
    } catch (e) {
      console.log("loadHabitsList error:", e);
    }
  };

  const loadHabitsData = async () => {
    try {
      const checkIns = await db.getAllAsync(`
        SELECT habit_id, DATE(created_at) AS date, COUNT(*) AS count
        FROM check_ins_log
        GROUP BY habit_id, DATE(created_at)
      `);

      const grouped = {};
      for (const { habit_id, date, count } of checkIns) {
        if (!grouped[habit_id]) grouped[habit_id] = [];
        grouped[habit_id].push({ date, count });
      }
      setHabitData(grouped);
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

  const loadHabitHistoryGrouped = async (habit_id) => {
    const logs = await db.getAllAsync(
      `SELECT habit_id, created_at FROM check_ins_log WHERE habit_id = ? ORDER BY created_at DESC`,
      [habit_id]
    );

    if (!logs || logs.length === 0) return [];
    const grouped = {};

    for (const { created_at } of logs) {
      const month = dayjs(created_at).format("YYYY-MM"); // for sorting
      const date = dayjs(created_at).format("YYYY-MM-DD");
      const time = dayjs(created_at).format("HH:mm");

      if (!grouped[month]) grouped[month] = {};
      if (!grouped[month][date]) grouped[month][date] = [];

      grouped[month][date].push(time);
    }

    const habitHistoryList = Object.entries(grouped)
      .sort((a, b) => dayjs(b[0]).diff(dayjs(a[0])))
      .map(([month, days]) => {
        const daysEntries = Object.entries(days)
          .sort((a, b) => dayjs(b[0]).diff(dayjs(a[0])))
          .map(([date, times]) => {
            const sortedTimes = [...times].sort((a, b) =>
              dayjs(`${date} ${a}`, "YYYY-MM-DD HH:mm").diff(
                dayjs(`${date} ${b}`, "YYYY-MM-DD HH:mm")
              )
            );
            return {
              rawDate: date,
              displayDate: dayjs(date).format("dddd, D MMMM"),
              count: sortedTimes.length,
              times: sortedTimes,
            };
          });

        return {
          month: dayjs(month).format("MMMM YYYY"),
          total: daysEntries.reduce((sum, d) => sum + d.count, 0),
          days: daysEntries,
        };
      });

    return habitHistoryList;
  };

  useEffect(() => {
    loadAllData();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  const habitCheck = async (habit_id) => {
    if (!db) return;
    const today = dayjs().format("YYYY-MM-DD");
    const newLog = uuid.v4();
    if (!habit_id) {
      console.error("habitCheck called without valid habit_id");
      return;
    }
    try {
      // Insert check-in vào DB
      await db.runAsync(
        `INSERT INTO check_ins_log (habit_id, log_id, created_at, updated_at) VALUES (?, ?, ?, ?)`,
        [habit_id, newLog, timestamp, timestamp]
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

      await db.runAsync(`UPDATE habit SET updated_at = ? WHERE habit_id = ? `, [
        timestamp,
        habit_id,
      ]);

      // Update widget after check-in
      await saveHabitToWidget(habitList);
    } catch (error) {
      console.error("Error in habitCheck:", error);
    }
  };

  const removeCheckin = async (habit_id, targetDate) => {
    const today = dayjs().format("YYYY-MM-DD");

    if (targetDate !== today) return;

    const currentData = Array.isArray(habitData[habit_id])
      ? habitData[habit_id]
      : [];
    const todayCheckin = currentData.find((item) => item.date === targetDate);

    if (!todayCheckin || todayCheckin.count <= 0) return;

    const updatedData = currentData.map((item) => {
      if (item.date === today) {
        return { ...item, count: item.count - 1 };
      }
      return item;
    });

    setHabitData((prev) => ({
      ...prev,
      [habit_id]: updatedData,
    }));

    const updatedHabitData = { ...habitData, [habit_id]: updatedData };
    setHabitData(updatedHabitData);
    if (!db) return;

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

      await db.runAsync(`UPDATE habit SET updated_at = ? WHERE habit_id = ?`, [
        timestamp,
        habit_id,
      ]);
    } catch (error) {
      console.error("Error saving habitData:", error);
    }
  };

  const resetHabitData = async () => {
    if (!db) return;

    try {
      await db.runAsync("DELETE FROM check_ins_log");
      setHabitData({});
      // Update widget after reset
      await saveHabitToWidget([]);
    } catch (error) {
      console.error("Error resetting habit data:", error);
      alert("Failed to reset habit data. Please try again.");
    }
  };

  const handleAddHabit = async (newHabit) => {
    const newId = uuid.v4();
    const trimmedTitle = newHabit.title.trim();

    if (!trimmedTitle || typeof trimmedTitle !== "string") {
      setErrorMessage("Habit name is required.");
      setIsError(true);
      return false;
    }

    const isDuplicated = habitList.some(
      (habit) => habit.title.toLowerCase() === trimmedTitle.toLowerCase()
    );
    if (isDuplicated) {
      setErrorMessage("Habit name already exists.");
      setIsError(true);
      return false;
    }
    const habitToSave = {
      habit_id: String(newId),
      title: String(trimmedTitle),
      description: newHabit.description ? String(newHabit.description) : "",
      color_code: newHabit.color_code ? String(newHabit.color_code) : "#C3F0C8",
      icon: newHabit.icon ? String(newHabit.icon) : "add",
      created_at: String(timestamp),
      updated_at: String(timestamp),
    };

    if (!db) return;

    try {
      await db.runAsync(
        "INSERT INTO habit (habit_id, title, description, color_code, icon, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          habitToSave.habit_id,
          habitToSave.title,
          habitToSave.description,
          habitToSave.color_code,
          habitToSave.icon,
          habitToSave.created_at,
          habitToSave.updated_at,
        ]
      );

      toast.show("Habit is saved 🥳", {
        message: "Nice work keeping up the habit!",
        duration: 3000,
      });

      await loadHabitsList();

      return true;
    } catch (error) {
      console.error("Failed to save habit:", error, error.stack);
      alert("Failed to save habit. Please try again.");
      return false;
    }
  };

  const handleDeleteHabit = async (habit_id) => {
    if (!db) return;

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

      // Update widget after deleting habit
      await saveHabitToWidget(updatedList);
    } catch (error) {
      console.error("Error deleting habit:", error);
      alert("Failed to delete habit. Please try again");
    }
  };

  const handleUpdateHabit = async (id, updatedFields) => {
    const { title, description, color_code, icon } = updatedFields;
    const trimmedTitle = title?.trim();
    const isDuplicated = habitList.some(
      (habit) =>
        habit.habit_id !== id &&
        habit.title.toLowerCase() === trimmedTitle.toLowerCase()
    );
    const currentHabit = habitList.find((habit) => habit.habit_id === id);
    if (!currentHabit) return false;
    if (isDuplicated) {
      setErrorMessage(" Habit name already exists.");
      setIsError(true);
      return false;
    }
    if (!trimmedTitle) {
      setErrorMessage("Habit name is required.");
      setIsError(true);
      return false;
    }
    if (!db || !currentHabit) return;
    const isUnchanged =
      currentHabit.title === trimmedTitle &&
      (currentHabit.description || "") === (description || "") &&
      (currentHabit.color_code || "") === (color_code || "") &&
      (currentHabit.icon || "") === (icon || "");

    if (isUnchanged) {
      toast.show("No changes made 🤔", {
        message: "You didn't update anything.",
        duration: 3000,
      });
      await loadHabitsList();
      return true;
    }

    try {
      await db.runAsync(
        `UPDATE habit 
         SET title = ?, description = ?, color_code = ?, icon = ?, updated_at = ? 
         WHERE habit_id = ?`,
        [trimmedTitle, description, color_code, icon, timestamp, id]
      );

      const updatedList = habitList.map((habit) =>
        habit.habit_id === id
          ? { ...habit, title: trimmedTitle, description, color_code, icon }
          : habit
      );
      setHabitList(updatedList);

      toast.show("Habit is updated 🥳", {
        message: "Changes saved successfully!",
        duration: 3000,
      });

      await loadHabitsList();

      // Update widget after update habit
      await saveHabitToWidget(updatedList);

      return true;
    } catch (error) {
      console.error("Error updating habit:", error);
      alert("Failed to update habit. Please try again");
      return false;
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
        loadAllData,
        loadHabitsData,
        loadHabitHistoryGrouped,
        handleAddHabit,
        handleUpdateHabit,
        errorMessage,
        isError,
        setErrorMessage,
        setIsError,
        currentHabit,
        setCurrentHabit,
        getLastCheckins,
        saveHabitToWidget,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};
