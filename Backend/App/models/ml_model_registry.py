from datetime import datetime
from app.extensions import db


selection_model = db.Table(
    "selection_model",
    db.Column(
        "selection_id",
        db.Integer,
        db.ForeignKey("selections.id"),
        primary_key=True,
    ),
    db.Column(
        "model_id",
        db.Integer,
        db.ForeignKey("models.id"),
        primary_key=True,
    ),
)


class ModelRegistry(db.Model):
    __tablename__ = 'models'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    description = db.Column(db.String(255))

    model_path = db.Column(db.String(255), nullable=False)
    
    selections = db.relationship('Selection', secondary="selection_model", back_populates='models')

    def __repr__(self):
        return f"<MLModelRegistry {self.name}>"