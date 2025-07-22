// CarReview.jsx
import React, { useEffect, useState } from 'react';

export default function ExtractReview() {
  const [data, setData] = useState({});
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("extractedData");
    if (raw) {
      setData(JSON.parse(raw));
    }
  }, []);

  const handleChange = (section, index, key, value) => {
    const updated = { ...data };
    updated[section][index][key] = value;
    setData(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setStatus("Submitting to database...");

    try {
      const res = await fetch("https://your-backend-url/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      setLoading(false);
      setStatus(result.result || result.error || "Submitted.");
    } catch (err) {
      setLoading(false);
      setStatus("❌ Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>📝 Review Extracted CAR Data</h2>
      {Object.entries(data).map(([section, records]) => (
        <div key={section} style={{ marginBottom: "2rem" }}>
          <h3>{section}</h3>
          {records.map((record, i) => (
            <div key={i} style={{
              border: "1px solid #ccc",
              padding: "1rem",
              borderRadius: "6px",
              marginBottom: "1rem"
            }}>
              {Object.entries(record).map(([key, value]) => (
                <div key={key} style={{ marginBottom: "0.5rem" }}>
                  <label style={{ fontWeight: "bold" }}>{key}: </label>
                  <input
                    style={{ marginLeft: "0.5rem", padding: "0.25rem", width: "60%" }}
                    value={value}
                    onChange={e => handleChange(section, i, key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "5px",
          fontSize: "1rem"
        }}
        disabled={loading}
      >
        ✅ Submit to Supabase
      </button>

      {loading && <p>Submitting...</p>}
      {status && <p>{status}</p>}
    </div>
  );
}
