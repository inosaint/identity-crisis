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
// const providerSelect = document.getElementById('providerSelect');
const generateBtn = document.getElementById('generateBtn');
const buttonText = document.getElementById('buttonText');
const spinner = document.getElementById('spinner');
const generatedImage = document.getElementById('generatedImage');
const shimmerOverlay = document.getElementById('shimmerOverlay');
const loadingText = document.getElementById('loadingText');
const toast = document.getElementById('toast');

// Toast notification
function showToast(message, duration = 3000) {
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// Update loading text with wavy animation
function updateLoadingText(text) {
  const delay = 200;

  loadingText.innerHTML = text
    .split("")
    .map(letter => {
      // Preserve spaces by using &nbsp; for space characters
      if (letter === ' ') {
        return `<span>&nbsp;</span>`;
      }
      // Add line break
      if (letter === '\n') {
        return '<br>';
      }
      return `<span>${letter}</span>`;
    })
    .join("");

  Array.from(loadingText.children).forEach((span, index) => {
    setTimeout(() => {
      span.classList.add("wavy");
    }, index * 60 + delay);
  });
}

// Update UI based on loading state
function updateUI() {
  if (state.loading) {
    generateBtn.disabled = true;
    spinner.classList.remove('hidden');
    buttonText.textContent = '';
    shimmerOverlay.classList.add('show');
    shimmerOverlay.classList.remove('hidden');
    loadingText.classList.remove('hidden');
    loadingText.classList.add('show');
    updateLoadingText('Gazing into the\nabyss...');
  } else {
    generateBtn.disabled = false;
    spinner.classList.add('hidden');
    buttonText.textContent = 'Generate';
    loadingText.classList.remove('show');
    setTimeout(() => {
      loadingText.classList.add('hidden');
    }, 300);
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
      const res = await fetch(`/api/status/${state.messageId}`);
      const job = await res.json();

      if (job.status === 'completed') {
        // Stop loading and polling
        state.loading = false;
        clearInterval(state.pollInterval);

        // Display the image
        generatedImage.src = `data:image/png;base64,${job.image}`;
        generatedImage.classList.remove('hidden');

        // Wait for image to load before showing it
        generatedImage.onload = () => {
          generatedImage.classList.add('show');
          shimmerOverlay.classList.remove('show');
          shimmerOverlay.classList.add('hidden');
        };

        updateUI();
      } else if (job.status === 'failed') {
        // Stop loading and polling
        state.loading = false;
        clearInterval(state.pollInterval);
        updateUI();
        showToast('Image generation failed. Please try again.');
      }
    } catch (error) {
      console.error('Polling error:', error);
    }
  }, 500); // Poll every 500ms
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
  const provider = 'openai'; // Always use OpenAI

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

  try {
    const response = await fetch(`/api/generate?prompt=${encodeURIComponent(prompt)}&provider=${provider}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || 'Failed to start image generation';
      throw new Error(errorMessage);
    }

    const json = await response.json();
    state.messageId = json.jobId;

    // Start polling for results
    startPolling();
  } catch (error) {
    console.error('Submission error:', error);
    state.loading = false;
    updateUI();
    showToast(error.message || 'Error generating image. Please try again.');
    stopPolling();
  }
}

// Event listeners
form.addEventListener('submit', handleSubmit);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  stopPolling();
});

// Modal functionality
const conceptButton = document.getElementById('conceptButton');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');

// Open modal
function openModal() {
  modalOverlay.classList.add('show');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close modal
function closeModal() {
  modalOverlay.classList.remove('show');
  document.body.style.overflow = ''; // Restore scrolling
}

// Event listeners for modal
conceptButton.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);

// Close modal when clicking outside the content
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('show')) {
    closeModal();
  }
});

// Initialize
console.log('🪞 Identity Crisis - Ready to find out how AI sees you?!');
