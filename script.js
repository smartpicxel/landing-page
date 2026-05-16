// Cinematic Visual Studio – Interactions
// Handles loader, smooth scrolling, scroll reveal, portfolio filters, cursor, and contact form

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  /* Loader */
  const loader = document.getElementById("loader");
  window.setTimeout(() => {
    if (loader) {
      loader.style.opacity = "0";
      loader.style.pointerEvents = "none";
      window.setTimeout(() => loader.remove(), 400);
    }
  }, 1400);

  /* Custom cursor */
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorOutline = document.querySelector(".cursor-outline");

  if (cursorDot && cursorOutline) {
    let outlineX = window.innerWidth / 2;
    let outlineY = window.innerHeight / 2;

    const moveCursor = (event) => {
      const { clientX, clientY } = event;
      cursorDot.style.transform = `translate(${clientX}px, ${clientY}px)`;
      outlineX += (clientX - outlineX) * 0.16;
      outlineY += (clientY - outlineY) * 0.16;
      cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
    };

    window.addEventListener("mousemove", moveCursor);

    const hoverSelectors =
      "a, button, .btn, .project-card, .service-card, .social-link, .filter-btn, input, textarea";
    body.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverSelectors)) {
        cursorOutline.classList.add("is-hovering");
      }
    });
    body.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverSelectors)) {
        cursorOutline.classList.remove("is-hovering");
      }
    });
  }

  /* Sticky nav active link */
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));

  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute("href");
      if (!id || !id.startsWith("#")) return null;
      const section = document.querySelector(id);
      return section ? { id, element: section, link } : null;
    })
    .filter(Boolean);

  const handleScrollSpy = () => {
    const scrollPosition = window.scrollY + window.innerHeight * 0.28;
    let active = null;

    sections.forEach((entry) => {
      const rect = entry.element.getBoundingClientRect();
      const offsetTop = rect.top + window.scrollY;
      if (scrollPosition >= offsetTop) {
        active = entry;
      }
    });

    if (active) {
      navLinks.forEach((link) => link.classList.remove("active"));
      active.link.classList.add("active");
    }
  };

  window.addEventListener("scroll", handleScrollSpy);
  handleScrollSpy();

  /* Smooth scrolling */
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
  smoothScrollLinks.forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const rect = target.getBoundingClientRect();
      const offsetTop = rect.top + window.scrollY - 80;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    });
  });

  /* Mobile nav toggle */
  const navToggle = document.querySelector(".nav-toggle");
  const navLinksContainer = document.querySelector(".nav-links");

  if (navToggle && navLinksContainer) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("is-open");
      navLinksContainer.classList.toggle("is-open");
    });

    navLinks.forEach((link) =>
      link.addEventListener("click", () => {
        navToggle.classList.remove("is-open");
        navLinksContainer.classList.remove("is-open");
      })
    );
  }

  /* Scroll reveal using IntersectionObserver */
  const revealElements = document.querySelectorAll("[data-reveal]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealElements.forEach((el) => observer.observe(el));

  /* Animate skill bars when visible */
  const skillCards = document.querySelectorAll(".skill-card");
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const card = entry.target;
        const level = card.getAttribute("data-level");
        const bar = card.querySelector(".skill-bar-fill");
        if (level && bar) {
          bar.style.width = `${level}%`;
          bar.style.transition = "width 0.9s cubic-bezier(0.22, 0.61, 0.36, 1)";
        }
        skillObserver.unobserve(card);
      });
    },
    { threshold: 0.4 }
  );

  skillCards.forEach((card) => skillObserver.observe(card));

  /* Portfolio filters */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const filter = button.getAttribute("data-filter");
      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category") || "";
        if (filter === "all" || category.includes(filter)) {
          card.classList.remove("is-hidden");
        } else {
          card.classList.add("is-hidden");
        }
      });
    });
  });

  /* Project hover tilts */
  projectCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / rect.height) * -6;
      const rotateY = ((x - rect.width / 2) / rect.width) * 6;
      card.style.transform = `translateY(-4px) scale(1.01) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  /* Contact form (front-end only) */
  const contactForm = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");

  if (contactForm && formMessage) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const name = (formData.get("name") || "").toString().trim();
      const email = (formData.get("email") || "").toString().trim();
      const project = (formData.get("project") || "").toString().trim();

      formMessage.classList.remove("is-success", "is-error");

      if (!name || !email || !project) {
        formMessage.textContent = "Please fill in all fields before sending.";
        formMessage.classList.add("is-error");
        return;
      }

      const emailBody =
        `New project inquiry from ${name}%0D%0A%0D%0A` +
        `Email: ${email}%0D%0A%0D%0A` +
        `Project details:%0D%0A${encodeURIComponent(project)}`;

      window.location.href = `mailto:hello@cinematicvisuals.studio?subject=New Project Inquiry – Portfolio&body=${emailBody}`;

      formMessage.textContent = "Thanks for reaching out. Your email app is opening with the details.";
      formMessage.classList.add("is-success");
      contactForm.reset();
    });
  }

  /* Footer year */
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = String(new Date().getFullYear());
});

let reelPlay = document.getElementById("play-btn");
let overlay = document.getElementById("main-pop");
let video = overlay.querySelector("video");

reelPlay.addEventListener("click", () => {
    // Show the popup
    overlay.style.display = "flex";
    
    // Optional: Play/Restart video on click
    video.currentTime = 0;
    video.play();
});


const pgCards = document.querySelectorAll(".pg-card");

pgCards.forEach(card=>{

card.addEventListener("mousemove",(e)=>{

const rect = card.getBoundingClientRect();

const x = e.clientX - rect.left;
const y = e.clientY - rect.top;

const moveX = (x - rect.width/2) / 25;
const moveY = (y - rect.height/2) / 25;

card.style.transform = `
translateY(-5px)
rotateY(${moveX}deg)
rotateX(${-moveY}deg)
`;

});

card.addEventListener("mouseleave",()=>{

card.style.transform = `
translateY(0)
rotateY(0)
rotateX(0)
`;

});

});

