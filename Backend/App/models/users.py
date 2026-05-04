from datetime import datetime
from app.extensions import db
from sqlalchemy.orm import relationship


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, index=True)
    email = db.Column(db.String, unique=True, nullable=False)
    hashed_password = db.Column(db.String, nullable=False)
    role = db.Column(db.String, default="public")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    login_at = db.Column(db.DateTime)
    is_verified = db.Column(db.Boolean, default=False)

    predictions = db.relationship('Prediction', backref='user', lazy=True)
    selections = db.relationship('Selection', backref='user', lazy=True)
