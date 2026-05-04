from .auth import auth_bp
from .predict import predict_bp
from .history import history_bp


def register_blueprints(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(predict_bp)
    app.register_blueprint(history_bp)