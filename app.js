function convert() {
  const value = parseFloat(document.getElementById('inputValue').value);
  const results = document.getElementById('results');
  results.innerHTML = ''; // Clear previous results

  if (isNaN(value)) {
    results.innerHTML = '<li>Please enter a valid number</li>';
    return;
  }

  const conversions = [
    `${value} °C = ${(value * 9/5 + 32).toFixed(2)} °F`,
    `${value} °C = ${(value + 273.15).toFixed(2)} K`,
    `${value} °F = ${((value - 32) * 5/9).toFixed(2)} °C`,
    `${value} °F = ${((value - 32) * 5/9 + 273.15).toFixed(2)} K`,
    `${value} km = ${(value * 0.621371).toFixed(2)} mi`,
    `${value} m = ${(value * 1.09361).toFixed(2)} yd`,
    `${value} yd = ${(value / 1.09361).toFixed(2)} m`,
    `${value} cm = ${(value / 2.54).toFixed(2)} in`,
    `${value} in = ${(value * 2.54).toFixed(2)} cm`,
    `${value} km/h = ${(value * 0.621371).toFixed(2)} mph`,
    `${value} mph = ${(value * 1.60934).toFixed(2)} km/h`,
    `${value} oz = ${(value * 28.3495).toFixed(2)} g`,
    `${value} g = ${(value / 28.3495).toFixed(2)} oz`,
    `${value} fl oz = ${(value * 29.5735).toFixed(2)} ml`,
    `${value} ml = ${(value / 29.5735).toFixed(2)} fl oz`,
    `${value} sec = ${(value / 60).toFixed(2)} min`,
    `${value} min = ${(value / 60).toFixed(2)} h`,
    `${value} h = ${(value / 24).toFixed(2)} days`
  ];

  // Display conversions in a list
  conversions.forEach(conversion => {
    const li = document.createElement('li');
    li.textContent = conversion;
    results.appendChild(li);
  });
}
