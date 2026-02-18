# 🚀 ResQ Sentinel - Complete API Documentation

## System Status ✅

- **Backend API**: http://localhost:8000
- **Frontend UI**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs (Interactive Swagger UI)
- **Database**: SQLite (./backend/resq_db.sqlite3)

---

## 🎯 Core Endpoints

### 1. Health & Status

#### GET `/health`
System health check
```json
{
  "database": "CONNECTED",
  "ai_engine": "READY",
  "routing": "READY"
}
```

#### GET `/`
API status
```json
{
  "status": "ONLINE",
  "system": "ResQ Sentinel AI Backend"
}
```

---

## 🤖 AI Analysis Endpoints

### 2. Change Detection (Pre/Post Analysis)

#### POST `/analyze/change-detection`
Compares before and after satellite images to detect changes/damage

**Request:**
- `pre_image` (File): Pre-disaster satellite image
- `post_image` (File): Post-disaster satellite image

**Response:**
```json
{
  "status": "success",
  "analysis": {
    "change_detected": 45.3,
    "damage_percentage": 45.3,
    "confidence": 0.87,
    "mask_data": "data:image/png;base64,...",
    "model": "ChangeFormerV6"
  },
  "model": "ChangeFormerV6",
  "damage_percentage": 45.3,
  "confidence": 0.87,
  "mask_map": "data:image/png;base64,..."
}
```

**Features:**
- ✅ Vision Transformer-based change detection
- ✅ Red/Yellow heatmap visualization
- ✅ Pixel-level damage analysis
- ✅ Confidence scoring (0-1)

---

### 3. Single Image Damage Segmentation

#### POST `/analyze/segmentation`
Analyzes a single satellite image for damage assessment

**Request:**
- `image` (File): Single satellite image

**Response:**
```json
{
  "status": "success",
  "metrics": {
    "total_damage_percentage": 34.5,
    "building_damage_percentage": 42.1,
    "infrastructure_damage_percentage": 33.7,
    "debris_coverage_percentage": 21.3,
    "severity_level": "MODERATE",
    "affected_area_percentage": 34.5,
    "confidence_score": 0.85,
    "damaged_zones_count": 8,
    "safe_zones_count": 8,
    "estimate_message": "⚡ MODERATE DAMAGE: 34.50% - Significant but manageable. 8 zones need assessment."
  },
  "visualization": "data:image/png;base64,...",
  "model": "DamageEstimator"
}
```

**Features:**
- ✅ Multi-metric damage breakdown
- ✅ Building integrity analysis
- ✅ Infrastructure assessment
- ✅ Debris coverage estimation
- ✅ Zone-based analysis (4x4 grid = 16 zones)

---

### 4. Comprehensive Damage Estimation

#### POST `/analyze/damage-estimation`
Detailed damage estimation with actionable metrics

**Request:**
- `image` (File): Satellite image

**Response:**
```json
{
  "status": "success",
  "damage_assessment": {
    "total_damage": 45.7,
    "building_damage": 52.3,
    "infrastructure_damage": 41.8,
    "debris_coverage": 28.5,
    "severity": "MODERATE",
    "confidence": 0.82
  },
  "zone_analysis": {
    "damaged_zones": 7,
    "safe_zones": 9,
    "total_zones": 16
  },
  "assessment_message": "⚡ MODERATE DAMAGE: 45.70% - Significant but manageable. 7 zones need assessment.",
  "visualization": "data:image/png;base64,...",
  "model": "DamageEstimator"
}
```

#### Damage Classification

| Severity | Range | Action Required |
|----------|-------|-----------------|
| **CRITICAL** | 80-100% | 🚨 Immediate evacuation & emergency response |
| **SEVERE** | 60-80% | ⚠️ Evacuation warnings & rescue teams |
| **MODERATE** | 40-60% | ⚡ Structural assessment required |
| **MINOR** | 20-40% | ✓ Limited impact, assess damage |
| **MINIMAL** | 0-20% | ✓ Area safe, routine monitoring |

---

### 5. Combined Damage Report

#### POST `/analyze/combined-damage-report`
Comprehensive analysis combining change detection + damage estimation

**Request:**
- `pre_image` (File): Pre-disaster image
- `post_image` (File): Post-disaster image
- `single_image` (File, Optional): Additional reference image

**Response:**
```json
{
  "status": "success",
  "combined_analysis": {
    "change_detection_damage": 48.3,
    "estimation_damage": 42.1,
    "combined_damage_percentage": 45.8,
    "severity": "MODERATE",
    "confidence": 0.84
  },
  "change_detection": {
    "damage_map": "data:image/png;base64,...",
    "model": "ChangeFormerV6"
  },
  "damage_estimation": {
    "visualization": "data:image/png;base64,...",
    "metrics": {
      "total_damage_percentage": 42.1,
      "building_damage_percentage": 48.5,
      "infrastructure_damage_percentage": 39.2,
      "debris_coverage_percentage": 24.3,
      "severity_level": "MODERATE",
      "confidence_score": 0.81,
      "damaged_zones_count": 7,
      "safe_zones_count": 9
    }
  },
  "assessment_message": "Combined analysis: High confidence in damage assessment..."
}
```

**Algorithm:**
- Change Detection: 60% weight
- Damage Estimation: 40% weight
- Final Score = (CD × 0.6) + (DE × 0.4)

---

## 📊 Incident Management

### GET `/incidents/`
Fetch all detected incidents
```json
[
  {
    "id": 1,
    "type": "DAMAGE",
    "severity": "CRITICAL",
    "coordinates": {"lat": 34.0622, "lng": -118.2537},
    "confidence": 0.92
  }
]
```

### POST `/incidents/`
Create new incident report

**Request:**
```json
{
  "type": "DAMAGE",
  "severity": "CRITICAL",
  "lat": 34.0622,
  "lng": -118.2537,
  "description": "Building collapse near downtown"
}
```

---

## 🛣️ Routing

### GET `/route/compute`
Calculate safe evacuation routes

**Parameters:**
- `start_node`: Starting location
- `end_node`: Destination

**Response:**
```json
{
  "route": [...],
  "risk_level": 0.15,
  "eta": "14m 30s",
  "status": "SAFE"
}
```

---

## 📄 Reports

### GET `/reports/generate`
Download damage assessment PDF report

**Response:** Binary PDF file

---

## 🔌 Frontend Integration

### API Service Functions

```typescript
// Change detection
await apiService.analyzeChangeDetection(preFile, postFile)

// Single image damage segmentation
await apiService.analyzeSegmentation(imageFile)

// Damage estimation
await apiService.estimateDamage(imageFile)

// Combined analysis
await apiService.analyzeCombinedDamage(preFile, postFile)

// Incidents
await apiService.getIncidents()
await apiService.createIncident({
  type: 'DAMAGE',
  severity: 'CRITICAL',
  lat: 34.0622,
  lng: -118.2537
})

// Routing
await apiService.computeRoute(startNode, endNode)

// Reports
await apiService.generateReport()
```

---

## 📈 Metrics Explained

### Total Damage Percentage
- Overall infrastructure damage across the affected area
- Based on edge detection + color anomalies
- Range: 0-100%

### Building Damage Percentage  
- Specific structural integrity assessment
- Uses Sobel edge detection for structure analysis
- Range: 0-100%

### Infrastructure Damage
- Roads, utilities, and services impact
- Typically 80% of building damage
- Range: 0-100%

### Debris Coverage
- Percentage of visible debris/collapsed materials
- Based on color anomaly detection
- Range: 0-100%

### Confidence Score
- Model's confidence in the assessment
- Ranges 0-1 (0-100%)
- Higher damage = Higher confidence (up to 0.95)

### Zone Analysis (4x4 Grid)
- Image divided into 16 zones
- Each zone classified as damaged or safe
- Helps identify damage distribution patterns

---

## 🎨 Visualization Types

### 1. Change Detection Mask
- **Color Scheme**: Red (high change) → Yellow (moderate) → Dark (no change)
- **Use**: Compare before/after imagery
- **Generated by**: ChangeFormer V6 model

### 2. Damage Estimation Overlay
- **Color Scheme**: Red intensity indicates damage severity
- **Use**: Identify specific damage locations
- **Generated by**: DamageEstimator (Sobel edges + color analysis)

---

## ⚙️ Technical Details

### Image Processing Pipeline
1. **Load** - Read JPG/PNG files
2. **Resize** - Normalize to 256x256 pixels
3. **Normalize** - Convert to 0-1 range
4. **Tensor** - GPU-accelerated if available
5. **Inference** - Model forward pass
6. **Postprocess** - Create visualizations
7. **Output** - Return metrics + base64 images

### Hardware Support
- ✅ GPU Acceleration (CUDA if available)
- ✅ CPU Fallback (auto-detection)
- ✅ Batch Processing ready
- ✅ Real-time performance

### Model Specifications

**ChangeFormer V6:**
- Architecture: Vision Transformer
- Input: 256×256 RGB pairs
- Output: Change probability map
- Checkpoint: 100+ MB

**DamageEstimator:**
- Algorithms: Sobel edge detection + NDVI
- Input: 256×256 RGB single image
- Output: Multi-metric damage assessment
- Lightweight: <1MB

---

## 🚀 Usage Example

### Complete Workflow
```typescript
// 1. Upload satellite images
const preImageFile = await selectFile();
const postImageFile = await selectFile();

// 2. Run combined analysis
const result = await apiService.analyzeCombinedDamage(preImageFile, postImageFile);

// 3. Extract metrics
const damagePercent = result.combined_analysis.combined_damage_percentage;
const severity = result.combined_analysis.severity;
const confidence = result.combined_analysis.confidence;

// 4. Display visualizations
// - Change detection map: result.change_detection.damage_map
// - Damage estimation: result.damage_estimation.visualization

// 5. Create incident if damage detected
if (damagePercent > 10) {
  await apiService.createIncident({
    type: 'DAMAGE',
    severity: severity,
    lat: detectedLatitude,
    lng: detectedLongitude,
    description: `AI-detected ${damagePercent.toFixed(1)}% damage`
  });
}

// 6. Generate PDF report
const pdfBlob = await apiService.generateReport();
```

---

## 📝 Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 422 Unprocessable Entity | Invalid file format | Use JPG/PNG images |
| 400 Bad Request | Missing parameters | Ensure all required fields |
| 500 Internal Server Error | Processing failed | Check image quality/size |
| 408 Timeout | Large file processing | Use smaller images |

---

## 🔐 Security

- ✅ CORS enabled for frontend communication
- ✅ Input validation on all endpoints  
- ✅ File size limits enforced
- ✅ Temporary file cleanup
- ✅ No sensitive data logging

---

## 📞 Support

For issues or questions:
1. Check http://localhost:8000/docs for interactive API testing
2. Review error messages in browser console
3. Verify backend service is running
4. Check file format and image quality

