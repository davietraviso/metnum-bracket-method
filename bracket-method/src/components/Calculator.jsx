import React, { useState, useEffect, useRef } from "react";
import { evaluate } from "mathjs";
import "./Calculator.css";
import icon2 from '../assets/book.png'
import icon3 from '../assets/book2.png'
import IterationTabs from "./IterationTabs";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Tab, Tabs, Container, Row, Col } from "react-bootstrap";
import BracketCheck from "./BracketCheck";
import '../assets/mathquill/mathquill.css';
import '../assets/mathquill/mathquill.js';  // pastikan Anda sudah mengimpor CSS MathQuill




const Calculator = () => {
  const [isValidInterval, setIsValidInterval] = useState(true); // Default true
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
  const [displayLimit, setDisplayLimit] = useState(10);


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
    const maxIterations = 100;
    let steps = [];
    let iteration = 0;

    // Validate initial interval
    let fa = evaluate(parsedInput, { x: a });
    let fb = evaluate(parsedInput, { x: b });
    if (fa * fb >= 0) {
        throw new Error("The function must have opposite signs at a and b.");
    }

    let xn = a; // Initial guess for the root

    while (Math.abs(b - a) > tol && iteration < maxIterations) {
        fa = evaluate(parsedInput, { x: a });
        fb = evaluate(parsedInput, { x: b });
        xn = (a * fb - b * fa) / (fb - fa);
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

    if (iteration >= maxIterations) {
        console.warn("Max iterations reached. Method may not have converged.");
    }

    setRoot(xn); // Use xn as the root
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


  
  // filter hasil yang ditampilkan
  const filteredResults = results.slice(0, displayLimit);


  

  return (
    <div>
      <div className="form-container">
        <MathJaxContext>
         

            <div className="p-fungsi"> 
                <p >Fungsi</p>                
            </div>
            <div className="row">
                <div className="col-4">
                    <label style={{ display: "flex", alignItems: "center", marginTop: "10px"  }}>
                        <span style={{fontSize:'20px', paddingRight:'10px'}}>
                            <MathJax>{`\\(f(x) = \\)`}</MathJax>
                        </span>
                        {/* <div
                            ref={mathFieldRef}
                            style={{ fontSize:'20px', border: '1px solid #ddd', padding: '5px', width: '300px',height:'40px', borderRadius:'5px ' , minHeight: '30px' }}
                        /> */}
                        <input
                            style={{ marginLeft: "10px" }}
                            className="forms"
                            value={functionInput}
                            onChange={(e) => setFunctionInput(e.target.value)}
                        />
                    </label>

                </div>
                

            </div>
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

                

                

            </div>
            <div className="row" style={{paddingTop:'20px'}}>
                <div className="col-5">
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
                <div className="col-5">
                    {/* Input batas iterasi */}
                    <label style={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <span style={{ fontWeight: "bold", paddingRight:'10px' }}>Batas Iterasi yang Ditampilkan: </span>
                        
                        <input
                        type="number"
                        className="forms"
                        value={displayLimit}
                        onChange={(e) => setDisplayLimit(Number(e.target.value))}
                        min="1"
                        step="1"
                        />
                    </label>
                </div>
            </div>

            <div className="slider-container" style={{paddingTop:'20px'}}>
                <label className="slider-label">
                    Presisi (Digit): {precision}
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

    <Tabs>
        <Tab eventKey="validation" title="Cek Interval">
            <div style={{ padding: "20px" }}>
                <BracketCheck precision={precision} functionInput={functionInput} a={x0} b={x1} setIsValidInterval={setIsValidInterval} />
            </div>
        </Tab>

    </Tabs>
    


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
                <p><strong>Toleransi Perhitungan</strong>: <br /> Menentukan sejauh mana hasil akhir dianggap cukup dekat dengan akar sebenarnya, <br /> sehingga iterasi dapat dihentikan. <br />Memastikan bahwa akar sudah cukup terpenuhi dalam interval {`\\([a,b].\\)`} <br />
                Di mana iterasi tetap berjalan hingga {`\\(| b - a |\\)`} memenuhi toleransi. <br />
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

      {isValidInterval && filteredResults.length > 0 && (
        <IterationTabs
          iterations={filteredResults}
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
