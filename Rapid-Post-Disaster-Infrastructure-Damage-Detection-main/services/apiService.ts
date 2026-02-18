// Backend API Service - connects frontend to FastAPI backend on port 8000

const API_BASE = 'http://localhost:8000';

export const apiService = {
  // Health check
  async getHealth() {
    const response = await fetch(`${API_BASE}/health`);
    return response.json();
  },

  // Incidents
  async getIncidents() {
    const response = await fetch(`${API_BASE}/incidents/`);
    return response.json();
  },

  async createIncident(incident: {
    type: string;
    severity: string;
    lat: number;
    lng: number;
    description?: string;
  }) {
    const response = await fetch(`${API_BASE}/incidents/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incident),
    });
    return response.json();
  },

  // AI Analysis - Change Detection
  async analyzeChangeDetection(preImageFile: File, postImageFile: File) {
    const formData = new FormData();
    formData.append('pre_image', preImageFile);
    formData.append('post_image', postImageFile);

    const response = await fetch(`${API_BASE}/analyze/change-detection`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  // AI Analysis - Segmentation (Damage Estimation)
  async analyzeSegmentation(imageFile: File) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${API_BASE}/analyze/segmentation`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  // Damage Estimation Endpoint
  async estimateDamage(imageFile: File) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${API_BASE}/analyze/damage-estimation`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  // Combined Damage Report (pre + post images)
  async analyzeCombinedDamage(preImageFile: File, postImageFile: File, singleImageFile?: File) {
    const formData = new FormData();
    formData.append('pre_image', preImageFile);
    formData.append('post_image', postImageFile);
    if (singleImageFile) {
      formData.append('single_image', singleImageFile);
    }

    const response = await fetch(`${API_BASE}/analyze/combined-damage-report`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  // Routing
  async computeRoute(startNode: string, endNode: string) {
    const response = await fetch(
      `${API_BASE}/route/compute?start_node=${startNode}&end_node=${endNode}`
    );
    return response.json();
  },

  // Reports
  async generateReport() {
    const response = await fetch(`${API_BASE}/reports/generate`);
    if (!response.ok) throw new Error('Failed to generate report');
    return response.blob();
  },
};

export default apiService;
