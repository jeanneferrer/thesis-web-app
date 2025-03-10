/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("const video = document.getElementById('video');\nconst startButton = document.getElementById('startButton');\nconst stopButton = document.getElementById('stopButton');\nconst captureButton = document.getElementById('captureButton');\nconst canvas = document.getElementById('canvas');\nconst compressedImage = document.getElementById('compressedImage');\nconst metricsDiv = document.getElementById('metrics');\nconst cameraContainer = document.getElementById('camera-container');\nconst captureContainer = document.getElementById('capture-container');\nconst resultsContainer = document.getElementById('results-container');\nconst errorContainer = document.getElementById('error-container');\nconst errorMessage = document.getElementById('error-message');\n\nlet stream;\n\nstartButton.addEventListener('click', () => {\n  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {\n    navigator.mediaDevices\n      .getUserMedia({ video: true })\n      .then((mediaStream) => {\n        stream = mediaStream;\n        video.srcObject = stream;\n        video.onloadedmetadata = () => {\n          video.play();\n        };\n        stopButton.disabled = false;\n        captureButton.disabled = false;\n        startButton.disabled = true;\n        errorContainer.style.display = 'none';\n      })\n      .catch((error) => {\n        console.error('Error accessing the camera:', error);\n        errorMessage.textContent = 'Unable to access the camera. Please check permissions.';\n        errorContainer.style.display = 'block';\n      });\n  } else {\n    errorMessage.textContent = 'Camera access is not supported in this browser.';\n    errorContainer.style.display = 'block';\n  }\n});\n\nstopButton.addEventListener('click', () => {\n  if (stream) {\n    stream.getTracks().forEach((track) => track.stop());\n    video.srcObject = null;\n    stopButton.disabled = true;\n    captureButton.disabled = true;\n    startButton.disabled = false;\n  }\n});\n\ncaptureButton.addEventListener('click', () => {\n  const context = canvas.getContext('2d');\n  context.drawImage(video, 0, 0, canvas.width, canvas.height);\n  cameraContainer.style.display = 'none';\n  captureContainer.style.display = 'block';\n  resultsContainer.style.display = 'none'; // Hide results until processed.\n  sendImageToBackend(canvas.toDataURL('image/jpeg'));\n});\n\nfunction sendImageToBackend(imageDataUrl) {\n  fetch('/process_image', {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json',\n    },\n    body: JSON.stringify({ image: imageDataUrl }),\n  })\n    .then((response) => response.json())\n    .then((data) => {\n      displayResults(data);\n    })\n    .catch((error) => {\n      console.error('Error:', error);\n      errorMessage.textContent = 'Error processing image.';\n      errorContainer.style.display = 'block';\n      cameraContainer.style.display = 'block'; // Show camera again on error\n      captureContainer.style.display = 'none';\n    });\n}\n\nfunction displayResults(data) {\n  compressedImage.src = data.compressed_image;\n  metricsDiv.innerHTML = `\n        <p>Compression Ratio: ${data.compression_ratio}</p>\n        <p>PSNR: ${data.psnr}</p>\n        <p>SSIM: ${data.ssim}</p>\n        <p>Memory Usage: ${data.memory_usage} MB</p>\n        <p>Detection Time Without Compression: ${data.detection_time_without_compression} seconds</p>\n        <p>Compression Time: ${data.compression_time} seconds</p>\n        <p>Detection Time With Compression: ${data.detection_time_with_compression} seconds</p>\n    `;\n  captureContainer.style.display = 'none';\n  resultsContainer.style.display = 'block';\n  errorContainer.style.display = 'none';\n  cameraContainer.style.display = 'block';\n}\n\n\n//# sourceURL=webpack://test/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;