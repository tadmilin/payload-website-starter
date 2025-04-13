import React from 'react';

interface DirectionInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

const DirectionInput: React.FC<DirectionInputProps> = ({ value, onChange, label }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      onChange(newValue);
    }
  };

  // Convert direction to compass direction for display
  const getCompassDirection = (degrees: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index] || 'N';
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label} ({getCompassDirection(value)})
      </label>
      <div className="flex items-center">
        <input
          type="range"
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          min="0"
          max="359"
          step="1"
          value={value}
          onChange={handleChange}
        />
        <span className="ml-3 text-gray-700">{value}°</span>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>N (0°)</span>
        <span>E (90°)</span>
        <span>S (180°)</span>
        <span>W (270°)</span>
      </div>
    </div>
  );
};

export default DirectionInput;