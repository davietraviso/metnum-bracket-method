import React, { useState, useEffect } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Tab, Tabs, Container, Row, Col } from "react-bootstrap";
import IterationGraph from "./IterationGraph";
import "./IterationTabs.css";
import FakePositionGraph from "./FakePositionGraph";

const IterationTabs = ({ iterations, precision, root, functionInput, method }) => {
  const [key, setKey] = useState("table");

  const formatNumber = (num) => {
    return num.toFixed(precision); // Format number to the given precision
  };

  

  return (
    <Container style={{ marginTop: "20px" }}>
      <Tabs
        id="iteration-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="table" title="Iterasi Tabel">
            <table className="table">
                <thead>
                <tr>
                    <MathJaxContext>
                    <th><MathJax>{`\\(Iterasi\\)`}</MathJax></th>
                    <th><MathJax>{`\\(a\\)`}</MathJax></th>
                    <th><MathJax>{`\\(b\\)`}</MathJax></th>
                    <th><MathJax>{`\\(f(a)\\)`}</MathJax></th>
                    <th><MathJax>{`\\(f(b)\\)`}</MathJax></th>
                    <th><MathJax>{`\\(x_n\\)`}</MathJax></th>
                    <th><MathJax>{`\\(f(x_n)\\)`}</MathJax></th>
                    </MathJaxContext>
                </tr>
                </thead>
                <tbody>
                {iterations.map((iteration, index) => (
                    <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{formatNumber(iteration.a)}</td>
                    <td>{formatNumber(iteration.b)}</td>
                    <td>{formatNumber(iteration.fa)}</td>
                    <td>{formatNumber(iteration.fb)}</td>
                    <td>{formatNumber(iteration.xn)}</td>
                    <td>{formatNumber(iteration.fxn)}</td>
                    </tr>
                ))}
                </tbody>
                <tfoot>
                <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '1rem' }}>
                    {root !== null && (
                        <h3>Root (x): {root.toFixed(precision)}</h3>
                    )}
                    </td>
                </tr>
                </tfoot>
            </table>
        </Tab>


        

        {method === 'bisection' ? (
          <Tab eventKey="manual" title="Kalkulasi Iterasi (Bisection)" style={{paddingBottom:'50px'}}>
            <MathJaxContext key={method}>
              <div>
                {iterations.map((iteration, index) => (
                  <div key={index} style={{ marginBottom: "20px" }}>
                    <h5>Iterasi ke-{index + 1}:</h5>
                    <MathJax>
                      {`
                        \\(a = ${formatNumber(iteration.a)}, b = ${formatNumber(iteration.b)}, x_n = \\frac{${formatNumber(iteration.a)} + ${formatNumber(iteration.b)}}{2} = ${formatNumber(iteration.xn)}\\)
                      `}
                    </MathJax>
                    <MathJax>
                      {`
                        \\(f(x_n) = f(${formatNumber(iteration.xn)}) = ${formatNumber(iteration.fxn)}\\)
                      `}
                    </MathJax>
                    <p>
                      Root berada di antara  <br />
                      <label>
                      <MathJax>                        
                          {`\\((${formatNumber(iteration.a)})\\)`} dan  {`\\((${formatNumber(iteration.b)})\\)`}
                      </MathJax>                  
                      
                      </label>
                      
                    </p>
                    <p>
                      Interval baru:{" "}
                      <MathJax>
                      {iteration.update === "b = xn"
                        ? `\\([${formatNumber(iteration.a)}, ${formatNumber(iteration.xn)}]\\)`
                        : `\\([${formatNumber(iteration.xn)}, ${formatNumber(iteration.b)}]\\)`}

                      </MathJax>
                    </p>
                  </div>
                ))}
                {root !== null && <h3>Root (x): {root.toFixed(precision)}</h3>}
              </div>
            </MathJaxContext>
          </Tab>
        ) : (
          <Tab eventKey="manual" title="Kalkulasi Iterasi (False Position)" style={{ paddingBottom: "50px" }}>
            <MathJaxContext key={method}> 
              <div>
                {iterations.map((iteration, index) => (
                  <div key={index} style={{ marginBottom: "20px" }}>
                    <h5>Iterasi ke-{index + 1}:</h5>
                    <MathJax>
                      {`
                        \\(a = ${formatNumber(iteration.a)}, b = ${formatNumber(iteration.b)}, \\)
                        \\(x_n = b - \\frac{f(b)(b - a)}{f(b) - f(a)} = ${formatNumber(iteration.xn)}\\)
                      `}
                    </MathJax>
                    <MathJax>
                      {`
                        \\(f(x_n) = f(${formatNumber(iteration.xn)}) = ${formatNumber(iteration.fxn)}\\)
                      `}
                    </MathJax>
                    <p>
                      Root berada di antara: <br />
                      <label>
                        <MathJax>
                          {iteration.update === "b = xn"
                            ? `\\([${formatNumber(iteration.a)}, ${formatNumber(iteration.xn)}]\\)`
                            : `\\([${formatNumber(iteration.xn)}, ${formatNumber(iteration.b)}]\\)`}
                        </MathJax>
                      </label>
                    </p>
                    <p>
                      Interval baru:{" "}
                      <MathJax>
                        {iteration.update === "b = xn"
                          ? `\\([${formatNumber(iteration.a)}, ${formatNumber(iteration.xn)}]\\)`
                          : `\\([${formatNumber(iteration.xn)}, ${formatNumber(iteration.b)}]\\)`}
                      </MathJax>
                    </p>
                  </div>
                ))}
                {root !== null && <h3>Root (x): {root.toFixed(precision)}</h3>}
              </div>
            </MathJaxContext>
          </Tab>

        )}

        {method === 'bisection' ? (
          <Tab eventKey="graph" title="Grafik Iterasi">
            <IterationGraph iterations={iterations} functionInput={functionInput} />
          </Tab>
        ) : (
          <Tab eventKey="graph" title="Grafik Iterasi">
            <FakePositionGraph iterations={iterations} functionInput={functionInput} />
          </Tab>
        )}

      </Tabs>
    </Container>
  );
};

export default IterationTabs;