"""
Damage Detection & Estimation Module
Provides detailed damage assessment with multiple metrics
"""

import torch
import numpy as np
from PIL import Image
import io
import base64
from typing import Dict, Any
from dataclasses import dataclass


@dataclass
class DamageMetrics:
    """Container for damage assessment metrics"""
    total_damage_percentage: float
    building_damage_percentage: float
    infrastructure_damage_percentage: float
    debris_coverage_percentage: float
    severity_level: str  # CRITICAL, SEVERE, MODERATE, MINOR, MINIMAL
    affected_area_percentage: float
    confidence_score: float
    damaged_zones_count: int
    safe_zones_count: int


class DamageEstimator:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    def estimate_damage(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Estimate damage from a single image
        Analyzes building integrity, debris, and structural damage
        """
        try:
            img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            img = img.resize((256, 256), Image.Resampling.LANCZOS)
            img_np = np.array(img, dtype=np.float32) / 255.0
            
            # Analyze image for damage patterns
            metrics = self._analyze_damage_patterns(img_np)
            
            # Create damage visualization
            damage_viz = self._create_damage_visualization(img_np, metrics)
            damage_base64 = self._image_to_base64(damage_viz)
            
            return {
                'status': 'success',
                'metrics': self._metrics_to_dict(metrics),
                'visualization': damage_base64,
                'model': 'DamageEstimator',
                'analysis_type': 'Single Image Assessment'
            }
        except Exception as e:
            return {
                'status': 'error',
                'error': str(e),
                'metrics': None
            }
    
    def _analyze_damage_patterns(self, img_np: np.ndarray) -> DamageMetrics:
        """Analyze image for damage patterns"""
        # Convert to grayscale
        gray = np.mean(img_np, axis=2)
        
        # Edge detection (high edges = structural damage)
        edges = self._sobel_edges(gray)
        
        # Anomaly detection (unusual colors = debris/damage)
        anomaly_score = self._detect_color_anomalies(img_np)
        
        # Calculate various damage metrics
        building_damage = float(np.mean(edges)) * 100
        debris_coverage = float(np.mean(anomaly_score)) * 100
        
        # Combine metrics
        total_damage = (building_damage * 0.6 + debris_coverage * 0.4)
        total_damage = np.clip(total_damage, 0, 100)
        
        # Count affected zones (divide image into 16 zones)
        damage_zones = self._count_damage_zones(edges, threshold=0.3)
        
        # Determine severity
        severity = self._classify_severity(total_damage)
        
        return DamageMetrics(
            total_damage_percentage=total_damage,
            building_damage_percentage=building_damage,
            infrastructure_damage_percentage=building_damage * 0.8,
            debris_coverage_percentage=debris_coverage,
            severity_level=severity,
            affected_area_percentage=total_damage,
            confidence_score=min(0.95, 0.7 + total_damage / 200),  # Higher damage = higher confidence
            damaged_zones_count=damage_zones['damaged'],
            safe_zones_count=damage_zones['safe']
        )
    
    def _sobel_edges(self, gray: np.ndarray) -> np.ndarray:
        """Sobel edge detection for structural damage"""
        # Simple Sobel approximation
        sx = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], dtype=np.float32)
        sy = np.array([[-1, -2, -1], [0, 0, 0], [1, 2, 1]], dtype=np.float32)
        
        # Convolve
        edges_x = np.abs(self._convolve2d(gray, sx))
        edges_y = np.abs(self._convolve2d(gray, sy))
        edges = np.sqrt(edges_x**2 + edges_y**2)
        
        return (edges - edges.min()) / (edges.max() - edges.min() + 1e-6)
    
    def _convolve2d(self, img: np.ndarray, kernel: np.ndarray) -> np.ndarray:
        """Simple 2D convolution with SAME padding"""
        h, w = img.shape
        kh, kw = kernel.shape
        
        # Pad the image for SAME convolution
        pad_h = kh // 2
        pad_w = kw // 2
        padded_img = np.pad(img, ((pad_h, pad_h), (pad_w, pad_w)), mode='constant', constant_values=0)
        
        # Output has same size as input
        output = np.zeros((h, w))
        
        for i in range(h):
            for j in range(w):
                output[i, j] = np.sum(padded_img[i:i+kh, j:j+kw] * kernel)
        
        return output
    
    def _detect_color_anomalies(self, img_np: np.ndarray) -> np.ndarray:
        """Detect unusual colors indicating debris/damage"""
        # Brown/gray debris vs green vegetation
        r, g, b = img_np[..., 0], img_np[..., 1], img_np[..., 2]
        
        # Normalized Difference Vegetation Index (NDVI) equivalent
        # High NDVI = vegetation (good), Low NDVI = urban/debris (damage)
        ndvi = np.where((g + r) != 0, (g - r) / (g + r), 0)
        
        # Invert: high score = low vegetation = damage
        anomaly = 1.0 - np.clip((ndvi + 0.5), 0, 1)
        
        return anomaly
    
    def _count_damage_zones(self, damage_map: np.ndarray, threshold: float = 0.3) -> Dict[str, int]:
        """Divide image into 4x4 grid, count damaged zones"""
        h, w = damage_map.shape
        tile_h, tile_w = h // 4, w // 4
        
        damaged = 0
        safe = 0
        
        for i in range(4):
            for j in range(4):
                tile = damage_map[i*tile_h:(i+1)*tile_h, j*tile_w:(j+1)*tile_w]
                if np.mean(tile) > threshold:
                    damaged += 1
                else:
                    safe += 1
        
        return {'damaged': damaged, 'safe': safe}
    
    def _classify_severity(self, damage_percent: float) -> str:
        """Classify damage severity"""
        if damage_percent >= 80:
            return 'CRITICAL'
        elif damage_percent >= 60:
            return 'SEVERE'
        elif damage_percent >= 40:
            return 'MODERATE'
        elif damage_percent >= 20:
            return 'MINOR'
        else:
            return 'MINIMAL'
    
    def _create_damage_visualization(self, img_np: np.ndarray, metrics: DamageMetrics) -> Image.Image:
        """Create visualization with damage overlay"""
        # Convert image back to 0-255 range
        img_display = (img_np * 255).astype(np.uint8)
        
        # Analyze edges to create damage overlay
        gray = np.mean(img_np, axis=2)
        edges = self._sobel_edges(gray)
        
        # Create colored overlay
        overlay = np.zeros_like(img_display)
        overlay[..., 0] = (edges * 255).astype(np.uint8)  # Red channel
        overlay[..., 1] = ((1 - edges) * 128).astype(np.uint8)  # Green channel
        overlay[..., 2] = 0  # Blue channel
        
        # Blend with original
        result = (img_display * 0.6 + overlay * 0.4).astype(np.uint8)
        
        return Image.fromarray(result, 'RGB')
    
    def _metrics_to_dict(self, metrics: DamageMetrics) -> Dict[str, Any]:
        """Convert metrics to dictionary"""
        return {
            'total_damage_percentage': round(metrics.total_damage_percentage, 2),
            'building_damage_percentage': round(metrics.building_damage_percentage, 2),
            'infrastructure_damage_percentage': round(metrics.infrastructure_damage_percentage, 2),
            'debris_coverage_percentage': round(metrics.debris_coverage_percentage, 2),
            'severity_level': metrics.severity_level,
            'affected_area_percentage': round(metrics.affected_area_percentage, 2),
            'confidence_score': round(metrics.confidence_score, 2),
            'damaged_zones_count': metrics.damaged_zones_count,
            'safe_zones_count': metrics.safe_zones_count,
            'estimate_message': self._generate_estimate_message(metrics)
        }
    
    def _generate_estimate_message(self, metrics: DamageMetrics) -> str:
        """Generate human-readable damage assessment"""
        messages = {
            'CRITICAL': f"🚨 CRITICAL DAMAGE: {metrics.total_damage_percentage:.1f}% - Immediate medical response required. {metrics.damaged_zones_count} zones severely affected.",
            'SEVERE': f"⚠️ SEVERE DAMAGE: {metrics.total_damage_percentage:.1f}% - Major structural damage. {metrics.damaged_zones_count} zones impacted.",
            'MODERATE': f"⚡ MODERATE DAMAGE: {metrics.total_damage_percentage:.1f}% - Significant but manageable. {metrics.damaged_zones_count} zones need assessment.",
            'MINOR': f"✓ MINOR DAMAGE: {metrics.total_damage_percentage:.1f}% - Limited impact. {metrics.damaged_zones_count} isolated damage spots.",
            'MINIMAL': f"✓ MINIMAL DAMAGE: {metrics.total_damage_percentage:.1f}% - Area relatively safe. {metrics.safe_zones_count}/{metrics.safe_zones_count + metrics.damaged_zones_count} zones unaffected."
        }
        return messages.get(metrics.severity_level, "Unknown damage level")
    
    def _image_to_base64(self, img: Image.Image) -> str:
        """Convert PIL image to base64"""
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        return f"data:image/png;base64,{base64.b64encode(buffered.getvalue()).decode()}"


# Global instance
damage_estimator = DamageEstimator()
