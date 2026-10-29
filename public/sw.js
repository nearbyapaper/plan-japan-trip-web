// Service worker ของ Japan 2027: เก็บหน้าแผนเที่ยวไว้ในเครื่อง ให้เปิดดูได้ตอนไม่มีอินเทอร์เน็ต
//
// - หน้าเว็บ: ลองโหลดจากเน็ตก่อน ถ้าไม่มีเน็ตหรือช้าเกินไปจะใช้ฉบับที่เก็บไว้
// - ไฟล์ JS/CSS/ฟอนต์ใน /_next/static: ชื่อไฟล์เปลี่ยนทุกครั้งที่ build จึงเก็บครั้งเดียวใช้ได้เลย
// - หน้าเว็บแยกเก็บตามภาษา (th / ja) เพราะ URL เดียวกันแสดงได้ทั้งสองภาษา
// - ไม่เก็บหน้า login, แผนที่พื้นหลัง (OpenStreetMap) และรูปจาก Wikimedia

const PAGES = "j27-pages-v1";
const STATIC = "j27-static-v1";
const META = "j27-meta-v1";
const LANGS = ["th", "ja"];
const LANG_KEY = "/__j27/lang";
const NAV_TIMEOUT_MS = 5000;

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keep = [PAGES, STATIC, META];
      for (const name of await caches.keys()) {
        if (name.startsWith("j27-") && !keep.includes(name)) await caches.delete(name);
      }
      await self.clients.claim();
    })(),
  );
});

const pageKey = (path, lang) => new URL(`${path}?__lang=${lang}`, self.location.origin).href;

async function getLang() {
  const res = await (await caches.open(META)).match(LANG_KEY);
  const lang = res ? await res.text() : "th";
  return LANGS.includes(lang) ? lang : "th";
}

async function setLang(lang) {
  if (!LANGS.includes(lang)) return;
  await (await caches.open(META)).put(LANG_KEY, new Response(lang));
}

const htmlLang = (html) => {
  const m = html.match(/<html[^>]*\slang="(th|ja)"/);
  return m ? m[1] : null;
};

// หาไฟล์ใน /_next/static ที่หน้าเว็บอ้างถึง (ทั้งใน <script>/<link> และในข้อมูล RSC ที่ฝังในหน้า)
function collectAssets(text, into, base = self.location.origin) {
  // จับถึงนามสกุลไฟล์ เพราะชื่อโฟลเดอร์อย่าง app/(trip)/ มีวงเล็บอยู่
  for (const m of text.matchAll(
    /(?:\/_next\/)?static\/(?:chunks|css|media)\/[^"'\s\\]*?\.(?:js|css|woff2?|ttf|otf|png|jpe?g|svg|webp|gif)/g,
  )) {
    const p = m[0].startsWith("/_next/") ? m[0] : `/_next/${m[0]}`;
    into.add(new URL(p, base).href);
  }
}

async function cacheAssets(urls) {
  const cache = await caches.open(STATIC);
  // CSS อ้างถึงไฟล์ฟอนต์อีกที ต้องอ่าน CSS ก่อน
  for (const url of [...urls]) {
    if (!url.endsWith(".css")) continue;
    try {
      const res = (await cache.match(url)) || (await fetch(url));
      if (!res.ok) continue;
      await cache.put(url, res.clone());
      collectAssets(await res.text(), urls, url);
    } catch {}
  }
  await Promise.all(
    [...urls].map(async (url) => {
      if (await cache.match(url)) return;
      try {
        const res = await fetch(url);
        if (res.ok) await cache.put(url, res);
      } catch {}
    }),
  );
}

async function storePage(path, html) {
  const lang = htmlLang(html) || (await getLang());
  await (await caches.open(PAGES)).put(
    pageKey(path, lang),
    new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } }),
  );
}

// ดาวน์โหลดทุกหน้าทั้งสองภาษาเก็บไว้ แล้วลบหน้าเก่าที่ไม่มีแล้ว
// (ไฟล์ใน STATIC ไม่ลบ เพราะมีไฟล์ที่โหลดตอนใช้งาน เช่นโค้ดแผนที่ ถ้าอยากล้างให้เปลี่ยนเลขเวอร์ชันชื่อ cache)
async function syncAll(paths) {
  const assets = new Set();
  const keepPages = new Set();
  let saved = 0;
  let failed = 0;

  for (const lang of LANGS) {
    for (const path of paths) {
      try {
        const res = await fetch(path, {
          headers: { "x-j27-lang": lang },
          credentials: "same-origin",
          cache: "no-store",
        });
        if (res.redirected) return { saved, failed, needLogin: true };
        if (!res.ok) {
          failed++;
          continue;
        }
        const html = await res.text();
        collectAssets(html, assets);
        const key = pageKey(path, lang);
        await (await caches.open(PAGES)).put(
          key,
          new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } }),
        );
        keepPages.add(key);
        saved++;
      } catch {
        failed++;
      }
    }
  }

  await cacheAssets(assets);

  // ลบของเก่าเฉพาะเมื่อโหลดครบทุกหน้า กันข้อมูลหายตอนเน็ตหลุดกลางทาง
  if (failed === 0) {
    const pages = await caches.open(PAGES);
    for (const req of await pages.keys()) if (!keepPages.has(req.url)) await pages.delete(req);
  }
  return { saved, failed, needLogin: false };
}

async function findPage(path) {
  const pages = await caches.open(PAGES);
  const lang = await getLang();
  const order = [lang, ...LANGS.filter((l) => l !== lang)];
  for (const l of order) {
    const hit = await pages.match(pageKey(path, l));
    if (hit) return hit;
  }
  return null;
}

function offlinePage() {
  const html = `<!doctype html><html lang="th"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>ออฟไลน์ · Japan 2027</title>
<style>body{font-family:system-ui,sans-serif;background:#f6f4ef;color:#1d1b18;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;padding:16px}
.c{max-width:360px;text-align:center}a{color:#c2410c}@media(prefers-color-scheme:dark){body{background:#14130f;color:#f1ede4}a{color:#f97316}}</style></head>
<body><div class="c"><p style="font-size:40px;margin:0">📴</p><h1 style="font-size:20px">ไม่มีอินเทอร์เน็ต</h1>
<p>หน้านี้ยังไม่ได้บันทึกไว้ในเครื่อง ต่อเน็ตแล้วเปิดเว็บอีกครั้งเพื่อบันทึกทุกหน้า</p>
<p><a href="/">กลับไปหน้าภาพรวม</a></p></div></body></html>`;
  return new Response(html, { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

const cacheable = (path) => path !== "/login" && !path.startsWith("/__j27");

async function handleNavigation(event) {
  const path = new URL(event.request.url).pathname;
  const network = fetch(event.request).then((res) => {
    if (cacheable(path) && res.ok && res.type === "basic") {
      const copy = res.clone();
      event.waitUntil(
        copy.text().then(async (html) => {
          await storePage(path, html);
          const assets = new Set();
          collectAssets(html, assets);
          await cacheAssets(assets);
        }),
      );
    }
    return res;
  });

  // เน็ตช้ามาก (เช่นสัญญาณอ่อนในรถไฟ) ให้ใช้ฉบับในเครื่องไปก่อน
  const timeout = new Promise((resolve) => setTimeout(() => resolve("timeout"), NAV_TIMEOUT_MS));
  try {
    const first = await Promise.race([network, timeout]);
    if (first !== "timeout") return first;
    const cached = await findPage(path);
    if (cached) {
      network.catch(() => {});
      return cached;
    }
    return await network;
  } catch {
    return (await findPage(path)) || (await findPage("/")) || offlinePage();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok && res.type === "basic") await cache.put(request, res.clone());
  return res;
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    event.respondWith(handleNavigation(event));
    return;
  }
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/manifest.webmanifest"
  ) {
    event.respondWith(cacheFirst(req));
  }
  // คำขออื่น (เช่นข้อมูล RSC ตอนกดลิงก์) ปล่อยไปตามปกติ ถ้าออฟไลน์ Next.js จะโหลดทั้งหน้าใหม่ ซึ่งจะมาเข้า handleNavigation
});

self.addEventListener("message", (event) => {
  const data = event.data || {};
  const reply = (msg) => event.ports[0]?.postMessage(msg);

  if (data.type === "lang") {
    event.waitUntil(setLang(data.lang).then(() => reply({ ok: true })));
  } else if (data.type === "sync" && Array.isArray(data.paths)) {
    event.waitUntil(
      syncAll(data.paths)
        .then(reply)
        .catch(() => reply({ saved: 0, failed: data.paths.length * LANGS.length, needLogin: false })),
    );
  } else if (data.type === "clear") {
    event.waitUntil(
      Promise.all([caches.delete(PAGES), caches.delete(STATIC)]).then(() => reply({ ok: true })),
    );
  }
});
