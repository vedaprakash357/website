// Sample dynamic project data
const projects = [
  {
    id: 1,
    title: "Pulse Analytics Board",
    category: "web",
    summary: "Real-time metrics tracker with live search, sorting, and state persistence.",
    details: "Built with modular DOM rendering and debounced filtering so large datasets stay snappy without page reloads.",
    tags: ["HTML", "CSS Grid", "JavaScript"]
  },
  {
    id: 2,
    title: "Tokenized Design System",
    category: "ui",
    summary: "Accessible component tokens supporting instant light and dark themes.",
    details: "Uses semantic CSS custom properties and high-contrast surface pairs to keep UI states consistent across viewports.",
    tags: ["CSS Variables", "A11y", "Responsive"]
  },
  {
    id: 3,
    title: "Markdown Note Vault",
    category: "tools",
    summary: "Lightweight browser workspace that saves drafts automatically to localStorage.",
    details: "Includes instant word/character counters, tag filtering, and zero-backend persistence right in the browser.",
    tags: ["localStorage", "DOM API", "JS"]
  },
  {
    id: 4,
    title: "Kanban Sprint Planner",
    category: "web",
    summary: "Interactive task board with status transitions and live column counts.",
    details: "Demonstrates clean state-to-UI synchronization where every action updates counters and renders cleanly.",
    tags: ["State", "Flexbox", "JavaScript"]
  }
];

// DOM References
const projectsGrid = document.getElementById("projectsGrid");
const filterBar = document.getElementById("filterBar");
const projectSearch = document.getElementById("projectSearch");
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const modal = document.getElementById("projectModal");
const modalClose = document.getElementById("modalClose");

let activeCategory = "all";
let searchQuery = "";

// Theme initialization & toggle
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  themeToggle.textContent = next === "dark" ? "☀️" : "🌙";
});

// Mobile menu toggle
menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// Render filtered & searched projects
function renderProjects() {
  const filtered = projects.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery) ||
      item.summary.toLowerCase().includes(searchQuery) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    projectsGrid.innerHTML = `<p class="muted">No projects match your current filter.</p>`;
    return;
  }

  projectsGrid.innerHTML = filtered
    .map(
      (project) => `
      <article class="project-card">
        <div>
          <span class="badge">${project.category}</span>
          <h3>${project.title}</h3>
          <p>${project.summary}</p>
        </div>
        <div class="card-footer">
          <div class="tags">
            ${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
          </div>
          <button class="link-btn" data-id="${project.id}">Details →</button>
        </div>
      </article>
    `
    )
    .join("");
}

filterBar.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;

  filterBar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  activeCategory = btn.dataset.category;
  renderProjects();
});

projectSearch.addEventListener("input", (e) => {
  searchQuery = e.target.value.trim().toLowerCase();
  renderProjects();
});

// Modal logic
function openModal(projectId) {
  const project = projects.find((p) => p.id === Number(projectId));
  if (!project) return;

  document.getElementById("modalCategory").textContent = project.category;
  document.getElementById("modalTitle").textContent = project.title;
  document.getElementById("modalDescription").textContent = project.details;
  document.getElementById("modalTags").innerHTML = project.tags
    .map((tag) => `<span class="tag">${tag}</span>`)
    .join("");

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

projectsGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".link-btn");
  if (btn) openModal(btn.dataset.id);
});

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
});

// Animate stats when scrolled into view
function animateStats() {
  const statNumbers = document.querySelectorAll(".stat-number");
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.target);
        let current = 0;
        const step = Math.max(1, Math.floor(target / 30));

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = current;
          }
        }, 25);

        obs.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );

  statNumbers.forEach((num) => observer.observe(num));
}

// Contact form validation
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  formStatus.textContent = "";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");

  nameError.textContent = "";
  emailError.textContent = "";
  messageError.textContent = "";

  let isValid = true;

  if (name.length < 2) {
    nameError.textContent = "Please enter at least 2 characters.";
    isValid = false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    emailError.textContent = "Please enter a valid email address.";
    isValid = false;
  }

  if (message.length < 10) {
    messageError.textContent = "Message should be at least 10 characters.";
    isValid = false;
  }

  if (!isValid) return;

  formStatus.textContent = `Thanks, ${name}! Your message is ready to send.`;
  contactForm.reset();
});

// Set dynamic copyright year & initialize
document.getElementById("year").textContent = new Date().getFullYear();
initTheme();
renderProjects();
animateStats();