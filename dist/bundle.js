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

eval("const video = document.getElementById('video');\nconst startButton = document.getElementById('startButton');\nconst stopButton = document.getElementById('stopButton');\n\nlet stream; // Variable to store the camera stream\n\n// Start the camera\nstartButton.addEventListener('click', () => {\n  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {\n    navigator.mediaDevices\n      .getUserMedia({ video: true })\n      .then((mediaStream) => {\n        stream = mediaStream; // Store the stream\n        video.srcObject = stream; // Display the stream in the video element\n        video.onloadedmetadata = () => {\n          video.play();\n        };\n        stopButton.disabled = false; // Enable the \"Stop Camera\" button\n        startButton.disabled = true; // Disable the \"Start Camera\" button\n      })\n      .catch((error) => {\n        console.error('Error accessing the camera:', error);\n        alert('Unable to access the camera. Please check permissions.');\n      });\n  } else {\n    alert('Camera access is not supported in this browser.');\n  }\n});\n\n// Stop the camera\nstopButton.addEventListener('click', () => {\n  if (stream) {\n    // Stop all tracks in the stream\n    stream.getTracks().forEach((track) => track.stop());\n    video.srcObject = null; // Clear the video source\n    stopButton.disabled = true; // Disable the \"Stop Camera\" button\n    startButton.disabled = false; // Enable the \"Start Camera\" button\n  }\n});\n\n\n//# sourceURL=webpack://test/./src/index.js?");

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