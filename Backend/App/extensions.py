from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_mail import Mail

db = SQLAlchemy()
flask_bcrypt = Bcrypt()
mail = Mail()