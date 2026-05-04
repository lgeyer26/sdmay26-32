from flask import Blueprint, request, jsonify, Response
import csv
import io
from app.extensions import db
from app.models import Prediction

export_bp = Blueprint("export", __name__)

@export_bp.route("/export", methods=["POST"])
def export_prediction():
    data = request.json
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    prediction_id = data.get("prediction_id")
    if not prediction_id:
        return jsonify({"message": "prediction_id is required"}), 400

    # Query prediction
    prediction = (
        db.session.query(Prediction)
        .filter(Prediction.id == prediction_id)
        .first()
    )

    if not prediction:
        return jsonify({"message": "Prediction not found"}), 404

    # Get related selection
    selection = prediction.selection

    # Create CSV in memory
    output = io.StringIO()
    writer = csv.writer(output)

    # Header
    writer.writerow([
        "prediction_id",
        "timestamp",
        "model",
        "location",
        "output"
    ])

    # Loop through models and locations
    for model in selection.models:
        for location in selection.locations:
            writer.writerow([
                prediction.id,
                prediction.created_at,
                model.name,
                location.sub,
                prediction.output_data
            ])

    # Create response
    response = Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=prediction_{prediction.id}.csv"
        }
    )

    return response