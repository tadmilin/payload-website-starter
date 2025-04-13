import React, { useState, useEffect } from 'react';

interface SolarPanelWattageProps {
  wattage: number;
}

const SolarPanelWattage: React.FC<SolarPanelWattageProps> = ({ wattage }) => {
  const [monthlyCost, setMonthlyCost] = useState<string>('');
  const [monthlyWattHours, setMonthlyWattHours] = useState<number>(0);
  const [yearlyGeneration, setYearlyGeneration] = useState<number>(0);

  // Calculate watt-hours and yearly generation when cost or wattage changes
  useEffect(() => {
    // Convert cost to watt-hours (divide by 5)
    const costValue = parseFloat(monthlyCost);
    if (!isNaN(costValue) && costValue > 0) {
      const wattHours = costValue / 5;
      setMonthlyWattHours(wattHours);
    } else {
      setMonthlyWattHours(0);
    }

    // Calculate yearly generation (Estimated Wattage * 120)
    setYearlyGeneration(wattage * 120);
  }, [monthlyCost, wattage]);

  // Handle cost input change
  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonthlyCost(e.target.value);
  };

  return (
    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 className="text-lg font-semibold text-green-800 mb-3">Solar Panel Potential</h3>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Monthly Electricity Cost (Thai Baht)
        </label>
        <input
          type="number"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={monthlyCost}
          onChange={handleCostChange}
          placeholder="Enter your monthly cost"
          min="0"
          step="100"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">Estimated Wattage:</span>
          <span className="text-xl font-bold text-green-600">{wattage.toFixed(2)} kW</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">Monthly Consumption:</span>
          <span className="text-xl font-bold text-blue-600">
            {monthlyWattHours.toFixed(2)} kWh
          </span>
        </div>
      </div>

      <div className="bg-green-100 p-3 rounded-md mb-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-medium">Estimated Yearly Generation:</span>
          <span className="text-2xl font-bold text-green-700">{yearlyGeneration.toFixed(2)} kWh</span>
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-2">
        This is an estimate based on the roof dimensions, orientation, and sun position.
        Actual output may vary based on panel efficiency, weather conditions, and installation details.
      </p>
    </div>
  );
};

export default SolarPanelWattage;
