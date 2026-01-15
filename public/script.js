// State management
let state = {
  prompt: '',
  loading: false,
  messageId: '',
  image: null,
  pollInterval: null
};

// DOM elements
const form = document.getElementById('promptForm');
const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const buttonText = document.getElementById('buttonText');
const spinner = document.getElementById('spinner');
const generatedImage = document.getElementById('generatedImage');
const shimmerOverlay = document.getElementById('shimmerOverlay');
const toast = document.getElementById('toast');

// Toast notification
function showToast(message, duration = 3000) {
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// Update UI based on loading state
function updateUI() {
  if (state.loading) {
    generateBtn.disabled = true;
    spinner.classList.remove('hidden');
    buttonText.textContent = '';
    shimmerOverlay.classList.add('show');
    shimmerOverlay.classList.remove('hidden');
  } else {
    generateBtn.disabled = false;
    spinner.classList.add('hidden');
    buttonText.textContent = 'Generate';
  }
}

// Start polling for results
function startPolling() {
  if (state.pollInterval) {
    clearInterval(state.pollInterval);
  }

  state.pollInterval = setInterval(async () => {
    if (!state.messageId || !state.loading) {
      clearInterval(state.pollInterval);
      return;
    }

    try {
      const res = await fetch(`/api/poll?id=${state.messageId}`);

      if (res.status === 200) {
        const json = await res.json();

        // Stop loading and polling
        state.loading = false;
        clearInterval(state.pollInterval);

        // Parse the response and extract the base64 image
        const data = typeof json === 'string' ? JSON.parse(json) : json;
        const base64Image = data.data[0].b64_json;

        // Display the image
        generatedImage.src = `data:image/png;base64,${base64Image}`;
        generatedImage.classList.remove('hidden');

        // Wait for image to load before showing it
        generatedImage.onload = () => {
          generatedImage.classList.add('show');
          shimmerOverlay.classList.remove('show');
          shimmerOverlay.classList.add('hidden');
        };

        updateUI();
        showToast('Image generated successfully!');
      }
    } catch (error) {
      console.error('Polling error:', error);
    }
  }, 1000); // Poll every second
}

// Stop polling
function stopPolling() {
  if (state.pollInterval) {
    clearInterval(state.pollInterval);
    state.pollInterval = null;
  }
}

// Handle form submission
async function handleSubmit(e) {
  e.preventDefault();

  const prompt = promptInput.value.trim();
  if (!prompt) {
    showToast('Please enter a prompt');
    return;
  }

  state.prompt = prompt;
  state.loading = true;
  state.image = null;

  // Reset image display
  generatedImage.classList.remove('show');
  generatedImage.classList.add('hidden');

  updateUI();
  showToast('Generating your image...', 5000);

  try {
    const response = await fetch(`/api/image?prompt=${encodeURIComponent(prompt)}`);

    if (!response.ok) {
      throw new Error('Failed to start image generation');
    }

    const json = await response.json();
    state.messageId = json.id;

    // Start polling for results
    startPolling();
  } catch (error) {
    console.error('Submission error:', error);
    state.loading = false;
    updateUI();
    showToast('Error generating image. Please try again.');
    stopPolling();
  }
}

// Event listeners
form.addEventListener('submit', handleSubmit);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  stopPolling();
});

// Initialize
console.log('🪞 Identity Crisis - Ready to generate your AI identity!');
