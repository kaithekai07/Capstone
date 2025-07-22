import React, { useEffect, useState } from "react";
import "./ExtractReview.css";

export default function ExtractReview() {
  const [data, setData] = useState({});
  const [section, setSection] = useState("Section_A");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("extractedData");
    if (raw) setData(JSON.parse(raw));
  }, []);

  const handleChange = (sec, idx, key, val) => {
    const updated = { ...data };
    updated[sec][idx][key] = val;
    setData(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setStatus("Submitting...");
    try {
      const res = await fetch("https://your-backend-url/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      setStatus(result.result || result.error || "Submitted.");
    } catch (err) {
      setStatus("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const sectionLabels = {
    Section_A: "General Info",
    Section_B1: "Chronology",
    Section_B2: "Cost Impact",
    Section_C: "Root Cause (5Why)",
    Section_D: "Correction Taken",
    Section_E1: "Corrective Action",
    Section_E2: "Conclusion Review"
  };

  return (
    <div className="review-container">
      <aside className="sidebar">
        {Object.keys(sectionLabels).map((key) => (
          <button
            key={key}
            className={section === key ? "active" : ""}
            onClick={() => setSection(key)}
          >
            {sectionLabels[key]}
          </button>
        ))}
        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
          ✅ Submit to Supabase
        </button>
        {loading && <p>Submitting...</p>}
        {status && <p>{status}</p>}
      </aside>

      <main className="section-content">
        <h2>{sectionLabels[section]}</h2>
        {data[section]?.map((record, i) => (
          <div key={i} className="record-box">
            {Object.entries(record).map(([key, val]) => (
              <div key={key} className="input-group">
                <label>{key}</label>
                <input
                  value={val}
                  onChange={(e) => handleChange(section, i, key, e.target.value)}
                />
              </div>
            ))}
          </div>
        ))}
      </main>
    </div>
  );
}
"""

css_code = """
.review-container {
  display: flex;
  font-family: Arial, sans-serif;
  height: 100vh;
}

.sidebar {
  width: 250px;
  background: #f1f5f9;
  padding: 1rem;
  border-right: 1px solid #ccc;
  display: flex;
  flex-direction: column;
}

.sidebar button {
  margin-bottom: 0.5rem;
  padding: 0.75rem;
  font-size: 1rem;
  border: none;
  text-align: left;
  background: none;
  cursor: pointer;
  border-radius: 5px;
}

.sidebar button:hover,
.sidebar .active {
  background-color: #2563eb;
  color: white;
}

.submit-btn {
  margin-top: auto;
  background-color: #10b981 !important;
  color: white !important;
}

.section-content {
  flex-grow: 1;
  padding: 2rem;
  overflow-y: auto;
}

.record-box {
  background: #ffffff;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.75rem;
}

.input-group label {
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.input-group input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}
