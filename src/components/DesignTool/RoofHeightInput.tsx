import React from 'react';

interface RoofHeightInputProps {
  value: number;
  onChange: (value: number) => void;
  roofType: string;
}

const RoofHeightInput: React.FC<RoofHeightInputProps> = ({ value, onChange, roofType }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue) && newValue > 0) {
      onChange(newValue);
    }
  };

  // Only show for shed and gable roofs
  if (roofType !== 'shed' && roofType !== 'gable') {
    return null;
  }

  const label = roofType === 'shed' ? 'Shed Roof Height' : 'Gable Roof Height';

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label} (meters)
      </label>
      <input
        type="number"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={value}
        onChange={handleChange}
        min="0.5"
        max="10"
        step="0.1"
      />
    </div>
  );
};

export default RoofHeightInput;