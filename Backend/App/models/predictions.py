from datetime import datetime
from app.extensions import db

class Prediction(db.Model):
    __tablename__ = 'predictions'

    id = db.Column(db.Integer, primary_key=True)

    # ── user relation ─────────────────────────
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # ── dataset info (for history UI) ────────
    dataset = db.Column(db.String, nullable=False)   # e.g. "PJM"
    subzone = db.Column(db.String, nullable=False)    # e.g. "AE"

    # ── model metadata ────────────────────────
    model_id = db.Column(db.Integer, db.ForeignKey('models.id'), nullable=True)
    enc_in = db.Column(db.Integer, nullable=True)     # input window size

    # ── time series data ──────────────────────
    true_target = db.Column(db.JSON, nullable=False)
    predicted = db.Column(db.JSON, nullable=False)

    # optional snapshot of raw input features
    input_data = db.Column(db.JSON, nullable=True)

    # ── timestamps ────────────────────────────
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
