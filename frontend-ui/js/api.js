/**
 * API Connector - Communicates with FastAPI Backend
 * NO mock data - all responses come from backend
 */

const API_BASE_URL = localStorage.getItem('api_base_url') || 'http://localhost:8000';

/**
 * Set API base URL and persist to localStorage
 */
function setApiBaseUrl(url) {
  localStorage.setItem('api_base_url', url);
  return url;
}

/**
 * Get API base URL
 */
function getApiBaseUrl() {
  return localStorage.getItem('api_base_url') || 'http://localhost:8000';
}

/**
 * Check backend health
 */
async function checkHealth() {
  try {
    const response = await fetch(`${getApiBaseUrl()}/health`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return { status: 'online', data };
  } catch (error) {
    return { status: 'offline', error: error.message };
  }
}

/**
 * Change Detection Analysis
 * POST /analyze/change-detection
 * 
 * @param {File} preImage - Pre-disaster satellite image
 * @param {File} postImage - Post-disaster satellite image
 * @returns {Promise<Object>} Backend response with damage metrics and mask
 */
async function analyzeChangeDetection(preImage, postImage) {
  if (!preImage || !postImage) {
    throw new Error('Both pre and post images are required');
  }

  const formData = new FormData();
  formData.append('pre_image', preImage);
  formData.append('post_image', postImage);

  const response = await fetch(`${getApiBaseUrl()}/analyze/change-detection`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Single Image Segmentation
 * POST /analyze/segmentation
 * 
 * @param {File} image - Satellite image
 * @returns {Promise<Object>} Backend response with segmentation metrics
 */
async function analyzeSegmentation(image) {
  if (!image) {
    throw new Error('Image is required');
  }

  const formData = new FormData();
  formData.append('image', image);

  const response = await fetch(`${getApiBaseUrl()}/analyze/segmentation`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Comprehensive Damage Estimation
 * POST /analyze/damage-estimation
 * 
 * @param {File} image - Satellite image
 * @returns {Promise<Object>} Backend response with damage assessment
 */
async function estimateDamage(image) {
  if (!image) {
    throw new Error('Image is required');
  }

  const formData = new FormData();
  formData.append('image', image);

  const response = await fetch(`${getApiBaseUrl()}/analyze/damage-estimation`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Fetch ChangeFormer Mask
 * GET /visualize/changeformer/mask
 * 
 * @returns {Promise<Object>} Backend response with mask image
 */
async function fetchChangeFormerMask(filename) {
  let url = `${getApiBaseUrl()}/visualize/changeformer/mask`;
  if (filename) url += `?filename=${encodeURIComponent(filename)}`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  const data = await response.json();
  return data;
}

/**
 * Fetch ChangeFormer Heatmap
 * GET /visualize/changeformer/heatmap
 * 
 * @returns {Promise<Object>} Backend response with heatmap image
 */
async function fetchChangeFormerHeatmap(filename) {
  let url = `${getApiBaseUrl()}/visualize/changeformer/heatmap`;
  if (filename) url += `?filename=${encodeURIComponent(filename)}`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  const data = await response.json();
  return data;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    setApiBaseUrl,
    getApiBaseUrl,
    checkHealth,
    analyzeChangeDetection,
    analyzeSegmentation,
    estimateDamage,
    fetchChangeFormerMask,
    fetchChangeFormerHeatmap,
  };
}
