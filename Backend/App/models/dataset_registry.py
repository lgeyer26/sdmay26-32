from datetime import datetime
from app.extensions import db
from sqlalchemy.orm import relationship


class DatasetRegistry(db.Model):
    __tablename__ = "datasets"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)

    data_type = db.Column(db.String(50))   # load / weather
    region = db.Column(db.String(50))