const video = document.getElementById('video');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const captureButton = document.getElementById('captureButton');
const canvas = document.getElementById('canvas');
const compressedImage = document.getElementById('compressedImage');
const metricsDiv = document.getElementById('metrics');
const cameraContainer = document.getElementById('camera-container');
const captureContainer = document.getElementById('capture-container');
const resultsContainer = document.getElementById('results-container');
const errorContainer = document.getElementById('error-container');
const errorMessage = document.getElementById('error-message');

let stream;

startButton.addEventListener('click', () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((mediaStream) => {
        stream = mediaStream;
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play();
        };
        stopButton.disabled = false;
        captureButton.disabled = false;
        startButton.disabled = true;
        errorContainer.style.display = 'none';
      })
      .catch((error) => {
        console.error('Error accessing the camera:', error);
        errorMessage.textContent = 'Unable to access the camera. Please check permissions.';
        errorContainer.style.display = 'block';
      });
  } else {
    errorMessage.textContent = 'Camera access is not supported in this browser.';
    errorContainer.style.display = 'block';
  }
});

stopButton.addEventListener('click', () => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    video.srcObject = null;
    stopButton.disabled = true;
    captureButton.disabled = true;
    startButton.disabled = false;
  }
});

captureButton.addEventListener('click', () => {
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  cameraContainer.style.display = 'none';
  captureContainer.style.display = 'block';
  resultsContainer.style.display = 'none'; // Hide results until processed.
  sendImageToBackend(canvas.toDataURL('image/jpeg'));
});

function sendImageToBackend(imageDataUrl) {
  fetch('/process_image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: imageDataUrl }),
  })
    .then((response) => response.json())
    .then((data) => {
      displayResults(data);
    })
    .catch((error) => {
      console.error('Error:', error);
      errorMessage.textContent = 'Error processing image.';
      errorContainer.style.display = 'block';
      cameraContainer.style.display = 'block'; // Show camera again on error
      captureContainer.style.display = 'none';
    });
}

function displayResults(data) {
  compressedImage.src = data.compressed_image;
  metricsDiv.innerHTML = `
        <p>Compression Ratio: ${data.compression_ratio}</p>
        <p>PSNR: ${data.psnr}</p>
        <p>SSIM: ${data.ssim}</p>
        <p>Memory Usage: ${data.memory_usage} MB</p>
        <p>Detection Time Without Compression: ${data.detection_time_without_compression} seconds</p>
        <p>Compression Time: ${data.compression_time} seconds</p>
        <p>Detection Time With Compression: ${data.detection_time_with_compression} seconds</p>
    `;
  captureContainer.style.display = 'none';
  resultsContainer.style.display = 'block';
  errorContainer.style.display = 'none';
  cameraContainer.style.display = 'block';
}
