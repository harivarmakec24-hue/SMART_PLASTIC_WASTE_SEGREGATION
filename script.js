/**
 * Smart Plastic & Waste Segregation System - Frontend JavaScript Engine
 * Handles Camera API streaming, canvas capturing, file upload validation,
 * Fetch API communication, low confidence warning handling, and dynamic stats updating.
 */

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initFileUpload();
    initCameraStudio();
    loadDashboardStats();
    renderResultPageIfAvailable();
});

// Toast Notification Manager
function showToast(message, type = 'error') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-check';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4500);
}

// Tab Switching
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            const targetPane = document.getElementById(target);
            if (targetPane) targetPane.classList.add('active');
            
            if (target !== 'camera-tab' && window.webcamStream) {
                stopCameraStream();
            }
        });
    });
}

// Drag & Drop File Upload Engine
let selectedUploadFile = null;

function initFileUpload() {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const previewWrapper = document.getElementById('previewWrapper');
    const imagePreview = document.getElementById('imagePreview');
    const clearBtn = document.getElementById('clearPreviewBtn');
    const analyzeBtn = document.getElementById('analyzeUploadBtn');

    if (!dropzone || !fileInput) return;

    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelection(e.target.files[0]);
        }
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            resetFileUpload();
        });
    }

    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', () => {
            if (!selectedUploadFile) {
                showToast("Please select or drop an image file first.");
                return;
            }
            sendImageForClassification(selectedUploadFile, 'file');
        });
    }
}

function handleFileSelection(file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];
    if (!validTypes.includes(file.type)) {
        showToast("Invalid file type. Please upload a valid image (JPG, PNG, WEBP).");
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
        showToast("File size exceeds 10MB limit. Please choose a smaller image.");
        return;
    }

    selectedUploadFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
        const imagePreview = document.getElementById('imagePreview');
        const previewWrapper = document.getElementById('previewWrapper');
        const dropzone = document.getElementById('dropzone');
        const analyzeBtn = document.getElementById('analyzeUploadBtn');

        if (imagePreview && previewWrapper) {
            imagePreview.src = e.target.result;
            previewWrapper.style.display = 'block';
            if (dropzone) dropzone.style.display = 'none';
            if (analyzeBtn) analyzeBtn.disabled = false;
        }
    };
    reader.readAsDataURL(file);
}

function resetFileUpload() {
    selectedUploadFile = null;
    const fileInput = document.getElementById('fileInput');
    const previewWrapper = document.getElementById('previewWrapper');
    const dropzone = document.getElementById('dropzone');
    const analyzeBtn = document.getElementById('analyzeUploadBtn');

    if (fileInput) fileInput.value = '';
    if (previewWrapper) previewWrapper.style.display = 'none';
    if (dropzone) dropzone.style.display = 'block';
    if (analyzeBtn) analyzeBtn.disabled = true;
}

// Live Camera Studio Engine
window.webcamStream = null;
let currentFacingMode = 'environment';

function initCameraStudio() {
    const startCamBtn = document.getElementById('startCamBtn');
    const stopCamBtn = document.getElementById('stopCamBtn');
    const flipCamBtn = document.getElementById('flipCamBtn');
    const captureBtn = document.getElementById('captureCamBtn');

    if (startCamBtn) startCamBtn.addEventListener('click', startCameraStream);
    if (stopCamBtn) stopCamBtn.addEventListener('click', stopCameraStream);
    if (flipCamBtn) {
        flipCamBtn.addEventListener('click', () => {
            currentFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
            if (window.webcamStream) {
                stopCameraStream();
                startCameraStream();
            }
        });
    }
    if (captureBtn) captureBtn.addEventListener('click', captureCameraImage);
}

async function startCameraStream() {
    const video = document.getElementById('videoFeed');
    const placeholder = document.getElementById('cameraPlaceholder');
    const startBtn = document.getElementById('startCamBtn');
    const stopBtn = document.getElementById('stopCamBtn');
    const captureBtn = document.getElementById('captureCamBtn');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showToast("Webcam API is not supported by your browser.");
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: currentFacingMode, width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        
        window.webcamStream = stream;
        if (video) {
            video.srcObject = stream;
            video.style.display = 'block';
            await video.play();
        }
        if (placeholder) placeholder.style.display = 'none';

        if (startBtn) startBtn.style.display = 'none';
        if (stopBtn) stopBtn.style.display = 'inline-flex';
        if (captureBtn) captureBtn.disabled = false;
        showToast("Camera started successfully.", "success");
    } catch (err) {
        console.error("Camera access error:", err);
        showToast("Unable to access camera. Please check camera permissions in browser settings.");
    }
}

function stopCameraStream() {
    if (window.webcamStream) {
        window.webcamStream.getTracks().forEach(track => track.stop());
        window.webcamStream = null;
    }

    const video = document.getElementById('videoFeed');
    const placeholder = document.getElementById('cameraPlaceholder');
    const startBtn = document.getElementById('startCamBtn');
    const stopBtn = document.getElementById('stopCamBtn');
    const captureBtn = document.getElementById('captureCamBtn');

    if (video) video.style.display = 'none';
    if (placeholder) placeholder.style.display = 'flex';
    if (startBtn) startBtn.style.display = 'inline-flex';
    if (stopBtn) stopBtn.style.display = 'none';
    if (captureBtn) captureBtn.disabled = true;
}

function captureCameraImage() {
    const video = document.getElementById('videoFeed');
    const canvas = document.getElementById('capturedCanvas');

    if (!video || !window.webcamStream) {
        showToast("Camera stream is not active.");
        return;
    }

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Image = canvas.toDataURL('image/jpeg', 0.92);
    sendImageForClassification(base64Image, 'base64');
}

// Send Image to Flask Backend
async function sendImageForClassification(imagePayload, type = 'file') {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) loadingOverlay.style.display = 'flex';

    try {
        let response;

        if (type === 'file') {
            const formData = new FormData();
            formData.append('file', imagePayload);
            response = await fetch('/predict', {
                method: 'POST',
                body: formData
            });
        } else {
            response = await fetch('/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image_base64: imagePayload })
            });
        }

        const data = await response.json();

        if (!response.ok || data.error) {
            throw new Error(data.error || "Unable to identify the waste. Please upload a clearer image.");
        }

        // Save prediction response in sessionStorage & navigate to result view
        sessionStorage.setItem('last_waste_result', JSON.stringify(data));
        window.location.href = '/result';

    } catch (err) {
        console.error("Classification error:", err);
        showToast(err.message || "Waste type could not be identified confidently. Please upload a clearer image.");
    } finally {
        if (loadingOverlay) loadingOverlay.style.display = 'none';
    }
}

// Render Result View (on result.html)
function renderResultPageIfAvailable() {
    const resultBox = document.getElementById('resultContainer');
    if (!resultBox) return;

    const savedData = sessionStorage.getItem('last_waste_result');
    if (!savedData) {
        window.location.href = '/detection';
        return;
    }

    const data = JSON.parse(savedData);

    const resultImage = document.getElementById('resultImage');
    const detectedType = document.getElementById('detectedType');
    const categoryBadge = document.getElementById('categoryBadge');
    const confidenceText = document.getElementById('confidenceText');
    const confidenceFill = document.getElementById('confidenceFill');
    const binTitle = document.getElementById('binTitle');
    const binInstruction = document.getElementById('binInstruction');
    const decompTime = document.getElementById('decompTime');

    if (resultImage) resultImage.src = data.image_url;
    if (detectedType) detectedType.textContent = data.waste_type;
    
    if (categoryBadge) {
        categoryBadge.textContent = data.category || data.waste_type;
        categoryBadge.style.backgroundColor = data.badge_bg || '#dbeafe';
        categoryBadge.style.color = data.badge_text || '#1e40af';
    }

    if (confidenceText) confidenceText.textContent = `${data.confidence}%`;
    if (confidenceFill) {
        setTimeout(() => {
            confidenceFill.style.width = `${data.confidence}%`;
        }, 150);
    }

    if (binTitle) binTitle.textContent = data.bin;
    if (binInstruction) binInstruction.textContent = data.instructions;
    if (decompTime) decompTime.textContent = data.decomposition || 'N/A';
}

// Dynamic Dashboard Stats Loader
async function loadDashboardStats() {
    const totalElem = document.getElementById('statTotalAnalyzed');
    if (!totalElem) return;

    try {
        const res = await fetch('/stats');
        const data = await res.json();

        animateCounter('statTotalAnalyzed', data.total_analyzed || 0);
        
        const cats = data.categories || {};
        animateCounter('statPlastic', cats.plastic || 0);
        animateCounter('statPaper', cats.paper || 0);
        animateCounter('statCardboard', cats.cardboard || 0);
        animateCounter('statGlass', cats.glass || 0);
        animateCounter('statMetal', cats.metal || 0);
        animateCounter('statOrganic', cats.organic || 0);

    } catch (err) {
        console.warn("Could not load stats API.");
    }
}

function animateCounter(id, target) {
    const elem = document.getElementById(id);
    if (!elem) return;
    
    let current = 0;
    const step = Math.max(1, Math.floor(target / 25));
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            elem.textContent = target;
            clearInterval(timer);
        } else {
            elem.textContent = current;
        }
    }, 30);
}
