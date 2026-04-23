/* ============================================================
   RAKESH GOWDAR — Portfolio JavaScript
   ============================================================ */

'use strict';

/* ── PAGE PROGRESS ── */
const pageProgress = document.querySelector('.page-progress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  if (pageProgress) pageProgress.style.width = pct + '%';
});

/* ── CUSTOM CURSOR (desktop only) ── */
function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const dot = document.createElement('div'); dot.className = 'cursor';
  const ring = document.createElement('div'); ring.className = 'cursor-ring';
  document.body.append(dot, ring);
  let mx = -100, my = -100, rx = -100, ry = -100;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  document.querySelectorAll('a, button, .demo-card, .project-card, .skill-group').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
  (function loop() {
    dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
    requestAnimationFrame(loop);
  })();
}

/* ── NAV ── */
function initNav() {
  const nav = document.querySelector('nav');
  const ham = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
  if (ham) {
    ham.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      ham.classList.toggle('open');
    });
  }
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

/* ── SECTION INDICATOR ── */
function initSectionIndicator() {
  const sections = document.querySelectorAll('section[id]');
  const indicator = document.querySelector('.section-indicator');
  if (!indicator) return;
  const dots = [];
  sections.forEach((s, i) => {
    const d = document.createElement('div');
    d.className = 'section-dot';
    d.title = s.id;
    d.addEventListener('click', () => s.scrollIntoView({ behavior: 'smooth' }));
    indicator.appendChild(d);
    dots.push(d);
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        dots.forEach(d => d.classList.remove('active'));
        const idx = Array.from(sections).indexOf(e.target);
        if (dots[idx]) dots[idx].classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => io.observe(s));
}

/* ── HERO TYPING ── */
function initHeroTyping() {
  const el = document.querySelector('.hero-type-text');
  if (!el) return;
  const phrases = [
    'Senior Flutter Engineer',
    'Mobile Architecture Expert',
    '10+ Years Building Products',
    'Clean Code Advocate',
    'Performance Obsessed',
  ];
  let pi = 0, ci = 0, deleting = false;
  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ci + 1);
      ci++;
      if (ci === phrase.length) { deleting = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = phrase.slice(0, ci - 1);
      ci--;
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 40 : 80);
  }
  tick();
}

/* ── REVEAL ON SCROLL ── */
function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .timeline-item').forEach(el => io.observe(el));
}

/* ── SKILLS BARS ── */
function initSkillBars() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-bar-fill').forEach(bar => bar.classList.add('animated'));
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-group').forEach(g => io.observe(g));
}

/* ── SNAKE GAME ── */
function initSnake() {
  const canvas = document.getElementById('snake-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const overlay = document.querySelector('.demo-overlay');
  const startBtn = document.querySelector('.demo-play-btn');
  const scoreEl = document.getElementById('snake-score');
  const hiEl = document.getElementById('snake-hi');

  let COLS = 20, ROWS = 20;
  let CW, CH;
  let snake, dir, nextDir, food, score, hiScore = 0, gameLoop, alive = false;

  function resize() {
    const size = canvas.parentElement.offsetWidth;
    canvas.width = canvas.height = size;
    CW = size / COLS; CH = size / ROWS;
    if (!alive) drawIdle();
  }

  function drawIdle() {
    ctx.fillStyle = '#0a0f16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(56,189,248,0.04)';
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if ((r + c) % 2 === 0) ctx.fillRect(c * CW, r * CH, CW, CH);
      }
    }
  }

  function placeFood() {
    let ok = false, f;
    while (!ok) {
      f = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
      ok = !snake.some(s => s.x === f.x && s.y === f.y);
    }
    food = f;
  }

  function startGame() {
    snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    dir = { x: 1, y: 0 }; nextDir = { x: 1, y: 0 };
    score = 0; alive = true;
    scoreEl && (scoreEl.textContent = '0');
    placeFood();
    overlay && overlay.classList.add('hidden');
    clearInterval(gameLoop);
    gameLoop = setInterval(tick, 120);
  }

  function tick() {
    dir = nextDir;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (head.x < 0) head.x = COLS - 1;
    if (head.x >= COLS) head.x = 0;
    if (head.y < 0) head.y = ROWS - 1;
    if (head.y >= ROWS) head.y = 0;
    if (snake.some(s => s.x === head.x && s.y === head.y)) {
      clearInterval(gameLoop);
      alive = false;
      hiScore = Math.max(hiScore, score);
      hiEl && (hiEl.textContent = hiScore);
      gameOver();
      return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score++;
      scoreEl && (scoreEl.textContent = score);
      placeFood();
    } else snake.pop();
    draw();
  }

  function draw() {
    ctx.fillStyle = '#0a0f16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(56,189,248,0.03)';
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if ((r + c) % 2 === 0) ctx.fillRect(c * CW, r * CH, CW, CH);
      }
    }
    // Food
    const px = food.x * CW + CW / 2, py = food.y * CH + CH / 2;
    const t = Date.now() / 600;
    const glow = ctx.createRadialGradient(px, py, 0, px, py, CW);
    glow.addColorStop(0, `rgba(244,114,182,0.8)`);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(px, py, CW * (0.5 + 0.1 * Math.sin(t)), 0, Math.PI * 2);
    ctx.fill();

    // Snake
    snake.forEach((seg, i) => {
      const alpha = 1 - (i / snake.length) * 0.5;
      const r = Math.round(seg.x * CW + 1), top = Math.round(seg.y * CH + 1);
      const w = Math.round(CW - 2), h = Math.round(CH - 2);
      if (i === 0) {
        const g = ctx.createLinearGradient(r, top, r + w, top + h);
        g.addColorStop(0, '#38bdf8');
        g.addColorStop(1, '#54c5f8');
        ctx.fillStyle = g;
      } else {
        ctx.fillStyle = `rgba(56,189,248,${alpha * 0.85})`;
      }
      roundRect(ctx, r, top, w, h, 3);
    });
  }

  function gameOver() {
    draw();
    ctx.fillStyle = 'rgba(9,12,18,0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = `bold ${Math.round(CW * 1.2)}px Syne, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = `${Math.round(CW * 0.7)}px DM Mono, monospace`;
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillStyle = '#64748b';
    ctx.fillText('Click to restart', canvas.width / 2, canvas.height / 2 + 42);
    overlay && overlay.classList.remove('hidden');
    if (startBtn) startBtn.textContent = 'Play Again';
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
  }

  document.addEventListener('keydown', e => {
    const map = {
      ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
      w: { x: 0, y: -1 }, s: { x: 0, y: 1 },
      a: { x: -1, y: 0 }, d: { x: 1, y: 0 }
    };
    const nd = map[e.key];
    if (nd && alive) {
      if (nd.x !== -dir.x || nd.y !== -dir.y) nextDir = nd;
      e.preventDefault();
    }
  });

  // Mobile controls
  document.querySelectorAll('.snake-ctrl-btn[data-dir]').forEach(btn => {
    btn.addEventListener('click', () => {
      const map = { up: { x:0,y:-1 }, down: { x:0,y:1 }, left: { x:-1,y:0 }, right: { x:1,y:0 } };
      const nd = map[btn.dataset.dir];
      if (nd && alive && (nd.x !== -dir.x || nd.y !== -dir.y)) nextDir = nd;
    });
  });

  if (startBtn) startBtn.addEventListener('click', startGame);
  canvas.addEventListener('click', () => { if (!alive) startGame(); });

  window.addEventListener('resize', resize);
  resize();
  drawIdle();
}

/* ── PHONE SIMULATOR ── */
function initPhoneSim() {
  const screens = document.querySelectorAll('.app-screen');
  const navTabs = document.querySelectorAll('.nav-tab');

  function showScreen(id) {
    screens.forEach(s => {
      if (s.id === id) { s.classList.add('active'); s.classList.remove('exit'); }
      else { s.classList.remove('active'); if (!s.classList.contains('exit')) s.classList.add('exit'); }
    });
    navTabs.forEach(t => t.classList.toggle('active', t.dataset.screen === id));
    setTimeout(() => {
      document.querySelectorAll('.app-screen.exit').forEach(s => s.classList.remove('exit'));
    }, 400);
  }

  navTabs.forEach(t => t.addEventListener('click', () => showScreen(t.dataset.screen)));

  document.querySelectorAll('.screen-list-item[data-nav]').forEach(item => {
    item.addEventListener('click', () => showScreen(item.dataset.nav));
  });

  // Time update
  function updateTime() {
    const now = new Date();
    document.querySelectorAll('.phone-time').forEach(el => {
      el.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });
  }
  setInterval(updateTime, 1000);
  updateTime();
}

/* ── API DEMO ── */
function initApiDemo() {
  const output = document.getElementById('api-output');
  if (!output) return;

  function formatJSON(obj, indent = 0) {
    if (typeof obj === 'string') return `<span class="api-json-str">"${obj}"</span>`;
    if (typeof obj === 'number') return `<span class="api-json-num">${obj}</span>`;
    if (typeof obj === 'boolean') return `<span class="api-json-bool">${obj}</span>`;
    if (obj === null) return `<span class="api-json-bool">null</span>`;
    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      const pad = '  '.repeat(indent + 1);
      const items = obj.slice(0,3).map(v => `${pad}${formatJSON(v, indent + 1)}`).join(',\n');
      return `[\n${items}\n${'  '.repeat(indent)}]`;
    }
    const pad = '  '.repeat(indent + 1);
    const entries = Object.entries(obj).slice(0, 6).map(([k, v]) =>
      `${pad}<span class="api-json-key">"${k}"</span>: ${formatJSON(v, indent + 1)}`
    ).join(',\n');
    return `{\n${entries}\n${'  '.repeat(indent)}}`;
  }

  async function fetchData(type) {
    const btns = document.querySelectorAll('.api-btn');
    btns.forEach(b => b.classList.add('loading'));
    output.innerHTML = '<span class="api-spinner"></span> Fetching...';

    try {
      let url, label;
      if (type === 'joke') {
        url = 'https://v2.jokeapi.dev/joke/Programming?type=single';
        label = '// GET /joke/Programming';
      } else if (type === 'crypto') {
        url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true';
        label = '// GET /simple/price?ids=bitcoin,ethereum';
      } else {
        url = 'https://api.github.com/users/rakeshgowdar';
        label = '// GET /users/rakeshgowdar';
      }

      const res = await fetch(url);
      const data = await res.json();
      output.innerHTML = `<span class="t-comment">${label}</span>\n<span class="t-tag">HTTP 200 OK</span>\n\n${formatJSON(data)}`;
    } catch (e) {
      // Fallback mock data
      const mocks = {
        joke: { id: 42, category: 'Programming', joke: "Why do programmers prefer dark mode? Because light attracts bugs!", flags: { nsfw: false, racist: false }, safe: true },
        crypto: { bitcoin: { usd: 67420, usd_24h_change: 2.34 }, ethereum: { usd: 3890, usd_24h_change: 1.12 } },
        github: { login: 'rakeshgowdar', public_repos: 24, followers: 180, following: 42, bio: 'Senior Flutter Engineer | Mobile Architecture' }
      };
      const mock = mocks[type] || mocks.github;
      output.innerHTML = `<span class="t-comment">// Mock data (CORS or offline)</span>\n<span class="t-tag">HTTP 200 OK (cached)</span>\n\n${formatJSON(mock)}`;
    }

    btns.forEach(b => b.classList.remove('loading'));
  }

  document.getElementById('api-btn-joke')?.addEventListener('click', () => fetchData('joke'));
  document.getElementById('api-btn-crypto')?.addEventListener('click', () => fetchData('crypto'));
  document.getElementById('api-btn-github')?.addEventListener('click', () => fetchData('github'));
}

/* ── ANIMATION DEMO ── */
function initAnimDemo() {
  const ball = document.querySelector('.anim-ball');
  const stage = document.querySelector('.anim-stage');
  if (!ball || !stage) return;

  const anims = {
    spring: { animation: 'none', transition: 'transform 0.8s cubic-bezier(0.34,1.56,0.64,1)', label: 'Spring (Flutter Hero animation curve)' },
    ease: { animation: 'none', transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1)', label: 'Ease Out (Flutter FadeTransition)' },
    bounce: { animation: 'ball-bounce 1.2s cubic-bezier(0.34,1.56,0.64,1) infinite', transition: 'none', label: 'Bounce Loop (Flutter AnimationController)' },
    pulse: { animation: 'ball-pulse 1s ease-in-out infinite', transition: 'none', label: 'Pulse (Flutter ScaleTransition)' },
    slide: { animation: 'ball-slide 2s cubic-bezier(0.65,0,0.35,1) infinite', transition: 'none', label: 'Slide (Flutter SlideTransition)' },
  };

  // Inject keyframes
  const ks = document.createElement('style');
  ks.textContent = `
    @keyframes ball-bounce { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-50px) scale(1.15)} }
    @keyframes ball-pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.6);opacity:0.7} }
    @keyframes ball-slide { 0%,100%{transform:translateX(-80px)} 50%{transform:translateX(80px)} }
  `;
  document.head.appendChild(ks);

  let currentAnim = null;
  document.querySelectorAll('.anim-ctrl-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.anim-ctrl-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const type = btn.dataset.anim;
      const conf = anims[type];
      if (!conf) return;
      ball.style.animation = 'none';
      ball.style.transform = '';
      setTimeout(() => {
        ball.style.transition = conf.transition || 'none';
        ball.style.animation = conf.animation || 'none';
        if (type === 'spring' || type === 'ease') {
          setTimeout(() => {
            ball.style.transform = 'translateX(80px) scale(1.1)';
            setTimeout(() => { ball.style.transform = ''; }, 900);
          }, 20);
        }
        const lbl = document.querySelector('.anim-label');
        if (lbl) lbl.textContent = conf.label;
      }, 50);
    });
  });
}

/* ── TERMINAL ── */
function initTerminal() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  if (!input || !output) return;

  const commands = {
    whoami: () => `<span class="t-key">name</span>       <span class="t-val">Rakesh Gowdar</span>
<span class="t-key">role</span>       <span class="t-val">Senior Flutter Engineer</span>
<span class="t-key">experience</span> <span class="t-val">10+ years mobile development</span>
<span class="t-key">location</span>   <span class="t-val">Hyderabad, India 🇮🇳</span>
<span class="t-key">email</span>      <span class="t-val">rakesh@example.com</span>
<span class="t-key">github</span>     <span class="t-val">github.com/rakeshgowdar</span>`,

    skills: () => `<span class="t-tag">[ Flutter / Dart ]</span>
  <span class="t-key">expertise</span>   <span class="t-val">★★★★★</span>  State management, animations, platform channels
  <span class="t-key">packages</span>    <span class="t-val">BLoC, Riverpod, Provider, GetX</span>

<span class="t-tag">[ Mobile ]</span>
  <span class="t-key">Android</span>     <span class="t-val">★★★★★</span>  Kotlin, Jetpack Compose, NDK
  <span class="t-key">iOS</span>         <span class="t-val">★★★★☆</span>  Swift, SwiftUI, Objective-C

<span class="t-tag">[ Architecture ]</span>
  <span class="t-key">patterns</span>    <span class="t-val">Clean Architecture, MVVM, MVC, DDD</span>
  <span class="t-key">testing</span>     <span class="t-val">Unit, Widget, Integration, TDD</span>

<span class="t-tag">[ Backend ]</span>
  <span class="t-key">stack</span>       <span class="t-val">Firebase, REST, GraphQL, WebSockets</span>
  <span class="t-key">cloud</span>       <span class="t-val">GCP, AWS, Docker</span>`,

    projects: () => `<span class="t-tag">[ Featured Projects ]</span>

<span class="t-key">1.</span> <span class="t-success">FlutterFlow Pro</span>
   <span class="t-val">Visual app builder • 50K+ downloads • ★ 4.8</span>
   <span class="t-comment">// Flutter, Firebase, BLoC</span>

<span class="t-key">2.</span> <span class="t-success">MedTrack Mobile</span>
   <span class="t-val">Healthcare platform • 100K+ users • HIPAA compliant</span>
   <span class="t-comment">// Flutter, Kotlin, REST API, Clean Arch</span>

<span class="t-key">3.</span> <span class="t-success">FinPulse</span>
   <span class="t-val">Fintech app • Real-time data • 4.9★ App Store</span>
   <span class="t-comment">// Flutter, WebSockets, Riverpod</span>

<span class="t-key">4.</span> <span class="t-success">UIKit OSS</span>
   <span class="t-val">Open source component library • 2.4K GitHub ★</span>
   <span class="t-comment">// Flutter, pub.dev published</span>`,

    contact: () => `<span class="t-tag">[ Contact ]</span>
  <span class="t-key">email</span>     <span class="t-val">rakesh@gowdar.dev</span>
  <span class="t-key">linkedin</span>  <span class="t-val">linkedin.com/in/rakeshgowdar</span>
  <span class="t-key">github</span>    <span class="t-val">github.com/rakeshgowdar</span>
  <span class="t-key">twitter</span>   <span class="t-val">@rakeshgowdar</span>

<span class="t-success">Open to senior / lead roles and consulting</span>`,

    help: () => `<span class="t-tag">[ Available Commands ]</span>
  <span class="t-key">whoami</span>    — Personal info & contact
  <span class="t-key">skills</span>    — Technical skill breakdown  
  <span class="t-key">projects</span>  — Featured project showcase
  <span class="t-key">contact</span>   — Get in touch
  <span class="t-key">clear</span>     — Clear terminal
  <span class="t-key">Easter</span>    — Try: ↑↑↓↓←→←→BA`,

    clear: () => { output.innerHTML = ''; return null; },

    flutter: () => `<span class="t-tag">[ Flutter Expertise ]</span>
  Custom painters, animations, platform channels
  State: BLoC, Riverpod, Provider
  Performance: 60fps optimization, profiling
  Published packages on pub.dev
  <span class="t-success">10 years of mobile development experience</span>`,
  };

  function runCommand(cmd) {
    const trimmed = cmd.trim().toLowerCase();
    const fn = commands[trimmed];
    let out;
    if (fn) {
      out = fn();
      if (out === null) return;
    } else if (trimmed === '') {
      return;
    } else {
      out = `<span class="t-error">Command not found: ${cmd}</span>\nType <span class="t-key">help</span> for available commands`;
    }

    const promptLine = `<div class="t-line"><span class="t-prompt">rakesh@portfolio</span><span class="t-comment">:~$</span> <span class="t-cmd">${cmd}</span></div>`;
    const resultLine = `<div class="t-line" style="margin-bottom:14px">${out}</div>`;
    output.innerHTML += promptLine + resultLine;
    output.scrollTop = output.scrollHeight;
  }

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      runCommand(val);
    }
  });

  document.querySelectorAll('.terminal-hint span').forEach(chip => {
    chip.addEventListener('click', () => {
      runCommand(chip.textContent);
      input.focus();
    });
  });

  // Auto type intro
  setTimeout(() => runCommand('whoami'), 400);
  setTimeout(() => {
    output.innerHTML += `<div class="t-line t-comment" style="margin-bottom:8px">// Type 'help' to explore more commands</div>`;
  }, 600);
}

/* ── PROJECTS ── */
function initProjects() {
  document.querySelectorAll('.project-card').forEach(card => {
    const expandBtn = card.querySelector('.project-expand-btn');
    if (expandBtn) {
      expandBtn.addEventListener('click', e => {
        e.stopPropagation();
        card.classList.toggle('expanded');
        expandBtn.textContent = card.classList.contains('expanded') ? 'Collapse ↑' : 'Details ↓';
      });
    }
  });
}

/* ── KONAMI CODE EASTER EGG ── */
function initKonami() {
  const code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let pos = 0;
  document.addEventListener('keydown', e => {
    if (e.key === code[pos]) {
      pos++;
      if (pos === code.length) {
        pos = 0;
        document.querySelector('.konami-overlay')?.classList.add('show');
      }
    } else pos = 0;
  });
  document.querySelector('.konami-close')?.addEventListener('click', () => {
    document.querySelector('.konami-overlay')?.classList.remove('show');
  });
}

/* ── COUNTER ANIMATION ── */
function initCounters() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const nums = e.target.querySelectorAll('.stat-num[data-target]');
        nums.forEach(num => {
          const target = parseInt(num.dataset.target);
          const suffix = num.dataset.suffix || '';
          let cur = 0;
          const step = target / 60;
          const tick = () => {
            cur = Math.min(cur + step, target);
            num.textContent = Math.floor(cur) + suffix;
            if (cur < target) requestAnimationFrame(tick);
          };
          tick();
        });
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.hero-stats').forEach(el => io.observe(el));
}

/* ── INIT ALL ── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNav();
  initSectionIndicator();
  initHeroTyping();
  initReveal();
  initSkillBars();
  initSnake();
  initPhoneSim();
  initApiDemo();
  initAnimDemo();
  initTerminal();
  initProjects();
  initKonami();
  initCounters();
});
