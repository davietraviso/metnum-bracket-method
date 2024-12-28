import React, { useState, useEffect } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Tab, Tabs, Container, Row, Col } from "react-bootstrap";
import "./IterationTabs.css";

const IterationTabs = ({ iterations, precision, root }) => {
  const [key, setKey] = useState("table");

//   useEffect(() => {
//       // Force MathJax to re-render the math equations when state changes
//       window.MathJax.typeset();
//     }, [iterations]); // This triggers a re-render when iterations change

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
                        <th><MathJax>
                            {`
                                \\(a\\)
                            `}
                            </MathJax></th>
                        <th><MathJax>{`\\(b\\)`}</MathJax></th>
                        <th><MathJax>{`\\(f(a)\\)`}</MathJax></th>
                        <th><MathJax>{`\\(f(b)\\)`}</MathJax></th>
                        <th><MathJax>{`\\(x_n\\)`}</MathJax></th>
                        <th><MathJax>
                            {`
                            \\(f(x_n)\\)
                            `}
                            </MathJax></th>
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
            {root !== null && <h3>Root (x): {root.toFixed(precision)}</h3>}
          </table>
        </Tab>

        <Tab eventKey="manual" title="Kalkulasi Iterasi">
          <MathJaxContext>
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
                    Root berada di antara {`\\((${formatNumber(iteration.a)}) dan (${formatNumber(iteration.b)}\\).`}
                    
                  </p>
                  <p>
                    Interval baru:{" "}
                    {iteration.update === "b = xn"
                      ? `\\([${formatNumber(iteration.a)}, ${formatNumber(iteration.xn)}]\\)`
                      : `\\([${formatNumber(iteration.xn)}, ${formatNumber(iteration.b)}]\\)`}
                  </p>
                </div>
              ))}
              {root !== null && <h3>Root (x): {root.toFixed(precision)}</h3>}
            </div>
          </MathJaxContext>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default IterationTabs;