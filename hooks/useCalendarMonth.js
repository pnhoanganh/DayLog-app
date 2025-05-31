import { useMemo, useState } from "react";

const useCalendarMonth = (initialDates = new Date()) => {
  const [currentDate, setCurrentDate] = useState(initialDates);

  const goToPreviousDate = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const formattedLabel = useMemo(() => {
    return currentDate.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  }, [currentDate]);

  return {
    currentDate,
    goToPreviousDate,
    goToNextMonth,
    formattedLabel,
  };
};

export default useCalendarMonth;
