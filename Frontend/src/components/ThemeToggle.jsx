import React from 'react';
import { SunIcon, MoonIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <label className="swap swap-rotate btn btn-ghost btn-circle">
      <input 
        type="checkbox" 
        onChange={toggleTheme} 

        checked={theme === 'cupcake'} 
      />
      <SunIcon className="swap-on fill-current w-5 h-5" />
      <MoonIcon className="swap-off fill-current w-5 h-5" />
    </label>
  );
};

export default ThemeToggle;