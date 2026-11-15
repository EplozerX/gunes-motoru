(function () {
  "use strict";
  const stage = document.getElementById("stage"),
    canvas = document.getElementById("view");
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("Canvas 2D bu tarayıcıda kullanılamıyor.");
  let W = 800,
    H = 550,
    DPR = 1,
    frame = null,
    lastTime = null,
    renderCount = 0,
    failed = false;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  function invalidate() {
    if (frame === null && !failed && !document.hidden)
      frame = requestAnimationFrame(tick);
  }
  function tick(time) {
    frame = null;
    try {
      if (P.run)
        P.spin =
          (P.spin +
            Math.min(lastTime === null ? 0 : (time - lastTime) / 1000, 0.05) *
              5.7) %
          (Math.PI * 2);
      lastTime = time;
      render();
      renderCount++;
      Object.assign(canvas.dataset, {
        ready: "true",
        yaw: String(P.yaw),
        pitch: String(P.pitch),
        distance: String(P.dist),
        spin: String(P.spin),
        selected: P.selected,
        wires: String(P.wires),
        running: String(P.run),
        renderCount: String(renderCount),
      });
      window.modelReady();
      if (P.run) invalidate();
    } catch (error) {
      failed = true;
      window.showModelError(error);
    }
  }
  // Compatible with Safari versions without CanvasRenderingContext2D.roundRect.
  function roundedRect(x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }

  const P = {
    yaw: 0.73,
    pitch: 0.67,
    dist: 700,
    ty: 12,
    run: false,
    spin: 0,
    wires: true,
    selected: "motor",
  };
  const C = {
    solar: {
      icon: "☀️",
      name: "Güneş paneli",
      desc: "Hazır fotovoltaik hücrelerden oluşan küçük panel. Işığı elektriğe çevirir. Gösterilen panel 6 V nominaldir; açık devre gerilimi daha yüksek olabilir ve şarj kartının en yüksek giriş sınırını aşmamalıdır.",
      meta: ["6 V nominal", "Yaklaşık 110 × 85 mm"],
      pos: [-163, 64, -75],
    },
    charge: {
      icon: "🔋",
      name: "Güneş şarj kontrol kartı",
      desc: "Panelle ve 1S Li-ion pille uyumlu şarj kartı gerekir. Her USB şarj kartı güneş paneline uygun değildir. Standart Li-ion için 4,2 V şarj sınırı ve akım hücre datasheet’iyle doğrulanır. Şarj sırasında çalışma için güç yolu / yük paylaşımı desteği gerekir.",
      meta: ["Şarj kontrolü", "Model temsili"],
      pos: [-61, 22, -88],
    },
    battery: {
      icon: "🔋",
      name: "18650 şarjlı pil + yuva",
      desc: "Tek hücre: 3,6–3,7 V nominal, standart Li-ion için tam şarj 4,2 V. Koruma devresi şarj kartının yerini tutmaz. Uyumlu yuva kullanın; kısa devre etmeyin, hücreye doğrudan lehim yapmayın ve hasarlı pil kullanmayın.",
      meta: ["3,6–3,7 V nominal", "Korumalı hücre"],
      pos: [21, 29, -83],
    },
    reg: {
      icon: "⚡",
      name: "Gerilim düzenleyici",
      desc: "Örnek giriş: yaklaşık 3,0–4,2 V pil. Bu aralığı destekleyen boost ile 5 V, yalnızca 5 V girişi kabul eden ESP32 geliştirme kartına verilir. 3V3 hattı için tüm pil aralığını kapsayan sabit 3,3 V buck-boost gerekir. Kesin giriş aralığı, düşük pil kesmesi ve çıkış akımı ürüne bağlıdır. Motor beslemesi ayrıca belirlenir.",
      meta: ["Örnek giriş: 3,0–4,2 V", "5 V boost / 3,3 V buck-boost"],
      pos: [113, 20, -81],
    },
    sensor: {
      icon: "📏",
      name: "INA219 sensörü",
      desc: "Şönt üzerinden seçilen kolun akımını ve gerilimini ölçer. ESP32 için 3,3 V I²C seviyeleri, ortak referans ve kartın şönt / akım sınırları doğrulanır. INA219 tek başına kesin pil yüzdesi ölçmez.",
      meta: ["I²C", "Akım + voltaj"],
      pos: [-42, 21, 11],
    },
    esp: {
      icon: "🧠",
      name: "ESP32 kontrol kartı",
      desc: "Sensör verilerini OLED ekrana iletir. GPIO’lar 3,3 V mantık seviyesindedir; motor GPIO’dan beslenmez. Geliştirme kartının 5 V / USB giriş koşulları modeline bağlıdır.",
      meta: ["Programlanabilir", "Arduino IDE"],
      pos: [57, 19, 12],
    },
    oled: {
      icon: "🖥️",
      name: "0,96 inç OLED ekran",
      desc: "Ölçülen voltaj ve akımı, ayrıca algoritmanın tahmin ettiği pil doluluk yüzdesini gösterir. Ekrandaki %78 örnek veridir.",
      meta: ["I²C", "Temsili %78"],
      pos: [155, 46, 11],
    },
    switch: {
      icon: "🔘",
      name: "Mekanik aç/kapa anahtarı",
      desc: "Motorun elektrik hattını mekanik olarak açıp kapatır. Anahtarın akım sınırının motorla uyumlu olması gerekir.",
      meta: ["ON/OFF", "Motor güç hattı"],
      pos: [148, 21, 98],
    },
    motor: {
      icon: "🌀",
      name: "El yapımı bobinli DC motor",
      desc: "Emaye kaplı bakır bobin, iki destek, sabit mıknatıslar ve basit komütatörden oluşur. Önce yüksüz çalıştırılır, sonra hafif pervane takılır.",
      meta: ["Kendin sar", "Manyetik tork"],
      pos: [-66, 36, 88],
    },
    fan: {
      icon: "💨",
      name: "Hafif pervane",
      desc: "Bobin miline bağlanan ince, hafif pervane. Bu basit motorun torku düşük olacağından küçük yapılması gerekir.",
      meta: ["4 kanat", "Hafif malzeme"],
      pos: [17, 37, 88],
    },
    base: {
      icon: "📐",
      name: "Ahşap / MDF taban",
      desc: "Bütün sistemi sabitleyen yaklaşık 45 × 30 cm taban. Delikler, destek ayakları, kablo klipsleri ve etiketler burada yer alır.",
      meta: ["450 × 300 mm", "Yalıtımlı montaj"],
      pos: [0, 4, 0],
    },
  };
  const order = [
    "base",
    "solar",
    "charge",
    "battery",
    "reg",
    "sensor",
    "esp",
    "oled",
    "switch",
    "motor",
    "fan",
  ];
  let elParts = document.getElementById("parts");
  order.forEach((id) => {
    const b = document.createElement("button");
    b.className = "part";
    b.textContent = C[id].icon + " " + C[id].name;
    b.dataset.part = id;
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => select(id));
    elParts.appendChild(b);
  });
  function select(id) {
    if (!C[id]) return;
    P.selected = id;
    let a = C[id];
    document.getElementById("componentName").textContent = a.name;
    document.getElementById("componentIcon").textContent = a.icon;
    document.getElementById("componentDesc").textContent = a.desc;
    document.getElementById("componentMeta").innerHTML = a.meta
      .map((x) => "<span>" + x + "</span>")
      .join("");
    document.querySelectorAll(".part").forEach((x) => {
      x.classList.toggle("selected", x.dataset.part === id);
      x.setAttribute("aria-pressed", String(x.dataset.part === id));
    });
    invalidate();
  }
  function resize() {
    const r = canvas.getBoundingClientRect();
    W = r.width;
    H = r.height;
    DPR = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.round(W * DPR),
      height = Math.round(H * DPR);
    // Assigning even the same canvas dimensions erases its bitmap in WebKit.
    if (canvas.width !== width || canvas.height !== height) {
      canvas.dataset.ready = "false";
      canvas.width = width;
      canvas.height = height;
    }
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    invalidate();
  }
  if (typeof ResizeObserver === "function")
    new ResizeObserver(resize).observe(stage);
  window.addEventListener("resize", resize);
  resize();
  select("motor");
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
  const norm = (a) => {
    const d = Math.hypot(...a) || 1;
    return a.map((c) => c / d);
  };
  let camera,
    shapes = [],
    sceneLayer = 0,
    currentPart = null,
    hitRegions = [],
    labelRegions = [];
  function setupCamera() {
    let c = Math.cos(P.pitch),
      s = Math.sin(P.pitch),
      t = [0, P.ty, 0],
      pos = [
        Math.sin(P.yaw) * c * P.dist,
        s * P.dist + P.ty,
        Math.cos(P.yaw) * c * P.dist,
      ],
      f = norm(t.map((q, i) => q - pos[i])),
      r = norm(cross(f, [0, 1, 0])),
      u = cross(r, f);
    camera = { pos, f, r, u, focal: Math.min(W / 1.04, H / 0.68) * 1.16 };
  }
  function proj(q) {
    const a = q.map((x, i) => x - camera.pos[i]),
      z = dot(a, camera.f),
      k = camera.focal / Math.max(40, z);
    return [W / 2 + dot(a, camera.r) * k, H * 0.53 - dot(a, camera.u) * k, z];
  }
  function poly(points, color, edge = "", lw = 0.5, alpha = 1) {
    const avg = points.reduce((n, p) => n + proj(p)[2], 0) / points.length;
    shapes.push({
      points,
      color,
      edge,
      lw,
      alpha,
      depth: avg,
      layer: sceneLayer,
      part: currentPart,
      kind: "poly",
    });
  }
  function line(points, color, width = 2, alpha = 1) {
    for (let i = 1; i < points.length; i++) {
      let q = [points[i - 1], points[i]],
        depth = (proj(q[0])[2] + proj(q[1])[2]) / 2;
      shapes.push({
        points: q,
        color,
        width,
        depth,
        layer: sceneLayer,
        part: currentPart,
        kind: "line",
        alpha,
      });
    }
  }
  function box(x, y, z, w, h, d, color, edge = "#172436") {
    let x0 = x - w / 2,
      x1 = x + w / 2,
      z0 = z - d / 2,
      z1 = z + d / 2,
      y0 = y,
      y1 = y + h;
    let A = [x0, y0, z0],
      B = [x1, y0, z0],
      C = [x1, y0, z1],
      D = [x0, y0, z1],
      E = [x0, y1, z0],
      F = [x1, y1, z0],
      G = [x1, y1, z1],
      I = [x0, y1, z1];
    poly([A, B, F, E], color[1] || color[0], edge);
    poly([B, C, G, F], color[2] || color[0], edge);
    poly([C, D, I, G], color[3] || color[0], edge);
    poly([D, A, E, I], color[4] || color[0], edge);
    poly([E, F, G, I], color[0], edge);
    poly([D, C, B, A], color[5] || color[2] || color[0], edge);
  }
  function cylX(x0, x1, y, z, r, color, n = 16) {
    let rings = [];
    for (let x of [x0, x1]) {
      let ring = [];
      for (let j = 0; j < n; j++) {
        let a = (j * 2 * Math.PI) / n;
        ring.push([x, y + r * Math.sin(a), z + r * Math.cos(a)]);
      }
      rings.push(ring);
    }
    for (let j = 0; j < n; j++) {
      poly(
        [
          rings[0][j],
          rings[0][(j + 1) % n],
          rings[1][(j + 1) % n],
          rings[1][j],
        ],
        color[j % 3] || color[0],
        "#111a2b",
        0.2,
      );
    }
    poly(rings[0].slice().reverse(), color[1] || color[0]);
    poly(rings[1], color[1] || color[0]);
  }
  function discY(cx, y, cz, r, color, n = 16) {
    let p = [];
    for (let i = 0; i < n; i++) {
      let a = (i / n) * Math.PI * 2;
      p.push([cx + Math.cos(a) * r, y, cz + Math.sin(a) * r]);
    }
    poly(p, color, "#1b3248", 0.65);
  }
  function plate(cx, cy, cz, w, h, angle, fill, stroke) {
    const co = Math.cos(angle),
      si = Math.sin(angle);
    let pos = (x, q, offset = 0) => [
      cx + x,
      cy + q * co + offset * si,
      cz - q * si + offset * co,
    ];
    poly(
      [
        pos(-w / 2, -h / 2),
        pos(w / 2, -h / 2),
        pos(w / 2, h / 2),
        pos(-w / 2, h / 2),
      ],
      fill,
      stroke,
      1.5,
    );
    return pos;
  }
  function wire3(points, color) {
    if (P.wires) line(points, color, 2.8, 0.87);
  }
  function addWires() {
    let routes = [
      {
        c: "#ff735a",
        p: [
          [-128, 12, -86],
          [-110, 11, -115],
          [-78, 11, -115],
          [-61, 13, -92],
        ],
      },
      {
        c: "#ff735a",
        p: [
          [-42, 13, -91],
          [-27, 11, -125],
          [2, 11, -125],
          [2, 17, -85],
        ],
      },
      {
        c: "#ff735a",
        p: [
          [47, 16, -83],
          [74, 11, -122],
          [113, 11, -122],
          [113, 13, -81],
        ],
      },
      {
        c: "#ff735a",
        p: [
          [22, 15, -71],
          [20, 11, -23],
          [-42, 12, -23],
          [-42, 15, 11],
        ],
      },
      {
        c: "#ff735a",
        p: [
          [20, 14, -70],
          [92, 12, -54],
          [57, 15, 11],
        ],
      },
      {
        c: "#ff735a",
        p: [
          [20, 12, -72],
          [172, 11, -46],
          [172, 11, 74],
          [149, 15, 97],
        ],
      },
      {
        c: "#ff735a",
        p: [
          [128, 13, 102],
          [80, 10, 132],
          [-45, 10, 132],
          [-76, 19, 91],
        ],
      },
      {
        c: "#61cafe",
        p: [
          [-27, 16, 14],
          [7, 11, 42],
          [38, 16, 14],
        ],
      },
      {
        c: "#61cafe",
        p: [
          [83, 15, 14],
          [114, 11, 44],
          [155, 17, 14],
        ],
      },
      {
        c: "#273548",
        p: [
          [-127, 11, -94],
          [-104, 11, -134],
          [-10, 10, -134],
          [20, 16, -92],
        ],
      },
      {
        c: "#273548",
        p: [
          [20, 12, -76],
          [40, 10, 115],
          [120, 9, 138],
          [-77, 16, 99],
        ],
      },
    ];
    routes.forEach((o) => wire3(o.p, o.c));
  }
  function solar() {
    const cx = -164,
      cz = -73;
    // Small backing tiles avoid average-depth sorting hiding half the solar cells.
    const point = (x, y, offset = 0) => [
      cx + x,
      66 + y * Math.cos(0.35) + offset * Math.sin(0.35),
      cz - y * Math.sin(0.35) + offset * Math.cos(0.35),
    ];
    const tile = (x, y, w, h, offset, color, edge) =>
      poly(
        [
          point(x - w / 2, y - h / 2, offset),
          point(x + w / 2, y - h / 2, offset),
          point(x + w / 2, y + h / 2, offset),
          point(x - w / 2, y + h / 2, offset),
        ],
        color,
        edge,
        0.55,
      );
    for (let i = 0; i < 5; i++)
      for (let j = 0; j < 4; j++) {
        const x = -42.4 + i * 21.2,
          y = -31.125 + j * 20.75;
        tile(x, y, 21.2, 20.75, 0, "#122e49", "#488baa");
        tile(
          x,
          y,
          18,
          17.5,
          0.5,
          (i + j) % 2 ? "#1d5888" : "#236c9b",
          "#4e99bf",
        );
      }
    line(
      [
        point(-53, -41.5),
        point(53, -41.5),
        point(53, 41.5),
        point(-53, 41.5),
        point(-53, -41.5),
      ],
      "#80d9e9",
      1.5,
    );
    line(
      [
        [-203, 10, -70],
        [-194, 31, -76],
        [-195, 57, -86],
      ],
      "#91a9b7",
      3.8,
    );
    line(
      [
        [-125, 10, -70],
        [-134, 31, -76],
        [-134, 57, -86],
      ],
      "#91a9b7",
      3.8,
    );
    box(-164, 9, -100, 82, 4, 24, ["#546b7c", "#3f5467", "#40566a"]);
  }
  function board(x, z, w, d, kind) {
    const green = kind === "charge",
      cyan = kind === "reg";
    box(x, 12, z, w, 4, d, [
      green ? "#1e975f" : cyan ? "#227fc1" : "#248e95",
      green ? "#287e59" : "#276c8f",
      "#23586f",
    ]);
    box(x, 17, z, w * 0.44, 6, d * 0.48, ["#192a3d", "#172a36", "#203343"]);
    for (let i = 0; i < 5; i++) {
      let xp = x - w * 0.4 + i * w * 0.2;
      discY(xp, 17, z - d * 0.33, 1.8, "#e6c978");
      discY(xp, 17, z + d * 0.33, 1.8, "#e6c978");
    }
    box(x + w * 0.35, 17, z, 9, 7, 11, ["#394b5f", "#273747", "#182c43"]);
  }
  function battery() {
    box(20, 11, -83, 78, 8, 37, ["#182537", "#132136", "#0d192e"]);
    cylX(-8, 50, 27, -83, 14, ["#755ce5", "#927bf4", "#5d48d6"]);
    cylX(49, 53, 27, -83, 12, ["#b1c3d3", "#d6e0e7"]);
    box(19, 38, -83, 31, 1, 8, ["#dfd7fb", "#c9bbec"]);
  }
  function esp() {
    board(59, 12, 14, 58, "reg");
    box(57, 17, 13, 53, 4, 30, ["#205e91", "#174b70", "#17577a"]);
    box(57, 21, 14, 26, 5, 22, ["#343a44", "#282e3c", "#1e2530"]);
    box(57, 23, -7, 16, 7, 12, ["#bfc2c4", "#9dacc1", "#7c8599"]);
    for (let i = 0; i < 7; i++) {
      discY(34 + i * 7, 24, 35, 1.6, "#f8cd71");
      discY(34 + i * 7, 24, -10, 1.6, "#f8cd71");
    }
  }
  function oled() {
    line(
      [
        [128, 10, 29],
        [137, 40, 11],
      ],
      "#a6b3bf",
      3.5,
    );
    line(
      [
        [180, 10, 29],
        [174, 40, 11],
      ],
      "#a6b3bf",
      3.5,
    );
    let p = plate(155, 47, 14, 68, 47, 0.05, "#126a8f", "#b4e7fa");
    let q = plate(155, 47.6, 14.5, 56, 34, 0.05, "#061626", "#1f94b0");
    for (let x of [-27, 27])
      for (let y of [-18, 18]) {
        let pt = p(x, y, 1);
        discY(pt[0], pt[1], pt[2], 1.7, "#d2b253");
      }
  }
  function motor() {
    // shaft supports and permanent magnets
    box(-81, 10, 90, 36, 6, 64, ["#253a4d", "#1a2e3c"]);
    box(-91, 16, 102, 19, 14, 19, ["#e94f57", "#ba2e41", "#a82235"]);
    box(-64, 16, 102, 19, 14, 19, ["#3a8de5", "#2776d0", "#19599f"]);
    for (let x of [-104, -19]) {
      box(x, 10, 89, 9, 33, 10, ["#7c9ba7", "#4f6d7d", "#49637b"]);
      cylX(x - 7, x + 7, 39, 89, 4, ["#adc0c5", "#c4d3db"]);
    }
    cylX(-115, 11, 39, 89, 3.4, ["#b4beca", "#d7e1e9"]);
    cylX(-93, -30, 39, 89, 14, ["#92562d", "#ac6b39", "#714527"]);
    let a = P.spin,
      pts = [];
    for (let i = 0; i <= 18 * 14; i++) {
      let t = i / (18 * 14),
        ang = t * Math.PI * 2 * 18 + a;
      pts.push([
        -91 + t * 60,
        39 + 15.3 * Math.sin(ang),
        89 + 15.3 * Math.cos(ang),
      ]);
    }
    line(pts, "#efaa51", 2.15, 0.97);
    for (let x of [-96, -26])
      cylX(x - 2, x + 2, 39, 89, 17, ["#3a454a", "#5a6269"]);
  }
  function fan() {
    let spin = P.spin;
    let x = 17,
      cy = 39,
      cz = 89,
      r0 = 5;
    for (let k = 0; k < 4; k++) {
      let a = (k * Math.PI) / 2 + spin,
        rad = (rr, ang) => [
          x,
          cy + rr * Math.sin(ang),
          cz + rr * Math.cos(ang),
        ];
      poly(
        [
          rad(r0, a - 0.34),
          rad(15, a - 0.35),
          rad(39, a - 0.26),
          rad(43, a + 0.05),
          rad(24, a + 0.28),
          rad(r0, a + 0.28),
        ],
        k % 2 ? "#b4e9f5" : "#88d7e9",
        "#3b8aaf",
        0.95,
        0.94,
      );
    }
    cylX(13, 21, cy, cz, 6, ["#b7cbd8", "#e0eff5"]);
  }
  function metalSwitch() {
    box(151, 12, 98, 40, 6, 28, ["#24394a", "#1c2e42"]);
    box(151, 18, 98, 26, 8, 19, ["#1a212b", "#121d2b"]);
    box(151, 26, 98, 8, 8, 7, [
      P.run ? "#36d19d" : "#e96f67",
      P.run ? "#29b38a" : "#ca4e49",
    ]);
  }
  function render() {
    if (!W || !H) return;
    ctx.fillStyle = "#0b1728";
    ctx.fillRect(0, 0, W, H);
    setupCamera();
    shapes = [];
    sceneLayer = 0;
    currentPart = "base";
    // shadow + feet and base
    box(0, -6, 0, 460, 10, 305, [
      "#526b79",
      "#354653",
      "#2f4455",
      "#3c5261",
      "#506775",
    ]);
    box(0, 4, 0, 452, 7, 298, [
      "#375b71",
      "#243c50",
      "#273b4c",
      "#2b4759",
      "#466a80",
    ]);
    for (let x of [-209, 209])
      for (let z of [-132, 132]) {
        discY(x, 12, z, 3.7, "#bec9c8");
      }
    sceneLayer = 1;
    currentPart = null;
    if (P.wires) addWires();
    currentPart = "solar";
    solar();
    currentPart = "charge";
    board(-61, -88, 51, 42, "charge");
    currentPart = "battery";
    battery();
    currentPart = "reg";
    board(113, -82, 50, 41, "reg");
    currentPart = "sensor";
    board(-42, 12, 40, 38, "sensor");
    currentPart = "esp";
    esp();
    currentPart = "oled";
    oled();
    currentPart = "switch";
    metalSwitch();
    currentPart = "motor";
    motor();
    currentPart = "fan";
    fan();
    shapes.sort((a, b) => a.layer - b.layer || b.depth - a.depth);
    hitRegions = [];
    labelRegions = [];
    const targets = {};
    for (let s of shapes) {
      const pts = s.points.map(proj);
      ctx.globalAlpha = s.alpha ?? 1;
      if (s.kind === "line") {
        if (pts.some((p) => p[2] <= 0)) continue;
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        ctx.lineTo(pts[1][0], pts[1][1]);
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.width * Math.max(0.7, 700 / P.dist);
        ctx.lineCap = "round";
        ctx.stroke();
      } else {
        if (pts.some((p) => p[2] <= 0)) continue;
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.closePath();
        if (s.part) hitRegions.push({ id: s.part, points: pts });
        ctx.fillStyle = s.color;
        ctx.fill();
        if (s.edge) {
          ctx.lineWidth = s.lw;
          ctx.strokeStyle = s.edge;
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    // Example OLED screen readout; not real battery telemetry.
    {
      let screen = proj([155, 49, 15]);
      if (screen[2] > 0) {
        ctx.fillStyle = "#b5f4ed";
        ctx.font = "bold 12px monospace";
        ctx.textAlign = "center";
        ctx.fillText("78%", screen[0], screen[1] + 4);
      }
    }
    // Floating component labels
    for (let [id, label, pos] of [
      ["solar", "SOLAR", [-163, 112, -80]],
      ["charge", "ŞARJ", [-61, 29, -87]],
      ["battery", "PİL", [20, 49, -83]],
      ["reg", "DC-DC", [113, 29, -80]],
      ["sensor", "INA219", [-42, 34, 14]],
      ["esp", "ESP32", [57, 34, 14]],
      ["oled", "OLED", [155, 82, 14]],
      ["switch", "ON/OFF", [151, 34, 98]],
      ["motor", "BOBİN", [-73, 70, 89]],
      ["fan", "PERVANE", [20, 89, 89]],
    ]) {
      const q = proj(pos);
      if (q[2] < 0) continue;
      const active = id === P.selected;
      ctx.font = (active ? "bold 11px" : "bold 9px") + " system-ui";
      let ww = ctx.measureText(label).width + 15;
      ctx.fillStyle = active ? "#b9eff9" : "#0d2238d9";
      ctx.strokeStyle = active ? "#68d8ee" : "#42637a";
      ctx.lineWidth = 1;
      let xx = q[0] - ww / 2,
        yy = q[1] - 12;
      if (xx < 0 || xx + ww > W || yy < 0 || yy > H - 19) continue;
      // Place crowded mobile labels in a nearby free row, retaining their hit areas.
      const placedY = [0, -23, 23, -46, 46, -69, 69]
        .map((offset) => yy + offset)
        .find(
          (y) =>
            y >= 4 &&
            y + 19 <= H - 4 &&
            !labelRegions.some(
              (r) =>
                xx < r.x + r.w + 3 &&
                xx + ww + 3 > r.x &&
                y < r.y + r.h + 3 &&
                y + 22 > r.y,
            ),
        );
      if (placedY === undefined) continue;
      if (placedY !== yy) {
        ctx.beginPath();
        ctx.moveTo(q[0], q[1]);
        ctx.lineTo(q[0], placedY + 9.5);
        ctx.stroke();
      }
      yy = placedY;
      ctx.beginPath();
      roundedRect(xx, yy, ww, 19, 6);
      labelRegions.push({ id, x: xx, y: yy, w: ww, h: 19 });
      targets[id] = { x: q[0], y: yy + 9.8 };
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = active ? "#123345" : "#c7dfef";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, q[0], yy + 9.8);
    }
    // Selected part reticle, active to give tangible response
    if (P.selected && C[P.selected] && P.selected !== "base") {
      let q = proj(C[P.selected].pos);
      if (q[2] > 0) {
        ctx.strokeStyle = "#6be7f4";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.arc(q[0], q[1], 16, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    canvas.dataset.targets = JSON.stringify(targets);
  }
  invalidate();

  // A multi-touch session cannot become a tap when either finger is released.
  const pointers = new Map();
  let gesture = null;
  function distance() {
    const a = [...pointers.values()];
    return Math.hypot(a[1].x - a[0].x, a[1].y - a[0].y);
  }
  function pick(x, y) {
    for (let i = labelRegions.length - 1; i >= 0; i--) {
      const r = labelRegions[i];
      if (
        x >= r.x - 5 &&
        x <= r.x + r.w + 5 &&
        y >= r.y - 5 &&
        y <= r.y + r.h + 5
      ) {
        select(r.id);
        return;
      }
    }
    // Reverse painter order selects the visible face rather than a nearby hidden center.
    for (let i = hitRegions.length - 1; i >= 0; i--) {
      const r = hitRegions[i];
      let inside = false;
      for (let j = 0, k = r.points.length - 1; j < r.points.length; k = j++) {
        const a = r.points[j],
          b = r.points[k];
        if (
          a[1] > y !== b[1] > y &&
          x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]
        )
          inside = !inside;
      }
      if (inside) {
        select(r.id);
        return;
      }
    }
  }
  canvas.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (pointers.size === 0)
      gesture = {
        x: e.clientX,
        y: e.clientY,
        moved: false,
        multi: false,
        canceled: false,
      };
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch (error) {
      console.warn("Pointer capture kullanılamadı", error);
    }
    if (pointers.size > 1) gesture.multi = true;
    e.preventDefault();
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!pointers.has(e.pointerId) || !gesture) return;
    const old = pointers.get(e.pointerId),
      before = pointers.size === 2 ? distance() : 0;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (Math.hypot(e.clientX - gesture.x, e.clientY - gesture.y) > 8)
      gesture.moved = true;
    if (pointers.size === 2) {
      const after = distance();
      if (before > 4 && after > 4)
        P.dist = clamp((P.dist * before) / after, 420, 1100);
    } else if (pointers.size === 1 && !gesture.multi) {
      P.yaw += (e.clientX - old.x) * 0.007;
      P.pitch = clamp(P.pitch + (e.clientY - old.y) * 0.006, 0.13, 1.43);
    }
    invalidate();
    e.preventDefault();
  });
  function endPointer(e, canceled = false) {
    if (!pointers.has(e.pointerId) || !gesture) return;
    if (canceled) gesture.canceled = true;
    const tap =
      !gesture.canceled &&
      !gesture.multi &&
      !gesture.moved &&
      Math.hypot(e.clientX - gesture.x, e.clientY - gesture.y) <= 8 &&
      pointers.size === 1;
    pointers.delete(e.pointerId);
    if (tap) {
      const r = canvas.getBoundingClientRect();
      pick(e.clientX - r.left, e.clientY - r.top);
    }
    if (pointers.size === 0) gesture = null;
  }
  canvas.addEventListener("pointerup", (e) => endPointer(e));
  canvas.addEventListener("pointercancel", (e) => endPointer(e, true));
  canvas.addEventListener("lostpointercapture", (e) => endPointer(e, true));
  // Safari's page-level gesture zoom must not steal the model's pinch.
  for (const event of ["gesturestart", "gesturechange"])
    canvas.addEventListener(event, (e) => e.preventDefault(), {
      passive: false,
    });
  canvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      P.dist = clamp(P.dist * (e.deltaY > 0 ? 1.07 : 0.93), 420, 1100);
      invalidate();
    },
    { passive: false },
  );
  function zoom(factor) {
    P.dist = clamp(P.dist * factor, 420, 1100);
    invalidate();
  }
  function reset() {
    P.yaw = 0.73;
    P.pitch = 0.67;
    P.dist = 700;
    P.ty = 12;
    select("motor");
  }
  document.getElementById("zoomIn").onclick = () => zoom(0.83);
  document.getElementById("zoomOut").onclick = () => zoom(1.2);
  document.getElementById("reset").onclick = reset;
  document.getElementById("wires").onclick = (e) => {
    P.wires = !P.wires;
    e.currentTarget.classList.toggle("toggled", P.wires);
    e.currentTarget.setAttribute("aria-pressed", String(P.wires));
    invalidate();
  };
  document.getElementById("motorBtn").onclick = (e) => {
    P.run = !P.run;
    lastTime = null;
    e.currentTarget.textContent = P.run
      ? "■ Pervaneyi durdur"
      : "▶ Pervaneyi döndür";
    e.currentTarget.classList.toggle("off", !P.run);
    e.currentTarget.setAttribute("aria-pressed", String(P.run));
    invalidate();
  };
  canvas.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowLeft":
        P.yaw -= 0.1;
        break;
      case "ArrowRight":
        P.yaw += 0.1;
        break;
      case "ArrowUp":
        P.pitch = clamp(P.pitch - 0.08, 0.13, 1.43);
        break;
      case "ArrowDown":
        P.pitch = clamp(P.pitch + 0.08, 0.13, 1.43);
        break;
      case "+":
      case "=":
        zoom(0.9);
        break;
      case "-":
        zoom(1.1);
        break;
      case "Home":
        reset();
        break;
      default:
        return;
    }
    e.preventDefault();
    invalidate();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      lastTime = null;
      pointers.clear();
      gesture = null;
    } else {
      lastTime = null;
      invalidate();
    }
  });
})();
