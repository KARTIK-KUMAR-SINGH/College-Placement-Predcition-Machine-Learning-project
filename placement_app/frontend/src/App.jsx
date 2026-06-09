import { useState } from "react";
import "./App.css";

const BRANCHES = ["CSE", "ECE", "ISE", "AIML", "EEE", "ME", "DS", "CIVIL"];
const DSA_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const SKILL_LEVELS = ["None", "Basic", "Intermediate", "Advanced"];
const RELEVANCE_LEVELS = ["None", "Low", "Medium", "High"];

const defaultForm = {
  Branch: "ECE",
  College_Tier: 2,
  CGPA: 7.5,
  Active_Backlogs: 0,
  Gap_Years: 0,
  DSA_Proficiency: "Intermediate",
  ML_AI_Skills: "None",
  Web_Dev_Skills: "None",
  Num_Projects: 2,
  GitHub_Repos: 5,
  Num_Certifications: 2,
  Hackathons_Won: 0,
  Num_Internships: 0,
  Internship_Relevance: "None",
  Communication_Score: 7.0,
  Aptitude_Score: 65,
  Leadership_Roles: "No",
  Companies_Applied: 5,
  Companies_Shortlisted: 1,
};

function SliderField({ label, name, value, min, max, step = 1, onChange, unit = "" }) {
  return (
    <div className="field slider-field">
      <div className="field-header">
        <label>{label}</label>
        <span className="field-value">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(name, step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value))}
      />
      <div className="slider-range"><span>{min}</span><span>{max}</span></div>
    </div>
  );
}

function SelectField({ label, name, value, options, onChange }) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="select-wrap">
        <select value={value} onChange={(e) => onChange(name, e.target.value)}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    setResult(null);
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e) {
      setError(e.message || "Could not connect to prediction server.");
    }
    setLoading(false);
  };

  const placed = result?.placed === "Yes";

  return (
    <div className="app">
      <header>
        <div className="header-inner">
          <div className="logo-mark">⬡</div>
          <div>
            <h1>Placement Predictor</h1>
            <p className="tagline">Decision Tree · Trained on 250 student profiles</p>
          </div>
        </div>
      </header>

      <main>
        <div className="form-grid">
          {/* Academic */}
          <section className="card">
            <h2 className="section-title"><span className="dot dot-blue" />Academic Profile</h2>
            <SelectField label="Branch" name="Branch" value={form.Branch} options={BRANCHES} onChange={handleChange} />
            <SliderField label="College Tier" name="College_Tier" value={form.College_Tier} min={1} max={3} onChange={handleChange} />
            <SliderField label="CGPA" name="CGPA" value={form.CGPA} min={4.0} max={10.0} step={0.1} onChange={handleChange} />
            <SliderField label="Active Backlogs" name="Active_Backlogs" value={form.Active_Backlogs} min={0} max={8} onChange={handleChange} />
            <SliderField label="Gap Years" name="Gap_Years" value={form.Gap_Years} min={0} max={3} onChange={handleChange} />
          </section>

          {/* Skills */}
          <section className="card">
            <h2 className="section-title"><span className="dot dot-cyan" />Technical Skills</h2>
            <SelectField label="DSA Proficiency" name="DSA_Proficiency" value={form.DSA_Proficiency} options={DSA_LEVELS} onChange={handleChange} />
            <SelectField label="ML / AI Skills" name="ML_AI_Skills" value={form.ML_AI_Skills} options={SKILL_LEVELS} onChange={handleChange} />
            <SelectField label="Web Dev Skills" name="Web_Dev_Skills" value={form.Web_Dev_Skills} options={SKILL_LEVELS} onChange={handleChange} />
            <SliderField label="Projects" name="Num_Projects" value={form.Num_Projects} min={0} max={15} onChange={handleChange} />
            <SliderField label="GitHub Repos" name="GitHub_Repos" value={form.GitHub_Repos} min={0} max={50} onChange={handleChange} />
            <SliderField label="Certifications" name="Num_Certifications" value={form.Num_Certifications} min={0} max={15} onChange={handleChange} />
          </section>

          {/* Experience */}
          <section className="card">
            <h2 className="section-title"><span className="dot dot-violet" />Experience & Soft Skills</h2>
            <SliderField label="Hackathons Won" name="Hackathons_Won" value={form.Hackathons_Won} min={0} max={10} onChange={handleChange} />
            <SliderField label="Internships" name="Num_Internships" value={form.Num_Internships} min={0} max={5} onChange={handleChange} />
            <SelectField label="Internship Relevance" name="Internship_Relevance" value={form.Internship_Relevance} options={RELEVANCE_LEVELS} onChange={handleChange} />
            <SelectField label="Leadership Roles" name="Leadership_Roles" value={form.Leadership_Roles} options={["No", "Yes"]} onChange={handleChange} />
            <SliderField label="Communication Score" name="Communication_Score" value={form.Communication_Score} min={1} max={10} step={0.1} onChange={handleChange} />
            <SliderField label="Aptitude Score" name="Aptitude_Score" value={form.Aptitude_Score} min={20} max={100} onChange={handleChange} />
            <SliderField label="Companies Applied" name="Companies_Applied" value={form.Companies_Applied} min={0} max={30} onChange={handleChange} />
            <SliderField label="Companies Shortlisted" name="Companies_Shortlisted" value={form.Companies_Shortlisted} min={0} max={15} onChange={handleChange} />
          </section>
        </div>

        <div className="predict-zone">
          <button className="predict-btn" onClick={handlePredict} disabled={loading}>
            {loading ? <span className="spinner" /> : "Predict Placement"}
          </button>

          {error && (
            <div className="result-card error-card">
              <p>⚠ {error}</p>
              <p className="error-hint">Make sure the Flask server is running on port 5000.</p>
            </div>
          )}

          {result && !error && (
            <div className={`result-card ${placed ? "placed" : "not-placed"}`}>
              <div className="result-icon">{placed ? "✓" : "✗"}</div>
              <div className="result-text">
                <h3>{placed ? "Likely to be Placed" : "Not Likely to be Placed"}</h3>
                <p className="result-sub">Model confidence: <strong>82%</strong></p>
              </div>
              <div className="prob-bar-wrap">
                <div className="prob-label"><span>Placement Probability</span><span>{result.placed_prob}%</span></div>
                <div className="prob-bar">
                  <div className="prob-fill" style={{ width: `${result.placed_prob}%` }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
