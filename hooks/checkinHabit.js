import React, { createContext, useState, useEffect } from "react";
import dayjs from "dayjs";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const CheckinHabit = createContext();

export const CheckinProvider = ({ children }) => {
  const [habitData, setHabitData] = useState({});

  // Load habitData from AsyncStorage
  const loadHabitData = async () => {
    try {
      const stored = await AsyncStorage.getItem("habitData");
      const parsed = stored ? JSON.parse(stored) : {};
      setHabitData(parsed);
    } catch (error) {
      console.error("Error loading habitData:", error);
    }
  };

  useEffect(() => {
    loadHabitData();
  }, []);

  const habitCheck = async (habitId) => {
    const today = dayjs().format("YYYY-MM-DD");
    const currentData = Array.isArray(habitData[habitId])
      ? habitData[habitId]
      : [];
    const existing = currentData.find((item) => item?.date === today);

    let newData;
    if (existing) {
      newData = currentData.map((item) =>
        item.date === today ? { ...item, count: item.count + 1 } : item
      );
    } else {
      newData = [...currentData, { date: today, count: 1 }];
    }

    const updatedHabitData = { ...habitData, [habitId]: newData };
    setHabitData(updatedHabitData);
    try {
      await AsyncStorage.setItem("habitData", JSON.stringify(updatedHabitData));
    } catch (error) {
      console.error("Error saving habitData:", error);
    }
    console.log("Updated habitData:", updatedHabitData);
  };

  return (
    <CheckinHabit.Provider value={{ habitData, habitCheck, setHabitData }}>
      {children}
    </CheckinHabit.Provider>
  );
};
