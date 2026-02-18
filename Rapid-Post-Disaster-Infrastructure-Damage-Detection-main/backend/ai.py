import random
import time

class AIPipeline:
    def __init__(self):
        print("Loading Siamese U-Net (Change Detection)... [MOCK]")
        print("Loading Attention U-Net (Damage Segmentation)... [MOCK]")
        print("Loading YOLOv8 (Road Obstruction)... [MOCK]")
        time.sleep(1) # Simulate load time
        
    async def detect_changes(self, pre_image_path: str, post_image_path: str):
        """
        Simulates Siamese U-Net output.
        Returns percentage of change and a mock mask polygon.
        """
        await self._simulate_inference_delay()
        change_percentage = random.uniform(15.0, 45.0)
        return {
            "model": "Siamese U-Net ResNet50",
            "change_detected": change_percentage,
            "status": "COMPLETED"
        }

    async def segment_damage(self, image_path: str):
        """
        Simulates Attention U-Net identifying building damage.
        """
        await self._simulate_inference_delay()
        buildings_affected = random.randint(3, 12)
        severity_score = random.uniform(0.4, 0.9)
        return {
            "model": "Attention U-Net",
            "buildings_detected": buildings_affected,
            "severity_index": severity_score
        }

    async def scan_roads(self, image_path: str):
        """
        Simulates YOLOv8 finding blocked roads.
        """
        await self._simulate_inference_delay()
        obstructions = random.randint(0, 3)
        return {
            "model": "YOLOv8-L",
            "obstructions_found": obstructions,
            "clearance_required": obstructions > 0
        }

    async def _simulate_inference_delay(self):
        # Async sleep to mimic GPU processing time
        await __import__("asyncio").sleep(0.5)

ai_engine = AIPipeline()
