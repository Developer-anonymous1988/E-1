const color1Input = document.getElementById("color1");
const color2Input = document.getElementById("color2");
const color1Text = document.getElementById("color1Text");
const color2Text = document.getElementById("color2Text");
const directionSelect = document.getElementById("direction");
const preview = document.getElementById("preview");
const codeBlock = document.getElementById("codeBlock");
const randomBtn = document.getElementById("randomBtn");
const swapBtn = document.getElementById("swapBtn");
const copyBtn = document.getElementById("copyBtn");
const copyStatus = document.getElementById("copyStatus");

const curatedPalettes = [
  ["#0f172a", "#1e293b"],
  ["#020617", "#312e81"],
  ["#0f766e", "#022c22"],
  ["#111827", "#4b5563"],
  ["#1d3557", "#457b9d"],
];

function applyRandomDirectionAndUpdate(c1, c2) {
  color1Input.value = c1;
  color2Input.value = c2;

  const options = Array.from(directionSelect.options);
  directionSelect.value =
    options[Math.floor(Math.random() * options.length)].value;

  syncColorInputs(true);
}


function generateRandomColor() {
  const hex = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0");
  return `#${hex}`;
}

function isValidHex(value) {
  return /^#([0-9a-fA-F]{6})$/.test(value.trim());
}

function buildGradientString(direction, c1, c2) {
  return `linear-gradient(${direction}, ${c1}, ${c2})`;
}

function updateGradient() {
  const color1 = color1Input.value;
  const color2 = color2Input.value;
  const direction = directionSelect.value;

  const gradient = buildGradientString(direction, color1, color2);

  preview.style.backgroundImage = gradient;

  const cssCode = [
    `background: ${color1};`,
    `background: -webkit-${gradient};`,
    `background: ${gradient};`,
  ].join("\n");

  codeBlock.textContent = cssCode;
}

function syncColorInputs(fromPicker = true) {
  if (fromPicker) {
    color1Text.value = color1Input.value.toLowerCase();
    color2Text.value = color2Input.value.toLowerCase();
    color1Text.classList.remove("invalid");
    color2Text.classList.remove("invalid");
  } else {
    let c1 = color1Text.value.trim();
    let c2 = color2Text.value.trim();

    if (!c1.startsWith("#")) c1 = `#${c1}`;
    if (!c2.startsWith("#")) c2 = `#${c2}`;

    const valid1 = isValidHex(c1);
    const valid2 = isValidHex(c2);

    color1Text.classList.toggle("invalid", !valid1);
    color2Text.classList.toggle("invalid", !valid2);

    if (valid1) {
      color1Input.value = c1.toLowerCase();
      color1Text.value = c1.toLowerCase();
    }
    if (valid2) {
      color2Input.value = c2.toLowerCase();
      color2Text.value = c2.toLowerCase();
    }
  }
  updateGradient();
}

function randomizeGradient() {
  const c1 = generateRandomColor();
  const c2 = generateRandomColor();
  applyRandomDirectionAndUpdate(c1, c2);
  flashCopyStatus("Random gradient generated.");
}

function randomizeGradientFromPalette() {
  const pair =
    curatedPalettes[Math.floor(Math.random() * curatedPalettes.length)];
  applyRandomDirectionAndUpdate(pair[0], pair[1]);
  flashCopyStatus("Random curated gradient.");
}

function swapColors() {
  const temp = color1Input.value;
  color1Input.value = color2Input.value;
  color2Input.value = temp;
  syncColorInputs(true);
}


async function copyCssToClipboard() {
  const text = codeBlock.textContent.trim();
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    flashCopyStatus("Copied CSS to clipboard.");
  } catch (err) {
    console.error("Copy failed:", err);
    flashCopyStatus("Copy failed. Try selecting text manually.", true);
  }
}

function flashCopyStatus(message, isError = false) {
  copyStatus.textContent = message;
  copyStatus.classList.toggle("error", isError);
  if (!isError) {
    setTimeout(() => {
      copyStatus.textContent = "";
    }, 1800);
  }
}

color1Input.addEventListener("input", () => syncColorInputs(true));
color2Input.addEventListener("input", () => syncColorInputs(true));

color1Text.addEventListener("input", () => syncColorInputs(false));
color2Text.addEventListener("input", () => syncColorInputs(false));

directionSelect.addEventListener("change", updateGradient);
randomBtn.addEventListener("click", randomizeGradient);
swapBtn.addEventListener("click", swapColors);
copyBtn.addEventListener("click", copyCssToClipboard);

window.addEventListener("DOMContentLoaded", () => {
  randomizeGradient();
});

