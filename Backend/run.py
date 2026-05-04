from app import create_app
import os

config_name = os.getenv("FLASK_CONFIG", "development")

app = create_app("dev")

if __name__ == "__main__":
    app.run(
        host = "0.0.0.0",
        port=5000,
        debug=(config_name == "development")
    )
