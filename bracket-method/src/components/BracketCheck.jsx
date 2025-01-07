import React from "react";
import { evaluate } from "mathjs";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const BracketCheck = ({ precision, functionInput, a, b }) => {
    // Jika kolom a atau b kosong, tidak menampilkan pesan apa pun
    if (!a.trim() || !b.trim()) {
        return null; // Tidak merender apa-apa
    }

    // Konversi nilai a dan b ke angka
    const aNum = parseFloat(a);
    const bNum = parseFloat(b);
  
    // Validasi apakah aNum dan bNum adalah angka
    if (isNaN(aNum) || isNaN(bNum)) {
      return (
        <div style={{ color: "red", fontWeight: "bold", marginTop: "20px" }}>
          ✘ Input interval tidak valid. Pastikan nilai x₀ dan x₁ adalah angka yang valid.
        </div>
      );
    }
  
    // Evaluasi fungsi di aNum dan bNum
    let fa, fb;
    try {
      fa = evaluate(functionInput, { x: aNum });
      fb = evaluate(functionInput, { x: bNum });
    } catch (error) {
      return (
        <div style={{ color: "red", fontWeight: "bold", marginTop: "20px" }}>
          ✘ Terjadi kesalahan saat mengevaluasi fungsi. Periksa kembali input fungsi Anda.
        </div>
      );
    }
  
    // Mengecek apakah f(a) * f(b) < 0
    const isBracketValid = fa * fb < 0;

    const formatNumber = (num) => {
      return num.toFixed(precision); // Format number to the given precision
    };
  
    return (
        <>
          <MathJaxContext>
            <MathJax>
              <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
                <h3>Pengecekan</h3>
                <p>Memantau apakah bracket interval memiliki solusi:</p>
                <p>{`\\(f(a) = f(${aNum}) = ${formatNumber(fa)}\\)`}</p>
                <p>{`\\(f(b) = f(${bNum}) = ${formatNumber(fb)}\\)`}</p>
                <p></p>
                <p>
                  {`\\(f(a) \\cdot f(b) = ${formatNumber(fa)} \\cdot ${formatNumber(fb)} = ${formatNumber(fa * fb)}\\)`}<br />
                  <br />
                  {isBracketValid 
                    ? "Interval-interval ini memiliki solusi dan bisa dilanjutkan prosesnya." 
                    : "Interval-interval ini tidak memiliki solusi dan tidak bisa dilanjutkan prosesnya."}
                </p>
                {isBracketValid ? (
                  <div style={{ color: "green", fontWeight: "bold" }}>
                    ✔ Interval nilainya valid. Silahkan lanjutkan.
                  </div>
                ) : (
                  <div style={{ color: "red", fontWeight: "bold" }}>
                    ✘ Interval nilainya tidak valid. Silahkan pilih nilai interval lainnya.
                  </div>
                )}
              </div>
            </MathJax>
          </MathJaxContext>
        </>
    );
  };
  
  

  export default BracketCheck;