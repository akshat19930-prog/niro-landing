// Renders public/media/chat-pain.mp4 frame by frame against the local static build (npx serve out -l 4321).
// Usage: node design/hero-clip-render.mjs <dir with tools/package.json> [stills], then encode the frames with:
// ffmpeg -framerate 30 -i frames/f%04d.png -c:v libx264 -profile:v high -level:v 3.1 -pix_fmt yuv420p -crf 28 -preset veryslow -tune stillimage -g 90 -movflags +faststart -an chat-pain.mp4
import { createRequire } from "module";
import fs from "fs";
const SCR = process.argv[2];
const require = createRequire(SCR + "/tools/package.json");
const puppeteer = require("puppeteer-core");
const OUT = SCR + "/vid/frames";
const STILLS = process.argv[3] === "stills";
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const FPS = 30;
// Same rhythm as the clip it replaces: 13.43s at 1x (the page plays it at
// 0.65x, so about 20.7s a loop), a ~1s fade out and a ~1s fade in between
// screens. The second bubble on each screen now arrives a beat after the
// first, like a real reply, so the screens run 4.0 / 4.4 / 5.0s.
const SCREENS = [
  {
    title: "Niro · Ankush", sub: "Niro, Me", chip: "Monday",
    bubbles: [
      { kind: "me", html: "Please set a Friday <b>pain checker</b> for Amma&rsquo;s knee. If it&rsquo;s 7/10 or worse, book physio.", time: "19:04", at: 0 },
      { kind: "niro", html: "Done. Every Friday I&rsquo;ll check in with Amma and act on her score.", time: "19:06", at: 1.1 },
    ],
    len: 4.0,
  },
  {
    title: "Niro · Amma", sub: "Amma&rsquo;s 1:1 chat with Niro", chip: "Friday",
    bubbles: [
      { kind: "niro", html: "Namaste Aunty! How is the knee pain this week, on a scale of 10? 10 being the worst.", time: "09:00", at: 0 },
      { kind: "amma", html: "8. 3 din se kaafi badha hua hai. Yoga bhi chal raha hai, par phir bhi.", time: "09:14", at: 1.3 },
    ],
    len: 4.4,
  },
  {
    title: "Niro · Ankush", sub: "Niro, Me", chip: "Friday",
    bubbles: [
      { kind: "niro", html: "Amma reported <b>8/10</b> knee pain today, above the 7 you set. Booking 3 physio sessions for next week in her standard slots. OK to confirm?", time: "09:20", at: 0 },
      { kind: "me", html: "Superb, approved!", time: "09:31", at: 1.6 },
    ],
    len: 5.0,
  },
];
const FADE = 0.9; // out, and again in
// The loop starts on screen 1 fully shown (that frame is also the poster),
// HEAD seconds into its hold, and ends by building screen 1 back up.
const HEAD = 1.7;
const total = SCREENS.reduce((n, s) => n + s.len, 0); // 13.4s

function stateAt(T) {
  // Shift so the timeline runs screen 1 entry first, then wrap.
  // Screen 1's second bubble has fully arrived 1.6s into the screen.
  let t = (T + HEAD - 0.1) % total;
  let i = 0;
  while (t >= SCREENS[i].len) { t -= SCREENS[i].len; i++; }
  const s = SCREENS[i];
  const fadeIn = Math.min(1, t / FADE);
  const fadeOut = Math.min(1, Math.max(0, (s.len - t) / FADE));
  const vis = Math.min(fadeIn, fadeOut);
  const bubbles = s.bubbles.map((b) => {
    const k = Math.max(0, Math.min(1, (t - b.at - 0.15) / 0.3));
    return k;
  });
  return { i, vis, bubbles };
}

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:760px;height:1080px;overflow:hidden;background:var(--wa-bg)}
#v{position:fixed;inset:0;width:760px;height:1080px;font-family:var(--font-sans);background:var(--wa-bg)}
.bg{position:absolute;inset:132px 0 0 0;background-color:var(--wa-bg);background-image:var(--jaali);background-size:96px;opacity:.55}
.top{position:absolute;left:0;right:0;top:0;height:132px;background:var(--forest-700);display:flex;align-items:center;gap:22px;padding:0 32px}
.av{width:80px;height:80px;border-radius:50%;background:var(--gold-500);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:48px;color:var(--forest-900);flex-shrink:0}
.who b{display:block;color:#fff;font-weight:600;font-size:29px;letter-spacing:.01em}
.who span{display:block;color:rgba(255,255,255,.62);font-size:21px;margin-top:4px}
.ph{margin-left:auto;width:20px;height:30px;border:2.5px solid rgba(255,255,255,.85);border-radius:5px;position:relative}
.ph:after{content:"";position:absolute;left:5px;right:5px;bottom:3px;height:2.5px;background:rgba(255,255,255,.85);border-radius:2px}
.screen{position:absolute;left:0;right:0;top:132px;bottom:0;padding:120px 24px 0;display:flex;flex-direction:column;gap:16px}
.chip{align-self:center;background:rgba(255,255,255,.82);color:var(--ink-500,#6b6a63);font-size:19px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;padding:7px 16px;border-radius:10px;margin-bottom:18px}
.b{max-width:592px;border-radius:22px;padding:18px 22px 14px;font-size:25.5px;line-height:1.55;position:relative;box-shadow:0 1px 1.5px rgba(0,0,0,.08)}
.b b{font-weight:700}
.b i{display:block;font-style:normal;font-weight:600;font-size:21px;margin-bottom:4px}
.b .tm{display:block;text-align:right;font-size:18px;margin-top:6px}
.me{align-self:flex-end;background:var(--wa-out);color:var(--ink-900)}
.me .tm{color:rgba(25,26,22,.5)}
.me .tm:after{content:" \\2713\\2713";color:#4fa3e0;letter-spacing:-6px;margin-left:6px}
.niro{align-self:flex-start;background:var(--wa-out-dark);color:#fff}
.niro i{color:var(--gold-300)}
.niro i em{font-style:normal;font-weight:500;color:var(--gold-500)}
.niro .tm{color:rgba(255,255,255,.5)}
.amma{align-self:flex-start;background:#fff;color:var(--ink-900)}
.amma i{color:#c76a5a}
.amma .tm{color:rgba(25,26,22,.45)}
.veil{position:absolute;inset:0;background:var(--wa-bg)}
`;

const b = await puppeteer.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 760, height: 1080, deviceScaleFactor: 1 });
await p.goto("http://localhost:4321/firsttrialtask/", { waitUntil: "networkidle0" }).catch(() => {});
await p.goto("http://localhost:4321/", { waitUntil: "networkidle0" });
await p.evaluate((css, screens) => {
  document.querySelectorAll("body > *").forEach((n) => n.remove());
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  const v = document.createElement("div"); v.id = "v"; document.body.appendChild(v);
  window.__screens = screens;
  window.__draw = (s) => {
    const sc = screens[s.i];
    const bub = sc.bubbles.map((x, j) => {
      const k = s.bubbles[j];
      if (k <= 0) return "";
      const name = x.kind === "niro" ? "<i>Kunal <em>from Niro</em></i>" : x.kind === "amma" ? "<i>Amma</i>" : "";
      return `<div class="b ${x.kind}" style="opacity:${k};transform:translateY(${(1 - k) * 14}px)">${name}${x.html}<span class="tm">${x.time}</span></div>`;
    }).join("");
    v.innerHTML = `<div class="bg"></div><div class="top"><div class="av">N</div><div class="who"><b>${sc.title}</b><span>${sc.sub}</span></div><div class="ph"></div></div><div class="screen"><div class="chip">${sc.chip}</div>${bub}</div><div class="veil" style="opacity:${(1 - s.vis) * 0.85}"></div>`;
  };
}, CSS, SCREENS);
await p.evaluate(() => document.fonts.ready);

if (STILLS) {
  for (const [n, T] of [["s1", 0], ["s2", 5.0], ["s3", 9.5]]) {
    await p.evaluate((s) => window.__draw(s), stateAt(T));
    await p.screenshot({ path: `${SCR}/vid/still-${n}.png` });
  }
} else {
  const N = Math.round(total * FPS);
  for (let f = 0; f < N; f++) {
    await p.evaluate((s) => window.__draw(s), stateAt(f / FPS));
    await p.screenshot({ path: `${OUT}/f${String(f).padStart(4, "0")}.png` });
  }
  console.log("frames", N, "seconds", total);
}
await b.close();
