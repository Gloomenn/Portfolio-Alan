const sections = [...document.querySelectorAll(".screen[id]")];
const sectionLinks = [...document.querySelectorAll("[data-section-target]")];
const stepButtons = [...document.querySelectorAll("[data-section-step]")];
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#primary-navigation");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let activeSectionId = sections[0]?.id;

function setActiveSection(id) {
  activeSectionId = id;
  sectionLinks.forEach((link) => {
    if (link.dataset.sectionTarget === id) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

if (activeSectionId) setActiveSection(activeSectionId);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const mostVisible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

    if (mostVisible) setActiveSection(mostVisible.target.id);
  }, { threshold: [0.35, 0.6], rootMargin: "-8% 0px -8% 0px" });

  sections.forEach((section) => sectionObserver.observe(section));
}

stepButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const activeIndex = Math.max(0, sections.findIndex((section) => section.id === activeSectionId));
    const nextIndex = Math.min(sections.length - 1, Math.max(0, activeIndex + Number(button.dataset.sectionStep)));
    sections[nextIndex]?.scrollIntoView({
      behavior: reducedMotion.matches ? "auto" : "smooth",
      block: "start"
    });
  });
});

sectionLinks.forEach((link) => {
  link.addEventListener("click", () => setActiveSection(link.dataset.sectionTarget));
});

if (menuToggle instanceof HTMLButtonElement && siteNav instanceof HTMLElement) {
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
    siteNav.classList.remove("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Abrir menú" : "Cerrar menú");
    siteNav.classList.toggle("is-open", !isExpanded);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}
