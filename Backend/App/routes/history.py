from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import Prediction, Selection

history_bp = Blueprint("history", __name__)

@history_bp.route("/history/<id>", methods=["GET"])
def get_history(id):
    predictions = Prediction.query.filter_by(user_id=id).all()

    return jsonify({
        "success": True,
        "history": [
            {
                "id": p.id,
                "dataset": p.dataset,
                "subzone": p.subzone,
                "true_values": p.true_target,
                "predicted_values": p.predicted,
                "created_at": p.created_at
            }
            for p in predictions
        ]
    })
