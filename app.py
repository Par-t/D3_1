from flask import Flask, send_from_directory, jsonify , request
from flask_cors import CORS  
import os
import pandas as pd
import atexit  

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
    try:
        # Read the main data file
        df = pd.read_csv(CSV_FILE)
        
        # Define columns to aggregate
        demographic_columns = [
            'Hispanic', 'White', 'Black', 'Native', 'Asian', 
            'Pacific', 'Men', 'Women', 'TotalPop', 'Income'
        ]
        
        # Create grouped state data with all demographics
        state_grouped = df.groupby('State').agg({
            column: 'sum' for column in demographic_columns
        }).reset_index()
        
        state_grouped[['Hispanic', 'White', 'Black', 'Native', 'Asian', 'Pacific']] = (
        state_grouped[['Hispanic', 'White', 'Black', 'Native', 'Asian', 'Pacific']].div(
            state_grouped['TotalPop'], axis=0)).mul(100)
        
        # Create grouped county data with all demographics
        county_grouped = df.groupby('County').agg({
            column: 'sum' for column in demographic_columns
        }).reset_index()
        
        # Sort by population in descending order
        state_grouped = state_grouped.sort_values('TotalPop', ascending=False)
        county_grouped = county_grouped.sort_values('TotalPop', ascending=False)
        
        # Round all numeric columns to 2 decimal places
        numeric_columns = demographic_columns
        state_grouped[numeric_columns] = state_grouped[numeric_columns].round(2)
        county_grouped[numeric_columns] = county_grouped[numeric_columns].round(2)
        
        # Save to CSV files
        state_grouped.to_csv(STATE_CSV, index=False)
        county_grouped.to_csv(COUNTY_CSV, index=False)
        
        print("Successfully created grouped data files with demographic information")
        
    except Exception as e:
        print(f"Error creating grouped data: {e}")

# Function to clean up grouped data files on exit
def cleanup_files():
    try:
        if os.path.exists(STATE_CSV):
            os.remove(STATE_CSV)
        if os.path.exists(COUNTY_CSV):
            os.remove(COUNTY_CSV)
        print("Cleaned up grouped data files")
    except Exception as e:
        print(f"Error cleaning up files: {e}")

# Register the cleanup function to run on exit
atexit.register(cleanup_files)

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
    # Create grouped files on startup
    update_grouped_data()
    app.run(debug=True)
