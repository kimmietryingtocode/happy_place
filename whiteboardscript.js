const canvas = document.getElementById("whiteboard");
const context = canvas.getContext("2d");

let drawing = false;

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



const clearButton = document.getElementById("clear-btn");

clearButton.addEventListener("click", () => {
  context.clearRect(0,0, canvas.width, canvas.height);
});



const colorPicker = document.getElementById("color-picker");

colorPicker.addEventListener("input", (e) => {
  context.strokeStyle = e.target.value;
});



const brushSizeInput = document.getElementById("brush-size");

brushSizeInput.addEventListener("input", (e) => {
  context.lineWidth = e.target.value;
});

// Function to display saved drawings on the page
function displaySavedDrawing(imageData) {
  // Create a container for the saved image
  const imageContainer = document.createElement('div');
  imageContainer.className = 'saved-drawing-container';

  // Create an img element to display the drawing
  const img = document.createElement('img');
  img.src = imageData; // Use the base64 data URL passed as an argument
  img.className = 'saved-drawing';
  img.style.width = '200px'; // You can set any size you prefer for display
  img.style.height = 'auto'; // Maintain aspect ratio

  // Append the img element to the container and then to the page
  imageContainer.appendChild(img);

  // Assuming there is a container to append the saved drawings, adjust as needed
  const entryResultRow = document.querySelector('.entryResultRow');
  if (entryResultRow) {
    entryResultRow.appendChild(imageContainer);
  } else {
    console.warn('Container for saved drawings not found');
  }
}

const saveButton = document.getElementById("save-btn");

// Function to save the current drawing as an image
saveButton.addEventListener("click", async () => {
  const imageData = canvas.toDataURL("image/png"); // Get the canvas data as a Base64 string

  // Send the image data to the server
  try {
    const response = await fetch('http://localhost:3010/save-drawing', { // Ensure correct URL
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
    displaySavedDrawing(imageData); // Display the saved drawing on the page
  } catch (error) {
    console.error("Failed to save drawing:", error);
  }
});