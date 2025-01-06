const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const upload = document.getElementById("upload");
const brightness = document.getElementById("brightness");
const contrast = document.getElementById("contrast");
const reset = document.getElementById("reset");
const download = document.getElementById("download");

let originalImage = null;

// Load image onto the canvas
upload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        originalImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
});

// Apply filters
function applyFilters() {
  const imageData = ctx.createImageData(originalImage);
  const data = originalImage.data;
  const filteredData = imageData.data;

  const bFactor = parseInt(brightness.value);
  const cFactor = parseInt(contrast.value);

  for (let i = 0; i < data.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      // RGB channels
      let pixel = data[i + j];
      pixel += bFactor; // Adjust brightness
      pixel = (pixel - 128) * (cFactor / 100 + 1) + 128; // Adjust contrast
      filteredData[i + j] = Math.min(Math.max(pixel, 0), 255); // Clamp values
    }
    filteredData[i + 3] = data[i + 3]; // Alpha channel remains the same
  }
  ctx.putImageData(imageData, 0, 0);
}

brightness.addEventListener("input", applyFilters);
contrast.addEventListener("input", applyFilters);

// Reset filters
reset.addEventListener("click", () => {
  ctx.putImageData(originalImage, 0, 0);
  brightness.value = 0;
  contrast.value = 0;
});

// Download the edited image
download.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "edited-image.png";
  link.href = canvas.toDataURL();
  link.click();
});
