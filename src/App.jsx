import React from 'react';
import TrafficSimulation from './components/TrafficSimulation';

function App() {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <h1>Traffic Simulator</h1>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="simulation-container">
            <div className="control-panel">
              <div className="d-flex align-items-center justify-content-center">
                <label htmlFor="spawnRateSlider" className="mb-0">Car Spawn Rate (Lower = More Cars)</label>
                <input type="range" className="form-range" id="spawnRateSlider" min="10" max="120" value="60" step="10" />
              </div>
            </div>
            <TrafficSimulation />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 