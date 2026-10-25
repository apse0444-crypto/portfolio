/* Progressive enhancement only — the page is fully usable without this file. */
(function () {
  "use strict";

  var root = document.documentElement;
  var themeBtn = document.getElementById("theme-toggle");
  var menuBtn = document.getElementById("menu-toggle");
  var menu = document.getElementById("mobile-menu");
  var header = document.querySelector(".site-header");
  var yearEl = document.getElementById("year");

  /* ---------------------------------------------------------- theme */

  function currentTheme() {
    return root.dataset.theme === "dark" ? "dark" : "light";
  }

  function syncThemeButton() {
    if (!themeBtn) return;
    var isDark = currentTheme() === "dark";
    themeBtn.setAttribute("aria-pressed", String(isDark));
    themeBtn.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", isDark ? "#121110" : "#f4f1ea");
  }

  function setTheme(theme) {
    root.dataset.theme = theme;
    try { localStorage.setItem("theme", theme); } catch (e) {}
    syncThemeButton();
  }

  if (themeBtn) {
    syncThemeButton();
    themeBtn.addEventListener("click", function () {
      setTheme(currentTheme() === "dark" ? "light" : "dark");
    });
  }

  // Follow the OS setting until the visitor picks a theme themselves.
  var media = window.matchMedia("(prefers-color-scheme: dark)");
  var onSchemeChange = function (event) {
    var stored = null;
    try { stored = localStorage.getItem("theme"); } catch (e) {}
    if (!stored) {
      root.dataset.theme = event.matches ? "dark" : "light";
      syncThemeButton();
    }
  };
  if (typeof media.addEventListener === "function") media.addEventListener("change", onSchemeChange);

  /* ----------------------------------------------------- mobile menu */

  function closeMenu() {
    if (!menu || !menuBtn) return;
    menu.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
  }

  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () {
      var open = menuBtn.getAttribute("aria-expanded") === "true";
      if (open) {
        closeMenu();
      } else {
        menu.hidden = false;
        menuBtn.setAttribute("aria-expanded", "true");
        menuBtn.setAttribute("aria-label", "Close menu");
      }
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") {
        closeMenu();
        menuBtn.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  /* ------------------------------------------------ header + scrollspy */

  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-list a[href^="#"]'));
  var sections = links
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);

  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (link) {
            link.toggleAttribute(
              "aria-current",
              link.getAttribute("href") === "#" + entry.target.id
            );
            if (link.hasAttribute("aria-current")) link.setAttribute("aria-current", "true");
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (section) { spy.observe(section); });
  }

  /* --------------------------------------------------------- reveals */

  var revealables = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var revealer = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 }
    );
    Array.prototype.forEach.call(revealables, function (el) { revealer.observe(el); });
  } else {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add("is-visible"); });
  }

  /* ------------------------------------------------------------- misc */

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
