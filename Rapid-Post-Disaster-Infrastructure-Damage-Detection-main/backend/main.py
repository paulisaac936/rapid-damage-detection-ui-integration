from fastapi import FastAPI, Depends, UploadFile, File, BackgroundTasks
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import os
import glob
from PIL import Image
import numpy as np
import io
import base64

# Internal imports
from database import engine, Base, get_db
from models import Incident as IncidentModel
from ai import ai_engine
from routing import router as routing_engine
from pdf import generate_pdf_report
from change_detection import ai_model
from damage_estimation import damage_estimator

# Path to ChangeFormer predictions
CHANGEFORMER_MASKS_DIR = os.path.join(os.path.dirname(__file__), '..', 'ChangeFormer-main', 'samples_DSIFN', 'predict_ChangeFormerV6')

# Initialize DB Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ResQ Sentinel API",
    description="Geospatial AI Backend for Disaster Response",
    version="3.0.1"
)

# CORS Config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Schemas ---
class IncidentCreate(BaseModel):
    type: str
    severity: str
    lat: float
    lng: float
    description: Optional[str] = None

class IncidentResponse(IncidentCreate):
    id: int
    confidence: float
    timestamp: str

# --- Endpoints ---

@app.get("/")
def read_root():
    return {"status": "ONLINE", "system": "ResQ Sentinel AI Backend"}

@app.get("/health")
def health_check():
    return {
        "database": "CONNECTED",
        "ai_engine": "READY",
        "routing": "READY"
    }

# 1. Incident Management
@app.post("/incidents/", response_model=dict)
def create_incident(incident: IncidentCreate, db: Session = Depends(get_db)):
    # Mock creation logic (PostGIS handling would go here)
    return {"msg": "Incident reported", "data": incident}

@app.get("/incidents/")
def get_incidents(db: Session = Depends(get_db)):
    # Return mock data if DB empty
    return [
        {"id": 1, "type": "DAMAGE", "severity": "CRITICAL", "coordinates": {"lat": 34.0622, "lng": -118.2537}},
        {"id": 2, "type": "BLOCKED", "severity": "MODERATE", "coordinates": {"lat": 34.0422, "lng": -118.2337}}
    ]

# 2. AI Pipeline
@app.post("/analyze/change-detection")
async def analyze_change(
    pre_image: UploadFile = File(...), 
    post_image: UploadFile = File(...)
):
    try:
        # Read image files
        pre_data = await pre_image.read()
        post_data = await post_image.read()
        
        # Run change detection
        result = ai_model.detect_changes(pre_data, post_data)
        
        return {
            "status": "success",
            "analysis": result,
            "model": result.get('model', 'ChangeFormerV6'),
            "damage_percentage": result.get('damage_percentage', 0),
            "confidence": result.get('confidence', 0),
            "mask_map": result.get('mask_data', None)
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "damage_percentage": 0,
            "confidence": 0
        }

@app.post("/analyze/segmentation")
async def analyze_segmentation(image: UploadFile = File(...)):
    """
    Analyze a single satellite image for damage segmentation
    Returns damage percentage and building/infrastructure breakdown
    """
    try:
        image_data = await image.read()
        result = damage_estimator.estimate_damage(image_data)
        return result
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "metrics": None
        }


@app.post("/analyze/damage-estimation")
async def damage_estimation(image: UploadFile = File(...)):
    """
    Comprehensive damage estimation from single image
    Provides detailed metrics:
    - Total damage percentage
    - Building damage breakdown
    - Infrastructure damage breakdown
    - Debris coverage
    - Severity classification (CRITICAL/SEVERE/MODERATE/MINOR/MINIMAL)
    - Affected zones count
    - Confidence score
    """
    try:
        image_data = await image.read()
        result = damage_estimator.estimate_damage(image_data)
        
        if result['status'] == 'success':
            metrics = result['metrics']
            return {
                "status": "success",
                "damage_assessment": {
                    "total_damage": metrics['total_damage_percentage'],
                    "building_damage": metrics['building_damage_percentage'],
                    "infrastructure_damage": metrics['infrastructure_damage_percentage'],
                    "debris_coverage": metrics['debris_coverage_percentage'],
                    "severity": metrics['severity_level'],
                    "confidence": metrics['confidence_score']
                },
                "zone_analysis": {
                    "damaged_zones": metrics['damaged_zones_count'],
                    "safe_zones": metrics['safe_zones_count'],
                    "total_zones": metrics['damaged_zones_count'] + metrics['safe_zones_count']
                },
                "assessment_message": metrics['estimate_message'],
                "visualization": result['visualization'],
                "model": result['model']
            }
        else:
            return result
            
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }


@app.post("/analyze/combined-damage-report")
async def combined_damage_report(
    pre_image: UploadFile = File(...),
    post_image: UploadFile = File(...),
    single_image: Optional[UploadFile] = File(None)
):
    """
    Combined damage analysis:
    1. Change detection between pre/post images
    2. Damage estimation on post image
    3. Combined severity assessment
    """
    try:
        pre_data = await pre_image.read()
        post_data = await post_image.read()
        
        # Change detection
        change_result = ai_model.detect_changes(pre_data, post_data)
        
        # Damage estimation on post image
        damage_result = damage_estimator.estimate_damage(post_data)
        
        # Combine results
        if change_result['status'] == 'success' and damage_result['status'] == 'success':
            change_damage = change_result.get('damage_percentage', 0)
            est_damage = damage_result['metrics']['total_damage_percentage']
            
            # Weighted average (change detection 60%, estimation 40%)
            combined_damage = (change_damage * 0.6 + est_damage * 0.4)
            
            return {
                "status": "success",
                "combined_analysis": {
                    "change_detection_damage": round(change_damage, 2),
                    "estimation_damage": round(est_damage, 2),
                    "combined_damage_percentage": round(combined_damage, 2),
                    "severity": damage_result['metrics']['severity_level'],
                    "confidence": min(
                        change_result.get('confidence', 0.5),
                        damage_result['metrics']['confidence_score']
                    )
                },
                "change_detection": {
                    "damage_map": change_result.get('mask_data'),
                    "model": change_result.get('model')
                },
                "damage_estimation": {
                    "visualization": damage_result.get('visualization'),
                    "metrics": damage_result['metrics']
                },
                "assessment_message": damage_result['metrics']['estimate_message']
            }
        else:
            return {
                "status": "error",
                "error": "Failed to complete analysis",
                "change_status": change_result.get('status'),
                "damage_status": damage_result.get('status')
            }
            
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }

# 2.5 ChangeFormer Visualization Endpoints
from fastapi import Query

@app.get("/visualize/changeformer/mask")
def get_changeformer_mask(filename: str = Query(None)):
    """
    Return a ChangeFormer prediction mask as base64, by filename
    """
    try:
        if filename:
            mask_path = os.path.join(CHANGEFORMER_MASKS_DIR, filename)
            if not os.path.exists(mask_path):
                return {"status": "error", "error": "Mask file not found"}
        else:
            mask_files = glob.glob(os.path.join(CHANGEFORMER_MASKS_DIR, '*.png'))
            if not mask_files:
                return {"status": "error", "error": "No mask files found"}
            mask_path = mask_files[-1]
        mask_img = Image.open(mask_path).convert('L')
        buffered = io.BytesIO()
        mask_img.save(buffered, format="PNG")
        mask_base64 = f"data:image/png;base64,{base64.b64encode(buffered.getvalue()).decode()}"
        return {
            "status": "success",
            "mask": mask_base64,
            "filename": os.path.basename(mask_path)
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}

@app.get("/visualize/changeformer/heatmap")
def get_changeformer_heatmap(filename: str = Query(None)):
    """
    Generate and return a colored heatmap from a ChangeFormer mask by filename
    """
    try:
        if filename:
            mask_path = os.path.join(CHANGEFORMER_MASKS_DIR, filename)
            if not os.path.exists(mask_path):
                return {"status": "error", "error": "Mask file not found"}
        else:
            mask_files = glob.glob(os.path.join(CHANGEFORMER_MASKS_DIR, '*.png'))
            if not mask_files:
                return {"status": "error", "error": "No mask files found"}
            mask_path = mask_files[-1]
        mask_img = Image.open(mask_path).convert('L')
        mask_np = np.array(mask_img, dtype=np.float32) / 255.0
        heatmap = np.zeros((mask_np.shape[0], mask_np.shape[1], 3), dtype=np.uint8)
        heatmap[..., 0] = (mask_np * 255).astype(np.uint8)
        heatmap[..., 1] = 0
        heatmap[..., 2] = ((1 - mask_np) * 255).astype(np.uint8)
        heatmap_img = Image.fromarray(heatmap, 'RGB')
        buffered = io.BytesIO()
        heatmap_img.save(buffered, format="PNG")
        heatmap_base64 = f"data:image/png;base64,{base64.b64encode(buffered.getvalue()).decode()}"
        return {
            "status": "success",
            "heatmap": heatmap_base64,
            "filename": os.path.basename(mask_path)
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}

# 3. Routing
@app.get("/route/compute")
def compute_safe_route(start_node: str, end_node: str):
    route = routing_engine.compute_route(start_node, end_node)
    if not route:
        return {"error": "No safe path found"}
    return route

# 4. Reports
@app.get("/reports/generate")
def download_report(background_tasks: BackgroundTasks):
    # Fetch data
    incidents = [
        {"id": 1, "type": "DAMAGE", "severity": "CRITICAL", "coordinates": {"lat": 34.0622, "lng": -118.2537}},
        {"id": 2, "type": "BLOCKED", "severity": "MODERATE", "coordinates": {"lat": 34.0422, "lng": -118.2337}}
    ]
    
    pdf_buffer = generate_pdf_report(incidents)
    
    return StreamingResponse(
        pdf_buffer, 
        media_type="application/pdf", 
        headers={"Content-Disposition": "attachment; filename=damage_report.pdf"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
