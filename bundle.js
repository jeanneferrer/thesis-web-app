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

eval("const video = document.getElementById('video');\nconst startButton = document.getElementById('startButton');\nconst stopButton = document.getElementById('stopButton');\nconst captureButton = document.getElementById('captureButton');\nconst canvas = document.getElementById('canvas');\nconst compressedImage = document.getElementById('compressedImage');\nconst metricsDiv = document.getElementById('metrics');\nconst cameraContainer = document.getElementById('camera-container');\nconst captureContainer = document.getElementById('capture-container');\nconst resultsContainer = document.getElementById('results-container');\nconst errorContainer = document.getElementById('error-container');\nconst errorMessage = document.getElementById('error-message');\n\nlet stream;\n\nstartButton.addEventListener('click', () => {\n  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {\n    navigator.mediaDevices\n      .getUserMedia({ video: true })\n      .then((mediaStream) => {\n        stream = mediaStream;\n        video.srcObject = stream;\n        video.onloadedmetadata = () => {\n          video.play();\n        };\n        stopButton.disabled = false;\n        captureButton.disabled = false;\n        startButton.disabled = true;\n        errorContainer.style.display = 'none';\n      })\n      .catch((error) => {\n        console.error('Error accessing the camera:', error);\n        showError('Unable to access the camera. Please check permissions.');\n      });\n  } else {\n    showError('Camera access is not supported in this browser.');\n  }\n});\n\nstopButton.addEventListener('click', () => {\n  if (stream) {\n    stream.getTracks().forEach((track) => track.stop());\n    video.srcObject = null;\n    stopButton.disabled = true;\n    captureButton.disabled = true;\n    startButton.disabled = false;\n  }\n});\n\ncaptureButton.addEventListener('click', () => {\n  const context = canvas.getContext('2d');\n  context.drawImage(video, 0, 0, canvas.width, canvas.height);\n\n  canvas.toBlob((blob) => {\n    if (!blob) {\n      showError('Failed to capture image.');\n      return;\n    }\n\n    const reader = new FileReader();\n    reader.readAsDataURL(blob);\n    reader.onloadend = () => {\n      const base64data = reader.result.split(',')[1]; // Extract Base64\n      sendImageToBackend(base64data);\n    };\n  }, 'image/jpeg');\n});\n\nfunction sendImageToBackend(base64data) {\n  if (!base64data) {\n    showError('Error: No Base64 data generated.');\n    return;\n  }\n\n  fetch('http://127.0.0.1:5000/process_image', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ image: base64data }) \n  })\n  .then(response => response.json())\n  .then(data => {\n    if (data.error) {\n      throw new Error(data.error);\n    }\n    displayResults(data);\n  })\n  .catch(error => {\n    console.error('Error sending image:', error);\n    showError('Error processing image. Ensure the backend is running.');\n  });\n}\n\nfunction displayResults(data) {\n  if (!data.compressed_image) {\n    showError('No processed image received.');\n    return;\n  }\n\n  compressedImage.src = data.compressed_image;\n  metricsDiv.innerHTML = `\n      <p>Compression Ratio: ${data.compression_ratio || 'N/A'}</p>\n      <p>PSNR: ${data.psnr || 'N/A'}</p>\n      <p>SSIM: ${data.ssim || 'N/A'}</p>\n      <p>Memory Usage: ${data.memory_usage || 'N/A'} MB</p>\n      <p>Detection Time Without Compression: ${data.detection_time_without_compression || 'N/A'} sec</p>\n      <p>Compression Time: ${data.compression_time || 'N/A'} sec</p>\n      <p>Detection Time With Compression: ${data.detection_time_with_compression || 'N/A'} sec</p>\n  `;\n\n  captureContainer.style.display = 'none';\n  resultsContainer.style.display = 'block';\n  errorContainer.style.display = 'none';\n}\n\nfunction showError(message) {\n  errorMessage.textContent = message;\n  errorContainer.style.display = 'block';\n}\n\n\n//# sourceURL=webpack://test/./src/index.js?");

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