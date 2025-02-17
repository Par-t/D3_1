from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS  # Add this import
import os
import pandas as pd

app = Flask(__name__)
CORS(app)
# Ensure a folder exists for storing CSV files
UPLOAD_FOLDER = "data"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

CSV_FILE = os.path.join(UPLOAD_FOLDER, "data.csv")
COUNTY_CSV = os.path.join(UPLOAD_FOLDER, "grouped_county.csv")
STATE_CSV = os.path.join(UPLOAD_FOLDER, "grouped_state.csv")

# Try loading CSV; if it fails, create a new one
try:
    df = pd.read_csv(CSV_FILE)
except FileNotFoundError:
    df = pd.DataFrame()
    df.to_csv(CSV_FILE, index=False)
except Exception as e:
    print(f"Error loading CSV file: {e}")

# Function to update grouped data and save them
def update_grouped_data():
    # Implement your data grouping logic here
    pass

# Ensure grouped data is available on startup
update_grouped_data()

# Route to get county-level data
@app.route("/data/county", methods=["GET"])
def get_county_data():
    grouped_county = pd.read_csv(COUNTY_CSV)
    return jsonify(grouped_county.to_dict(orient="records"))

# Route to get state-level data
@app.route("/data/state", methods=["GET"])
def get_state_data():
    grouped_state = pd.read_csv(STATE_CSV)
    return jsonify(grouped_state.to_dict(orient="records"))

# Route to get ethnicity data
@app.route("/data/ethnicity", methods=["GET"])
def get_ethnicity_data():
    ethnicity_sums = df[['Hispanic', 'White', 'Black', 'Native', 'Asian', 'Pacific']].sum()
    ethnicity_data = ethnicity_sums.reset_index().rename(columns={0: 'TotalPop', 'index': 'Ethnicity'})
    return jsonify(ethnicity_data.to_dict(orient="records"))

# Route to get gender data
@app.route("/data/gender", methods=["GET"])
def get_gender_data():
    gender_sums = df[['Men', 'Women']].sum()
    gender_data = gender_sums.reset_index().rename(columns={0: 'TotalPop', 'index': 'Gender'})
    return jsonify(gender_data.to_dict(orient="records"))

# Serve index.html for D3.js visualization
@app.route("/")
def index():
    return send_from_directory("static", "index.html")

if __name__ == "__main__":
    app.run(debug=True)
