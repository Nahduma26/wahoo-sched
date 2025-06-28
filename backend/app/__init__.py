from flask import Flask, Blueprint, render_template, request, jsonify
from flask_cors import CORS
from markupsafe import escape
from .routes import course_page


def create_app():
    app = Flask(__name__)
    CORS(app)
    
    app.register_blueprint(course_page, url_prefix='/api')
    return app