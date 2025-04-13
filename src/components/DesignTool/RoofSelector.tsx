import React from 'react';

interface RoofSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const RoofSelector: React.FC<RoofSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Roof Type
      </label>
      <div className="flex space-x-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio"
            name="roofType"
            value="flat"
            checked={value === 'flat'}
            onChange={() => onChange('flat')}
          />
          <span className="ml-2">Flat Roof</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio"
            name="roofType"
            value="shed"
            checked={value === 'shed'}
            onChange={() => onChange('shed')}
          />
          <span className="ml-2">Shed Roof</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio"
            name="roofType"
            value="gable"
            checked={value === 'gable'}
            onChange={() => onChange('gable')}
          />
          <span className="ml-2">Gable Roof</span>
        </label>
      </div>
    </div>
  );
};

export default RoofSelector;
