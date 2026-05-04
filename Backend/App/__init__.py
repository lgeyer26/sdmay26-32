from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from .extensions import db, flask_bcrypt, mail

from app.models import users, selections, predictions, ml_model_registry, locations

migrate = Migrate()

def create_app(config_name):
    app = Flask(__name__)

    @app.route("/")
    def index():
        return "Backend is running"

    app.config.from_object("config.Config")

    db.init_app(app)
    flask_bcrypt.init_app(app)
    mail.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    from .routes import register_blueprints
    register_blueprints(app)

    return app