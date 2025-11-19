
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("modified").textContent = document.lastModified;


const temp = parseFloat(document.getElementById("temp").textContent);
const wind = parseFloat(document.getElementById("wind").textContent);

function calculateWindChill(T, W) {
  return (
    13.12 +
    0.6215 * T -
    11.37 * Math.pow(W, 0.16) +
    0.3965 * T * Math.pow(W, 0.16)
  );
}

let output = "N/A";

if (temp <= 10 && wind > 4.8) {
  output = calculateWindChill(temp, wind).toFixed(1) + " °C";
}

document.getElementById("windchill").textContent = output;
