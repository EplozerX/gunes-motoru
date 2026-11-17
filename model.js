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
              5.7 *
              P.speed) %
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
        speed: String(P.speed),
        selected: P.selected,
        wires: String(P.wires),
        terminalsVisible: String(P.terminals),
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
    speed: 1,
    targetX: 0,
    targetZ: 0,
    wires: true,
    terminals: true,
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
      desc: "Bu örnekte elektronik için sabit 3,3 V sağlayan, şarj kartının SYS çıkış aralığına uygun bir buck-boost kullanılır. SYS gerilimi pil gerilimiyle aynı varsayılmaz. ESP32 kartının dışarıdan 3V3 beslemeyi desteklemesi ve USB bağlantısının ayrılması gerekir. Motor ayrı, gerilimi ve akım sınırı seçilecek bir besleme kolundadır.",
      meta: ["Örnek çıkış: 3,3 V", "SYS aralığına uygun buck-boost"],
      pos: [113, 20, -81],
    },
    sensor: {
      icon: "📏",
      name: "INA219 sensörü",
      desc: "Bu bağlantı örneğinde şarj kartının SYS çıkışından sonra toplam yük akımını ölçer; pilin şarj akımını ölçmez. VIN+ ve VIN− şöntün iki ucudur; VIN− toprak değildir. Sensörün ayrı VCC/GND beslemesi 3,3 V, veri hatları SDA/SCL’dir. Şönt ve akım sınırı ürüne göre doğrulanır.",
      meta: ["I²C", "Akım + voltaj"],
      pos: [-42, 21, 11],
    },
    esp: {
      icon: "🧠",
      name: "ESP32 kontrol kartı",
      desc: "Bu örnek, dışarıdan 3V3 beslemeyi desteklediği doğrulanan bir ESP32 kartını esas alır; USB bağlantısı ayrıdır. SDA ve SCL için yazılımda seçilen GPIO’lar gerçek karta göre belirlenir. Sensör verilerini OLED’e iletir; motor GPIO’dan beslenmez.",
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
  const details = window.PART_DETAILS || {};
  const dialog = document.getElementById("partDialog");
  let detailTab = "overview",
    dialogOpener = null;
  const tabNames = {
    overview: "Görevi",
    physics: "Nasıl çalışır?",
    safety: "Dikkat et",
  };
  function makeText(tag, text, className = "") {
    const element = document.createElement(tag);
    element.textContent = text;
    if (className) element.className = className;
    return element;
  }
  function renderDetail() {
    if (!dialog) return;
    const part = C[P.selected],
      info = details[P.selected] || {};
    dialog.style.setProperty("--part-accent", info.accent || "#ffcc70");
    document.getElementById("detailIcon").textContent = part.icon;
    document.getElementById("detailCategory").textContent =
      info.category || "Proje parçası";
    document.getElementById("detailName").textContent = part.name;
    document.getElementById("detailSummary").textContent =
      info.tagline || part.desc;
    document
      .getElementById("detailSpecs")
      .replaceChildren(...part.meta.map((meta) => makeText("span", meta)));
    document.getElementById("partPosition").textContent =
      `${order.indexOf(P.selected) + 1} / ${order.length}`;
    const panel = document.getElementById("detailPanel");
    panel.setAttribute("aria-label", tabNames[detailTab]);
    panel.setAttribute("aria-labelledby", `detail-tab-${detailTab}`);
    const cards = info[detailTab] || [
      { title: tabNames[detailTab], text: part.desc },
    ];
    const sections = cards.map((card) => {
      const section = document.createElement("section");
      section.className = "detail-section";
      section.append(makeText("h3", card.title), makeText("p", card.text));
      return section;
    });
    if (detailTab === "overview") {
      const ports = terminalList.filter(
        (terminal) => terminal.part === P.selected,
      );
      if (ports.length) {
        const section = document.createElement("section");
        section.className = "detail-section terminal-reference";
        section.append(
          makeText("h3", "Bu örnekteki bağlantı uçları"),
          makeText("p", ports.map((terminal) => terminal.label).join(" · ")),
          makeText(
            "p",
            "Etiketler işlevi gösterir; fiziksel pin sırası seçilecek karttan doğrulanır.",
          ),
        );
        sections.push(section);
      }
    }
    if (info.fact && detailTab === "overview") {
      const fact = document.createElement("div");
      fact.className = "detail-fact";
      fact.append(
        makeText("span", info.fact.label),
        makeText("strong", info.fact.value),
      );
      sections.push(fact);
    }
    panel.replaceChildren(...sections);
    for (const button of document.querySelectorAll("[data-detail-tab]")) {
      const active = button.dataset.detailTab === detailTab;
      button.id = `detail-tab-${button.dataset.detailTab}`;
      button.setAttribute("aria-selected", String(active));
      button.classList.toggle("active", active);
      button.tabIndex = active ? 0 : -1;
    }
  }
  function showDetails(opener) {
    if (!dialog) return;
    if (!dialog.open) {
      const trigger = opener?.currentTarget || opener;
      dialogOpener =
        trigger instanceof Element && typeof trigger.focus === "function"
          ? trigger
          : document.activeElement instanceof HTMLElement &&
              document.activeElement !== document.body
            ? document.activeElement
            : canvas;
      detailTab = "overview";
      renderDetail();
      dialog.showModal();
      dialog.scrollTop = 0;
      document.body.classList.add("dialog-open");
    } else renderDetail();
  }
  const order = [
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
    "base",
  ];
  let elParts = document.getElementById("parts");
  order.forEach((id) => {
    const b = document.createElement("button");
    b.className = "part";
    const mark = makeText("span", C[id].icon, "part-mark");
    mark.setAttribute("aria-hidden", "true");
    const copy = document.createElement("span");
    copy.className = "part-copy";
    copy.append(
      makeText("span", C[id].name, "part-title"),
      makeText("span", details[id]?.category || "Maket parçası", "part-role"),
    );
    const arrow = makeText("span", "", "part-arrow");
    arrow.innerHTML =
      '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="m4 12 8-8M4 4h8v8"/></svg>';
    arrow.setAttribute("aria-hidden", "true");
    b.append(mark, copy, arrow);
    b.dataset.part = id;
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", (event) =>
      select(id, true, event.currentTarget),
    );
    elParts.appendChild(b);
  });
  function select(id, open = false, opener = null) {
    if (!C[id]) return;
    P.selected = id;
    let a = C[id];
    document.getElementById("componentName").textContent = a.name;
    document.getElementById("componentIcon").textContent = a.icon;
    const category = document.getElementById("componentCategory");
    if (category)
      category.textContent = details[id]?.category || "Proje parçası";
    document.getElementById("componentDesc").textContent = a.desc;
    document.getElementById("componentMeta").innerHTML = a.meta
      .map((x) => "<span>" + x + "</span>")
      .join("");
    document.querySelectorAll(".part").forEach((x) => {
      x.classList.toggle("selected", x.dataset.part === id);
      x.setAttribute("aria-pressed", String(x.dataset.part === id));
    });
    if (dialog?.open) {
      renderDetail();
      dialog.scrollTop = 0;
    }
    if (open) showDetails(opener);
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
      t = [P.targetX, P.ty, P.targetZ],
      pos = [
        P.targetX + Math.sin(P.yaw) * c * P.dist,
        s * P.dist + P.ty,
        P.targetZ + Math.cos(P.yaw) * c * P.dist,
      ],
      f = norm(t.map((q, i) => q - pos[i])),
      r = norm(cross(f, [0, 1, 0])),
      u = cross(r, f);
    camera = { pos, f, r, u, focal: Math.min(W / 1.04, H / 0.95) * 1.16 };
  }
  function proj(q) {
    const a = q.map((x, i) => x - camera.pos[i]),
      z = dot(a, camera.f),
      k = camera.focal / Math.max(40, z);
    return [
      W / 2 + dot(a, camera.r) * k,
      H * (W / H > 1.2 ? 0.46 : 0.53) - dot(a, camera.u) * k,
      z,
    ];
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
  const terminalMap = {};
  const terminalList = [];
  function defineTerminal(part, terminal, pos, kind, symbol, label = terminal) {
    const item = { part, terminal, pos, kind, symbol, label };
    terminalMap[part + "." + terminal] = item;
    terminalList.push(item);
  }
  const terminals = [
    ["solar", "+", [-126, 31, -61], "power", "+"],
    ["solar", "-", [-137, 31, -61], "ground", "−"],
    ["charge", "PV+", [-84, 18, -101], "power", "+"],
    ["charge", "PV-", [-84, 18, -90], "ground", "−"],
    ["charge", "BAT+", [-58, 18, -107], "power", "+"],
    ["charge", "BAT-", [-45, 18, -107], "ground", "−"],
    ["charge", "SYS+", [-39, 18, -79], "power", "+"],
    ["charge", "SYS-", [-39, 18, -68], "ground", "−"],
    ["battery", "+", [53, 27, -83], "power", "+"],
    ["battery", "-", [-8, 27, -83], "ground", "−"],
    ["reg", "IN+", [90, 18, -95], "power", "+"],
    ["reg", "IN-", [90, 18, -80], "ground", "−"],
    ["reg", "OUT+", [136, 18, -96], "power", "+", "OUT+ · 3V3"],
    ["reg", "OUT-", [136, 18, -80], "ground", "−"],
    ["sensor", "VIN+", [-59, 18, -3], "power", "+"],
    ["sensor", "VIN-", [-25, 18, -3], "power", "+", "VIN− · yük +"],
    ["sensor", "VCC", [-58, 18, 29], "power", "+"],
    ["sensor", "GND", [-48, 18, 29], "ground", "−"],
    ["sensor", "SDA", [-38, 18, 29], "data", "D"],
    ["sensor", "SCL", [-28, 18, 29], "clock", "C"],
    ["esp", "3V3", [34, 25, 35], "power", "+"],
    ["esp", "GND", [45, 25, 35], "ground", "−"],
    ["esp", "SDA", [66, 25, 35], "data", "D"],
    ["esp", "SCL", [77, 25, 35], "clock", "C"],
    ["oled", "VCC", [133, 25, 14], "power", "+"],
    ["oled", "GND", [146, 25, 14], "ground", "−"],
    ["oled", "SDA", [159, 25, 14], "data", "D"],
    ["oled", "SCL", [172, 25, 14], "clock", "C"],
    ["switch", "1", [137, 19, 109], "motor", "1"],
    ["switch", "2", [165, 19, 109], "motor", "2"],
    ["motor", "M+", [-110, 25, 100], "motor", "+"],
    ["motor", "M-", [-110, 25, 78], "ground", "−"],
    ["fuse", "IN", [-96, 17, -34], "power", "+", "F1 · giriş"],
    ["fuse", "OUT", [-70, 17, -34], "power", "+", "F1 · çıkış"],
    ["motorSupply", "IN+", [67, 18, 79], "power", "+"],
    ["motorSupply", "IN-", [67, 18, 98], "ground", "−"],
    ["motorSupply", "OUT+", [101, 18, 79], "motor", "+"],
    ["motorSupply", "OUT-", [101, 18, 98], "ground", "−"],
    ["return", "GND", [185, 15, 58], "ground", "−", "SYS− · yıldız dönüş"],
  ];
  terminals.forEach((args) => defineTerminal(...args));
  function owner(part) {
    return (
      { fuse: "charge", motorSupply: "motor", return: "charge" }[part] || part
    );
  }
  function terminalAt(endpoint) {
    const part = endpoint.part;
    let terminal = String(endpoint.terminal)
      .replace(/[−–]/g, "-")
      .replace(/\s|\*/g, "");
    if (part === "esp" && terminal.startsWith("SDA")) terminal = "SDA";
    if (part === "esp" && terminal.startsWith("SCL")) terminal = "SCL";
    if (part === "reg" && terminal.startsWith("OUT+")) terminal = "OUT+";
    return terminalMap[part + "." + terminal];
  }
  const wireColors = {
    power: "#c83832",
    ground: "#263341",
    data: "#166bd7",
    clock: "#168866",
    motor: "#c68116",
  };
  function addWires() {
    const connections = window.BENCH_CONNECTIONS || [];
    let rendered = 0;
    connections.forEach((connection, index) => {
      const from = terminalAt(connection.from),
        to = terminalAt(connection.to);
      if (!from || !to) return;
      let type = connection.net;
      if (from.kind === "ground" || to.kind === "ground") type = "ground";
      if (type === "data") type = from.terminal === "SCL" ? "clock" : "data";
      const color = wireColors[type] || wireColors.power;
      const height =
        type === "ground"
          ? 12.5
          : type === "data" || type === "clock"
            ? 15.5
            : 14;
      let lane;
      if (connection.from.part === "solar")
        lane = type === "ground" ? -137 : -126;
      else if (connection.from.part === "battery")
        lane = type === "ground" ? -119 : -128;
      else if (type === "data" || type === "clock")
        lane = type === "clock" ? 55 : 46;
      else if (type === "ground")
        lane =
          type === "ground" && from.part === "motor"
            ? 140
            : 65 + (index % 3) * 3;
      else if (type === "motor") lane = 139 - (index % 3) * 5;
      else if (from.part === "reg") lane = -43 + (index % 3) * 4;
      else if (from.part === "sensor") lane = to.part === "reg" ? -45 : 55;
      else lane = -47 + (index % 3) * 5;
      const a = from.pos,
        b = to.pos;
      const points = [
        a,
        [a[0], height, a[2]],
        [a[0], height, lane],
        [b[0], height, lane],
        [b[0], height, b[2]],
        b,
      ];
      // A pale sleeve makes crossings visually distinct from electrical junction dots.
      line(points, "#ffffff", 5.1, 0.96);
      line(points, color, 2.6, 0.98);
      rendered++;
    });
    canvas.dataset.connectionCount = String(rendered);
  }
  function auxiliaryHardware() {
    currentPart = "sensor";
    box(-83, 12, -34, 31, 5, 13, ["#e7e9df", "#bfc6bd", "#a7b7ad"]);
    cylX(-92, -74, 20, -34, 3.3, ["#c2d3d3", "#7da2a0"]);
    currentPart = "motor";
    board(84, 89, 38, 28, "reg");
    box(84, 22, 89, 14, 4, 13, ["#b7d3df", "#799db1", "#637f91"]);
    currentPart = "charge";
    discY(185, 13, 58, 6, "#b4c4cb");
    discY(185, 14, 58, 2.4, "#344f5d");
  }
  let terminalRegions = [];
  function drawTerminals() {
    terminalRegions = [];
    if (!P.terminals) {
      canvas.dataset.terminalCount = "0";
      return;
    }
    let count = 0;
    for (const terminal of terminalList) {
      const q = proj(terminal.pos);
      if (q[2] <= 0 || q[0] < 7 || q[0] > W - 7 || q[1] < 7 || q[1] > H - 7)
        continue;
      count++;
      const color = wireColors[terminal.kind];
      ctx.beginPath();
      ctx.arc(q[0], q[1], 5.8, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.font = "bold 8px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(terminal.symbol, q[0], q[1] + 0.2);
      terminalRegions.push({
        id: owner(terminal.part),
        x: q[0] - 7,
        y: q[1] - 7,
        w: 14,
        h: 14,
      });
      if (owner(terminal.part) !== P.selected) continue;
      const label = terminal.label;
      ctx.font = "bold 9px system-ui";
      const width = ctx.measureText(label).width + 12;
      const placement = [
        [12, -26],
        [12, 8],
        [-width - 12, -26],
        [-width - 12, 8],
        [12, -50],
        [-width - 12, 32],
        [12, 32],
      ].find(([dx, dy]) => {
        const x = q[0] + dx,
          y = q[1] + dy;
        return (
          x >= 5 &&
          x + width < W - 62 &&
          y > 64 &&
          y + 19 < H - 65 &&
          !labelRegions.some(
            (r) =>
              x < r.x + r.w + 3 &&
              x + width + 3 > r.x &&
              y < r.y + r.h + 3 &&
              y + 22 > r.y,
          )
        );
      });
      if (!placement) continue;
      const x = q[0] + placement[0],
        y = q[1] + placement[1];
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(q[0], q[1]);
      ctx.lineTo(x + width / 2, y + 9);
      ctx.stroke();
      ctx.beginPath();
      roundedRect(x, y, width, 19, 5);
      ctx.fillStyle = "#fffffff5";
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.fillText(label, x + width / 2, y + 9.5);
      labelRegions.push({ id: owner(terminal.part), x, y, w: width, h: 19 });
    }
    canvas.dataset.terminalCount = String(count);
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
    const background = ctx.createRadialGradient(
      W * 0.52,
      H * 0.47,
      0,
      W * 0.52,
      H * 0.47,
      Math.max(W, H) * 0.75,
    );
    background.addColorStop(0, "#ffffff");
    background.addColorStop(0.55, "#f7f9fb");
    background.addColorStop(1, "#e9eff4");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#728ca01b";
    for (let x = 18; x < W; x += 28)
      for (let y = 18; y < H; y += 28) ctx.fillRect(x, y, 1, 1);
    setupCamera();
    shapes = [];
    sceneLayer = 0;
    currentPart = "base";
    // shadow + feet and base
    box(0, -6, 0, 460, 10, 305, [
      "#e4eaf0",
      "#b9c6d0",
      "#a7b9c5",
      "#c4cfd6",
      "#d9e1e7",
    ]);
    box(0, 4, 0, 452, 7, 298, [
      "#ffffff",
      "#e1e7eb",
      "#d6dfe5",
      "#edf1f4",
      "#fafcfd",
    ]);
    for (let x of [-209, 209])
      for (let z of [-132, 132]) {
        discY(x, 12, z, 3.7, "#bec9c8");
      }
    sceneLayer = 1;
    currentPart = null;
    if (P.wires) addWires();
    else canvas.dataset.connectionCount = "0";
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
    auxiliaryHardware();
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
          ctx.lineWidth = s.part === P.selected ? Math.max(s.lw, 0.9) : s.lw;
          ctx.strokeStyle = s.part === P.selected ? "#bd8225" : s.edge;
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
    for (let [id, label, pos, auxiliary] of [
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
      ["charge", "F1*", [-83, 31, -34], true],
      ["motor", "MOTOR BESLEMESİ*", [84, 39, 89], true],
      ["charge", "SYS− / GND", [185, 30, 58], true],
    ]) {
      const q = proj(pos);
      if (q[2] < 0) continue;
      const active = id === P.selected;
      ctx.font = (active ? "bold 11px" : "bold 9px") + " system-ui";
      let ww = ctx.measureText(label).width + 15;
      ctx.fillStyle = active ? "#ffe0a1" : "#fffffff2";
      ctx.strokeStyle = active ? "#b98529" : "#97aab8";
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
      if (!auxiliary) targets[id] = { x: q[0], y: yy + 9.8 };
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = active ? "#342714" : "#294657";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, q[0], yy + 9.8);
    }
    // Selected part reticle, active to give tangible response
    if (P.selected && C[P.selected] && P.selected !== "base") {
      let q = proj(C[P.selected].pos);
      if (q[2] > 0) {
        ctx.strokeStyle = "#b87b20";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.arc(q[0], q[1], 16, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    drawTerminals();
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
    for (let i = terminalRegions.length - 1; i >= 0; i--) {
      const r = terminalRegions[i];
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
        select(r.id, true, canvas);
        return;
      }
    }
    for (let i = labelRegions.length - 1; i >= 0; i--) {
      const r = labelRegions[i];
      if (
        x >= r.x - 5 &&
        x <= r.x + r.w + 5 &&
        y >= r.y - 5 &&
        y <= r.y + r.h + 5
      ) {
        select(r.id, true, canvas);
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
        select(r.id, true, canvas);
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
      P.yaw -= (e.clientX - old.x) * 0.007;
      P.pitch = clamp(P.pitch + (e.clientY - old.y) * 0.006, 0.13, 1.43);
      markView("free");
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
    P.targetX = 0;
    P.targetZ = 0;
    markView("perspective");
    select("motor");
  }
  document.getElementById("terminalToggle")?.addEventListener("click", (e) => {
    P.terminals = !P.terminals;
    e.currentTarget.setAttribute("aria-pressed", String(P.terminals));
    invalidate();
  });
  document.addEventListener("lab:select-part", (event) => {
    const id = owner(event.detail?.id);
    if (C[id]) select(id, true, event.detail?.opener || canvas);
  });
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
    const status = document.getElementById("motorStatus");
    if (status)
      status.textContent = P.run ? "Pervane dönüyor" : "Denemeye hazır";
    stage.classList.toggle("motor-running", P.run);
    invalidate();
  };
  function markView(name) {
    for (const button of document.querySelectorAll("[data-view]"))
      button.setAttribute("aria-pressed", String(button.dataset.view === name));
    const status = document.getElementById("viewStatus");
    if (status)
      status.textContent =
        {
          perspective: "Perspektif",
          top: "Üstten görünüm",
          front: "Önden görünüm",
          focus: "Parça odağı",
        }[name] || "Serbest görünüm";
  }
  function focusSelected() {
    const position = C[P.selected].pos;
    P.targetX = position[0];
    P.ty = position[1];
    P.targetZ = position[2];
    P.dist = P.selected === "base" ? 700 : 420;
    dialogOpener = canvas;
    if (dialog?.open) dialog.close();
    markView("focus");
    invalidate();
    stage.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "center",
    });
    canvas.focus({ preventScroll: true });
  }
  for (const button of document.querySelectorAll("[data-view]"))
    button.addEventListener("click", () => {
      P.targetX = 0;
      P.targetZ = 0;
      P.ty = 12;
      P.dist = 700;
      const preset = {
        perspective: [0.73, 0.67],
        top: [0, 1.43],
        front: [0, 0.22],
      }[button.dataset.view];
      if (preset) {
        [P.yaw, P.pitch] = preset;
        markView(button.dataset.view);
        invalidate();
      }
    });
  document
    .getElementById("inspectPart")
    ?.addEventListener("click", showDetails);
  document
    .getElementById("tourBtn")
    ?.addEventListener("click", (event) =>
      select("solar", true, event.currentTarget),
    );
  document
    .getElementById("closeDetail")
    ?.addEventListener("click", () => dialog.close());
  document
    .getElementById("focusPart")
    ?.addEventListener("click", focusSelected);
  document
    .getElementById("prevPart")
    ?.addEventListener("click", () =>
      select(
        order[(order.indexOf(P.selected) + order.length - 1) % order.length],
      ),
    );
  document
    .getElementById("nextPart")
    ?.addEventListener("click", () =>
      select(order[(order.indexOf(P.selected) + 1) % order.length]),
    );
  dialog?.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    if (dialogOpener?.isConnected) dialogOpener.focus({ preventScroll: true });
  });
  dialog?.addEventListener("click", (e) => {
    if (e.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    )
      dialog.close();
  });
  function wireTabs(selector, attribute, selectTab) {
    const buttons = [...document.querySelectorAll(selector)];
    for (const button of buttons) {
      button.addEventListener("click", () =>
        selectTab(button.dataset[attribute]),
      );
      button.addEventListener("keydown", (e) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
        const index = buttons.indexOf(button),
          next =
            e.key === "Home"
              ? 0
              : e.key === "End"
                ? buttons.length - 1
                : (index + (e.key === "ArrowRight" ? 1 : buttons.length - 1)) %
                  buttons.length;
        e.preventDefault();
        buttons[next].focus();
        selectTab(buttons[next].dataset[attribute]);
      });
    }
  }
  wireTabs("[data-detail-tab]", "detailTab", (name) => {
    detailTab = name;
    renderDetail();
  });
  wireTabs("[data-explore]", "explore", (name) => {
    for (const button of document.querySelectorAll("[data-explore]")) {
      const active = button.dataset.explore === name;
      button.setAttribute("aria-selected", String(active));
      button.classList.toggle("active", active);
      button.tabIndex = active ? 0 : -1;
    }
    for (const panel of ["parts", "wiring", "energy", "physics"]) {
      const element = document.getElementById(panel + "Panel");
      if (element) element.hidden = panel !== name;
    }
  });
  for (const button of document.querySelectorAll("[data-select-part]"))
    button.addEventListener("click", (event) =>
      select(button.dataset.selectPart, true, event.currentTarget),
    );
  document.getElementById("spinSpeed")?.addEventListener("input", (e) => {
    P.speed = clamp(Number(e.target.value) || 1, 0.3, 2);
    document.getElementById("speedValue").textContent =
      P.speed.toLocaleString("tr-TR", { maximumFractionDigits: 1 }) + "×";
    invalidate();
  });
  canvas.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowLeft":
        P.yaw += 0.1;
        break;
      case "ArrowRight":
        P.yaw -= 0.1;
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
    if (e.key.startsWith("Arrow")) markView("free");
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
