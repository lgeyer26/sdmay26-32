import os
from flask import Blueprint, request, jsonify
from app.models.predictions import Prediction
from app.models.users import User
from app.extensions import db
from app.services.model_service import ModelService
from app.services.preprocess import load_data, build_one_sample

predict_bp = Blueprint("predict", __name__)

@predict_bp.route("/predict", methods=["POST"])
def predict():
    try:
        debug_steps = []

        debug_steps.append("STEP 1: Received request")

        data = request.json

        if not data:
            return jsonify({"debug": debug_steps}), 400

        dataset = data.get("dataset")
        sub = data.get("sub")
        user_id = data.get("userId")

        debug_steps.append("STEP 3: dataset:" + dataset + " sub:" + sub)

        # FIXED CONDITION
        if dataset is None or sub is None:
            debug_steps.append("STEP 4: Missing field error")
            return jsonify({"debug": debug_steps}), 400

        # ---------------- MODEL BUILD ----------------
        checkpoint_path = os.getcwd() + "/app/utils/model_inference/ours_" + sub+ "_MS_best_model.pth"

        debug_steps.append("STEP 5: Building model")
        model, cfg = ModelService.build_model(dataset, checkpoint_path)

        debug_steps.append("STEP 6: Loading data")
        model_data, stamps = load_data(dataset, sub)

        debug_steps.append("STEP 7: Building sample")
        x_enc, x_mark_enc, x_mark_dec, true = build_one_sample(
            model_data, stamps, idx=0
        )

        debug_steps.append("STEP 8: Running inference")
        pred = ModelService.inference(
            model, cfg, x_enc, x_mark_enc, x_mark_dec
        )

        if pred is None:
            return jsonify({"debug": debug_steps}), 400

        debug_steps.append("STEP 9: Formatting result")
        result = {
            "pred": pred.squeeze().tolist(),
            "meta": {
                "dataset": dataset,
                "sub": sub,
                "enc_in": cfg.enc_in,
                "output_shape": list(pred.shape)
            },
            "true_target": true.squeeze().tolist()
        }

        # ---------------- DATABASE ----------------
        debug_steps.append("STEP 10: Querying user")

        if user_id is not None:
            debug_steps.append("STEP 11: Writing to DB")
            prediction = Prediction(
                user_id=user_id,
                dataset=dataset,
                subzone=sub,
                true_target=true.squeeze().tolist(),
                predicted=pred.squeeze().tolist(),
                enc_in=cfg.enc_in
            )
            db.session.add(prediction)
            db.session.commit()

        debug_steps.append("STEP 12: Success")
        return jsonify(result)

    except Exception as e:
        import traceback
        print("ERROR:", str(e), flush=True)
        traceback.print_exc()
        return jsonify({"debug": debug_steps}), 500
