import React, { useState } from "react";
import Plot from "react-plotly.js";
import { evaluate, parse } from "mathjs";

const IterationGraph = ({ iterations, functionInput }) => {
  const [step, setStep] = useState(0);

  const currentIteration = iterations[step];

  // Generate function data for plotting
  const generateFunctionData = () => {
    const xValues = [];
    const yValues = [];
    const parsedFunction = parse(functionInput);

    for (let x = -10; x <= 10; x += 0.01) {
      xValues.push(x);
      try {
        yValues.push(parsedFunction.evaluate({ x }));
      } catch {
        yValues.push(NaN);
      }
    }
    return { xValues, yValues };
  };

  const { xValues, yValues } = generateFunctionData();

  // Generate horizontal lines for all iterations
  const generateHorizontalLines = () => {
    const horizontalLines = iterations.slice(0, step + 1).map((iteration, index) => ({
      x: [iteration.a, iteration.b],
      y: [1 + index * 0.1, 1 + index * 0.1], // Offset each line vertically
      type: "scatter",
      mode: "lines+markers",
      marker: { size: 5 },
      line: { color: "green", dash: "solid" },
      name: `Interval ${index + 1}`,
      showlegend: false,
    }));
    return horizontalLines;
  };

//   const generateInterpolationLines = () => {
//       const interpolationLines = iterations.slice(0, step + 1).map((iteration, index) => {
//         const fx_a = evaluate(functionInput, { x: iteration.a });
//         const fx_b = evaluate(functionInput, { x: iteration.b });
    
//         // Calculate intersection of interpolation line with x-axis
//         const x_intersect = (iteration.a * fx_b - iteration.b * fx_a) / (fx_b - fx_a);
    
//         return {
//           x: [iteration.a, iteration.b],
//           y: [fx_a, fx_b],
//           type: "scatter",
//           mode: "markers",
//           line: { color: "black", dash: "dash" },
//           marker: { size: 8 },
//           name: `Interpolasi Iterasi ${index + 1}`,
//           showlegend: index === step,
//         };
//       });
//       return interpolationLines;
//     };

  const horizontalLines = generateHorizontalLines();
//   const horizontalDots = generateInterpolationLines();

  return (
    <div>
      {/* Slider */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <input
          type="range"
          min="0"
          max={iterations.length - 1}
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
          style={{
            width: "80%",
            appearance: "none",
            height: "8px",
            borderRadius: "5px",
            background: "#ddd",
            outline: "none",
            marginBottom: "10px",
          }}
        />
        <p
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            margin: "0",
          }}
        >
          Tahapan Iterasi: {step + 1} | Interval: [{currentIteration.a.toFixed(4)},{" "}
          {currentIteration.b.toFixed(4)}]
        </p>
      </div>

      
    
      <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: "10px" }}>
        <div style={{ width: "90%" }}>
            <Plot
            data={[
                {
                x: xValues,
                y: yValues,
                type: "scatter",
                mode: "lines",
                name: "Function",
                },
                {
                x: [currentIteration.a, currentIteration.a],
                y: [-10, 10],
                type: "scatter",
                mode: "lines",
                line: { color: "red", dash: "dot" },
                name: "a (lower bound)",
                },
                {
                x: [currentIteration.b, currentIteration.b],
                y: [-10, 10],
                type: "scatter",
                mode: "lines",
                line: { color: "blue", dash: "dot" },
                name: "b (upper bound)",
                },
                ...horizontalLines,
                // ...horizontalDots,
                {
                // Add root approximation point for the current iteration
                x: [currentIteration.xn],
                y: [0],
                type: "scatter",
                mode: "markers",
                marker: { color: "red", size: 10 },
                name: "Root Approximation",
              },
            ]}
            layout={{
                title: `Iterasi ke- ${step + 1}`,
                xaxis: {
                title: "x",
                range: [currentIteration.a - 1, currentIteration.b + 1], // Fokus interval dengan padding
                },
                yaxis: {
                title: "f(x)",
                range: [-10, 10], // Setel rentang y-axis tetap
                },
                autosize: true,
                dragmode: "pan",
                margin: {
                l: 50,
                r: 50,
                t: 50,
                b: 50,
                },
            }}
            config={{
                staticPlot: false, // Biarkan zoom aktif 
            }}
            useResizeHandler={true}
            style={{ width: "100%", height: "500px" }}
            />
        </div>
      </div>

      
    </div>
  );
};

export default IterationGraph;
