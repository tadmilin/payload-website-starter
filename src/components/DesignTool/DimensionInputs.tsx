import React from 'react';

interface DimensionInputsProps {
  width: number;
  length: number;
  onWidthChange: (width: number) => void;
  onLengthChange: (length: number) => void;
}

const DimensionInputs: React.FC<DimensionInputsProps> = ({
  width,
  length,
  onWidthChange,
  onLengthChange
}) => {
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      onWidthChange(value);
    }
  };

  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      onLengthChange(value);
    }
  };

  return (
    <div className="mb-4 grid grid-cols-2 gap-4">
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Width (meters)
        </label>
        <input
          type="number"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={width}
          onChange={handleWidthChange}
          min="1"
          max="30"
          step="0.5"
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Length (meters)
        </label>
        <input
          type="number"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={length}
          onChange={handleLengthChange}
          min="1"
          max="30"
          step="0.5"
        />
      </div>
    </div>
  );
};

export default DimensionInputs;