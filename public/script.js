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
const imageContainer = document.getElementById('imageContainer');
const ratingContainer = document.getElementById('ratingContainer');
const thumbsUpBtn = document.getElementById('thumbsUpBtn');
const thumbsDownBtn = document.getElementById('thumbsDownBtn');

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
    promptInput.disabled = true;
    spinner.classList.remove('hidden');
    buttonText.textContent = '';
    shimmerOverlay.classList.add('show');
    shimmerOverlay.classList.remove('hidden');
    loadingText.classList.remove('hidden');
    loadingText.classList.add('show');
    updateLoadingText('Gazing into the\nabyss...');
    // Hide rating section during loading
    ratingContainer.classList.remove('show');
    ratingContainer.classList.add('hidden');
  } else {
    generateBtn.disabled = false;
    promptInput.disabled = false;
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
          // Stop mirror shimmer animation
          imageContainer.classList.add('image-loaded');
          // Show rating section
          ratingContainer.classList.remove('hidden');
          ratingContainer.classList.add('show');
          // Reset rating buttons
          thumbsUpBtn.classList.remove('selected');
          thumbsDownBtn.classList.remove('selected');
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
  // Reset shimmer animation
  imageContainer.classList.remove('image-loaded');

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

// Handle rating submission
async function submitRating(rating) {
  if (!state.messageId) {
    return;
  }

  try {
    const response = await fetch('/api/rate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobId: state.messageId,
        rating: rating
      })
    });

    if (response.ok) {
      showToast(`Thanks for your feedback!`, 2000);
    }
  } catch (error) {
    console.error('Rating error:', error);
  }
}

// Event listeners
form.addEventListener('submit', handleSubmit);

thumbsUpBtn.addEventListener('click', () => {
  thumbsUpBtn.classList.add('selected');
  thumbsDownBtn.classList.remove('selected');
  submitRating('positive');
});

thumbsDownBtn.addEventListener('click', () => {
  thumbsDownBtn.classList.add('selected');
  thumbsUpBtn.classList.remove('selected');
  submitRating('negative');
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  stopPolling();
});

// Initialize
console.log('🪞 Identity Crisis - Ready to find out how AI sees you?!');
