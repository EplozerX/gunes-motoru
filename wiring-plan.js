/* Functional reference wiring: these names are logical terminals, not board pin positions. */
(function () {
  "use strict";
  const connections = [
    {
      id: "pv-plus",
      net: "power",
      from: { part: "solar", terminal: "+" },
      to: { part: "charge", terminal: "PV+" },
      label: "PANEL +",
      note: "Panelin artı ucu, uyumlu güneş şarj kartının panel girişine gider.",
      check:
        "Panelin açık devre gerilimi ve kartın en yüksek giriş gerilimi doğrulanmalı.",
    },
    {
      id: "pv-minus",
      net: "ground",
      from: { part: "solar", terminal: "−" },
      to: { part: "charge", terminal: "PV−" },
      label: "PANEL −",
      note: "Panelin eksi ucu yalnızca şarj kartının doğrulanmış panel dönüşüne gider.",
      check:
        "PV−, BAT− ve SYS− uçlarını ürün belgesi olmadan dışarıdan birleştirmeyin.",
    },
    {
      id: "battery-plus",
      net: "power",
      from: { part: "battery", terminal: "+" },
      to: { part: "charge", terminal: "BAT+" },
      label: "PİL +",
      note: "Korumalı hücrenin dış artı terminali, 1S Li-ion şarj kartının pil portuna gider.",
      check:
        "Pil kimyası, hücre sayısı, şarj akımı ve 4,2 V üst sınırı gerçek hücre ile eşleştirilmeli.",
    },
    {
      id: "battery-minus",
      net: "ground",
      from: { part: "battery", terminal: "−" },
      to: { part: "charge", terminal: "BAT−" },
      label: "PİL −",
      note: "Hücrenin korunmuş dış eksi terminali kullanılır; koruma devresi baypas edilmez.",
      check:
        "BAT− ile diğer eksi portların ilişkisi şarj kartının belgelerine bağlıdır.",
    },
    {
      id: "system-fuse",
      net: "power",
      from: { part: "charge", terminal: "SYS+" },
      to: { part: "fuse", terminal: "IN" },
      label: "SİSTEM +",
      note: "Yalnızca güç yolu / yük paylaşımı çıkışı doğrulanmış kartın SYS+ portu kullanılır.",
      check:
        "Her şarj kartında ayrı sistem çıkışı yoktur. SYS gerilimi evrensel olarak 3,0–4,2 V değildir.",
    },
    {
      id: "fuse-sensor",
      net: "power",
      from: { part: "fuse", terminal: "OUT" },
      to: { part: "sensor", terminal: "VIN+" },
      label: "ÖLÇÜME +",
      note: "Uygun ana korumadan sonra toplam yük akımı INA219 şönt girişine gider.",
      check:
        "F1 değeri, kablo kesiti ve akım yolu seçilmeli; INA219’un şönt akımı ve bus gerilimi sınırları doğrulanmalı.",
    },
    {
      id: "load-electronics",
      net: "power",
      from: { part: "sensor", terminal: "VIN−" },
      to: { part: "reg", terminal: "IN+" },
      label: "ÖLÇÜLEN YÜK +",
      note: "VIN− şöntün yük tarafıdır; toprak değildir. Buradan elektronik beslemesinin IN+ girişine gidilir.",
      check:
        "Dönüştürücü, gerçek SYS minimum / maksimum gerilimini kapsamalı; 3,3 V çıkış doğrulanmalı.",
    },
    {
      id: "load-motor",
      net: "motor",
      from: { part: "sensor", terminal: "VIN−" },
      to: { part: "motorSupply", terminal: "IN+" },
      label: "MOTOR KOLU +",
      note: "Ölçülen yük hattının ikinci kolu, seçilecek motor besleme / akım sınırlama tasarımına gider.",
      check:
        "Motorun çalışma gerilimi ile kalkış ve kilitlenme akımı henüz bilinmiyor. Doğrudan SYS veya 5 V varsayılmadı.",
    },
    {
      id: "system-return",
      net: "ground",
      from: { part: "charge", terminal: "SYS−" },
      to: { part: "return", terminal: "GND" },
      label: "SİSTEM DÖNÜŞÜ",
      note: "Yalnızca yük tarafındaki ortak dönüş ağıdır. Şarj kartının PV− ve BAT− uçları bu çizimde ayrı kalır.",
      check:
        "Referans, izolesiz dönüştürücülerin ortak dönüşünü varsayar; gerçek kartın SYS− işlevi doğrulanmalı.",
    },
    {
      id: "reg-input-return",
      net: "ground",
      from: { part: "reg", terminal: "IN−" },
      to: { part: "return", terminal: "GND" },
      label: "IN− → GND",
      note: "Elektronik dönüştürücünün giriş dönüşü sistem dönüşüne bağlanır.",
      check:
        "İzolesiz dönüştürücü referansı; gerçek modülün terminal işlevleri ve akım sınırları doğrulanmalı.",
    },
    {
      id: "reg-output-return",
      net: "ground",
      from: { part: "reg", terminal: "OUT−" },
      to: { part: "return", terminal: "GND" },
      label: "OUT− → GND",
      note: "3,3 V çıkışın dönüşü, izolesiz referansta ortak sistem dönüşündedir.",
      check: "İzole bir dönüştürücü seçilirse bu referans aynen kullanılamaz.",
    },
    {
      id: "esp-return",
      net: "ground",
      from: { part: "esp", terminal: "GND" },
      to: { part: "return", terminal: "GND" },
      label: "ESP32 GND",
      note: "ESP32 mantık beslemesinin ortak referansı.",
      check:
        "Harici 3V3 girişini kabul ettiği doğrulanmış kart kullanılmalı; bu referansta USB ayrılır.",
    },
    {
      id: "sensor-return",
      net: "ground",
      from: { part: "sensor", terminal: "GND" },
      to: { part: "return", terminal: "GND" },
      label: "SENSÖR GND",
      note: "Sensörün küçük mantık beslemesi dönüşüdür. VIN− şönt terminalinden ayrıdır.",
      check: "Şönt güç akımı, sensörün ince GND / veri kablosundan geçirilmez.",
    },
    {
      id: "oled-return",
      net: "ground",
      from: { part: "oled", terminal: "GND" },
      to: { part: "return", terminal: "GND" },
      label: "OLED GND",
      note: "OLED beslemesinin ve I²C sinyallerinin ortak referansı.",
      check:
        "Gerçek ekranın pin sırası ve 3,3 V uyumu ürün üzerinden doğrulanmalı.",
    },
    {
      id: "motor-input-return",
      net: "motor",
      from: { part: "motorSupply", terminal: "IN−" },
      to: { part: "return", terminal: "GND" },
      label: "MOTOR IN−",
      note: "Motor besleme bloğunun güç dönüşü ayrı kabloyla ortak dönüşe götürülür.",
      check:
        "Yüksek motor akımı, sensör veya OLED GND kablosundan dolaştırılmaz.",
    },
    {
      id: "motor-output-return",
      net: "motor",
      from: { part: "motorSupply", terminal: "OUT−" },
      to: { part: "return", terminal: "GND" },
      label: "MOTOR OUT−",
      note: "İzolesiz motor beslemesi örneğinde çıkış dönüşü ortak sistem dönüşündedir.",
      check:
        "Gerçek motor besleme tasarımı seçilmeden giriş ve çıkış dönüşü fiziksel pinler olarak kesinleştirilemez.",
    },
    {
      id: "supply-esp",
      net: "power",
      from: { part: "reg", terminal: "OUT+" },
      to: { part: "esp", terminal: "3V3" },
      label: "+3,3 V → ESP",
      note: "Ölçülerek doğrulanmış sabit 3,3 V, harici 3V3 girişini destekleyen ESP32 kartını besler.",
      check:
        "USB ayrılmıştır. 3,3 V, 5 V ve USB girişleri eşdeğer değildir; kartın besleme koşulları doğrulanmalı.",
    },
    {
      id: "supply-sensor",
      net: "power",
      from: { part: "reg", terminal: "OUT+" },
      to: { part: "sensor", terminal: "VCC" },
      label: "+3,3 V → VCC",
      note: "Sensörün mantık beslemesi regüle 3,3 V hattından gelir; şönt akım yolu değildir.",
      check:
        "INA219 modülünün beslemesi ve I²C pull-up dirençlerinin 3,3 V seviyesinde olduğu doğrulanmalı.",
    },
    {
      id: "supply-oled",
      net: "power",
      from: { part: "reg", terminal: "OUT+" },
      to: { part: "oled", terminal: "VCC" },
      label: "+3,3 V → OLED",
      note: "3,3 V ile çalıştığı doğrulanmış OLED modülü aynı regüle besleme kolundadır.",
      check:
        "Dönüştürücünün toplam akım bütçesine ESP32, INA219 ve OLED birlikte dahil edilmeli.",
    },
    {
      id: "sda-sensor",
      net: "data",
      from: { part: "esp", terminal: "SDA GPIO*" },
      to: { part: "sensor", terminal: "SDA" },
      label: "I²C · SDA",
      note: "Yazılımda seçilen veri GPIO’su, sensörün SDA hattına gider.",
      check:
        "Evrensel bir GPIO numarası verilmedi. ESP32 ailesi, modül adresi ve 3,3 V pull-up seviyesi doğrulanmalı.",
    },
    {
      id: "sda-oled",
      net: "data",
      from: { part: "esp", terminal: "SDA GPIO*" },
      to: { part: "oled", terminal: "SDA" },
      label: "I²C · SDA",
      note: "OLED ve INA219 uygun, çakışmayan adreslerle aynı SDA veri hattını paylaşır.",
      check:
        "Fiziksel pin sırasını modül belgesinden bulun; SDA güç artısı veya eksisi değildir.",
    },
    {
      id: "scl-sensor",
      net: "data",
      from: { part: "esp", terminal: "SCL GPIO*" },
      to: { part: "sensor", terminal: "SCL" },
      label: "I²C · SCL",
      note: "Yazılımda seçilen saat GPIO’su, sensörün SCL hattına gider.",
      check:
        "Gerçek ESP32 kartının kullanılabilir GPIO’ları ve yazılım ataması birlikte doğrulanmalı.",
    },
    {
      id: "scl-oled",
      net: "data",
      from: { part: "esp", terminal: "SCL GPIO*" },
      to: { part: "oled", terminal: "SCL" },
      label: "I²C · SCL",
      note: "OLED, INA219 ile aynı SCL saat hattını paylaşır.",
      check:
        "SCL ile SDA ayrı ağlardır; rastgele kesişimler elektriksel birleşim değildir.",
    },
    {
      id: "motor-switch",
      net: "motor",
      from: { part: "motorSupply", terminal: "OUT+" },
      to: { part: "switch", terminal: "1" },
      label: "MOTOR + → 1",
      note: "Motor için seçilecek besleme bloğunun artı çıkışı, iki uçlu mekanik anahtarın ilk kontağına gider.",
      check:
        "Anahtarın kendine ait + / − kutbu yoktur. DC akım ve kalkış akımı sınırları doğrulanmalı.",
    },
    {
      id: "switch-motor",
      net: "motor",
      from: { part: "switch", terminal: "2" },
      to: { part: "motor", terminal: "M+" },
      label: "2 → MOTOR +",
      note: "Anahtarın ikinci kontağı motorun komütatör / fırça artı girişine gider.",
      check:
        "Motor gerilimi ve akımı ürün / deneyle belirlenir. Anahtar yalnızca motor kolunu keser.",
    },
    {
      id: "motor-return",
      net: "motor",
      from: { part: "motor", terminal: "M−" },
      to: { part: "motorSupply", terminal: "OUT−" },
      label: "MOTOR −",
      note: "Motorun eksi güç ucu, motor beslemesinin çıkış dönüşüne ayrı hatla gider.",
      check:
        "Akım sınırlama ve geçici rejim / endüktif koruma gerçek motor tasarımında ayrıca belirlenmeli.",
    },
  ];
  window.BENCH_CONNECTIONS = connections;
  const surface = document.getElementById("wirePlanSurface");
  if (!surface) return;
  const controls = document.getElementById("wirePlanControls");
  const summary = document.getElementById("wirePlanSummary");
  const list = document.getElementById("wirePlanList");
  if (!controls || !summary || !list) return;

  const NS = "http://www.w3.org/2000/svg";
  const names = {
    solar: "Güneş paneli",
    charge: "Güneş şarjı + güç yolu",
    battery: "Korumalı 18650",
    fuse: "F1 · ana koruma",
    sensor: "INA219",
    reg: "3,3 V DC-DC",
    esp: "ESP32",
    oled: "OLED",
    motorSupply: "Motor beslemesi*",
    switch: "ON/OFF anahtarı",
    motor: "Bobinli motor",
    return: "Sistem dönüşü",
  };
  const groups = {
    all: {
      label: "Tüm bağlantılar",
      description:
        "Panel ve pil kendi şarj portlarında; yükler SYS çıkışından ölçülerek elektronik ve motor kollarına ayrılır.",
    },
    power: {
      label: "+ Besleme",
      description:
        "Pozitif besleme yolları. Regüle 3,3 V elektronik içindir; SYS gerilimi kart modeline bağlıdır.",
    },
    ground: {
      label: "− / GND dönüş",
      description:
        "Panel eksi, pil eksi ve sistem dönüşü ayrı şarj portlarında gösterilir; kart belgesi olmadan dışarıdan birleştirilmez.",
    },
    data: {
      label: "I²C · Veri",
      description:
        "SDA ve SCL ayrı veri ağlarıdır. İki uyumlu aygıt ortak 3,3 V mantık seviyelerini ve uygun adresleri kullanır.",
    },
    motor: {
      label: "Motor kolu",
      description:
        "Motor kolunun pozitif hattı anahtarlanır. Motor gerilimi, akım sınırı ve geçici rejim koruması ürünlerle tasarlanmalıdır.",
    },
  };
  const routes = {
    "pv-plus": [
      [240, 220],
      [330, 220],
    ],
    "pv-minus": [
      [240, 270],
      [330, 270],
    ],
    "battery-plus": [
      [700, 220],
      [590, 220],
    ],
    "battery-minus": [
      [700, 270],
      [590, 270],
    ],
    "system-fuse": [
      [410, 370],
      [410, 415],
      [30, 415],
      [30, 550],
      [60, 550],
    ],
    "fuse-sensor": [
      [220, 550],
      [340, 550],
    ],
    "load-electronics": [
      [620, 550],
      [760, 550],
      [760, 720],
      [140, 720],
      [140, 810],
    ],
    "load-motor": [
      [620, 550],
      [860, 550],
    ],
    "system-return": [
      [510, 370],
      [510, 405],
      [35, 405],
      [35, 1290],
      [1230, 1290],
    ],
    "reg-input-return": [
      [80, 890],
      [35, 890],
    ],
    "reg-output-return": [
      [320, 930],
      [350, 930],
      [350, 1290],
    ],
    "esp-return": [
      [460, 930],
      [420, 930],
      [420, 1290],
    ],
    "sensor-return": [
      [460, 480],
      [460, 445],
      [650, 445],
      [650, 720],
      [735, 720],
      [735, 1290],
    ],
    "oled-return": [
      [860, 1190],
      [800, 1190],
      [800, 1290],
    ],
    "motor-input-return": [
      [860, 630],
      [830, 630],
      [830, 1290],
    ],
    "motor-output-return": [
      [1020, 680],
      [1020, 710],
      [1230, 710],
      [1230, 1290],
    ],
    "supply-esp": [
      [320, 860],
      [460, 860],
    ],
    "supply-sensor": [
      [320, 860],
      [390, 860],
      [390, 780],
      [280, 780],
      [280, 445],
      [400, 445],
      [400, 480],
    ],
    "supply-oled": [
      [320, 860],
      [390, 860],
      [390, 1110],
      [860, 1110],
    ],
    "sda-sensor": [
      [710, 860],
      [760, 860],
      [760, 730],
      [400, 730],
      [400, 690],
    ],
    "sda-oled": [
      [710, 860],
      [760, 860],
      [760, 1050],
      [930, 1050],
      [930, 1070],
    ],
    "scl-sensor": [
      [710, 910],
      [790, 910],
      [790, 755],
      [460, 755],
      [460, 690],
    ],
    "scl-oled": [
      [710, 910],
      [790, 910],
      [790, 1030],
      [1000, 1030],
      [1000, 1070],
    ],
    "motor-switch": [
      [1100, 550],
      [1165, 550],
      [1165, 755],
    ],
    "switch-motor": [
      [1115, 810],
      [1060, 810],
    ],
    "motor-return": [
      [1060, 870],
      [1060, 980],
      [1240, 980],
      [1240, 710],
      [1020, 710],
      [1020, 680],
    ],
  };
  const colors = {
    power: "#c64c3d",
    ground: "#263341",
    data: "#176da4",
    motor: "#b45b22",
  };
  const nodeDots = [
    { net: "power", x: 760, y: 550 },
    { net: "power", x: 390, y: 860 },
    { net: "data", x: 760, y: 860 },
    { net: "data", x: 790, y: 910 },
    ...[
      [35, 890],
      [350, 1290],
      [420, 1290],
      [735, 1290],
      [800, 1290],
      [830, 1290],
      [1230, 1290],
      [1020, 710],
      [1230, 710],
    ].map(([x, y]) => ({ net: "ground", x, y })),
  ];
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 1260 1370");
  svg.setAttribute("role", "group");
  svg.setAttribute("aria-labelledby", "wire-plan-title wire-plan-desc");
  svg.classList.add("wire-plan-svg");
  function el(tag, attrs = {}, content) {
    const e = document.createElementNS(NS, tag);
    for (const [key, value] of Object.entries(attrs))
      e.setAttribute(key, String(value));
    if (content !== undefined) e.textContent = content;
    return e;
  }
  function text(parent, x, y, value, attrs = {}) {
    const e = el("text", { x, y, ...attrs }, value);
    parent.append(e);
    return e;
  }
  svg.append(
    el(
      "title",
      { id: "wire-plan-title" },
      "Örnek bağlantı planı · ürün modelleri doğrulanmadı",
    ),
  );
  svg.append(
    el(
      "desc",
      { id: "wire-plan-desc" },
      "Sembolik portlarla 1S Li-ion güneş şarjı, toplam yük ölçümü, regüle 3,3 V elektronik ve seçilmesi gereken ayrı motor beslemesi. Bunlar fiziksel pin konumları değildir. Artı ve eksi uçları yazıyla, veri hatları SDA ve SCL ile işaretlidir. Yalnızca dolu noktalar elektriksel birleşimdir.",
    ),
  );
  const style = el("style");
  style.textContent = `
    .wire-plan-svg{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#fcfdfd;display:block;color:#283644;stroke:none}
    .wire-plan-svg text{fill:#344756;font-size:12px;stroke:none}.wire-plan-svg .diagram-title{font-size:22px;font-weight:750;fill:#233b49}.wire-plan-svg .diagram-caption{font-size:12px;fill:#687b89}
    .wire-plan-svg .lane-label{font-size:10px;font-weight:800;letter-spacing:1.8px;fill:#84929a}.wire-plan-svg .wire-net{opacity:1;transition:opacity .15s}.wire-plan-svg .wire-net.is-dim{opacity:.12}
    .wire-plan-svg .wire-path{fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:3.4}.wire-plan-svg .wire-halo{fill:none;stroke:#fcfdfd;stroke-width:10;stroke-linejoin:round;stroke-linecap:round}.wire-plan-svg .wire-net.is-selected .wire-path{stroke-width:5.4}
    .wire-plan-svg .wire-label{font-size:10px;font-weight:750;paint-order:stroke;stroke:#fcfdfd;stroke-width:5px;stroke-linejoin:round}.wire-plan-svg .block-title{font-size:15px;font-weight:800;fill:#273b49}.wire-plan-svg .block-note{font-size:11px;fill:#687d8b}.wire-plan-svg .port-label{font-size:11px;font-weight:800;fill:#324d5f;paint-order:stroke;stroke:#fcfdfd;stroke-width:3px;stroke-linejoin:round}.wire-plan-svg .port-pin{fill:#fff;stroke:#526d7c;stroke-width:1.5}.wire-plan-svg .wire-block{cursor:pointer;outline:none}.wire-plan-svg .block-outline{fill:#fff;stroke:#ccd7dc;stroke-width:1.5}.wire-plan-svg .wire-block:hover .block-outline,.wire-plan-svg .wire-block:focus .block-outline{stroke:#236f8c;stroke-width:3}.wire-plan-svg .warning-label{font-size:10px;font-weight:800;fill:#986622}.wire-plan-svg .junction{stroke:#fcfdfd;stroke-width:1.5}
    @media(prefers-reduced-motion:reduce){.wire-plan-svg .wire-net{transition:none}}
  `;
  svg.append(style);
  const defs = el("defs");
  const pattern = el("pattern", {
    id: "wire-paper-grid",
    width: 24,
    height: 24,
    patternUnits: "userSpaceOnUse",
  });
  pattern.append(el("circle", { cx: 1, cy: 1, r: 0.65, fill: "#e2e8eb" }));
  defs.append(pattern);
  svg.append(
    defs,
    el("rect", { width: 1260, height: 1370, fill: "url(#wire-paper-grid)" }),
  );
  text(svg, 40, 48, "BAĞLANTILARIN HARİTASI", { class: "diagram-title" });
  text(svg, 40, 74, "Örnek bağlantı planı · ürün modelleri doğrulanmadı", {
    class: "diagram-caption",
  });
  text(
    svg,
    40,
    98,
    "Referans: regüle 3,3 V · harici 3V3 girişine uygun ESP32 · USB ayrılmış · izolesiz dönüştürücüler",
    { class: "diagram-caption" },
  );
  text(svg, 40, 133, "01 / ENERJİ TOPLAMA VE DEPOLAMA", {
    class: "lane-label",
  });
  text(svg, 40, 450, "02 / ÖLÇÜM VE MOTOR KOLU", {
    class: "lane-label",
  });
  text(svg, 40, 785, "03 / REGÜLE 3,3 V ELEKTRONİK + ORTAK I²C VERİ YOLU", {
    class: "lane-label",
  });
  const wireLayer = el("g", { "aria-hidden": "true" });
  svg.append(wireLayer);
  const pathGroups = new Map();
  for (const c of connections) {
    const g = el("g", {
      class: "wire-net",
      "data-net": c.net,
      "data-connection-id": c.id,
    });
    const d = routes[c.id]
      .map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`)
      .join(" ");
    const stroke = c.id.startsWith("scl-")
      ? "#218c8d"
      : c.id.includes("return") || c.id.endsWith("minus")
        ? "#263341"
        : colors[c.net];
    g.append(
      el("path", { d, class: "wire-halo" }),
      el("path", {
        d,
        class: "wire-path",
        stroke,
        "data-net": c.net,
        "data-connection-id": c.id,
      }),
    );

    wireLayer.append(g);
    pathGroups.set(c.id, g);
  }
  const dotLayer = el("g", { "aria-hidden": "true" });
  for (const dot of nodeDots)
    dotLayer.append(
      el("circle", {
        cx: dot.x,
        cy: dot.y,
        r: 5,
        class: "junction",
        "data-net": dot.net,
        fill: colors[dot.net],
      }),
    );
  svg.append(dotLayer);
  function block({ id, x, y, w, h, title, lines = [], badge, ports = [] }) {
    const g = el("g", {
      class: "wire-block",
      role: "button",
      tabindex: 0,
      "data-part": id,
      "aria-label": `${names[id] || title} ayrıntılarını aç`,
    });
    g.append(
      el("rect", { x, y, width: w, height: h, rx: 14, class: "block-outline" }),
    );
    g.append(
      el("rect", {
        x: x + 16,
        y: y + 15,
        width: 25,
        height: 3,
        rx: 1.5,
        fill:
          id === "motorSupply"
            ? "#d39c54"
            : id === "sensor"
              ? "#568da8"
              : "#719485",
      }),
    );
    text(g, x + 16, y + 42, title, { class: "block-title" });
    lines.forEach((line, i) =>
      text(g, x + 16, y + 62 + i * 16, line, { class: "block-note" }),
    );
    if (badge) text(g, x + 16, y + h - 14, badge, { class: "warning-label" });
    for (const p of ports) {
      g.append(el("circle", { cx: p.x, cy: p.y, r: 4, class: "port-pin" }));
      const anchor =
        p.side === "left" ? "end" : p.side === "right" ? "start" : "middle";
      const tx =
        p.side === "left" ? p.x - 8 : p.side === "right" ? p.x + 8 : p.x;
      const ty =
        p.side === "top" ? p.y - 10 : p.side === "bottom" ? p.y + 18 : p.y - 8;
      text(g, tx, ty, p.label, { class: "port-label", "text-anchor": anchor });
    }
    const open = () =>
      document.dispatchEvent(
        new CustomEvent("lab:select-part", {
          detail: {
            id: id === "fuse" ? "charge" : id === "motorSupply" ? "motor" : id,
            source: "wiring",
            virtualPart: id,
            opener: g,
          },
        }),
      );
    g.addEventListener("click", open);
    g.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
    svg.append(g);
  }
  block({
    id: "solar",
    x: 50,
    y: 175,
    w: 190,
    h: 140,
    title: "Güneş paneli",
    lines: ["Nominal 6 V örneği", "Gerçek Voc doğrulanmalı"],
    ports: [
      { x: 240, y: 220, side: "right", label: "+" },
      { x: 240, y: 270, side: "right", label: "−" },
    ],
  });
  block({
    id: "charge",
    x: 330,
    y: 150,
    w: 260,
    h: 220,
    title: "Güneş şarjı + güç yolu",
    lines: ["1S Li-ion uyumu gerekli", "Ayrı SYS çıkışı varsayımı"],
    badge: "* PORT ADLARI ÜRÜNE BAĞLI",
    ports: [
      { x: 330, y: 220, side: "left", label: "PV+" },
      { x: 330, y: 270, side: "left", label: "PV−" },
      { x: 590, y: 220, side: "right", label: "BAT+" },
      { x: 590, y: 270, side: "right", label: "BAT−" },
      { x: 410, y: 370, side: "bottom", label: "SYS+*" },
      { x: 510, y: 370, side: "bottom", label: "SYS−*" },
    ],
  });
  block({
    id: "battery",
    x: 700,
    y: 175,
    w: 220,
    h: 140,
    title: "Korumalı 18650 + yuva",
    lines: ["Standart 1S Li-ion örneği", "Dış korunmuş uçlar"],
    ports: [
      { x: 700, y: 220, side: "left", label: "+" },
      { x: 700, y: 270, side: "left", label: "−" },
    ],
  });
  text(svg, 965, 217, "PİL KORUMASI", { class: "lane-label" });
  text(svg, 965, 239, "Şarj kontrolünün");
  text(svg, 965, 257, "yerini tutmaz.");
  block({
    id: "fuse",
    x: 60,
    y: 500,
    w: 160,
    h: 130,
    title: "F1 · ana koruma",
    lines: ["Değer / tip seçilmeli"],
    ports: [
      { x: 60, y: 550, side: "left", label: "IN" },
      { x: 220, y: 550, side: "right", label: "OUT" },
    ],
  });
  block({
    id: "sensor",
    x: 340,
    y: 480,
    w: 280,
    h: 210,
    title: "INA219",
    lines: [
      "Şönt: VIN+ → VIN−",
      "Motor + elektronik toplamı",
      "Pil şarj akımı değildir",
    ],
    ports: [
      { x: 340, y: 550, side: "left", label: "VIN+" },
      { x: 620, y: 550, side: "right", label: "VIN−" },
      { x: 400, y: 480, side: "top", label: "VCC" },
      { x: 460, y: 480, side: "top", label: "GND" },
      { x: 400, y: 690, side: "bottom", label: "SDA" },
      { x: 460, y: 690, side: "bottom", label: "SCL" },
    ],
  });
  text(svg, 659, 590, "VIN− ≠ GND", { class: "warning-label" });
  text(svg, 659, 608, "Şöntün yük çıkışı", { class: "block-note" });
  block({
    id: "motorSupply",
    x: 860,
    y: 480,
    w: 240,
    h: 200,
    title: "Motor beslemesi*",
    lines: [
      "Gerilim + akım sınırı: seçim gerekli",
      "Gerçek SYS aralığına uygun",
      "Geçici rejim / endüktif koruma",
      "gerçek tasarımda belirlenir",
    ],
    badge: "* HENÜZ SEÇİLMEMİŞ BLOK",
    ports: [
      { x: 860, y: 550, side: "left", label: "IN+" },
      { x: 860, y: 630, side: "left", label: "IN−" },
      { x: 1100, y: 550, side: "right", label: "OUT+" },
      { x: 1020, y: 680, side: "bottom", label: "OUT−" },
    ],
  });
  block({
    id: "reg",
    x: 80,
    y: 810,
    w: 240,
    h: 200,
    title: "3,3 V buck-boost*",
    lines: [
      "Giriş: gerçek SYS aralığı",
      "Çıkış: sabit 3,3 V",
      "Toplam akım bütçesi doğrulanır",
    ],
    badge: "* İZOLESİZ REFERANS",
    ports: [
      { x: 140, y: 810, side: "top", label: "IN+" },
      { x: 80, y: 890, side: "left", label: "IN−" },
      { x: 320, y: 860, side: "right", label: "OUT+ 3V3" },
      { x: 320, y: 930, side: "right", label: "OUT−" },
    ],
  });
  block({
    id: "esp",
    x: 460,
    y: 810,
    w: 250,
    h: 230,
    title: "ESP32 kartı*",
    lines: [
      "Harici 3V3 girişine uygun",
      "olduğu doğrulanmalı",
      "USB bu referansta ayrılır",
    ],
    badge: "* GPIO YAZILIMDA SEÇİLİR",
    ports: [
      { x: 460, y: 860, side: "left", label: "3V3*" },
      { x: 460, y: 930, side: "left", label: "GND" },
      { x: 710, y: 860, side: "right", label: "SDA GPIO*" },
      { x: 710, y: 910, side: "right", label: "SCL GPIO*" },
    ],
  });
  block({
    id: "oled",
    x: 860,
    y: 1070,
    w: 250,
    h: 180,
    title: "0,96 inç OLED*",
    lines: ["3,3 V uyumlu modül", "Adres / pin sırası doğrulanır"],
    ports: [
      { x: 860, y: 1110, side: "left", label: "VCC*" },
      { x: 860, y: 1190, side: "left", label: "GND" },
      { x: 930, y: 1070, side: "top", label: "SDA" },
      { x: 1000, y: 1070, side: "top", label: "SCL" },
    ],
  });
  block({
    id: "switch",
    x: 1115,
    y: 755,
    w: 100,
    h: 140,
    title: "ON/OFF",
    lines: ["İki kontak", "+ / − kutbu yok"],
    ports: [
      { x: 1165, y: 755, side: "top", label: "1" },
      { x: 1115, y: 810, side: "left", label: "2" },
    ],
  });
  block({
    id: "motor",
    x: 910,
    y: 755,
    w: 150,
    h: 170,
    title: "Bobinli motor",
    lines: ["Gerilim / akım", "deneyle belirlenir"],
    ports: [
      { x: 1060, y: 810, side: "right", label: "M+" },
      { x: 1060, y: 870, side: "right", label: "M−" },
    ],
  });
  text(
    svg,
    45,
    1322,
    "● Dolu nokta = elektriksel birleşim. Çizgi kesişimlerinde nokta yoksa bağlantı yoktur.",
    { class: "diagram-caption" },
  );
  text(
    svg,
    45,
    1343,
    "Pervane, mıknatıslar ve taban mekanik parçalardır; elektrik terminali gösterilmez.",
    { class: "diagram-caption" },
  );
  const scroll = document.createElement("div");
  scroll.className = "wire-plan-scroll";
  scroll.tabIndex = 0;
  scroll.setAttribute("role", "region");
  scroll.setAttribute("aria-label", "Kaydırılabilir örnek bağlantı çizimi");
  scroll.append(svg);
  surface.replaceChildren(scroll);
  const key = document.createElement("div");
  key.className = "wire-plan-key";
  for (const [net, label] of [
    ["power", "+ Besleme"],
    ["ground", "− / GND"],
    ["data", "SDA / SCL"],
    ["motor", "Motor kolu"],
  ]) {
    const span = document.createElement("span");
    span.dataset.net = net;
    const swatch = document.createElement("i");
    swatch.style.background = colors[net];
    swatch.setAttribute("aria-hidden", "true");
    span.append(swatch, document.createTextNode(label));
    key.append(span);
  }
  surface.append(key);
  let filter = "all",
    selected = null;
  const buttons = new Map(),
    rows = new Map();
  function heading(value) {
    const h = document.createElement("h4");
    h.className = "wire-summary-heading";
    h.textContent = value;
    return h;
  }
  function paragraph(value) {
    const p = document.createElement("p");
    p.textContent = value;
    return p;
  }
  function endpoint(point) {
    return `${names[point.part] || point.part} [${point.terminal}]`;
  }
  function update() {
    for (const [name, button] of buttons)
      button.setAttribute("aria-pressed", String(name === filter));
    for (const c of connections) {
      const active = selected
        ? selected === c.id
        : filter === "all" || filter === c.net;
      const g = pathGroups.get(c.id);
      g.classList.toggle("is-dim", !active);
      g.classList.toggle("is-selected", selected === c.id);
      const row = rows.get(c.id);
      row.classList.toggle("selected", selected === c.id);
      row.classList.toggle("is-dim", !active);
      row.setAttribute("aria-pressed", String(selected === c.id));
    }
    for (const dot of dotLayer.children)
      dot.style.opacity = selected
        ? "0.4"
        : filter === "all" || dot.dataset.net === filter
          ? "1"
          : ".12";
    for (const legend of key.children)
      legend.style.opacity =
        filter === "all" || legend.dataset.net === filter ? "1" : ".35";
    if (selected) {
      const c = connections.find((c) => c.id === selected);
      summary.replaceChildren(
        heading(c.label),
        paragraph(`${endpoint(c.from)} → ${endpoint(c.to)}`),
        paragraph(c.note),
        paragraph(`Ürün kontrolü: ${c.check}`),
      );
      summary.dataset.selectedConnection = selected;
    } else {
      const count = connections.filter(
        (c) => filter === "all" || c.net === filter,
      ).length;
      summary.replaceChildren(
        heading(`${groups[filter].label} · ${count} bağlantı`),
        paragraph(groups[filter].description),
        paragraph(
          "Bu bir örnek bağlantı planıdır. Gerçek ürün modeli, pin sırası ve gerilim / akım sınırları doğrulanmadan fiziksel bağlantı yapmayın.",
        ),
      );
      delete summary.dataset.selectedConnection;
    }
    surface.dataset.netFilter = filter;
    surface.dataset.selectedConnection = selected || "";
  }
  for (const [name, group] of Object.entries(groups)) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "wire-filter";
    button.dataset.netFilter = name;
    button.textContent = group.label;
    button.setAttribute("aria-pressed", String(name === "all"));
    button.addEventListener("click", () => {
      filter = name;
      selected = null;
      update();
    });
    controls.append(button);
    buttons.set(name, button);
  }
  const ul = document.createElement("ul");
  ul.className = "wire-connection-list";
  for (const c of connections) {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "wire-connection";
    button.dataset.connectionId = c.id;
    button.dataset.net = c.net;
    button.setAttribute("aria-pressed", "false");
    const label = document.createElement("strong");
    label.textContent = c.label;
    const terminals = document.createElement("span");
    terminals.textContent = `${endpoint(c.from)} → ${endpoint(c.to)}`;
    const note = document.createElement("small");
    note.textContent = c.note;
    button.append(label, terminals, note);
    button.addEventListener("click", () => {
      selected = selected === c.id ? null : c.id;
      if (selected) filter = "all";
      update();
    });
    li.append(button);
    ul.append(li);
    rows.set(c.id, button);
  }
  list.replaceChildren(ul);
  update();
  surface.dataset.ready = "true";
})();
