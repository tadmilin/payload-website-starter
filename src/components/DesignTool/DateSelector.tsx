import React, { useState, useEffect } from 'react';

interface DateSelectorProps {
  value: Date;
  onChange: (value: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ value, onChange }) => {
  // Calculate day of year (1-365)
  const getDayOfYear = (date: Date): number => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  // Convert day of year to date
  const getDateFromDayOfYear = (year: number, dayOfYear: number): Date => {
    const date = new Date(year, 0);
    date.setDate(dayOfYear);
    return date;
  };

  // Initialize slider value based on current date
  const [dayOfYear, setDayOfYear] = useState<number>(getDayOfYear(value));

  // Update local state when value changes externally
  useEffect(() => {
    setDayOfYear(getDayOfYear(value));
  }, [value]);

  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDayOfYear = parseInt(e.target.value, 10);
    setDayOfYear(newDayOfYear);

    // Create a new date with the selected day of year
    const newDate = getDateFromDayOfYear(value.getFullYear(), newDayOfYear);

    // Preserve the time from the original date
    newDate.setHours(value.getHours(), value.getMinutes(), value.getSeconds());

    onChange(newDate);
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${monthNames[date.getMonth()]} ${date.getDate()}`;
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Date: {formatDate(value)}
      </label>
      <div className="flex items-center">
        <input
          type="range"
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          min="1"
          max="365"
          step="1"
          value={dayOfYear}
          onChange={handleSliderChange}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Jan 1</span>
        <span>Apr 1</span>
        <span>Jul 1</span>
        <span>Oct 1</span>
        <span>Dec 31</span>
      </div>
    </div>
  );
};

export default DateSelector;
