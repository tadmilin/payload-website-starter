import React, { useState } from 'react';
import RoofSelector from './RoofSelector';
import DimensionInputs from './DimensionInputs';
import DirectionInput from './DirectionInput';
import ThreeCanvas from './ThreeCanvas';
import TimeSlider from './TimeSlider';
import SolarPanelWattage from './SolarPanelWattage';
import RoofHeightInput from './RoofHeightInput';
import DateSelector from './DateSelector';

export interface RoofConfig {
  type: string;
  width: number;
  length: number;
  direction: number;
  roofHeight?: number;
}

const DesignTool: React.FC = () => {
  const [roofType, setRoofType] = useState<string>('flat'); // 'flat', 'shed', 'gable', 'hip'
  const [width, setWidth] = useState<number>(10); // meters
  const [length, setLength] = useState<number>(8); // meters
  const [direction, setDirection] = useState<number>(180); // degrees (0=N, 90=E, 180=S, 270=W)
  const [roofHeight, setRoofHeight] = useState<number>(2); // meters, default height for shed and gable
  const [simulationTime, setSimulationTime] = useState<Date>(new Date()); // For sun simulation
  const [solarWattage, setSolarWattage] = useState<number>(0); // For solar panel wattage calculation

  const roofConfig: RoofConfig = {
    type: roofType,
    width,
    length,
    direction,
    roofHeight: (roofType === 'shed' || roofType === 'gable') ? roofHeight : undefined
  };

  // Handle wattage calculation from ThreeCanvas
  const handleWattageCalculated = (wattage: number) => {
    setSolarWattage(wattage);
  };

  return (
    <div>
      <RoofSelector value={roofType} onChange={setRoofType} />
      <DimensionInputs width={width} length={length} onWidthChange={setWidth} onLengthChange={setLength} />
      <RoofHeightInput value={roofHeight} onChange={setRoofHeight} roofType={roofType} />
      <DirectionInput value={direction} onChange={setDirection} label="Roof Facing Direction" />
      <DateSelector value={simulationTime} onChange={setSimulationTime} />
      <TimeSlider value={simulationTime} onChange={setSimulationTime} />

      <div style={{ height: '500px', width: '100%', border: '1px solid #ccc', marginTop: '20px' }}>
         <ThreeCanvas
           roofConfig={roofConfig}
           simulationTime={simulationTime}
           onWattageCalculated={handleWattageCalculated}
         />
      </div>

      <SolarPanelWattage wattage={solarWattage} />
    </div>
  );
};

export default DesignTool;
