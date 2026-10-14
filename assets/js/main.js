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

    // The toggle is labelled with what tapping it will do, not the current theme
    var next = theme === "dark" ? "Light mode" : "Dark mode";
    var btn = document.querySelector(".theme-toggle");
    if (!btn) return;

    var label = btn.querySelector(".theme-label");
    if (label) label.textContent = next;
    btn.setAttribute("aria-label", "Switch to " + next.toLowerCase());
    btn.setAttribute("title", "Switch to " + next.toLowerCase());
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
    var navToggle = document.querySelector(".nav-toggle");
    var navLinks = document.querySelector(".nav-links");

    var themeBtn = document.querySelector(".theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        toggleTheme();
        // On mobile the toggle lives inside the menu; close it once the theme is applied
        if (navLinks) navLinks.classList.remove("open");
      });
    }
    if (navToggle && navLinks) {
      navToggle.addEventListener("click", function () {
        navLinks.classList.toggle("open");
      });
    }

    // Research videos: nothing is downloaded until a video is close to the screen
    // (preload="none"); then it plays muted on a loop, and pauses again once scrolled away.
    // With "reduce motion" on, videos never autoplay and get controls instead.
    var videos = document.querySelectorAll(".research-video");
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      videos.forEach(function (v) { v.controls = true; });
    } else if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var p = e.target.play();
            if (p && p.catch) p.catch(function () {});   // ignore autoplay refusals
          } else {
            e.target.pause();
          }
        });
      }, { rootMargin: "200px 0px" });
      videos.forEach(function (v) { io.observe(v); });
    } else {
      videos.forEach(function (v) { v.autoplay = true; v.play(); });
    }

    // Auto-update the year in the footer
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });
})();
