from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import json

app = Flask(__name__)
CORS(app)

model = joblib.load("model.pkl")
transformer = joblib.load("transformer.pkl")
label_encoder = joblib.load("label_encoder.pkl")

with open("feature_columns.json") as f:
    feature_columns = json.load(f)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        df = pd.DataFrame([data], columns=feature_columns)
        # Cast numeric fields
        numeric_cols = ['College_Tier','CGPA','Active_Backlogs','Gap_Years',
                        'Num_Projects','GitHub_Repos','Num_Certifications',
                        'Hackathons_Won','Num_Internships','Communication_Score',
                        'Aptitude_Score','Companies_Applied','Companies_Shortlisted']
        for col in numeric_cols:
            df[col] = pd.to_numeric(df[col])

        transformed = transformer.transform(df)
        pred = model.predict(transformed)[0]
        prob = model.predict_proba(transformed)[0]
        label = label_encoder.inverse_transform([pred])[0]
        confidence = round(float(max(prob)) * 100, 1)

        return jsonify({
            "placed": label,
            "confidence": confidence,
            "placed_prob": round(float(prob[list(label_encoder.classes_).index("Yes")]) * 100, 1)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
