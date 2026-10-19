const $ = (s) => document.querySelector(s);
const STORAGE = "carebridge-demo-v1";
let saved = {};
try { saved = JSON.parse(localStorage.getItem(STORAGE)) || {}; } catch { saved = {}; }
function persist() { localStorage.setItem(STORAGE, JSON.stringify(saved)); }
function escapeHTML(value) { return String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c])); }
function showResult(el, title, text) {
  el.hidden = false;
  el.innerHTML = `<strong>${escapeHTML(title)}</strong>${escapeHTML(text)}`;
}
document.addEventListener("click", (e) => {
  const open = e.target.closest("[data-open]");
  if (open?.dataset.open === "emergency") $("#emergency-dialog").showModal();
  if (open?.dataset.open === "consult") $("#consult").scrollIntoView({behavior:"smooth"});
  const scroll = e.target.closest("[data-scroll]");
  if (scroll) document.getElementById(scroll.dataset.scroll).scrollIntoView({behavior:"smooth"});
  if (e.target.closest("[data-close]")) $("#emergency-dialog").close();
});
$("#checkup-form").addEventListener("submit", e => {
  e.preventDefault();
  const age = $("#age").value;
  const symptom = $("#symptom").value;
  const duration = $("#duration").value;
  const severity = document.querySelector('input[name="severity"]:checked')?.value;
  const details = $("#details").value.trim();
  const urgent = severity === "Severe";
  const summary = `Age: ${age}\nMain concern: ${symptom}\nDuration: ${duration}\nSelf-rated severity: ${severity}\nAdditional details: ${details || "Not provided"}\n\nNext step: ${urgent ? "Because you selected severe symptoms, seek prompt medical assessment. If symptoms are urgent or life-threatening, call 112 in India." : "This form cannot identify the cause. Consider contacting a qualified healthcare professional, especially if symptoms persist, worsen, or concern you."}`;
  saved.checkup = summary; persist();
  const box = $("#checkup-result");
  box.hidden = false;
  box.innerHTML = `<strong>Check-in summary</strong><pre>${escapeHTML(summary)}</pre><button type="button" class="btn btn-white" id="copy-checkup">Copy summary</button> <button type="button" class="btn btn-white" id="download-checkup">Download .txt</button>`;
});
$("#checkup-result").addEventListener("click", async e => {
  if (e.target.id === "copy-checkup") {
    try { await navigator.clipboard.writeText(saved.checkup); e.target.textContent = "Copied!"; }
    catch { alert(saved.checkup); }
  }
  if (e.target.id === "download-checkup") downloadText("health-check-summary.txt", saved.checkup);
});
$("#consult-form").addEventListener("submit", e => {
  e.preventDefault();
  const note = {
    name: $("#patient-name").value.trim(),
    contact: $("#patient-contact").value.trim(),
    careType: $("#care-type").value,
    notes: $("#consult-notes").value.trim(),
    created: new Date().toLocaleString()
  };
  saved.consultations = saved.consultations || [];
  saved.consultations.unshift(note);
  persist();
  showResult($("#consult-result"), "Consultation note saved on this device", `Type: ${note.careType}\nSaved: ${note.created}\nYou can download a copy below. This has NOT been sent to a doctor or clinic.`);
  const old = $("#download-consult");
  if (old) old.remove();
  const b = document.createElement("button");
  b.id = "download-consult"; b.className = "btn btn-white"; b.style.marginTop = "10px"; b.textContent = "Download consultation note";
  $("#consult-result").appendChild(b);
});
$("#consult-result").addEventListener("click", e => {
  if (e.target.id === "download-consult") {
    const n = (saved.consultations || [])[0];
    if (n) downloadText("consultation-note.txt", `CareBridge consultation note\nCreated: ${n.created}\nName: ${n.name || "Not provided"}\nContact: ${n.contact || "Not provided"}\nCare type: ${n.careType}\nConcern:\n${n.notes}\n\nThis is a personal note, not a booked appointment.`);
  }
});
function downloadText(name, content) {
  const url = URL.createObjectURL(new Blob([content], {type:"text/plain;charset=utf-8"}));
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const medicineData = [
  { names:["paracetamol","acetaminophen"], title:"Paracetamol (acetaminophen)", use:"Commonly used for pain and fever relief.", cautions:"Taking too much can cause serious liver damage. Check all combination products to avoid accidentally taking the same ingredient twice. Ask a clinician or pharmacist for advice about the right product and dose for you.", notes:"Check the exact strength, label directions, expiry date, and warnings. Extra caution is needed with liver disease or heavy alcohol use." },
  { names:["ibuprofen"], title:"Ibuprofen", use:"A non-steroidal anti-inflammatory medicine (NSAID) used for pain, fever, and inflammation.", cautions:"May not be suitable for people with stomach ulcers or bleeding, kidney disease, certain heart conditions, some asthma histories, or during pregnancy. It can interact with other medicines.", notes:"Ask a pharmacist or clinician before use, particularly if you take blood thinners or other anti-inflammatory medicines." },
  { names:["cetirizine"], title:"Cetirizine", use:"An antihistamine commonly used for allergy symptoms.", cautions:"Can cause sleepiness in some people. Avoid driving if it affects you and ask a pharmacist about alcohol or other sedating medicines.", notes:"Check the package instructions and ask a clinician about use for children, pregnancy, kidney problems, or other medicines." },
  { names:["ors","oral rehydration salts"], title:"Oral rehydration salts (ORS)", use:"A correctly prepared ORS solution can help replace water and salts lost through diarrhoea or vomiting.", cautions:"Mix the sachet with exactly the amount of safe water stated on the packet. Do not make it stronger or weaker.", notes:"Seek urgent care for severe dehydration, confusion, inability to drink, blood in stool, or worsening symptoms." },
  { names:["omeprazole"], title:"Omeprazole", use:"A proton pump inhibitor used for certain acid-related stomach conditions.", cautions:"The cause of persistent stomach symptoms should be assessed. It may interact with other medicines and may not be appropriate for every person.", notes:"Use according to a clinician's advice or the local product label; seek medical advice for severe or persistent symptoms." },
  { names:["amoxicillin"], title:"Amoxicillin", use:"A prescription antibiotic used for certain bacterial infections.", cautions:"Use only when prescribed for you. It does not treat viral illnesses. Allergic reactions can be serious; seek emergency help for difficulty breathing or swelling of the face or throat.", notes:"Do not share antibiotics or use leftovers. Follow the prescriber's directions and ask a pharmacist about missed doses or side effects." }
];
function renderMedicine(query) {
  const box = $("#medicine-result");
  const q = query.trim().toLowerCase();
  if (!q) return;
  const item = medicineData.find(m => m.names.some(name => name.includes(q) || q.includes(name)));
  if (item) {
    box.innerHTML = `<div class="medicine-info"><h4>${escapeHTML(item.title)}</h4><p><strong>General use:</strong> ${escapeHTML(item.use)}</p><p><strong>Safety reminders:</strong> ${escapeHTML(item.cautions)}</p><p><strong>Important:</strong> ${escapeHTML(item.notes)}</p><p class="warning">Reference information only. This is not personalized medical advice or a dosing recommendation. Confirm the exact product with a pharmacist.</p></div>`;
  } else {
    box.innerHTML = `<div class="medicine-info"><h4>No matching note in the built-in reference</h4><p>We couldn't find “${escapeHTML(query)}” in this small demo library. This does not mean the medicine is unsafe or unknown.</p><p>Check the active ingredient and strength printed on the package, then ask a registered pharmacist or clinician. Avoid guessing based on a similar name.</p><p class="warning">For a broader reference, consult an official medicine regulator or the product leaflet. This website does not verify medicines, batches, authenticity, or prescriptions.</p></div>`;
  }
}
$("#medicine-search-form").addEventListener("submit", e => { e.preventDefault(); renderMedicine($("#medicine-query").value); });
$("#search-scanned").addEventListener("click", () => {
  const text = $("#scanned-text").value.trim();
  if (!text) { $("#scan-status").textContent = "Enter a medicine name or scan a label first."; return; }
  $("#medicine-query").value = text.split(/\n|,|;/)[0].trim();
  renderMedicine($("#medicine-query").value);
  $("#medicine-result").scrollIntoView({behavior:"smooth",block:"nearest"});
});
let selectedImage = null;
$("#medicine-image").addEventListener("change", e => {
  const file = e.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) { $("#scan-status").textContent = "Please choose an image file."; return; }
  if (file.size > 12 * 1024 * 1024) { $("#scan-status").textContent = "Please choose an image under 12 MB."; return; }
  selectedImage = file;
  $("#image-preview").src = URL.createObjectURL(file);
  $("#image-preview-wrap").hidden = false;
  $("#scan-status").textContent = "Image ready. Tap “Read text from label” to try text recognition.";
});
$("#read-label").addEventListener("click", async () => {
  if (!selectedImage) return;
  const status = $("#scan-status");
  status.textContent = "Loading text recognition. Please keep this page open…";
  try {
    if (!window.Tesseract) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
        script.onload = resolve; script.onerror = () => reject(new Error("Could not load OCR library. Check your internet connection."));
        document.head.appendChild(script);
      });
    }
    const result = await window.Tesseract.recognize(selectedImage, "eng", { logger: info => {
      if (info.status) status.textContent = `Reading label: ${info.status}${info.progress != null ? " " + Math.round(info.progress * 100) + "%" : ""}`;
    }});
    $("#scanned-text").value = result.data.text.trim();
    status.textContent = result.data.text.trim() ? "Text extracted. Check spelling, medicine name, and strength carefully before searching." : "No clear text detected. Try a brighter, sharper photo or type the medicine name manually.";
  } catch (err) {
    status.textContent = `${err.message || "Text recognition failed."} You can still type the medicine name manually below.`;
  }
});
$("#clear-data").addEventListener("click", () => {
  if (!confirm("Clear saved health check-ins and consultation notes from this browser? This cannot be undone.")) return;
  saved = {};
  localStorage.removeItem(STORAGE);
  $("#checkup-result").hidden = true; $("#consult-result").hidden = true;
  $("#checkup-form").reset(); $("#consult-form").reset();
  $("#scan-status").textContent = "";
  alert("Saved local data cleared.");
});
