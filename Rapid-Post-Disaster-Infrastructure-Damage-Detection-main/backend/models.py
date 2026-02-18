from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Disaster(Base):
    __tablename__ = "disasters"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    type = Column(String)  # EARTHQUAKE, FLOOD, FIRE
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    incidents = relationship("Incident", back_populates="disaster")

class Incident(Base):
    __tablename__ = "incidents"
    id = Column(Integer, primary_key=True, index=True)
    disaster_id = Column(Integer, ForeignKey("disasters.id"))
    
    type = Column(String) # DAMAGE, HAZARD, BLOCKED
    severity = Column(String) # CRITICAL, MODERATE, LOW
    confidence = Column(Float)
    
    # Spatial Point (stored as JSON string)
    location = Column(String)  # JSON: {"lat": 0.0, "lng": 0.0}
    
    description = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    disaster = relationship("Disaster", back_populates="incidents")

class Road(Base):
    __tablename__ = "roads"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    status = Column(String) # OPEN, BLOCKED, RESTRICTED
    capacity = Column(Integer)
    
    # Spatial LineString (stored as JSON string)
    geometry = Column(String)  # JSON: coordinates

class Building(Base):
    __tablename__ = "buildings"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String) # RESIDENTIAL, HOSPITAL, SHELTER
    damage_level = Column(Float) # 0.0 to 1.0
    
    # Spatial Polygon (stored as JSON string)
    geometry = Column(String)  # JSON: coordinates

class EmergencyNode(Base):
    __tablename__ = "emergency_nodes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    type = Column(String) # HOSPITAL, FIRE_STATION, HELIPAD
    
    location = Column(String)  # JSON: {"lat": 0.0, "lng": 0.0}

class Imagery(Base):
    __tablename__ = "imagery"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    timestamp = Column(DateTime)
    type = Column(String) # PRE, POST
    url = Column(String)
