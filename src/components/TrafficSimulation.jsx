import React, { useEffect } from 'react';

const TrafficSimulation = () => {
  useEffect(() => {
    // The original simulation will be initialized by the loaded scripts
    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div id="canvas-container" className="text-center"></div>
  );
};

export default TrafficSimulation; 