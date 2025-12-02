const products = [
  { id: "fc-1888", name: "Flux Capacitor" },
  { id: "fc-2050", name: "Power Laces" },
  { id: "fs-1987", name: "Time Circuits" },
  { id: "fs-2188", name: "Low Voltage Reactor" },
  { id: "ac-2000", name: "Warp Drive" }
];

const select = document.querySelector("#productName");

products.forEach(item => {
  const option = document.createElement("option");
  option.value = item.id;
  option.textContent = item.name;
  select.appendChild(option);
});

