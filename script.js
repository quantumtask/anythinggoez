document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("js-ready");

  const header = document.querySelector(".site-header");
  const hero = document.querySelector(".hero");
  const menuToggle = document.querySelector("[data-hero-menu-toggle]");
  const menuPanel = document.querySelector("[data-hero-menu-panel]");
  const menuShell = document.querySelector(".hero-menu-shell");
  const scrollLinks = Array.from(document.querySelectorAll("[data-scroll-link]"));
  const routedSections = Array.from(document.querySelectorAll("section[id]"));

  const getScrollOffset = () => (header?.offsetHeight || 0) + 18;

  const setMenuState = (isOpen) => {
    if (!menuToggle || !menuPanel) {
      return;
    }

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuPanel.hidden = !isOpen;
  };

  const scrollToHash = (hash, smooth = true) => {
    if (!hash || !hash.startsWith("#")) {
      return;
    }

    const target = document.querySelector(hash);

    if (!target) {
      return;
    }

    const top = Math.max(
      target.getBoundingClientRect().top + window.scrollY - getScrollOffset(),
      0
    );

    window.scrollTo({
      top,
      behavior: smooth ? "smooth" : "auto",
    });

    if (window.history?.replaceState) {
      window.history.replaceState(null, "", hash);
    } else {
      window.location.hash = hash;
    }
  };

  const setActiveLinks = (id) => {
    scrollLinks.forEach((link) => {
      const isMatch = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isMatch);
      if (isMatch) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  if (menuToggle && menuPanel) {
    setMenuState(false);

    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      setMenuState(!isOpen);
    });

    document.addEventListener("click", (event) => {
      if (!menuShell?.contains(event.target)) {
        setMenuState(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setMenuState(false);
      }
    });
  }

  scrollLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");

      if (!hash || !hash.startsWith("#")) {
        return;
      }

      const target = document.querySelector(hash);

      if (!target) {
        return;
      }

      event.preventDefault();
      scrollToHash(hash);
      setMenuState(false);
    });
  });

  const updateActiveSection = () => {
    if (window.scrollY < (hero?.offsetHeight || 400) * 0.35) {
      setActiveLinks("top");
      return;
    }

    let currentId = routedSections[0]?.id || "services";

    routedSections.forEach((section) => {
      const sectionTop = section.offsetTop - getScrollOffset() - 80;
      if (window.scrollY >= sectionTop) {
        currentId = section.id;
      }
    });

    setActiveLinks(currentId);
  };

  window.addEventListener("scroll", updateActiveSection, { passive: true });
  window.addEventListener("resize", updateActiveSection);

  const revealSelectors = [
    ".hero-copy",
    ".hero-showcase",
    ".proof-grid > div",
    ".section-heading",
    ".service-card",
    ".gallery-card",
    ".feature-list article",
    ".step-card",
    ".faq-card",
    ".cta-panel",
  ];

  const revealTargets = Array.from(
    document.querySelectorAll(revealSelectors.join(", "))
  );

  revealTargets.forEach((element, index) => {
    element.classList.add("reveal-ready");
    element.style.setProperty("--reveal-delay", `${(index % 4) * 65}ms`);
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealTargets.forEach((element) => revealObserver.observe(element));

  if (window.location.hash) {
    window.setTimeout(() => {
      scrollToHash(window.location.hash, false);
      updateActiveSection();
    }, 80);
  } else {
    updateActiveSection();
  }
});
