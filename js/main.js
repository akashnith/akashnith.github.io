document.querySelectorAll(".yr").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

(function lastUpdated() {
  const el = document.querySelector(".updated");
  if (!el) return;
  const d = new Date(document.lastModified);
  if (isNaN(d.getTime()) || d.getFullYear() < 2000) return;
  el.textContent = d.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
})();

(function theme() {
  const link = document.getElementById("theme-toggle");
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  const read = () => {
    try {
      return localStorage.getItem("ap_theme");
    } catch (e) {
      return null;
    }
  };

  const isDark = () => {
    const saved = read();
    return saved ? saved === "dark" : media.matches;
  };

  const paint = () => {
    const dark = isDark();
    const saved = read();

    if (saved) document.documentElement.dataset.theme = saved;
    else delete document.documentElement.dataset.theme;
    if (link) {
      link.textContent = dark ? "light" : "dark";
      link.setAttribute(
        "aria-label",
        dark ? "Switch to the light theme" : "Switch to the dark theme",
      );
    }
  };

  paint();
  media.addEventListener("change", paint);

  if (link) {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const next = isDark() ? "light" : "dark";
      try {
        localStorage.setItem("ap_theme", next);
      } catch (err) {}
      paint();
    });
  }
})();

(function progress() {
  const bar = document.querySelector(".scroll-progress");
  if (!bar) return;
  const update = () => {
    const d = document.documentElement;
    const max = d.scrollHeight - d.clientHeight;
    bar.style.width = max > 0 ? (d.scrollTop / max) * 100 + "%" : "0%";
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
})();

(function activeSection() {
  const links = Array.from(
    document.querySelectorAll('.top-nav a[href^="#"]'),
  ).filter((a) => a.getAttribute("href").length > 1);
  if (!links.length || !("IntersectionObserver" in window)) return;

  const byId = new Map(
    links.map((a) => [a.getAttribute("href").slice(1), a]),
  );
  const targets = Array.from(byId.keys())
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const a = byId.get(entry.target.id);
        if (!a) return;
        if (entry.isIntersecting) {
          links.forEach((l) => {
            l.classList.remove("here");
            l.removeAttribute("aria-current");
          });
          a.classList.add("here");
          a.setAttribute("aria-current", "true");
        }
      });
    },
    { rootMargin: "-10% 0px -80% 0px" },
  );
  targets.forEach((t) => io.observe(t));
})();

(function timelineReveal() {
    var items = document.querySelectorAll("ol.timeline li");
    if (!items.length || !("IntersectionObserver" in window)) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("tl-anim");
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            e.target.classList.add("tl-in");
            io.unobserve(e.target);
        });
    }, { threshold: 0.2, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (li, i) {
        li.style.transitionDelay = i * 70 + "ms";
        io.observe(li);
    });
})();
