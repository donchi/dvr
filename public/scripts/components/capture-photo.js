export function initializeWebcamCapture() {
  // DOM Elements
  const webcamElement = document.getElementById('webcam');
  const canvasElement = document.getElementById('canvas');
  const photoPreview = document.getElementById('photo-preview');
  const captureBtn = document.getElementById('capture-btn');
  const retakeBtn = document.getElementById('retake-btn');
  const submitBtn = document.getElementById('submit-btn');
  const photoDataInput = document.getElementById('photo-file');
  const errorContainer = document.querySelector('#new-visitor-step5 .error-list');

  let stream = null;
  let isWebcamActive = false;

  // Initialize webcam when step 4 becomes visible
  function setupWebcamObserver() {
    const step5Element = document.getElementById('new-visitor-step5');
    if (!step5Element) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'style' && 
            step5Element.style.display === 'block') {
          startWebcam();
        } else if (mutation.attributeName === 'style' && 
                  step5Element.style.display === 'none' && 
                  isWebcamActive) {
          stopWebcam();
        }
      });
    });

    observer.observe(step5Element, {
      attributes: true,
      attributeFilter: ['style']
    });
  }

  // Start webcam stream
  async function startWebcam() {
    if (isWebcamActive) return;

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });

      webcamElement.srcObject = stream;
      webcamElement.style.display = 'block';
      photoPreview.style.display = 'none';
      captureBtn.disabled = false;
      isWebcamActive = true;

      // Handle when stream ends unexpectedly
      stream.getVideoTracks()[0].onended = () => {
        showError("Webcam disconnected. Please refresh the page.");
        stopWebcam();
      };

    } catch (err) {
      console.error("Webcam access error:", err);
      showError("Could not access webcam. Please ensure camera permissions are granted.");
    }
  }

  // Stop webcam stream
  function stopWebcam() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      webcamElement.srcObject = null;
      isWebcamActive = false;
    }
  }

  // Capture photo from webcam
  function capturePhoto() {
    if (!isWebcamActive) return;

    canvasElement.width = webcamElement.videoWidth;
    canvasElement.height = webcamElement.videoHeight;
    
    const context = canvasElement.getContext('2d');
    context.drawImage(webcamElement, 0, 0, canvasElement.width, canvasElement.height);
    
    // Convert canvas to Blob instead of data URL
    canvasElement.toBlob((blob) => {
      // Specify the filename with .jpg extension
      const filename = 'visitor-photo-' + Date.now() + '.jpg';
      const file = new File([blob], filename, { type: 'image/jpeg' });

      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(blob.type)) {
        showError("Only JPG or PNG images are supported");
        return;
      }
      
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      // Find or create the file input element
      const fileInput = document.getElementById('photo-file');
      fileInput.files = dataTransfer.files;
      

      if (!fileInput) {
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'photo-file';
        fileInput.name = 'photo';
        fileInput.style.display = 'none';
        document.getElementById('step5-form').appendChild(fileInput);
      }
      
      // Update UI
      photoPreview.src = URL.createObjectURL(file);
      photoPreview.style.display = 'block';
      webcamElement.style.display = 'none';
      captureBtn.style.display = 'none';
      retakeBtn.style.display = 'inline-block';
      submitBtn.disabled = false;
      
      stopWebcam();
    }, 'image/jpeg', 0.8);
  }
  // Reset for retaking photo
  function retakePhoto() {
    photoPreview.style.display = 'none';
    captureBtn.style.display = 'inline-block';
    retakeBtn.style.display = 'none';
    submitBtn.disabled = true;
    startWebcam();
  }

  // Display error messages
  function showError(message) {
    if (errorContainer) {
      errorContainer.innerHTML = `<div class="error">${message}</div>`;
    }
  }

  // Event listeners
  function setupEventListeners() {
    if (captureBtn) captureBtn.addEventListener('click', capturePhoto);
    if (retakeBtn) retakeBtn.addEventListener('click', retakePhoto);
    //if (submitBtn) submitBtn.addEventListener('submit', checkIn);
    
    // Clean up on page unload
    window.addEventListener('beforeunload', stopWebcam);
  }

  // Initialize everything
  function init() {
    setupEventListeners();
    setupWebcamObserver();
  }

  // Start the module
  init();

  // Return functions for external control if needed
  return {
    capturePhoto,
    retakePhoto,
    startWebcam,
    stopWebcam
  };
}