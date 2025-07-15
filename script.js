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
