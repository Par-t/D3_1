from flask import Flask, request, jsonify, send_from_directory
import pandas as pd
import os
from flask_cors import CORS  # Add this import

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
    df = pd.DataFrame(columns=["TractId", "State", "County", "Value1", "Value2"])  # Modify columns as needed
    df.to_csv(CSV_FILE, index=False)
except Exception as e:
    print(f"Error loading CSV: {e}")
    df = pd.DataFrame(columns=["TractId", "State", "County", "Value1", "Value2"])  # Safe fallback

# Function to update grouped data and save them
def update_grouped_data():
    grouped_county = df.groupby("County", as_index=False).agg(
        {col: "sum" if col not in ["TractId", "State", "County"] else "first" for col in df.columns}
    )
    grouped_state = df.groupby('State', as_index=False).sum()
    grouped_state = grouped_state.drop(['TractId', 'County'], axis=1)

    grouped_county.to_csv(COUNTY_CSV, index=False)
    grouped_state.to_csv(STATE_CSV, index=False)
    
    return grouped_county, grouped_state

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



# Serve index.html for D3.js visualization
@app.route("/")
def index():
    return send_from_directory("static", "index.html")

if __name__ == "__main__":
    app.run(debug=True)
