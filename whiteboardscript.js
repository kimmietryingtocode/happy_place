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

