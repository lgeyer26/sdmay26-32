from datetime import datetime
from app.extensions import db
from sqlalchemy.orm import relationship
from app.models.ml_model_registry import selection_model


selection_locations = db.Table(
    "selection_locations",
    db.Column("selection_id", db.Integer, db.ForeignKey("selections.id"), primary_key=True),
    db.Column("location_id", db.Integer, db.ForeignKey("locations.id"), primary_key=True)
)

class Selection(db.Model):
    __tablename__ = "selections"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # what user selected
    models = db.relationship("ModelRegistry", secondary=selection_model, back_populates='selections')
    forecast_horizon = db.Column(db.String(50))

    start_time = db.Column(db.DateTime)
    end_time = db.Column(db.DateTime)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    #relationship 
    locations = db.relationship('Location', secondary = selection_locations, back_populates="selections")
