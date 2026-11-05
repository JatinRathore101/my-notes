/* ==========================================================================
   my-notes — shared behaviour for notes/*.html, tables/*.html, topics.html
   - Theme toggle (auto / light / dark, remembered per browser)
   - Copy button on every .code block
   - Auto table of contents from h2/h3 (when an <aside class="toc"> exists)
   - Heading anchors
   - Mermaid rendering (auto-loads assets/vendor/mermaid-10.9.1 when a pre.mermaid exists) with theme-aware re-render
   - Reveal-on-scroll for elements with .reveal
   ========================================================================== */
(function () {
  "use strict";
  var root = document.documentElement;
  var KEY = "my-notes-theme";
  // URL of this file (assets/notes.js) — base for loading other local assets.
  var SCRIPT_URL = (document.currentScript && document.currentScript.src) || location.href;

  function store(k, v) { try { v === undefined ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} }
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  // ---- Theme ----
  var saved = load(KEY);
  if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);

  function isDark() {
    var t = root.getAttribute("data-theme");
    if (t) return t === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function slugify(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Theme toggle button
    var btn = document.querySelector("[data-theme-toggle]");
    function label() {
      var t = root.getAttribute("data-theme");
      if (btn) btn.textContent = t === "dark" ? "☾ Dark" : t === "light" ? "☀ Light" : "◐ Auto";
    }
    if (btn) {
      label();
      btn.addEventListener("click", function () {
        var t = root.getAttribute("data-theme");
        var next = !t ? "light" : t === "light" ? "dark" : null;
        if (next) { root.setAttribute("data-theme", next); store(KEY, next); }
        else { root.removeAttribute("data-theme"); store(KEY); }
        label();
        renderMermaid();
      });
    }

    // Copy buttons on code blocks
    document.querySelectorAll(".code").forEach(function (box) {
      var pre = box.querySelector("pre");
      if (!pre) return;
      var head = box.querySelector(".code-head");
      if (!head) {
        head = document.createElement("div");
        head.className = "code-head";
        head.innerHTML = "<span>" + (box.getAttribute("data-lang") || "") + "</span>";
        box.insertBefore(head, pre);
      }
      var b = document.createElement("button");
      b.className = "copy-btn"; b.type = "button"; b.textContent = "Copy";
      b.addEventListener("click", function () {
        var text = pre.innerText.replace(/\n$/, "");
        var done = function () { b.textContent = "Copied ✓"; b.classList.add("done");
          setTimeout(function () { b.textContent = "Copy"; b.classList.remove("done"); }, 1500); };
        if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback);
        else fallback();
        function fallback() {
          var ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
          document.body.appendChild(ta); ta.select();
          try { document.execCommand("copy"); done(); } catch (e) {}
          document.body.removeChild(ta);
        }
      });
      head.appendChild(b);
    });

    // Heading ids + anchors
    var heads = document.querySelectorAll("article h2, article h3");
    var used = {};
    heads.forEach(function (h) {
      if (!h.id) {
        var id = slugify(h.textContent) || "section";
        while (used[id]) id += "-x";
        h.id = id;
      }
      used[h.id] = true;
      var a = document.createElement("a");
      a.className = "anchor"; a.href = "#" + h.id; a.textContent = "#"; a.setAttribute("aria-label", "Link to section");
      h.appendChild(a);
    });

    // TOC
    var toc = document.querySelector("aside.toc");
    if (toc && heads.length > 2) {
      // Built with DOM APIs (textContent), so heading text is never parsed as HTML.
      toc.innerHTML = "<h2>On this page</h2>";
      var ol = document.createElement("ol");
      heads.forEach(function (h) {
        var li = document.createElement("li"), a = document.createElement("a");
        a.href = "#" + h.id;
        if (h.tagName === "H3") a.className = "sub";
        a.textContent = h.textContent.replace(/#$/, "");
        li.appendChild(a); ol.appendChild(li);
      });
      toc.appendChild(ol);
      var links = toc.querySelectorAll("a");
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              links.forEach(function (l) { l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id); });
            }
          });
        }, { rootMargin: "-70px 0px -70% 0px" });
        heads.forEach(function (h) { io.observe(h); });
      }
    } else if (toc) {
      toc.remove();
      var page = document.querySelector(".page"); if (page) page.classList.remove("has-toc");
    }

    // Reveal on scroll
    var rv = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); } });
      }, { threshold: 0.1 });
      rv.forEach(function (el) { ro.observe(el); });
    } else rv.forEach(function (el) { el.classList.add("in"); });

    renderMermaid();
  });

  // ---- Mermaid (lazy-loaded from the local vendored copy only when the page has a pre.mermaid) ----
  // Resolved relative to this script so it works from notes/, tables/ and the repo root alike.
  var MERMAID_LOCAL = new URL("vendor/mermaid-10.9.1/mermaid.min.js", SCRIPT_URL).href;
  var mermaidSrc = null, mermaidLoading = false;
  function renderMermaid() {
    var nodes = document.querySelectorAll("pre.mermaid");
    if (!nodes.length) return;
    if (!window.mermaid) {
      if (mermaidLoading) return;
      mermaidLoading = true;
      var s = document.createElement("script");
      s.src = MERMAID_LOCAL;
      s.onload = renderMermaid;
      document.head.appendChild(s);
      return;
    }
    if (!mermaidSrc) mermaidSrc = Array.prototype.map.call(nodes, function (n) { return n.textContent; });
    nodes.forEach(function (n, i) { n.removeAttribute("data-processed"); n.innerHTML = ""; n.textContent = mermaidSrc[i]; });
    window.mermaid.initialize({ startOnLoad: false, theme: isDark() ? "dark" : "default", securityLevel: "strict",
      fontFamily: getComputedStyle(document.body).fontFamily });
    window.mermaid.run({ nodes: nodes });
  }
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var onChange = function () { if (!root.getAttribute("data-theme")) renderMermaid(); };
    if (mq.addEventListener) mq.addEventListener("change", onChange); else if (mq.addListener) mq.addListener(onChange);
  }
})();
