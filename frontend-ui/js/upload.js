/**
 * Upload Handler - Manages file inputs and image previews
 * Uses URL.createObjectURL for in-dropzone previews
 */

var _objectUrls = {};

/**
 * Setup file input with preview
 * @param {string} inputId - ID of file input element
 * @param {string} previewId - ID of preview image in result panel (optional)
 * @param {string} metaId - ID of meta info element
 * @param {Function} onChange - Callback when file changes
 * @param {string} innerPreviewId - ID of img inside dropzone for in-box preview (optional)
 */
function setupFileInput(inputId, previewId, metaId, onChange, innerPreviewId) {
  const input = document.getElementById(inputId);
  const preview = previewId ? document.getElementById(previewId) : null;
  const meta = document.getElementById(metaId);
  const innerPreview = innerPreviewId ? document.getElementById(innerPreviewId) : null;
  const dropzone = input ? input.closest('.dropzone') : null;
  const placeholder = dropzone ? dropzone.querySelector('.dropzone__placeholder') : null;

  if (!input || !meta) {
    console.error('Missing elements for ' + inputId);
    return;
  }

  function onFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    var fileSize = (file.size / 1024 / 1024).toFixed(2);
    meta.textContent = file.name + ' (' + fileSize + ' MB)';

    if (innerPreview) {
      if (_objectUrls[inputId]) {
        URL.revokeObjectURL(_objectUrls[inputId]);
      }
      _objectUrls[inputId] = URL.createObjectURL(file);
      innerPreview.src = _objectUrls[inputId];
      innerPreview.style.display = 'block';
      if (placeholder) placeholder.style.display = 'none';
    }

    if (preview) {
      var reader = new FileReader();
      reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
    if (onChange) onChange(file);
  }

  input.addEventListener('change', function (e) {
    var file = e.target.files[0];
    if (file) onFile(file);
  });

  if (!dropzone) return;
  dropzone.addEventListener('dragover', function (e) {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });
  dropzone.addEventListener('dragleave', function () {
    dropzone.classList.remove('dragover');
  });
  dropzone.addEventListener('drop', function (e) {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    var file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      input.files = e.dataTransfer.files;
      onFile(file);
    }
  });
}

/**
 * Handle file selection and create preview (legacy; prefer setupFileInput with innerPreviewId)
 */
function handleFileSelect(file, previewElement, metaElement) {
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    return;
  }
  var fileSize = (file.size / 1024 / 1024).toFixed(2);
  metaElement.textContent = file.name + ' (' + fileSize + ' MB)';
  var reader = new FileReader();
  reader.onload = function (e) {
    previewElement.src = e.target.result;
    previewElement.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

/**
 * Get file from input
 */
function getFile(inputId) {
  const input = document.getElementById(inputId);
  return input?.files[0] || null;
}

/**
 * Clear file input and preview
 */
function clearFileInput(inputId, previewId, metaId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  const meta = document.getElementById(metaId);

  if (input) input.value = '';
  if (preview) {
    preview.src = '';
    preview.style.display = 'none';
  }
  if (meta) meta.textContent = 'No file selected';
}

/**
 * Validate that both pre and post images are selected
 */
function validateChangeDetectionInputs() {
  const preFile = getFile('pre-image-input');
  const postFile = getFile('post-image-input');

  if (!preFile) {
    throw new Error('Please select a pre-disaster image');
  }
  if (!postFile) {
    throw new Error('Please select a post-disaster image');
  }

  return { preFile, postFile };
}

/**
 * Validate single image input
 */
function validateSingleImageInput(inputId) {
  const file = getFile(inputId);
  if (!file) {
    throw new Error('Please select an image');
  }
  return file;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    setupFileInput,
    getFile,
    clearFileInput,
    validateChangeDetectionInputs,
    validateSingleImageInput,
  };
}
