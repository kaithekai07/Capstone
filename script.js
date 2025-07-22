function handleUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const loader = document.getElementById("loading-screen");
  const status = document.getElementById("upload-status");
  const resultLink = document.getElementById("result-link");

  loader.style.display = "block";
  status.innerText = "🔍 Reading file...";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("carId", "CAR-" + Math.floor(Math.random() * 1000));
  formData.append("date", new Date().toISOString().slice(0, 10));
  formData.append("description", "Uploaded from frontend");

  fetch("https://your-backend-domain.com/analyze", {
    method: "POST",
    body: formData,
  })
    .then(res => res.json())
    .then(data => {
      if (data.download_url) {
        status.innerText = "✅ Upload complete!";
        resultLink.innerHTML = `<a href="${data.download_url}" target="_blank">Download Excel</a>`;
      } else {
        status.innerText = "❌ Upload failed.";
      }
    })
    .catch(err => {
      console.error(err);
      status.innerText = "❌ Network error.";
    })
    .finally(() => {
      setTimeout(() => loader.style.display = "none", 3000);
    });
}

let extractedData = {};

function createEditableSection(sectionName, records) {
  const container = document.createElement("div");
  container.className = "section";
  container.innerHTML = `<h3>${sectionName}</h3>`;

  records.forEach((record, idx) => {
    const recordDiv = document.createElement("div");
    recordDiv.className = "record";

    Object.entries(record).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.value = value;
      input.oninput = (e) => {
        extractedData[sectionName][idx][key] = e.target.value;
      };
      const label = document.createElement("label");
      label.textContent = key;
      recordDiv.appendChild(label);
      recordDiv.appendChild(input);
    });

    container.appendChild(recordDiv);
  });

  return container;
}

async function uploadAndExtract() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  if (!file) return alert("Please select a file");

  const formData = new FormData();
  const carId = "CAR-" + Date.now();
  formData.append("file", file);
  formData.append("carId", carId);

  const res = await fetch("https://your-backend-url.com/analyze", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (data.error) return alert("❌ Extraction failed");

  extractedData = data.data;

  const container = document.getElementById("reviewContainer");
  container.innerHTML = "";

  Object.entries(extractedData).forEach(([section, records]) => {
    const sectionEl = createEditableSection(section, records);
    container.appendChild(sectionEl);
  });

  document.getElementById("submitBtn").style.display = "block";
}

async function submitToSupabase() {
  const res = await fetch("https://your-backend-url.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(extractedData),
  });

  const result = await res.json();
  if (result.error) return alert("Submission failed");
  alert("✅ Submitted to Supabase!");
}
