"""
Change Detection AI Module - integrates ChangeFormer model for damage detection
"""

import torch
import numpy as np
from PIL import Image
import io
import sys
import os
from pathlib import Path

# Add ChangeFormer to path
CHANGEFORMER_PATH = Path(__file__).parent / "ChangeFormer"
sys.path.insert(0, str(CHANGEFORMER_PATH))

try:
    from ChangeFormer import utils
    from ChangeFormer.models.basic_model import CDEvaluator
    HAS_CHANGEFORMER = True
except ImportError:
    HAS_CHANGEFORMER = False
    print("⚠️ ChangeFormer not available - using mock change detection")


class ChangeDetectionAI:
    def __init__(self):
        self.model = None
        self.device = None
        self.model_loaded = False
        self.img_size = 256
        
        if HAS_CHANGEFORMER:
            self._load_model()
    
    def _load_model(self):
        """Load ChangeFormer model from checkpoint"""
        try:
            # GPU setup
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            print(f"Using device: {self.device}")
            
            # Create args-like object with model config
            class Args:
                project_name = 'CD_ChangeFormerV6_LEVIR_b16_lr0.0001_adamw_train_test_200_linear_ce_multi_train_True_multi_infer_False_shuffle_AB_False_embed_dim_256'
                gpu_ids = '0'
                n_class = 2
                embed_dim = 256
                net_G = 'ChangeFormerV6'
                checkpoint_name = 'best_ckpt.pt'
                checkpoint_root = str(CHANGEFORMER_PATH / 'checkpoints')
                checkpoint_dir = str(CHANGEFORMER_PATH / 'checkpoints' / project_name)
                batch_size = 1
                
            args = Args()
            
            # Check if checkpoint exists
            checkpoint_path = Path(args.checkpoint_dir) / args.checkpoint_name
            if not checkpoint_path.exists():
                print(f"⚠️ Checkpoint not found at {checkpoint_path}")
                self.model_loaded = False
                return
            
            # Initialize model
            self.model = CDEvaluator(args)
            self.model.load_checkpoint(args.checkpoint_name)
            self.model.eval()
            self.model_loaded = True
            print("✓ ChangeFormer model loaded successfully")
            
        except Exception as e:
            print(f"⚠️ Failed to load ChangeFormer: {e}")
            self.model_loaded = False
    
    def detect_changes(self, pre_image_bytes: bytes, post_image_bytes: bytes) -> dict:
        """
        Detect changes between pre and post images
        Returns: {
            'change_detected': float (0-100),
            'damage_percentage': float (0-100),
            'confidence': float (0-1),
            'mask_data': base64 encoded PNG,
            'status': str
        }
        """
        try:
            # Load images
            pre_img = Image.open(io.BytesIO(pre_image_bytes)).convert('RGB')
            post_img = Image.open(io.BytesIO(post_image_bytes)).convert('RGB')
            
            # Resize to model input size
            pre_img = pre_img.resize((self.img_size, self.img_size), Image.Resampling.LANCZOS)
            post_img = post_img.resize((self.img_size, self.img_size), Image.Resampling.LANCZOS)
            
            # Convert to numpy arrays and normalize
            pre_np = np.array(pre_img, dtype=np.float32) / 255.0
            post_np = np.array(post_img, dtype=np.float32) / 255.0
            
            if self.model_loaded and self.model is not None:
                # Use ChangeFormer model
                return self._inference_changeformer(pre_np, post_np)
            else:
                # Use mock detection
                return self._mock_detection(pre_np, post_np)
                
        except Exception as e:
            print(f"Error in change detection: {e}")
            return self._error_response(str(e))
    
    def _inference_changeformer(self, pre_np: np.ndarray, post_np: np.ndarray) -> dict:
        """Run ChangeFormer inference"""
        try:
            with torch.no_grad():
                # Prepare tensors
                pre_tensor = torch.from_numpy(pre_np).permute(2, 0, 1).unsqueeze(0).to(self.device)
                post_tensor = torch.from_numpy(post_np).permute(2, 0, 1).unsqueeze(0).to(self.device)
                
                # Forward pass
                change_map = self.model.forward(pre_tensor, post_tensor)
                change_map = change_map.squeeze().cpu().numpy()
                
                # Calculate statistics
                if change_map.size > 0:
                    change_percentage = float(np.sum(change_map > 0.5) / change_map.size * 100)
                    max_confidence = float(np.max(change_map))
                else:
                    change_percentage = 0.0
                    max_confidence = 0.0
                
                # Create mask visualization
                mask_img = self._create_mask_visualization(change_map)
                mask_base64 = self._image_to_base64(mask_img)
                
                return {
                    'change_detected': change_percentage,
                    'damage_percentage': change_percentage,
                    'confidence': max_confidence,
                    'mask_data': mask_base64,
                    'model': 'ChangeFormerV6',
                    'status': 'COMPLETED'
                }
        except Exception as e:
            return self._error_response(f"ChangeFormer inference error: {e}")
    
    def _mock_detection(self, pre_np: np.ndarray, post_np: np.ndarray) -> dict:
        """Mock detection using simple difference analysis"""
        try:
            # Calculate pixel-wise difference
            diff = np.abs(pre_np - post_np)
            
            # Convert to grayscale difference
            diff_gray = np.mean(diff, axis=2)
            
            # Threshold to detect changes
            threshold = 0.15
            change_mask = (diff_gray > threshold).astype(np.float32)
            
            # Calculate statistics
            change_percentage = float(np.sum(change_mask) / change_mask.size * 100)
            confidence = float(np.mean(diff_gray[change_mask > 0])) if np.any(change_mask) else 0.0
            
            # Create visualization
            mask_img = self._create_mask_visualization(change_mask)
            mask_base64 = self._image_to_base64(mask_img)
            
            return {
                'change_detected': change_percentage,
                'damage_percentage': change_percentage,
                'confidence': min(confidence * 1.2, 1.0),  # Scale confidence
                'mask_data': mask_base64,
                'model': 'DifferenceAnalysis',
                'status': 'COMPLETED'
            }
        except Exception as e:
            return self._error_response(str(e))
    
    def _create_mask_visualization(self, change_map: np.ndarray) -> Image.Image:
        """Create visualization of change detection mask"""
        # Normalize to 0-1 range
        if change_map.max() > 0:
            normalized = (change_map - change_map.min()) / (change_map.max() - change_map.min())
        else:
            normalized = change_map
        
        # Apply colormap (red = high change)
        heatmap = np.zeros((normalized.shape[0], normalized.shape[1], 3), dtype=np.uint8)
        heatmap[..., 0] = (normalized * 255).astype(np.uint8)  # Red channel
        heatmap[..., 1] = ((1 - normalized) * 100).astype(np.uint8)  # Green channel
        
        return Image.fromarray(heatmap, 'RGB')
    
    def _image_to_base64(self, img: Image.Image) -> str:
        """Convert PIL image to base64 string"""
        import base64
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode()
        return f"data:image/png;base64,{img_base64}"
    
    def _error_response(self, error_msg: str) -> dict:
        """Return error response"""
        return {
            'change_detected': 0.0,
            'damage_percentage': 0.0,
            'confidence': 0.0,
            'mask_data': None,
            'error': error_msg,
            'status': 'ERROR'
        }


# Global instance
ai_model = ChangeDetectionAI()

