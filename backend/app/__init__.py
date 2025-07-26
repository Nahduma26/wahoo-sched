from flask import Flask, Blueprint, render_template, request, jsonify
from flask_cors import CORS
from markupsafe import escape
from .routes import course_page
from dotenv import load_dotenv
import os

load_dotenv()
def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config['SECRET_KEY'] = os.getenv('OPENAI_API_KEY')
    print(f"SECRET_KEY: {app.config['SECRET_KEY']}")
    app.register_blueprint(course_page, url_prefix='/api')
    return app