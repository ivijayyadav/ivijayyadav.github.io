/* main.js — small bits of interactivity for the site.
   No framework, no build step: this file runs directly in the browser. */

(function () {
  "use strict";

  var root = document.documentElement; // the <html> element

  /* ---- Theme (light / dark) -------------------------------------------
     We store the choice in localStorage so it survives page reloads.
     If the visitor hasn't chosen, we follow their OS setting.            */
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
  }

  var saved = localStorage.getItem("theme");
  if (saved) {
    applyTheme(saved);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    applyTheme("dark");
  } else {
    applyTheme("light");
  }

  function toggleTheme() {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
  }

  /* ---- Wire up buttons once the DOM is ready --------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    var themeBtn = document.querySelector(".theme-toggle");
    if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

    var navToggle = document.querySelector(".nav-toggle");
    var navLinks = document.querySelector(".nav-links");
    if (navToggle && navLinks) {
      navToggle.addEventListener("click", function () {
        navLinks.classList.toggle("open");
      });
    }

    // Auto-update the year in the footer
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });
})();
