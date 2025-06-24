import { createContext, useContext, useState } from "react";

export const FilterContext = createContext();

export const useFilter = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
  const [selectedDates, setSelectedDates] = useState({});
  const [applyFilter, setApplyFilter] = useState(false);

  return (
    <FilterContext.Provider
      value={{ selectedDates, setSelectedDates, applyFilter, setApplyFilter }}
    >
      {children}
    </FilterContext.Provider>
  );
};
