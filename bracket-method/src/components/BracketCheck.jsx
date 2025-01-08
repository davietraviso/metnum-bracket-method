import React from "react";
import { evaluate } from "mathjs";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const BracketCheck = ({ precision, functionInput, a, b }) => {
  if (!a.trim() || !b.trim()) return null;

  const aNum = parseFloat(a);
  const bNum = parseFloat(b);

  if (isNaN(aNum) || isNaN(bNum)) {
    return (
      <div style={{ color: "red", fontWeight: "bold", marginTop: "20px" }}>
        ✘ Input interval tidak valid. Pastikan nilai x₀ dan x₁ adalah angka yang valid.
      </div>
    );
  }

  let fa, fb;
  try {
    fa = evaluate(functionInput, { x: aNum });
    fb = evaluate(functionInput, { x: bNum });
  } catch {
    return (
      <div style={{ color: "red", fontWeight: "bold", marginTop: "20px" }}>
        ✘ Terjadi kesalahan saat mengevaluasi fungsi. Periksa kembali input fungsi Anda.
      </div>
    );
  }

  const checkForRootsGlobal = (func, steps = 100, range = [-1000, 1000]) => {
    const [minX, maxX] = range;
    const stepSize = (maxX - minX) / steps;

    for (let i = 0; i <= steps; i++) {
      const x = minX + i * stepSize;
      const currentValue = evaluate(func, { x });
      if (Math.abs(currentValue) < 1e-10) return true; // Fungsi menyentuh sumbu x
      if (i > 0 && Math.sign(currentValue) !== Math.sign(evaluate(func, { x: minX + (i - 1) * stepSize }))) {
        return true; // Fungsi melewati sumbu x
      }
    }
    return false;
  };

  const isFunctionHasRoot = checkForRootsGlobal(functionInput);
  const isBracketValid = fa * fb <= 0;
  const formatNumber = (num) => num.toFixed(precision);

  return (
    <MathJaxContext>
      <MathJax>
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
          <h3>Pengecekan</h3>
          <p>{`\\(f(a) = f(${aNum}) = ${formatNumber(fa)}\\)`}</p>
          <p>{`\\(f(b) = f(${bNum}) = ${formatNumber(fb)}\\)`}</p>
          <p>{`\\(f(a) \\cdot f(b) = ${formatNumber(fa)} \\cdot ${formatNumber(fb)} = ${formatNumber(fa * fb)}\\)`}</p>
          {isFunctionHasRoot ? (
            isBracketValid ? (
              <div style={{ color: "green", fontWeight: "bold", marginTop: "20px" }}>
                ✔ Interval memiliki solusi. Lanjutkan proses.
              </div>
            ) : (
              <div style={{ color: "red", fontWeight: "bold", marginTop: "20px" }}>
                ✘ Interval tidak memiliki solusi. Pilih interval lain.
              </div>
            )
          ) : (
            <div style={{ color: "red", fontWeight: "bold", marginTop: "20px" }}>
              ✘ Fungsi tidak memiliki akar. Pastikan fungsi melewati sumbu-x.
            </div>
          )}
        </div>
      </MathJax>
    </MathJaxContext>
  );
};

export default BracketCheck;
