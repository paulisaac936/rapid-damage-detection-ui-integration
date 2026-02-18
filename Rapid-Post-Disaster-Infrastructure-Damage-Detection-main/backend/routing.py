import networkx as nx
import math

class RoutingEngine:
    def __init__(self):
        self.graph = nx.Graph()
        self._build_mock_graph()

    def _build_mock_graph(self):
        # Create a simple grid graph representing LA Downtown streets
        # Nodes are (lat, lng) tuples (simplified)
        
        # Base Node (Medical Alpha)
        self.graph.add_node("base-alpha", pos=(34.0552, -118.2457), type="SAFE")
        
        # Incident Nodes
        self.graph.add_node("incident-1", pos=(34.0622, -118.2537), type="DANGER")
        self.graph.add_node("incident-2", pos=(34.0422, -118.2337), type="DANGER")
        
        # Intermediates
        self.graph.add_node("node-a", pos=(34.0580, -118.2500))
        self.graph.add_node("node-b", pos=(34.0500, -118.2400))
        
        # Edges with weights (distance/risk)
        self.graph.add_edge("base-alpha", "node-a", weight=5)
        self.graph.add_edge("node-a", "incident-1", weight=8)
        self.graph.add_edge("base-alpha", "node-b", weight=4)
        self.graph.add_edge("node-b", "incident-2", weight=10)
        
        # Cross connection
        self.graph.add_edge("node-a", "node-b", weight=6)

    def compute_route(self, start_id: str, end_id: str):
        try:
            path = nx.dijkstra_path(self.graph, start_id, end_id, weight='weight')
            length = nx.dijkstra_path_length(self.graph, start_id, end_id, weight='weight')
            
            # Convert path to coordinates for the frontend
            coords = []
            for node in path:
                if 'pos' in self.graph.nodes[node]:
                    lat, lng = self.graph.nodes[node]['pos']
                    coords.append({"lat": lat, "lng": lng})
            
            return {
                "path": coords,
                "total_cost": length,
                "nodes": path
            }
        except nx.NetworkXNoPath:
            return None
        except Exception as e:
            print(f"Routing Error: {e}")
            return None

router = RoutingEngine()
