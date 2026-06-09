# Placement Predictor — Local Setup Guide

## Project Structure

```
placement_app/
├── backend/
│   ├── app.py              ← Flask API server
│   ├── model.pkl           ← Trained Decision Tree
│   ├── transformer.pkl     ← ColumnTransformer (fitted)
│   ├── label_encoder.pkl   ← LabelEncoder for Placed column
│   ├── feature_columns.json
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   └── index.js
    ├── public/
    │   └── index.html
    └── package.json
```

---

## Step 1 — Set up the Python backend

Open a terminal and run:

```bash
cd placement_app/backend

# Create a virtual environment (recommended)
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the Flask server
python app.py
```

You should see:
```
* Running on http://127.0.0.1:5000
```

Keep this terminal open.

---

## Step 2 — Set up the React frontend

Open a **second** terminal:

```bash
cd placement_app/frontend

# Install Node dependencies (one-time)
npm install

# Start the React dev server
npm start
```

The browser will open at **http://localhost:3000**

---

## Step 3 — Use the app

- Fill in the student profile using sliders and dropdowns
- Click **Predict Placement**
- See the prediction with confidence %

---

## Notes

- The model has **80% accuracy** on the test set (Decision Tree, 250-row dataset).
- Both servers must be running simultaneously (Flask on :5000, React on :3000).
- Node.js 16+ required. Python 3.8+ required.
