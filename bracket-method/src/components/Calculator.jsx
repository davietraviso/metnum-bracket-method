import React, { useState, useEffect, useRef } from "react";
import { evaluate } from "mathjs";
import "./Calculator.css";
import icon2 from '../assets/book.png'
import icon3 from '../assets/book2.png'
import IterationTabs from "./IterationTabs";
import { MathJax, MathJaxContext } from "better-react-mathjax";
// import { EditableMathField } from "react-mathquill";
// import { MathfieldElement } from "mathlive";


const Calculator = () => {
  const [functionInput, setFunctionInput] = useState("");
  const [x0, setX0] = useState("");
  const [x1, setX1] = useState("");
  const [tolerance, setTolerance] = useState(0.0001);
  const [precision, setPrecision] = useState(4);
  const [results, setResults] = useState([]);
  const [root, setRoot] = useState(null);
  const [method, setMethod] = useState("bisection");
  const [showLegend, setShowLegend] = useState(false);
  const [parsedFunction, setParsedFunction] = useState("");
  const mathFieldRef = useRef(null); 

// // Define a global variable for browser compatibility
// if (typeof global === "undefined") {
//     var global = window;
//   }
  

//   useEffect(() => {
//     // Inisialisasi MathQuill setelah komponen dirender
//     const MQ = MathQuill.getInterface(2); // Mengambil interface MathQuill
//     const mathField = MQ.MathField(mathFieldRef.current, {
//       handlers: {
//         edit: () => {
//           // Mendapatkan input matematis yang sudah diformat setiap kali pengguna mengetik
//           setFunctionInput(mathField.latex());
//         }
//       }
//     });
//   }, []); sebelum


  const calculateBisection = (parsedInput) => {
    let a = parseFloat(x0);
    let b = parseFloat(x1);
    let tol = parseFloat(tolerance);
    let steps = [];
    let iteration = 0;

    while (Math.abs(b - a) > tol) {
      let xn = (a + b) / 2;
      let fa = evaluate(parsedInput, { x: a });
      let fb = evaluate(parsedInput, { x: b });
      let fxn = evaluate(parsedInput, { x: xn });

      let update = fa * fxn < 0 ? "b = xn" : "a = xn";

      steps.push({ iteration, a, b, fa, fb, xn, fxn, update });

      if (fxn === 0) break;
      if (fa * fxn < 0) {
        b = xn;
      } else {
        a = xn;
      }
      iteration++;
    }

    setRoot((a + b) / 2);
    setResults(steps);
  };

  const calculateFalsePosition = (parsedInput) => {
    let a = parseFloat(x0);
    let b = parseFloat(x1);
    let tol = parseFloat(tolerance);
    let steps = [];
    let iteration = 0;

    while (Math.abs(b - a) > tol) {
      let fa = evaluate(parsedInput, { x: a });
      let fb = evaluate(parsedInput, { x: b });
      let xn = (a * fb - b * fa) / (fb - fa);
      let fxn = evaluate(parsedInput, { x: xn });

      let update = fa * fxn < 0 ? "b = xn" : "a = xn";

      steps.push({ iteration, a, b, fa, fb, xn, fxn, update });

      if (Math.abs(fxn) < tol) break;

      if (fa * fxn < 0) {
        b = xn;
      } else {
        a = xn;
      }
      iteration++;
    }

    setRoot((a + b) / 2);
    setResults(steps);
  };
  
  const parseInput = (input) => {
    return input.replace(/ln\(/g, "log("); // Ganti ln(x) dengan log(x)
  };

  const handleCalculation = () => {
    try {
        const parsedInput = parseInput(functionInput);
        setParsedFunction(parsedInput); // Simpan parsedInput ke state

        if (method === "bisection") {
            calculateBisection(parsedInput);
        } else {
            calculateFalsePosition(parsedInput);
        }
    } catch (error) {
        console.error("Error during calculation:", error);
        alert("Terjadi kesalahan dalam perhitungan. Periksa kembali input Anda.");
    }
};
// Fungsi untuk memformat input angka dalam format pangkat
  const formatMathInput = (input) => {
    return input.replace(/(\d)\^(\d+)/g, '$1^{#$2}');
  };

  

  return (
    <div>
      <div className="form-container">
        <MathJaxContext>
            <div className="p-fungsi"> 
                <p >Fungsi</p>                
            </div>
            <label style={{ display: "flex", alignItems: "center", marginTop: "10px"  }}>
            <span style={{fontSize:'20px'}}>
            <MathJax>{`\\(f(x) =\\)`}</MathJax>
            </span>
            <input
                style={{ marginLeft: "10px" }}
                className="forms"
                value={functionInput}
                onChange={(e) => setFunctionInput(e.target.value)}
            />
            </label>
            <div className="row">
                <div className="col-4">
                    <div className="p-fungsi"> 
                        <p >Nilai Awal </p>                
                    </div>
                </div>
                
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", marginTop: "20px" }}>
                {/* Initial Value x0 */}
                <label style={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <span style={{fontSize:'25px'}}>
                        <MathJax>{`\\(x₀ =\\)`}</MathJax>
                        
                    </span>
                    <input
                        style={{ marginLeft: "10px", flex: 1 }}
                        className="forms"
                        value={x0}
                        onChange={(e) => setX0(e.target.value)}
                    />
                </label>

                {/* Initial Value x1 */}
                <label style={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <span style={{fontSize:'25px'}}>
                        <MathJax>{`\\(x₁ =\\)`}</MathJax>                
                    </span>                    
                    <input
                        style={{ marginLeft: "10px", flex: 1 }}
                        className="forms"
                        value={x1}
                        onChange={(e) => setX1(e.target.value)}
                    />
                </label>

                {/* Desired Tolerance */}
                <label style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <span style={{ fontWeight: "bold" }}>Toleransi Perhitungan:</span>
                <input
                    type="number"
                    style={{ marginLeft: "10px", flex: 1 }}
                    className="forms"
                    value={tolerance}
                    onChange={(e) => setTolerance(e.target.value)}
                    min="0.0000000001"
                    max="0.1"
                    step="0.0000000001"
                />
                </label>

                </div>
            <div className="slider-container">
                <label className="slider-label">
                    Precision (Digits): {precision}
                </label>
                <input
                    className="slider-name"
                    type="range"
                    min="1"
                    max="10"
                    value={precision}
                    onChange={(e) => setPrecision(e.target.value)}
                />
            </div>
            <div className="method-toggle">
                <button
                    className={`toggle-button ${method === "bisection" ? "active" : ""}`}
                    onClick={() => setMethod("bisection")}
                >
                    Bisection Method
                </button>
                <button
                    className={`toggle-button ${method === "falsePosition" ? "active" : ""}`}
                    onClick={() => setMethod("falsePosition")}
                >
                    False Position Method
                </button>
            </div>
            <button onClick={handleCalculation}>Kalkulasi</button>
        </MathJaxContext>
      </div>

      <h3>Hasil:</h3>
      <MathJaxContext>
      <MathJax>

      
      {showLegend && (
        <div className="legend" style={{marginBottom:'20px'}}>
            <p><strong>Legend:</strong></p>
            <div className="row row-width">
            
            <div className="col-5">
                <p><strong>{`\\(a\\)`}</strong>: Batas bawah interval</p>
                <p><strong>{`\\(b\\)`}</strong>: Batas atas interval</p>
                <p><strong>{`\\(f(a)\\)`}</strong>: Nilai fungsi pada {`\\(a\\)`}</p>
                <p><strong>{`\\(f(b)\\)`}</strong>: Nilai fungsi pada {`\\(b\\)`}</p>
            </div>
            <div className="col-6">
                <p><strong>{`\\(x_n\\)`}</strong>: Titik tengah atau solusi sementara</p>
                <p><strong>{`\\(f(x_n)\\)`}</strong>: Nilai fungsi pada {`\\(x_n\\)`}</p>
                <p><strong>Toleransi Perhitungan</strong>: <br />Memastikan bahwa akar sudah cukup terkunci dalam interval {`\\([a,b].\\)`} <br />
                Iterasi tetap berjalan hingga {`\\(| b - a |\\)`} memenuhi toleransi <br />
                {`\\(| b - a | \\lt toleransi\\)`}                 
                </p>
            </div>
            </div>
        </div>
        )}
      </MathJax>
      </MathJaxContext>

      <button className="button-legend" onClick={() => setShowLegend(!showLegend)}>
        {showLegend ? (
            <>
            <img className="icon-img" src={icon3} alt="Hide Legend" /> <br /> 
            </>
        ) : (
            <>
            <img className="icon-img" src={icon2} alt="Show Legend" /> <br /> 
            </>
        )}
      </button>

      {results.length > 0 && (
        <IterationTabs
          iterations={results}
          functionInput={parsedFunction}
          tolerance={tolerance}
          precision={precision}
          root={root}
          method={method}
        />
      )}

       
    </div>
  );
};

export default Calculator;
