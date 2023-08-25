import { createContext, useEffect, useState, Children } from 'react';
import { CurrentModeContextT } from '../types/types';

export const DarkModeContext = createContext<CurrentModeContextT | null>(null);
export const DarkModeContextProvider: React.FC<CurrentModeContextT> = ({ children }) => {
  const currentdarkmode = JSON.parse(localStorage.getItem('darkMode'));
  const [darkMode, setDarkMode] = useState(currentdarkmode || false);
  const toggle = () => {
    setDarkMode(!darkMode);
  };
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);
  return (
    <DarkModeContext.Provider value={{ darkMode, toggle }}>{children}</DarkModeContext.Provider>
  );
};
