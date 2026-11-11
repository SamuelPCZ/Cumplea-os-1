(function () {
  const giftBtn = document.getElementById("giftBtn");
  const giftStage = document.getElementById("giftStage");
  const giftLid = document.getElementById("giftLid");
  const hint = document.getElementById("hint");
  const gallery = document.getElementById("gallery");
  const slides = Array.from(document.querySelectorAll(".slide"));
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsContainer = document.getElementById("dots");
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");

  let current = 0;
  let opened = false;
  let confettiPieces = [];
  let confettiRunning = false;
  let animationId = null;

  // Puntos de navegación
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Foto ${i + 1}`);
    dot.setAttribute("aria-selected", i === 0 ? "true" : "false");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("active", i === current));
    dotsContainer.querySelectorAll("button").forEach((d, i) => {
      d.classList.toggle("active", i === current);
      d.setAttribute("aria-selected", i === current ? "true" : "false");
    });
  }

  prevBtn.addEventListener("click", () => goTo(current - 1));
  nextBtn.addEventListener("click", () => goTo(current + 1));

  document.addEventListener("keydown", (e) => {
    if (gallery.classList.contains("hidden")) return;
    if (e.key === "ArrowLeft") goTo(current - 1);
    if (e.key === "ArrowRight") goTo(current + 1);
  });

  let touchStartX = 0;
  gallery.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );
  gallery.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 50) goTo(dx > 0 ? current - 1 : current + 1);
  });

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  const colors = ["#ff6b9d", "#ffd166", "#06d6a0", "#4cc9f0", "#e63946", "#c77dff", "#fff"];

  function spawnConfetti(count) {
    for (let i = 0; i < count; i++) {
      confettiPieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 200,
        w: 6 + Math.random() * 8,
        h: 10 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: 2 + Math.random() * 4,
        vx: -2 + Math.random() * 4,
        rot: Math.random() * Math.PI * 2,
        vr: -0.15 + Math.random() * 0.3,
        shape: Math.random() > 0.5 ? "rect" : "circle",
      });
    }
  }

  function tickConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiPieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();
    });
    confettiPieces = confettiPieces.filter((p) => p.y < canvas.height + 40);
    if (confettiRunning || confettiPieces.length > 0) {
      animationId = requestAnimationFrame(tickConfetti);
    } else {
      animationId = null;
    }
  }

  function startConfetti() {
    confettiRunning = true;
    spawnConfetti(120);
    const burst = setInterval(() => {
      if (!confettiRunning) {
        clearInterval(burst);
        return;
      }
      spawnConfetti(25);
    }, 400);
    setTimeout(() => {
      confettiRunning = false;
      clearInterval(burst);
    }, 8000);
    if (!animationId) tickConfetti();
  }

  function openGift() {
    if (opened) return;
    opened = true;
    giftBtn.classList.add("opened");
    hint.textContent = "¡Feliz cumpleaños Fabi!";
    startConfetti();

    setTimeout(() => {
      giftStage.classList.add("exiting");
    }, 600);

    setTimeout(() => {
      giftStage.classList.add("hidden");
      gallery.classList.remove("hidden");
    }, 1100);
  }

  giftBtn.addEventListener("click", openGift);
})();
