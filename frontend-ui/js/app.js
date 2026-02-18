/**
 * Main Application Orchestrator
 * Coordinates UI, API calls, uploads, and rendering
 */

// Import modules (using global scope since we're in browser)
// These will be loaded via <script> tags in HTML

/**
 * Show loading overlay
 */
function showLoading(message) {
  if (message === void 0) message = 'Running AI Analysis...';
  var overlay = document.getElementById('loading-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = '<div class="loading-spinner"></div><div class="loading-text"></div>';
    document.body.appendChild(overlay);
  }
  var textEl = overlay.querySelector('.loading-text');
  if (textEl) textEl.innerHTML = message;
  overlay.style.display = 'flex';
}

/**
 * Hide loading overlay
 */
function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
}

/**
 * Update health indicator
 */
async function updateHealthStatus() {
  const healthIndicator = document.getElementById('health-indicator');
  const healthText = document.getElementById('health-text');
  
  try {
    const result = await checkHealth();
    if (result.status === 'online') {
      healthIndicator.className = 'status-dot status-dot--online';
      healthText.textContent = 'Health: Online';
    } else {
      healthIndicator.className = 'status-dot status-dot--offline';
      healthText.textContent = `Health: Offline (${result.error})`;
    }
  } catch (error) {
    healthIndicator.className = 'status-dot status-dot--offline';
    healthText.textContent = 'Health: Error';
  }
}

/**
 * Setup panel navigation
 */
function setupNavigation() {
  const navChips = document.querySelectorAll('.nav-chip');
  navChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const panelId = chip.dataset.panel;
      
      // Update active nav chip
      navChips.forEach((c) => c.classList.remove('nav-chip--active'));
      chip.classList.add('nav-chip--active');
      
      // Show corresponding panel
      const panels = document.querySelectorAll('.panel');
      panels.forEach((p) => p.classList.remove('panel--active'));
      const targetPanel = document.getElementById(`panel-${panelId}`);
      if (targetPanel) {
        targetPanel.classList.add('panel--active');
      }
    });
  });
}

/**
 * Setup API base URL input
 */
function setupApiConfig() {
  const input = document.getElementById('api-base-input');
  const button = document.getElementById('apply-api-base');
  const status = document.getElementById('connection-status');
  
  // Load saved URL
  const savedUrl = localStorage.getItem('api_base_url');
  if (savedUrl) {
    input.value = savedUrl;
    status.textContent = 'Configured';
    status.className = 'connection-pill connected';
  }
  
  button.addEventListener('click', () => {
    const url = input.value.trim();
    if (url) {
      setApiBaseUrl(url);
      status.textContent = 'Saved';
      status.className = 'connection-pill connected';
      updateHealthStatus();
    }
  });
  
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      button.click();
    }
  });
}

/**
 * Setup change detection panel
 */
function setupChangeDetection() {
  setupFileInput('pre-image-input', 'preview-pre', 'pre-image-meta', null, 'pre-dropzone-preview');
  setupFileInput('post-image-input', 'preview-post', 'post-image-meta', null, 'post-dropzone-preview');

  var button = document.getElementById('run-change-detection');
  var preInput = document.getElementById('pre-image-input');
  var postInput = document.getElementById('post-image-input');

  button.addEventListener('click', async function () {
    try {
      hideError('change-detection-error');
      var _a = validateChangeDetectionInputs(), preFile = _a.preFile, postFile = _a.postFile;

      button.disabled = true;
      if (preInput) preInput.disabled = true;
      if (postInput) postInput.disabled = true;
      showLoading('Running Change Detection...<br>Performing AI Inference...');

      var result = await analyzeChangeDetection(preFile, postFile);
      renderChangeDetectionResults(result);
      
      // Fetch and display ChangeFormer mask and heatmap for this upload
      try {
        const maskFilename = result.mask_filename;
        if (maskFilename) {
          const maskResult = await fetchChangeFormerMask(maskFilename);
          const heatmapResult = await fetchChangeFormerHeatmap(maskFilename);
          if (maskResult.status === 'success') {
            document.getElementById('cd-mask').src = maskResult.mask;
          }
          if (heatmapResult.status === 'success') {
            document.getElementById('cd-heatmap').src = heatmapResult.heatmap;
          }
        }
      } catch (vizError) {
        console.warn('Failed to load ChangeFormer visualizations:', vizError);
      }
    } catch (error) {
      showError('change-detection-error', 'Error: ' + error.message);
      console.error('Change detection error:', error);
    } finally {
      button.disabled = false;
      if (preInput) preInput.disabled = false;
      if (postInput) postInput.disabled = false;
      hideLoading();
    }
  });
}

/**
 * Setup segmentation panel
 */
function setupSegmentation() {
  setupFileInput('seg-image-input', null, 'seg-image-meta', () => {}, 'seg-dropzone-preview');

  const button = document.getElementById('run-segmentation');
  const segInput = document.getElementById('seg-image-input');

  button.addEventListener('click', async () => {
    try {
      hideError('segmentation-error');

      const imageFile = validateSingleImageInput('seg-image-input');

      button.disabled = true;
      if (segInput) segInput.disabled = true;
      showLoading('Running AI Segmentation...<br>Processing Satellite Tile...');

      const result = await analyzeSegmentation(imageFile);

      renderSegmentationResults(result);
    } catch (error) {
      showError('segmentation-error', `Error: ${error.message}`);
      console.error('Segmentation error:', error);
    } finally {
      button.disabled = false;
      if (segInput) segInput.disabled = false;
      hideLoading();
    }
  });
}

/**
 * Setup damage estimation panel
 */
function setupDamageEstimation() {
  setupFileInput('est-image-input', null, 'est-image-meta', () => {
    // File selected
  });
  
  const button = document.getElementById('run-estimation');
  button.addEventListener('click', async () => {
    try {
      hideError('estimation-error');
      
      const imageFile = validateSingleImageInput('est-image-input');
      
      button.disabled = true;
      showLoading('Running Damage Estimation...');
      
      const result = await estimateDamage(imageFile);
      
      renderDamageEstimationResults(result);
      
    } catch (error) {
      showError('estimation-error', `Error: ${error.message}`);
      console.error('Estimation error:', error);
    } finally {
      button.disabled = false;
      hideLoading();
    }
  });
}

/**
 * Initialize application
 */
function init() {
  // Setup navigation
  setupNavigation();
  
  // Setup API configuration
  setupApiConfig();
  
  // Setup panels
  setupChangeDetection();
  setupSegmentation();
  setupDamageEstimation();
  
  // Check backend health on load
  updateHealthStatus();
  
  // Periodic health check (every 30 seconds)
  setInterval(updateHealthStatus, 30000);
  
  console.log('ResQ Sentinel UI initialized');
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
