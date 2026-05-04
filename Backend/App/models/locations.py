from datetime import datetime
from app.extensions import db
from sqlalchemy.orm import relationship
from app.models.selections import selection_locations
from sqlalchemy.dialects.postgresql import JSONB

class Location(db.Model):
    __tablename__ = "locations"

    id = db.Column(db.Integer, primary_key=True)

    sub = db.Column(db.String(50), unique=True, nullable=False)  #AE
    dataset = db.Column(db.String(50), nullable=False)   #PJM
    geometry = db.Column(JSONB)  # GeoJSON

    selections = db.relationship('Selection', secondary = "selection_locations", back_populates="locations")

