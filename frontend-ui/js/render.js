/**
 * Result Renderer - Displays backend-provided data
 * NO client-side calculations - only renders what backend returns
 */

/**
 * Render change detection results in the Result Panel (AI Output section).
 * Displays ONLY backend-provided values; no client-side calculation.
 */
function renderChangeDetectionResults(data) {
  if (data.status === 'error') {
    throw new Error(data.error || 'Analysis failed');
  }

  var analysis = data.analysis || {};
  var model = data.model != null ? data.model : analysis.model;
  var changeDetected = data.change_detected != null ? data.change_detected : (analysis.change_detected != null ? analysis.change_detected : (data.damage_percentage != null ? data.damage_percentage : analysis.damage_percentage));
  var damagePercentage = data.damage_percentage != null ? data.damage_percentage : (analysis.damage_percentage != null ? analysis.damage_percentage : changeDetected);
  var confidence = data.confidence != null ? data.confidence : analysis.confidence;
  var status = data.status === 'success' ? 'COMPLETED' : (analysis.status != null ? analysis.status : (data.status != null ? String(data.status).toUpperCase() : '–'));
  var maskData = data.mask_map != null ? data.mask_map : analysis.mask_data;

  setText('cd-damage', formatPercentage(damagePercentage));
  setText('cd-change', formatPercentage(changeDetected));
  setText('cd-confidence', formatConfidence(confidence));
  setText('cd-model', model != null ? String(model) : '–');
  setText('cd-status', status);

  var maskImg = document.getElementById('cd-mask');
  if (maskImg) {
    if (maskData) {
      maskImg.src = maskData;
      maskImg.style.display = 'block';
    } else {
      maskImg.src = '';
      maskImg.style.display = 'none';
    }
  }

  var prePreview = document.getElementById('preview-pre');
  var postPreview = document.getElementById('preview-post');
  if (prePreview && prePreview.src && prePreview.src.length > 0) prePreview.style.display = 'block';
  if (postPreview && postPreview.src && postPreview.src.length > 0) postPreview.style.display = 'block';
}

function setText(id, text) {
  var el = document.getElementById(id);
  if (el) el.textContent = text;
}

/**
 * Render segmentation results
 * @param {Object} data - Backend response from /analyze/segmentation
 */
function renderSegmentationResults(data) {
  if (data.status === 'error' || !data.metrics) {
    throw new Error(data.error || 'Segmentation failed');
  }

  const metrics = data.metrics;
  
  // Render metrics from backend
  document.getElementById('seg-total').textContent = formatPercentage(metrics.total_damage_percentage);
  document.getElementById('seg-buildings').textContent = formatPercentage(metrics.building_damage_percentage);
  document.getElementById('seg-infra').textContent = formatPercentage(metrics.infrastructure_damage_percentage);
  document.getElementById('seg-debris').textContent = formatPercentage(metrics.debris_coverage_percentage);
  document.getElementById('seg-severity').textContent = metrics.severity_level || '–';
  document.getElementById('seg-confidence').textContent = formatConfidence(metrics.confidence_score);
  document.getElementById('seg-message').textContent = metrics.estimate_message || '–';

  // Render visualization
  const visualImg = document.getElementById('seg-visual');
  if (data.visualization && visualImg) {
    visualImg.src = data.visualization;
    visualImg.style.display = 'block';
  }
}

/**
 * Render damage estimation results
 * @param {Object} data - Backend response from /analyze/damage-estimation
 */
function renderDamageEstimationResults(data) {
  if (data.status === 'error') {
    throw new Error(data.error || 'Estimation failed');
  }

  const assessment = data.damage_assessment || {};
  const zones = data.zone_analysis || {};

  // Render assessment metrics
  document.getElementById('est-total').textContent = formatPercentage(assessment.total_damage);
  document.getElementById('est-buildings').textContent = formatPercentage(assessment.building_damage);
  document.getElementById('est-infra').textContent = formatPercentage(assessment.infrastructure_damage);
  document.getElementById('est-debris').textContent = formatPercentage(assessment.debris_coverage);
  document.getElementById('est-severity').textContent = assessment.severity || '–';
  document.getElementById('est-confidence').textContent = formatConfidence(assessment.confidence);
  
  // Render zone analysis
  document.getElementById('est-damaged-zones').textContent = zones.damaged_zones ?? '–';
  document.getElementById('est-safe-zones').textContent = zones.safe_zones ?? '–';
  document.getElementById('est-message').textContent = data.assessment_message || '–';

  // Render visualization
  const visualImg = document.getElementById('est-visual');
  if (data.visualization && visualImg) {
    visualImg.src = data.visualization;
    visualImg.style.display = 'block';
  }
}

/**
 * Clear all result displays
 */
function clearResults(panelId) {
  if (panelId === 'change-detection') {
    setText('cd-damage', '–');
    setText('cd-change', '–');
    setText('cd-confidence', '–');
    setText('cd-model', '–');
    setText('cd-status', '–');
    var maskImg = document.getElementById('cd-mask');
    if (maskImg) {
      maskImg.src = '';
      maskImg.style.display = 'none';
    }
  } else if (panelId === 'segmentation') {
    document.getElementById('seg-total').textContent = '–';
    document.getElementById('seg-buildings').textContent = '–';
    document.getElementById('seg-infra').textContent = '–';
    document.getElementById('seg-debris').textContent = '–';
    document.getElementById('seg-severity').textContent = '–';
    document.getElementById('seg-confidence').textContent = '–';
    document.getElementById('seg-message').textContent = '–';
    const visualImg = document.getElementById('seg-visual');
    if (visualImg) {
      visualImg.src = '';
      visualImg.style.display = 'none';
    }
  } else if (panelId === 'damage-estimation') {
    document.getElementById('est-total').textContent = '–';
    document.getElementById('est-buildings').textContent = '–';
    document.getElementById('est-infra').textContent = '–';
    document.getElementById('est-debris').textContent = '–';
    document.getElementById('est-severity').textContent = '–';
    document.getElementById('est-confidence').textContent = '–';
    document.getElementById('est-damaged-zones').textContent = '–';
    document.getElementById('est-safe-zones').textContent = '–';
    document.getElementById('est-message').textContent = '–';
    const visualImg = document.getElementById('est-visual');
    if (visualImg) {
      visualImg.src = '';
      visualImg.style.display = 'none';
    }
  }
}

/**
 * Format percentage value
 */
function formatPercentage(value) {
  if (value === null || value === undefined || value === '–') {
    return '–';
  }
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '–';
  return `${num.toFixed(2)}%`;
}

/**
 * Format confidence score (0-1 range)
 */
function formatConfidence(value) {
  if (value === null || value === undefined || value === '–') {
    return '–';
  }
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '–';
  return `${(num * 100).toFixed(1)}%`;
}

/**
 * Show error message in UI
 */
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.hidden = false;
  }
}

/**
 * Hide error message
 */
function hideError(elementId) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.hidden = true;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderChangeDetectionResults,
    renderSegmentationResults,
    renderDamageEstimationResults,
    clearResults,
    formatPercentage,
    formatConfidence,
    showError,
    hideError,
  };
}
