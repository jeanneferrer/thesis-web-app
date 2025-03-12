import './styles.css';

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
      .getUserMedia({ video: { facingMode: "environment" } }) // Force rear camera
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
        showError('Unable to access the camera. Please check permissions.');
      });
  } else {
    showError('Camera access is not supported in this browser.');
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

  canvas.toBlob((blob) => {
    if (!blob) {
      showError('Failed to capture image.');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result.split(',')[1]; // Extract Base64
      sendImageToBackend(base64data);
    };
  }, 'image/jpeg');
});

function sendImageToBackend(base64data) {
  if (!base64data) {
    showError('Error: No Base64 data generated.');
    return;
  }

  const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:5000";

  fetch(`${backendUrl}/process_image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64data }) 
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      throw new Error(data.error);
    }
    displayResults(data);
  })
  .catch(error => {
    console.error('Error sending image:', error);
    showError('Error processing image. Ensure the backend is running.');
  });
}

function displayResults(data) {
  if (!data.compressed_image) {
    showError('No processed image received.');
    return;
  }

  compressedImage.src = data.compressed_image;
  metricsDiv.innerHTML = `
      <p>Compression Ratio: ${data.compression_ratio || 'N/A'}</p>
      <p>PSNR: ${data.psnr || 'N/A'}</p>
      <p>SSIM: ${data.ssim || 'N/A'}</p>
      <p>Memory Usage: ${data.memory_usage || 'N/A'} MB</p>
      <p>Detection Time Without Compression: ${data.detection_time_without_compression || 'N/A'} sec</p>
      <p>Compression Time: ${data.compression_time || 'N/A'} sec</p>
      <p>Detection Time With Compression: ${data.detection_time_with_compression || 'N/A'} sec</p>
  `;

  captureContainer.style.display = 'none';
  resultsContainer.style.display = 'block';
  errorContainer.style.display = 'none';
}

function showError(message) {
  errorMessage.textContent = message;
  errorContainer.style.display = 'block';
}
