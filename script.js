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
    type: "APIS · NEXT.JS",
    title: "Gestor de correos temporales",
    description: "Aplicación conectada a una API externa para crear direcciones temporales y consultar mensajes en HTML o texto, incluidos sus archivos adjuntos.",
    technologies: ["Next.js", "Tailwind CSS", "API externa"],
    hosting: "Aplicación publicada",
    links: [
      { label: "Ver demo", url: "https://boreal-phi.vercel.app/" },
      { label: "Ver código", url: "https://example.com/reemplazar-repositorio-correo", isPlaceholder: true }
    ],
    visualClass: "project-visual-mail",
    visualLabel: "BANDEJA DE ENTRADA",
    visualTitle: "Correo desechable listo para usar.",
    visualChip: "MENSAJE NUEVO"
  },
  {
    type: "APLICACIÓN WEB · REACT · EXPRESS",
    title: "Gestión para el área de Psicología",
    description: "Aplicación web para gestionar pacientes, expedientes, usuarios administrativos y citas. Participé en el desarrollo de interfaces y funcionalidades conectadas a APIs REST.",
    technologies: ["React", "Express.js", "APIs REST", "Git"],
    hosting: "Proyecto institucional · sin demo pública",
    links: [],
    visualClass: "project-visual-docs",
    visualLabel: "GESTIÓN DE CITAS",
    visualTitle: "Información organizada en un solo lugar.",
    visualChip: "PROYECTO ACADÉMICO"
  },
  {
    type: "AUTOMATIZACIÓN · PYTHON · PERSONAL",
    title: "Automatización de documentos",
    description: "Aplicación web con Flask que consulta información mediante web scraping y automatiza la preparación de documentos Word y PDF.",
    technologies: ["Python", "Flask", "Web Scraping"],
    hosting: "Demo publicada en Render",
    links: [
      { label: "Ver demo", url: "https://example.com/reemplazar-demo-documentos", isPlaceholder: true },
      { label: "Ver código", url: "https://example.com/reemplazar-repositorio-documentos", isPlaceholder: true }
    ],
    visualClass: "project-visual-docs",
    visualLabel: "GENERADOR DE DOCUMENTOS",
    visualTitle: "Todo listo para generar.",
    visualChip: "03 CAMPOS COMPLETOS"
  }
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
  const projectLinks = project.links.map((link) => `
    <a href="${escapeHTML(link.url)}" target="_blank" rel="noreferrer"${link.isPlaceholder ? ' class="project-link-placeholder" aria-label="' + escapeHTML(link.label) + ' (URL provisional; reemplazar antes de publicar)"' : ""}>
      ${escapeHTML(link.label)}${link.isPlaceholder ? '<span class="project-link-note">URL provisional</span>' : '<span aria-hidden="true">↗</span>'}
    </a>`).join("");
  card.setAttribute("aria-label", isActive ? `Proyecto ${projectNumber}: ${project.title}` : "Vista previa de proyecto");
  card.innerHTML = `
    <div class="project-card-top"><span>PROYECTO DESTACADO / ${projectNumber}</span><span aria-hidden="true">↗</span></div>
    <div class="project-card-layout">
      <div class="project-card-copy">
        <p class="project-type">${escapeHTML(project.type)}</p>
        <h3>${escapeHTML(project.title)}</h3>
        <p>${escapeHTML(project.description)}</p>
        <ul class="tag-list" aria-label="Tecnologías">${technologies}</ul>
        <div class="project-aside">${escapeHTML(project.hosting)}</div>
        ${projectLinks ? `<div class="project-links" aria-label="Enlaces del proyecto">${projectLinks}</div>` : ""}
      </div>
      <div class="project-visual ${project.visualClass}" aria-hidden="true">
        <div class="visual-window"><span>${escapeHTML(project.visualLabel)}</span><strong>${escapeHTML(project.visualTitle)}</strong><div class="visual-lines"><i></i><i></i><i></i></div></div>
        <span class="visual-chip">${escapeHTML(project.visualChip)}</span>
      </div>
    </div>`;
  card.querySelectorAll("a").forEach((link) => {
    link.tabIndex = isActive ? 0 : -1;
  });
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