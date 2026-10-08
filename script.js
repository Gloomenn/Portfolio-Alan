const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Abrir menú" : "Cerrar menú");
  siteNav.classList.toggle("is-open", !isExpanded);
});

siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
    siteNav.classList.remove("is-open");
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();

const projects = [
  {
    type: "AUTOMATIZACIÓN · PYTHON",
    title: "Documentos, sin trabajo repetido.",
    description: "Aplicación web con Flask que consulta información mediante web scraping y automatiza la preparación de documentos Word y PDF.",
    technologies: ["Python", "Flask", "Web Scraping"],
    hosting: "Publicado en Render",
    visualClass: "project-visual-docs",
    visualLabel: "GENERADOR DE DOCUMENTOS",
    visualTitle: "Todo listo para generar.",
    visualChip: "03 CAMPOS COMPLETOS"
  },
  {
    type: "APIS · NEXT.JS",
    title: "Una bandeja de entrada al instante.",
    description: "Gestor de correos temporales conectado a una API externa, con lectura de mensajes en HTML y texto, además de archivos adjuntos.",
    technologies: ["Next.js", "Tailwind CSS", "API externa"],
    hosting: "Publicado en Vercel",
    visualClass: "project-visual-mail",
    visualLabel: "BANDEJA DE ENTRADA",
    visualTitle: "Tu código de acceso",
    visualChip: "MENSAJE NUEVO"
  },
  
];

const projectCards = {
  previous: document.querySelector(".carousel-card-left"),
  active: document.querySelector(".carousel-card-active"),
  next: document.querySelector(".carousel-card-right")
};
const projectIndex = document.querySelector("#project-current");
const projectTotal = document.querySelector("#project-total");
const previousButton = document.querySelector('[data-direction="previous"]');
const nextButton = document.querySelector('[data-direction="next"]');
let currentProject = 0;

function escapeHTML(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function renderProjectCard(card, project, index, isActive) {
  card.classList.remove("carousel-card-upcoming");
  card.setAttribute("aria-hidden", String(!isActive));

  if (!project) {
    card.classList.add("carousel-card-upcoming");
    card.innerHTML = '<div class="project-placeholder"><span class="project-placeholder-mark" aria-hidden="true">+</span><p>ESPACIO RESERVADO</p><h3>Próximo proyecto</h3></div>';
    return;
  }

  const projectNumber = String(index + 1).padStart(2, "0");
  const technologies = project.technologies.map((technology) => `<li>${escapeHTML(technology)}</li>`).join("");
  card.setAttribute("aria-label", isActive ? `Proyecto ${projectNumber}: ${project.title}` : "Vista previa de proyecto");
  card.innerHTML = `
    <div class="project-card-top"><span>PROYECTO DESTACADO / ${projectNumber}</span><span aria-hidden="true">↗</span></div>
    <div class="project-card-layout">
      <div class="project-card-copy">
        <p class="project-type">${escapeHTML(project.type)}</p>
        <h3>${escapeHTML(project.title)}</h3>
        <p>${escapeHTML(project.description)}</p>
        <ul class="tag-list" aria-label="Tecnologías">${technologies}</ul>
        <div class="project-aside"><span class="live-mark" aria-hidden="true"></span>${escapeHTML(project.hosting)}</div>
      </div>
      <div class="project-visual ${project.visualClass}" aria-hidden="true">
        <div class="visual-window"><span>${escapeHTML(project.visualLabel)}</span><strong>${escapeHTML(project.visualTitle)}</strong><div class="visual-lines"><i></i><i></i><i></i></div></div>
        <span class="visual-chip">${escapeHTML(project.visualChip)}</span>
      </div>
    </div>`;
}

function updateProjectCarousel() {
  const previousProject = currentProject > 0 ? currentProject - 1 : null;
  const nextProject = currentProject < projects.length - 1 ? currentProject + 1 : null;

  renderProjectCard(projectCards.previous, previousProject === null ? null : projects[previousProject], previousProject, false);
  renderProjectCard(projectCards.active, projects[currentProject], currentProject, true);
  renderProjectCard(projectCards.next, nextProject === null ? null : projects[nextProject], nextProject, false);
  projectIndex.textContent = String(currentProject + 1).padStart(2, "0");
  projectTotal.textContent = String(projects.length).padStart(2, "0");
  previousButton.disabled = currentProject === 0;
  nextButton.disabled = currentProject === projects.length - 1;
}

document.querySelectorAll(".carousel-arrow").forEach((button) => {
  button.addEventListener("click", () => {
    currentProject += button.dataset.direction === "next" ? 1 : -1;
    updateProjectCarousel();
  });
});

updateProjectCarousel();

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".section-heading, .timeline-entry, .about-intro, .about-details").forEach((element) => {
    element.setAttribute("data-reveal", "");
    revealObserver.observe(element);
  });
}