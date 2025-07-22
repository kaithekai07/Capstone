// CarReview.jsx
import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, TextField, Button, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

export default function CarReview({ extractedData, carId }) {
  const [data, setData] = useState(extractedData);

  const handleChange = (section, index, key, value) => {
    const updated = [...data[section]];
    updated[index][key] = value;
    setData({ ...data, [section]: updated });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("https://your-backend-url/submit-car", {
        car_id: carId,
        data
      });
      alert("✅ Submitted!");
    } catch (err) {
      alert("❌ Submission failed");
      console.error(err);
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>Review Extracted Data</Typography>

      {Object.entries(data).map(([section, records], secIndex) => (
        <Accordion key={section} defaultExpanded={secIndex === 0}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}><b>{section}</b></AccordionSummary>
          <AccordionDetails>
            {records.map((row, rowIndex) => (
              <div key={rowIndex} style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "10px" }}>
                {Object.entries(row).map(([key, value]) => (
                  <TextField
                    key={key}
                    label={key}
                    value={value}
                    onChange={(e) => handleChange(section, rowIndex, key, e.target.value)}
                    fullWidth
                    margin="dense"
                  />
                ))}
              </div>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}

      <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: 20 }}>
        ✅ Confirm & Submit
      </Button>
    </div>
  );
}
