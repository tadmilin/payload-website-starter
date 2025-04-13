import React, { useState, useEffect } from 'react';

interface TimeSliderProps {
  value: Date;
  onChange: (value: Date) => void;
}

const TimeSlider: React.FC<TimeSliderProps> = ({ value, onChange }) => {
  // Convert date to hours (0-24) for the slider
  const [hours, setHours] = useState<number>(value.getHours() + value.getMinutes() / 60);
  
  // Update hours when value changes externally
  useEffect(() => {
    setHours(value.getHours() + value.getMinutes() / 60);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHours = parseFloat(e.target.value);
    if (!isNaN(newHours)) {
      // Create a new date with the selected hours
      const newDate = new Date(value);
      const wholeHours = Math.floor(newHours);
      const minutes = Math.round((newHours - wholeHours) * 60);
      newDate.setHours(wholeHours, minutes);
      
      setHours(newHours);
      onChange(newDate);
    }
  };

  // Format time for display (e.g., "14:30")
  const formatTime = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Time of Day: {formatTime(hours)}
      </label>
      <div className="flex items-center">
        <input
          type="range"
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          min="6"
          max="18"
          step="0.25"
          value={hours}
          onChange={handleChange}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>6:00 AM</span>
        <span>12:00 PM</span>
        <span>6:00 PM</span>
      </div>
    </div>
  );
};

export default TimeSlider;