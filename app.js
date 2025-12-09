// ---------- DATA MODEL ----------
let items = [
  {
    id: 1,
    name: "Electronics Lab 1",
    type: "lab",
    location: "FCI CQAR3005",
    status: "available",
    tags: ["electronics", "oscilloscope", "soldering"],
    link: "https://be-iitkgp.vlabs.ac.in/" 
  },
  {
    id: 2,
    name: "AI Computing Lab",
    type: "lab",
    location: "FCI CQAR4002",
    status: "busy",
    tags: ["ai", "gpu", "python"],
    link: "https://www.sdu.dk/en/forskning/stem/fnug-labs/ai-learning-lab"
  },
  {
    id: 3,
    name: "3D Printer (Ender 3)",
    type: "equipment",
    location: "FCI CQAR1002",
    status: "maintenance",
    tags: ["3d printing", "prototype"],
    link: "https://www.tinkercad.com/"
  },
  {
    id: 4,
    name: "MATLAB Campus License",
    type: "software",
    location: "Available in all PC labs",
    status: "available",
    tags: ["software", "matlab"],
    link: "https://matlab.mathworks.com/" // example interactive resource
  },
  {
    id: 5,
    name: "Physics Lab – Optics",
    type: "lab",
    location: "FAIE CQAR4002",
    status: "available",
    tags: ["physics", "optics", "laser"],
    link: "https://www.birmingham.ac.uk/study/undergraduate/schools-and-colleges/post-16/a-level-stem-resources/electrical-properties"
  },
];

let adminMode = false;
let editingId = null; // which card is currently being edited

// 🔐 Change this if you want a different password
const ADMIN_PASSWORD = "soloranger";

// ---------- HELPERS ----------
function statusLabel(status) {
  if (status === "available") return "Available";
  if (status === "busy") return "Busy / Crowded";
  return "Under Maintenance";
}

function statusColor(status) {
  if (status === "available") return "#16a34a"; // green
  if (status === "busy") return "#ea580c"; // orange
  return "#b91c1c"; // red
}

// ---------- RENDER ----------
function renderResources() {
  const listEl = document.getElementById("resourcesList");
  const search = document.getElementById("searchInput").value.toLowerCase();
  const filterType = document.getElementById("typeFilter").value;

  const filtered = items.filter((item) => {
    const matchesType = filterType === "all" || item.type === filterType;
    const text =
      (item.name + " " + item.location + " " + item.tags.join(" ")).toLowerCase();
    const matchesSearch = text.includes(search);
    return matchesType && matchesSearch;
  });

  if (filtered.length === 0) {
    listEl.innerHTML =
      '<p class="empty">No resources found. Try another keyword or filter.</p>';
    return;
  }

  let html = "";

  filtered.forEach((item) => {
    // If this item is currently being edited (and admin mode is on)
    if (adminMode && editingId === item.id) {
      const tagsString = item.tags.join(", ");
      html += `
        <div class="card editing">
          <h3>Edit Resource</h3>
          <div class="edit-fields">
            <label>
              Name:
              <input type="text" class="edit-name" value="${item.name}" data-id="${item.id}" />
            </label>
            <label>
              Type:
              <select class="edit-type" data-id="${item.id}">
                <option value="lab" ${item.type === "lab" ? "selected" : ""}>Lab</option>
                <option value="equipment" ${item.type === "equipment" ? "selected" : ""}>Equipment</option>
                <option value="software" ${item.type === "software" ? "selected" : ""}>Software</option>
              </select>
            </label>
            <label>
              Location:
              <input type="text" class="edit-location" value="${item.location}" data-id="${item.id}" />
            </label>
            <label>
              Tags (comma separated):
              <input type="text" class="edit-tags" value="${tagsString}" data-id="${item.id}" />
            </label>
            <label>
              Interactive link (optional):
              <input type="text" class="edit-link" value="${item.link || ""}" data-id="${item.id}" />
            </label>
            <label>
              Status:
              <select class="edit-status" data-id="${item.id}">
                <option value="available" ${item.status === "available" ? "selected" : ""}>Available</option>
                <option value="busy" ${item.status === "busy" ? "selected" : ""}>Busy / Crowded</option>
                <option value="maintenance" ${item.status === "maintenance" ? "selected" : ""}>Under Maintenance</option>
              </select>
            </label>
          </div>
          <div class="edit-actions">
            <button class="save-edit-btn" data-id="${item.id}">Save</button>
            <button class="cancel-edit-btn" data-id="${item.id}">Cancel</button>
          </div>
        </div>
      `;
      return; // skip normal display for this item
    }

    const tagsHtml = item.tags
      .map((t) => `<span class="tag">#${t}</span>`)
      .join(" ");

    const openButton = item.link
      ? `<a class="open-btn" href="${item.link}" target="_blank" rel="noopener noreferrer">Open Resource</a>`
      : "";

    const adminControls = adminMode
      ? `
      <div class="admin-controls">
        <label>Change status:</label>
        <select data-id="${item.id}" class="status-select">
          <option value="available" ${
            item.status === "available" ? "selected" : ""
          }>Available</option>
          <option value="busy" ${
            item.status === "busy" ? "selected" : ""
          }>Busy / Crowded</option>
          <option value="maintenance" ${
            item.status === "maintenance" ? "selected" : ""
          }>Under Maintenance</option>
        </select>
        <button class="edit-btn" data-id="${item.id}">Edit</button>
      </div>
    `
      : "";

    html += `
      <div class="card">
        <h3>${item.name}</h3>
        <p class="meta">
          <span class="pill type-pill">${item.type}</span>
          <span class="location">${item.location}</span>
        </p>
        <p class="status-row">
          <span class="status-label">Status:</span>
          <span class="pill" style="background-color: ${statusColor(
            item.status
          )};">
            ${statusLabel(item.status)}
          </span>
        </p>
        ${
          tagsHtml
            ? `<p class="tags">${tagsHtml}</p>`
            : ""
        }
        ${openButton}
        ${adminControls}
      </div>
    `;
  });

  listEl.innerHTML = html;
}

// ---------- EVENT SETUP ----------
window.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const adminToggle = document.getElementById("adminToggle");
  const listEl = document.getElementById("resourcesList");
  const adminCreateBox = document.getElementById("adminCreateBox");

  const newNameInput = document.getElementById("newName");
  const newTypeSelect = document.getElementById("newType");
  const newLocationInput = document.getElementById("newLocation");
  const newTagsInput = document.getElementById("newTags");
  const newLinkInput = document.getElementById("newLink"); // ⚠️ make sure this exists in HTML
  const createBtn = document.getElementById("createBtn");

  // Initial render
  renderResources();

  // Search
  searchInput.addEventListener("input", () => {
    renderResources();
  });

  // Filter
  typeFilter.addEventListener("change", () => {
    renderResources();
  });

  // Admin toggle (with password)
  adminToggle.addEventListener("click", () => {
    if (!adminMode) {
      const entered = prompt("Enter admin password:");
      if (entered !== ADMIN_PASSWORD) {
        alert("Incorrect password.");
        return;
      }
      adminMode = true;
      document.body.classList.remove("user-bg");
      document.body.classList.add("admin-bg");
      adminToggle.classList.add("on");
      adminToggle.textContent = "Admin Mode: ON";
      adminCreateBox.classList.remove("hidden");
    } else {
      adminMode = false;
      editingId = null; // cancel any edits
      document.body.classList.remove("admin-bg");
      document.body.classList.add("user-bg");
      adminToggle.classList.remove("on");
      adminToggle.textContent = "Admin Mode: OFF";
      adminCreateBox.classList.add("hidden");
    }
    renderResources();
  });

  // LIST EVENTS (status change + edit buttons + save/cancel)
  listEl.addEventListener("change", (event) => {
    // Change status from dropdown (non-edit view)
    if (event.target.classList.contains("status-select")) {
      const id = Number(event.target.getAttribute("data-id"));
      const newStatus = event.target.value;
      items = items.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      );
      renderResources();
    }
  });

  listEl.addEventListener("click", (event) => {
    const target = event.target;

    // Click "Edit" button
    if (target.classList.contains("edit-btn")) {
      const id = Number(target.getAttribute("data-id"));
      editingId = id;
      renderResources();
      return;
    }

    // Click "Cancel" in edit mode
    if (target.classList.contains("cancel-edit-btn")) {
      editingId = null;
      renderResources();
      return;
    }

    // Click "Save" in edit mode
    if (target.classList.contains("save-edit-btn")) {
      const id = Number(target.getAttribute("data-id"));
      const card = target.closest(".card");

      const nameInput = card.querySelector(".edit-name");
      const typeSelect = card.querySelector(".edit-type");
      const locationInput = card.querySelector(".edit-location");
      const tagsInput = card.querySelector(".edit-tags");
      const linkInput = card.querySelector(".edit-link");
      const statusSelect = card.querySelector(".edit-status");

      const name = nameInput.value.trim();
      const type = typeSelect.value;
      const location = locationInput.value.trim();
      const tagsRaw = tagsInput.value.trim();
      const link = linkInput.value.trim();
      const status = statusSelect.value;

      if (!name || !location) {
        alert("Please fill in at least Name and Location.");
        return;
      }

      const tags = tagsRaw
        ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

      items = items.map((item) =>
        item.id === id
          ? { ...item, name, type, location, status, tags, link }
          : item
      );

      editingId = null;
      alert("Resource updated.");
      renderResources();
    }
  });

// Create new resource (Admin)
createBtn.addEventListener("click", () => {
  const name = newNameInput.value.trim();
  const type = newTypeSelect.value;
  const location = newLocationInput.value.trim();
  const tagsRaw = newTagsInput.value.trim();
  const linkRaw = newLinkInput.value.trim(); // NEW

  if (!name || !location) {
    alert("Please fill in at least Name and Location.");
    return;
  }

  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const newItem = {
    id: Date.now(),
    name,
    type,
    location,
    status: "available",
    tags,
    link: linkRaw // NEW FIELD
  };

  items.push(newItem);

  // Clear form
  newNameInput.value = "";
  newLocationInput.value = "";
  newTagsInput.value = "";
  newLinkInput.value = ""; // clear link field too
  newTypeSelect.value = "lab";

  alert("New resource created.");
  renderResources();
});
});
