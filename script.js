// FarmLink Transport demo JavaScript
// This file estimates costs and displays demo-only booking feedback.
// It does not contact real transport providers or track vehicles.

const vehicles = {
  mini:    { name: "Mini Truck", base: 180, perKm: 15, capacity: 700 },
  pickup:  { name: "Pickup Van", base: 220, perKm: 18, capacity: 1200 },
  tractor: { name: "Tractor Trailer", base: 300, perKm: 22, capacity: 3500 },
  large:   { name: "Large Truck", base: 650, perKm: 32, capacity: 10000 }
};

let selectedVehicle = "mini";

const form = document.getElementById("transportForm");
const pickupInput = document.getElementById("pickup");
const destinationInput = document.getElementById("destination");
const productInput = document.getElementById("product");
const quantityInput = document.getElementById("quantity");
const dateInput = document.getElementById("deliveryDate");
const distanceInput = document.getElementById("distance");
const estimatedCost = document.getElementById("estimatedCost");
const selectedVehicleLabel = document.getElementById("selectedVehicleLabel");
const bookingResult = document.getElementById("bookingResult");
const resetButton = document.getElementById("resetButton");

function calculateCost() {
  const vehicle = vehicles[selectedVehicle];
  const quantity = Number(quantityInput.value);
  const distance = Number(distanceInput.value);

  if (!quantity || quantity <= 0 || !distance || distance <= 0) {
    estimatedCost.textContent = "Enter details";
    return null;
  }

  // Demo formula: (base cost + distance rate) multiplied by a load factor.
  const loadFactor = Math.max(1, quantity / vehicle.capacity);
  const cost = Math.round((vehicle.base + vehicle.perKm * distance) * loadFactor);
  estimatedCost.textContent = `₹${cost.toLocaleString("en-IN")}`;
  return cost;
}

document.querySelectorAll(".vehicle-card").forEach((card) => {
  card.addEventListener("click", () => {
    selectedVehicle = card.dataset.vehicle;
    document.querySelectorAll(".vehicle-card").forEach((item) => {
      const isSelected = item === card;
      item.classList.toggle("selected", isSelected);
      item.setAttribute("aria-pressed", String(isSelected));
    });
    selectedVehicleLabel.textContent = vehicles[selectedVehicle].name;
    calculateCost();
  });
});

quantityInput.addEventListener("input", calculateCost);
distanceInput.addEventListener("input", calculateCost);

// Prevent users from choosing a date in the past.
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString()
  .slice(0, 10);
dateInput.min = localToday;

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const cost = calculateCost();
  if (!cost) {
    showMessage("Please enter a valid quantity and distance to calculate the estimate.");
    return;
  }

  const vehicle = vehicles[selectedVehicle];
  const quantity = Number(quantityInput.value);

  if (quantity > vehicle.capacity) {
    showMessage(
      `${vehicle.name} capacity is listed as ${vehicle.capacity.toLocaleString("en-IN")} kg. ` +
      `Your load is ${quantity.toLocaleString("en-IN")} kg. Please choose a larger vehicle.`
    );
    return;
  }

  showMessage(
    `Demo request prepared for ${productInput.value} from ${pickupInput.value.trim()} to ` +
    `${destinationInput.value.trim()}. Vehicle: ${vehicle.name}. Estimated cost: ₹${cost.toLocaleString("en-IN")}. ` +
    `No real booking has been made. A verified provider directory is not connected yet.`
  );
});

function showMessage(message) {
  bookingResult.textContent = message;
  bookingResult.classList.add("show");
}

resetButton.addEventListener("click", () => {
  form.reset();
  selectedVehicle = "mini";
  document.querySelectorAll(".vehicle-card").forEach((card) => {
    const isSelected = card.dataset.vehicle === "mini";
    card.classList.toggle("selected", isSelected);
    card.setAttribute("aria-pressed", String(isSelected));
  });
  selectedVehicleLabel.textContent = vehicles.mini.name;
  estimatedCost.textContent = "₹195";
  bookingResult.textContent = "";
  bookingResult.classList.remove("show");
});

calculateCost();
