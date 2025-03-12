from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
import cv2
import numpy as np
import torch
import psutil
from PIL import Image
from skimage.metrics import peak_signal_noise_ratio as psnr, structural_similarity as ssim
import time
import os

app = Flask(__name__)
CORS(app)

# Load MobileNet-SSD model
if not os.path.exists("deploy.prototxt"):
    os.system("wget https://github.com/chuanqi305/MobileNet-SSD/raw/master/deploy.prototxt")
if not os.path.exists("mobilenet_iter_73000.caffemodel"):
    os.system("wget https://github.com/chuanqi305/MobileNet-SSD/raw/master/mobilenet_iter_73000.caffemodel")

net = cv2.dnn.readNetFromCaffe("deploy.prototxt", "mobilenet_iter_73000.caffemodel")

# Define class labels
CLASSES = ["background", "person", "bicycle", "car", "motorcycle", "bus", "truck", "traffic light", "fire hydrant", "stop sign"]

def detect_objects(image):
    (h, w) = image.shape[:2]
    blob = cv2.dnn.blobFromImage(cv2.resize(image, (300, 300)), 0.007843, (300, 300), 127.5)
    net.setInput(blob)
    detections = net.forward()
    
    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > 0.2:
            idx = int(detections[0, 0, i, 1])
            label = CLASSES[idx] if 0 <= idx < len(CLASSES) else "Unknown"
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (startX, startY, endX, endY) = box.astype("int")
            cv2.rectangle(image, (startX, startY), (endX, endY), (0, 255, 0), 2)
            text = f"{label}: {confidence:.2f}"
            y = startY - 10 if startY - 10 > 10 else startY + 10
            cv2.putText(image, text, (startX, y), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
    return image

@app.route('/')
def home():
    return "Flask server is running!"

@app.route('/process_image', methods=['POST'])
def process_image():
    data = request.json
    if not data or 'image' not in data:
        return jsonify({"error": "Invalid request, no image data found"}), 400
    
    try:
        image_data = base64.b64decode(data['image'])
        image = Image.open(io.BytesIO(image_data))
        image = np.array(image)
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        original_size = len(image_data) / 1024  # KB

        start_time = time.perf_counter()
        detected_image = detect_objects(image.copy())
        detection_time_without_compression = time.perf_counter() - start_time

        resized_image = cv2.resize(image, (640, 480))
        compressed_path = "compressed_image.jpg"
        start_time = time.perf_counter()
        cv2.imwrite(compressed_path, resized_image, [cv2.IMWRITE_JPEG_QUALITY, 50])
        compression_time = time.perf_counter() - start_time
        
        compressed_image = cv2.imread(compressed_path)
        compressed_size = os.path.getsize(compressed_path) / 1024
        compression_ratio = original_size / compressed_size

        start_time = time.perf_counter()
        detected_compressed_image = detect_objects(compressed_image.copy())
        detection_time_with_compression = time.perf_counter() - start_time

        psnr_value = psnr(image, cv2.resize(compressed_image, (image.shape[1], image.shape[0])), data_range=image.max() - image.min())
        ssim_value = ssim(image, cv2.resize(compressed_image, (image.shape[1], image.shape[0])), channel_axis=2, data_range=image.max() - image.min())
        
        memory_usage = psutil.Process().memory_info().rss / 1024 / 1024

        _, buffer = cv2.imencode(".jpg", detected_compressed_image)
        compressed_base64 = base64.b64encode(buffer).decode("utf-8")

        response_data = {
            "compressed_image": f"data:image/jpeg;base64,{compressed_base64}",
            "compression_ratio": compression_ratio,
            "psnr": psnr_value,
            "ssim": ssim_value,
            "memory_usage": memory_usage,
            "detection_time_without_compression": detection_time_without_compression,
            "compression_time": compression_time,
            "detection_time_with_compression": detection_time_with_compression
        }

        return jsonify(response_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))  # Use Render's assigned port
    app.run(host="0.0.0.0", port=port)
