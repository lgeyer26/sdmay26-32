from flask import Blueprint, request, jsonify, current_app
from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature

from app.models.users import User
from app.extensions import db, mail, flask_bcrypt

auth_bp = Blueprint("auth", __name__)


def get_reset_serializer():
    return URLSafeTimedSerializer(current_app.config["SECRET_KEY"])


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    existing_user = User.query.filter_by(email=email).first()

    if existing_user and flask_bcrypt.check_password_hash(existing_user.hashed_password, password):
        return jsonify({"message": "Login successful",
                        "user_id": existing_user.id,
                        "email": existing_user.email,
                        "role": existing_user.role,
        }), 200

    return jsonify({"message": "Invalid credentials"}), 401


@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"message": "Email already exists"}), 400

    hashed_password = flask_bcrypt.generate_password_hash(password).decode("utf-8")

    new_user = User(email=email, hashed_password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully",
                    "user_id": new_user.id,
                    "email": new_user.email,
    }), 201


@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.json
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    email = data.get("email", "").strip().lower()

    if not email:
        return jsonify({"message": "Email is required"}), 400

    email = data.get("email")
    user  = User.query.filter_by(email=email).first()

    # Do NOT reveal if email exists
    if not user:
        return jsonify({"message": "If that email exists, a reset link was sent"}), 200

    serializer = get_reset_serializer()
    token = serializer.dumps(email, salt="password-reset-salt")

    frontend_url = current_app.config["FRONTEND_URL"]
    reset_link = f"{frontend_url}/reset-password?token={token}"

    msg = Message(
        subject="Reset Your Password",
        recipients=[email],
        body=f"""
You requested a password reset.

Click this link to reset your password:

{reset_link}

This link expires in 30 minutes.

If you did not request this, ignore this email.
"""
    )

    mail.send(msg)

    return jsonify({"message": "If that email exists, a reset link was sent"}), 200



@auth_bp.route("/reset-password", methods=["PUT"])
def reset_password():
    data = request.json
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    token = data.get("token", "")
    new_password = data.get("new_password", "")

    if not token or not new_password:
        return jsonify({"message": "Token and new password are required"}), 400

    serializer = get_reset_serializer()

    try:
        email = serializer.loads(
            token,
            salt="password-reset-salt",
            max_age=1800
        )
    except SignatureExpired:
        return jsonify({"message": "Reset link expired"}), 400
    except BadSignature:
        return jsonify({"message": "Invalid reset link"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "Invalid reset link"}), 400

    user.hashed_password = flask_bcrypt.generate_password_hash(new_password).decode("utf-8")
    db.session.commit()

    return jsonify({"message": "Password reset successful"}), 200