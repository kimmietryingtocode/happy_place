document.addEventListener("DOMContentLoaded", async function () {
  await fetchDrawings(); // Fetch stored drawings when the page loads
});

// Select necessary elements
const canvas = document.getElementById("whiteboard");
const context = canvas.getContext("2d");
const clearButton = document.getElementById("clear-btn");
const colorPicker = document.getElementById("color-picker");
const brushSizeInput = document.getElementById("brush-size");
const eraserButton = document.getElementById("eraser-btn");
const saveButton = document.getElementById("save-btn");

let drawing = false;
let isErasing = false; // Flag to toggle between drawing and erasing
let lastDrawingColor = "#000000"; // Default drawing color (black)

// Event listener for canvas
canvas.addEventListener("mousedown", () => {
drawing = true;
context.beginPath();
});

canvas.addEventListener("mouseup", () => {
drawing = false;
context.closePath();
});

canvas.addEventListener("mousemove", draw);

function draw(e) {
if (!drawing) return;

context.lineCap = "round";

context.lineTo(
  e.clientX - canvas.getBoundingClientRect().left,
  e.clientY - canvas.getBoundingClientRect().top
);
context.stroke();
context.beginPath();
context.moveTo(
  e.clientX - canvas.getBoundingClientRect().left,
  e.clientY - canvas.getBoundingClientRect().top
);
}

// Clear button
clearButton.addEventListener("click", () => {
context.clearRect(0, 0, canvas.width, canvas.height);
});

// Color picker
colorPicker.addEventListener("input", (e) => {
lastDrawingColor = e.target.value; // Update the last drawing color
context.strokeStyle = lastDrawingColor;
isErasing = false; // Switch back to drawing mode when a color is picked
eraserButton.textContent = "Eraser"; // Update button text
});

// Brush size
brushSizeInput.addEventListener("input", (e) => {
context.lineWidth = e.target.value;
});

// Eraser button
eraserButton.addEventListener("click", () => {
isErasing = !isErasing; // Toggle erasing mode

if (isErasing) {
  eraserButton.textContent = "Drawing Mode"; // Update button text
  context.strokeStyle = "#f7f2eb"; // Set the strokeStyle to white (background color)
} else {
  eraserButton.textContent = "Eraser"; // Update button text
  context.strokeStyle = lastDrawingColor; // Restore the last drawing color
}
});

// Save button
saveButton.addEventListener("click", async () => {
const imageData = canvas.toDataURL("image/png");

try {
  const response = await fetch('http://localhost:3010/save-drawing', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageData }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const result = await response.json();
  console.log(result.message);
  displaySavedDrawing(imageData);
} catch (error) {
  console.error("Failed to save drawing:", error);
}
});

// Fetch and display saved drawings from the server
async function fetchDrawings() {
  try {
      const response = await fetch('http://localhost:3010/get-drawings');
      if (!response.ok) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const drawings = await response.json();
      drawings.forEach(drawing => {
          displaySavedDrawing(drawing.imageData);
      });
  } catch (error) {
      console.error("Error fetching drawings:", error);
  }
}

// Display saved drawings
function displaySavedDrawing(imageData) {
const imageContainer = document.createElement('div');
imageContainer.className = 'saved-drawing-container';

const img = document.createElement('img');
img.src = imageData;
img.className = 'saved-drawing';
img.style.width = '200px';
img.style.height = 'auto';

imageContainer.appendChild(img);

const entryResultRow = document.querySelector('.entryResultRow');
if (entryResultRow) {
  entryResultRow.appendChild(imageContainer);
} else {
  console.warn('Container for saved drawings not found');
}
}
