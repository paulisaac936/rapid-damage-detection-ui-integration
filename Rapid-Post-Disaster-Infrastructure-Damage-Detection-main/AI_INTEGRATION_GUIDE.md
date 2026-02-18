# 🚀 ResQ Sentinel - Full AI Integration Complete

## System Status

### Backend Running
- **Port**: 8000
- **Status**: ✅ ONLINE
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs (Swagger UI)

### Frontend Running
- **Port**: 3000  
- **Status**: ✅ ONLINE
- **URL**: http://localhost:3000

---

## 🎯 New Features: AI Damage Detection

### How to Use

1. **Upload Satellite Images**
   - Click "Upload Pre" to select before-disaster satellite image
   - Click "Upload Post" to select after-disaster satellite image
   - Images are automatically resized to 256x256 for processing

2. **Run Analysis**
   - Click the blue "Run Analysis" button
   - Watch progress bar as the AI processes images
   - Backend performs change detection using ChangeFormer model

3. **View Results**
   - A modal will pop up showing:
     - **Damage Detection %**: Percentage of changes detected (0-100%)
     - **Confidence Score**: Model's confidence in the detection (0-100%)
     - **Mask Map**: Heatmap visualization showing where damage was detected
       - Red areas = High change intensity
       - Yellow areas = Medium change intensity
       - Dark areas = No change detected
     - **Damage Classification**: Severity level (CRITICAL/MODERATE/MINOR/MINIMAL)

4. **Auto-Report Creation**
   - If damage > 10%, a new incident is automatically created on the map
   - Severity is set based on damage percentage:
     - > 70% = CRITICAL
     - > 40% = MODERATE  
     - > 10% = LOW

---

## 🤖 AI Models

### Primary Model: ChangeFormer V6
- **Purpose**: Satellite image change detection
- **Architecture**: Vision Transformer-based
- **Input**: Two 256x256 RGB satellite images (pre & post disaster)
- **Output**: 
  - Change probability map (0-1 per pixel)
  - Aggregated damage percentage
  - Confidence score

### Fallback: Difference Analysis
- If ChangeFormer checkpoint not available
- Uses pixel-wise difference analysis
- Suitable for quick testing

---

## 📊 API Endpoints

### Change Detection (Main)
```
POST /analyze/change-detection
Content-Type: multipart/form-data

Parameters:
  - pre_image: File (JPG/PNG)
  - post_image: File (JPG/PNG)

Response:
{
  "status": "success",
  "analysis": {
    "damage_percentage": 45.3,
    "confidence": 0.87,
    "mask_data": "data:image/png;base64,...",
    "model": "ChangeFormerV6",
    "change_detected": 45.3
  }
}
```

### Related Endpoints
- `GET /health` - System health check
- `GET /incidents/` - Fetch detected incidents
- `POST /incidents/` - Report new incident
- `GET /route/compute` - Calculate evacuation routes
- `GET /reports/generate` - Generate PDF damage reports

---

## 🔧 Technical Details

### Frontend Components
- **App.tsx**: Main integration with real API calls
- **DamageAnalysisDisplay.tsx**: New modal component for results
- **services/apiService.ts**: HTTP client for backend

### Backend Modules
- **change_detection.py**: Main AI module with ChangeFormer integration
- **main.py**: Updated FastAPI endpoints
- **models.py**: SQLite-compatible data models

### Image Processing Pipeline
1. Load uploaded images (JPG/PNG)
2. Resize to 256x256 (ChangeFormer input size)
3. Normalize to 0-1 range
4. Tensor conversion (GPU if available)
5. Model inference
6. Create heatmap visualization
7. Calculate statistics
8. Return base64-encoded mask + metrics

---

## 🧪 Testing Recommendations

### Test Sample Images
- Use satellite imagery with clear before/after differences
- Size: Recommend 256x256 or larger (auto-resized)
- Format: JPG/PNG
- Content: Ideally satellite/aerial images for best results

### Expected Results
- **High Damage (>70%)**: Clearly visible structural changes
- **Moderate Damage (40-70%)**: Partial changes visible
- **Low Damage (10-40%)**: Minor variations
- **Minimal (<10%)**: Mostly unchanged regions

---

## 📝 Notes

- ChangeFormer model checkpoint required: `/backend/ChangeFormer/checkpoints/CD_ChangeFormerV6_LEVIR/best_ckpt.pt`
- If checkpoint missing, system falls back to difference analysis
- All processing on server-side (no client-side model execution)
- Results are stored as incidents in SQLite database
- CORS enabled for frontend-backend communication

---

## 🚀 Next Steps

1. Test with satellite imagery pairs
2. Adjust model threshold if needed
3. Integrate with GIS mapping for geo-visualization
4. Connect to real disaster databases
5. Deploy to production with GPU support

