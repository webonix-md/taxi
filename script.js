(function () {
  "use strict";

  const D = DEMO_DATA;
  const C = D.contacts;

  /* ---------- helpers ---------- */

  function el(tag, className, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function track(eventName, detail) {
    if (!eventName) return;
    // Аналитика не подключена к реальному сервису — событие только логируется.
    console.log("[analytics]", eventName, detail || "");
  }

  function digits(value) {
    return String(value).replace(/\D/g, "");
  }

  const TEL_HREF = C.phone ? "tel:+" + digits(C.phone) : "#apply";

  const ICONS = {
    car: '<path d="M3 13l1.5-5A2 2 0 0 1 6.4 6.5h11.2A2 2 0 0 1 19.5 8L21 13M3 13v5a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h12v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-5M3 13h18M6.5 16.5h.01M17.5 16.5h.01"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    headset: '<path d="M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 1 0-5.66 5.66l-6.36 6.36 2.83 2.83L11.87 14.7a4 4 0 0 0 5.66-5.66z"/>',
    wallet: '<path d="M20 7H4a1 1 0 0 0-1 1v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a1 1 0 0 0-1-1zM16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"/><circle cx="16" cy="13" r="1.5"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  };

  function icon(name) {
    return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.check}</svg>`;
  }

  function callButton(label, className, source) {
    const a = el("a", className, `${icon("phone")}<span>${label}</span>`);
    a.href = TEL_HREF;
    a.dataset.source = source;
    a.addEventListener("click", () => track("phone_click", source));
    return a;
  }

  function renderNotice(containerId, notice, source) {
    const box = byId(containerId);
    box.appendChild(el("p", "notice__text", notice.text));
    box.appendChild(callButton(notice.cta, "btn btn--primary", source));
  }

  function renderList(listId, items) {
    const list = byId(listId);
    items.forEach((text) => {
      list.appendChild(
        el("li", "", `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${ICONS.check}</svg><span>${text}</span>`)
      );
    });
  }

  /* ---------- header / nav / footer ---------- */

  function renderNav() {
    const nav = byId("nav");
    const mobileNav = byId("mobileNav");
    const footerNav = byId("footerNav");
    D.nav.forEach((item) => {
      const a1 = el("a", "nav__link", item.label);
      a1.href = item.anchor;
      nav.appendChild(a1);

      const a2 = el("a", "mobile-menu__link", item.label);
      a2.href = item.anchor;
      mobileNav.appendChild(a2);

      const a3 = el("a", "footer__link", item.label);
      a3.href = item.anchor;
      footerNav.appendChild(a3);
    });
  }

  function renderBrand() {
    const name = D.meta.companyName || "Таксопарк";
    byId("logoImg").alt = name;
    byId("footerLogoImg").alt = name;
  }

  function messengerLinks() {
    const links = [];
    if (C.viber) links.push({ id: "viber", label: "Viber", href: "viber://chat?number=%2B" + digits(C.viber) });
    if (C.whatsapp) links.push({ id: "whatsapp", label: "WhatsApp", href: "https://wa.me/" + digits(C.whatsapp) });
    if (C.telegram) links.push({ id: "telegram", label: "Telegram", href: "https://t.me/" + C.telegram });
    return links;
  }

  function renderFooterContacts() {
    const wrap = byId("footerContacts");
    const rows = [
      { label: "Телефон", value: C.phone, href: C.phone ? TEL_HREF : null, event: "phone_click" },
      { label: "Email", value: C.email, href: C.email ? "mailto:" + C.email : null },
      { label: "Адрес", value: C.address },
      { label: "Часы работы", value: C.officeHours },
    ];
    rows
      .filter((row) => row.value)
      .forEach((row) => {
        const node = row.href ? el("a", "footer__link") : el("p", "footer__link");
        node.textContent = `${row.label}: ${row.value}`;
        if (row.href) node.href = row.href;
        if (row.event) node.addEventListener("click", () => track(row.event, "footer"));
        wrap.appendChild(node);
      });
    messengerLinks().forEach((m) => {
      const a = el("a", "footer__link", m.label);
      a.href = m.href;
      wrap.appendChild(a);
    });
  }

  function initCallLinks() {
    document.querySelectorAll(".js-call").forEach((a) => {
      a.href = TEL_HREF;
      const base = a.textContent.trim();
      const label = "withNumber" in a.dataset && C.phone ? `${base} ${C.phone}` : base;
      a.innerHTML = `${icon("phone")}<span>${label}</span>`;
      a.addEventListener("click", () => track(a.dataset.event || "phone_click", a.dataset.source));
    });
  }

  function initBurger() {
    const burger = byId("burger");
    const menu = byId("mobileMenu");
    burger.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("no-scroll", isOpen);
    });
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        menu.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
        document.body.classList.remove("no-scroll");
      }
    });
  }

  function initHeaderScroll() {
    const header = byId("header");
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- hero ---------- */

  function renderHero() {
    byId("heroEyebrow").textContent = D.hero.eyebrow;
    const heroTitle = byId("heroTitle");
    heroTitle.textContent = D.hero.title + " ";
    if (D.hero.titleAccent) {
      const accent = el("span", "gradient-text");
      accent.textContent = D.hero.titleAccent;
      heroTitle.appendChild(accent);
    }
    byId("heroSubtitle").textContent = D.hero.subtitle;
    byId("heroNote").textContent = D.hero.note;

    const secondaryBtn = byId("heroCtaSecondary");
    secondaryBtn.textContent = D.hero.ctaSecondary.label;
    secondaryBtn.dataset.anchor = D.hero.ctaSecondary.anchor;

    const facts = byId("heroFacts");
    if (facts) facts.textContent = D.hero.quickFacts.join(" · ");
  }

  /* ---------- work types ---------- */

  function renderWorkTypeCards() {
    const wrap = byId("workTypeCards");
    D.workTypes.forEach((wt) => {
      const card = el(
        "div",
        "card card--work-type reveal",
        `<h3 class="card__title">${wt.title}</h3><p class="card__text">${wt.text}</p>`
      );
      if (wt.cta.type === "call") {
        card.appendChild(callButton(wt.cta.label, "btn btn--primary", "work_type_" + wt.id));
      } else {
        const a = el("a", "btn btn--outline", wt.cta.label);
        a.href = wt.cta.anchor;
        card.appendChild(a);
      }
      wrap.appendChild(card);
    });
  }

  /* ---------- benefits ---------- */

  function renderBenefits() {
    const wrap = byId("benefitCards");
    D.benefits.forEach((b) => {
      wrap.appendChild(
        el(
          "div",
          "card reveal",
          `<div class="card__icon">${icon(b.icon)}</div><h3 class="card__title">${b.title}</h3><p class="card__text">${b.text}</p>`
        )
      );
    });
  }

  /* ---------- vehicles ---------- */

  function renderVehicles() {
    byId("vehiclesSubtitle").textContent = D.vehicles.subtitle;
    const wrap = byId("vehicleCards");
    D.vehicles.items.forEach((v) => {
      const card = el("div", "carcard reveal");
      const media = el("div", "carcard__media");
      const photo = el("img");
      photo.src = v.photo;
      photo.alt = v.name;
      photo.loading = "lazy";
      media.appendChild(photo);
      media.appendChild(el("span", "carcard__badge", v.tariffLabel));
      card.appendChild(media);

      card.appendChild(
        el(
          "div",
          "carcard__body",
          `<h3 class="carcard__title">${v.name}</h3>
           <p class="carcard__meta">${v.tags.join(" · ")}</p>
           <p class="carcard__price">${v.conditionsLabel}</p>`
        )
      );
      wrap.appendChild(card);
      track("vehicle_view", v.id);
    });
    renderNotice("vehiclesNotice", D.vehicles.notice, "vehicles_notice");
  }

  /* ---------- calculator ---------- */

  function renderToggleGroup(containerId, options, activeId, onChange) {
    const wrap = byId(containerId);
    wrap.innerHTML = "";
    options.forEach((opt) => {
      const btn = el("button", "calc__option" + (opt.id === activeId ? " is-active" : ""), opt.label);
      btn.type = "button";
      btn.setAttribute("role", "tab");
      btn.addEventListener("click", () => {
        wrap.querySelectorAll(".calc__option").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        onChange(opt.id);
      });
      wrap.appendChild(btn);
    });
  }

  function initCalculator() {
    const cfg = D.incomeCalculator;
    if (!cfg.enabled) return;

    const state = {
      workType: cfg.workTypes[0].id,
      tariff: cfg.tariffs[0].id,
      hours: cfg.hoursRange.default,
      days: cfg.daysRange.default,
      started: false,
    };

    renderToggleGroup("calcWorkType", cfg.workTypes, state.workType, (id) => {
      state.workType = id;
      updateResult();
    });
    renderToggleGroup("calcTariff", cfg.tariffs, state.tariff, (id) => {
      state.tariff = id;
      updateResult();
    });

    const hoursInput = byId("calcHours");
    hoursInput.min = cfg.hoursRange.min;
    hoursInput.max = cfg.hoursRange.max;
    hoursInput.value = cfg.hoursRange.default;
    byId("calcHoursValue").textContent = state.hours;

    const daysInput = byId("calcDays");
    daysInput.min = cfg.daysRange.min;
    daysInput.max = cfg.daysRange.max;
    daysInput.value = cfg.daysRange.default;
    byId("calcDaysValue").textContent = state.days;

    hoursInput.addEventListener("input", () => {
      state.hours = Number(hoursInput.value);
      byId("calcHoursValue").textContent = state.hours;
      updateResult();
    });
    daysInput.addEventListener("input", () => {
      state.days = Number(daysInput.value);
      byId("calcDaysValue").textContent = state.days;
      updateResult();
    });

    byId("calcDisclaimer").textContent = cfg.disclaimer;

    function computeIncome() {
      const k = cfg.coefficients;
      if (!k) return null;
      const monthlyHours = state.hours * state.days * k.weeksPerMonth;
      const gross = monthlyHours * k.grossPerHour[state.tariff];
      const fuel = monthlyHours * k.fuelPerHour;
      const wear = state.workType === "own" ? monthlyHours * k.ownCarWearPerHour : 0;
      const net = Math.max(0, gross * (1 - k.parkShare[state.workType]) - fuel - wear);
      const round100 = (n) => Math.round(n / 100) * 100;
      return { low: round100(net * (1 - k.rangeSpread)), high: round100(net * (1 + k.rangeSpread)) };
    }

    function updateResult() {
      if (!state.started) {
        state.started = true;
        track("income_calculator_start");
      }
      const result = computeIncome();
      const resultEl = byId("calcResultValue");
      const noteEl = byId("calcResultNote");
      const fmt = (n) => n.toLocaleString("ru-RU");
      if (result === null) {
        resultEl.textContent = "Уточняется";
        resultEl.classList.add("is-placeholder");
        noteEl.textContent = "";
      } else {
        resultEl.textContent = `${fmt(result.low)} – ${fmt(result.high)} MDL`;
        resultEl.classList.remove("is-placeholder");
        noteEl.textContent = cfg.resultNote;
      }
    }

    updateResult();
  }

  /* ---------- how to start / conditions / requirements / trust ---------- */

  function renderSteps() {
    const wrap = byId("stepsList");
    D.howToStart.forEach((s) => {
      wrap.appendChild(
        el(
          "div",
          "step reveal",
          `<span class="step__num">${s.step}</span><h3 class="step__title">${s.title}</h3><p class="step__text">${s.text}</p>`
        )
      );
    });
  }

  function renderConditions() {
    const wrap = byId("conditionsList");
    D.conditions.forEach((c) => {
      wrap.appendChild(
        el(
          "div",
          "conditions__row",
          `<span class="conditions__label">${c.label}</span><span class="conditions__value">${c.value}</span>`
        )
      );
    });
    track("conditions_view");
  }

  function renderOwnCar() {
    byId("ownCarTitle").textContent = D.ownCar.title;
    byId("ownCarSubtitle").textContent = D.ownCar.subtitle;
    renderList("ownCarChecklist", D.ownCar.checklist);
    renderNotice("ownCarNotice", D.ownCar.notice, "own_car_notice");
  }

  function renderRequirements() {
    const wrap = byId("requirementCards");
    D.requirements.forEach((r) => {
      wrap.appendChild(
        el("div", "card card--sm reveal", `<h3 class="card__title">${r.title}</h3><p class="card__text">${r.text}</p>`)
      );
    });
  }

  function renderTrustPoints() {
    const wrap = byId("trustCards");
    D.trustPoints.forEach((t) => {
      const card = el(
        "div",
        "card card--trust reveal",
        `<h3 class="card__title">${t.title}</h3><p class="card__text">${t.text}</p>`
      );
      const link = el("a", "link", t.linkLabel + " →");
      link.href = t.anchor;
      card.appendChild(link);
      wrap.appendChild(card);
    });
  }

  /* ---------- faq ---------- */

  function renderFaq() {
    const wrap = byId("faqAccordion");
    D.faq.forEach((item, i) => {
      const accItem = el("div", "accordion__item" + (i === 0 ? " is-open" : ""));
      const head = el(
        "button",
        "accordion__head",
        `<span>${item.question}</span><svg class="icon accordion__arrow" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>`
      );
      head.type = "button";
      head.setAttribute("aria-expanded", i === 0 ? "true" : "false");
      const body = el("div", "accordion__body", `<p>${item.answer}</p>`);

      head.addEventListener("click", () => {
        const isOpen = accItem.classList.toggle("is-open");
        head.setAttribute("aria-expanded", String(isOpen));
        track("faq_open", item.question);
      });

      accItem.appendChild(head);
      accItem.appendChild(body);
      wrap.appendChild(accItem);
    });
    renderNotice("faqNotice", D.faqNotice, "faq_notice");
  }

  /* ---------- contact block ---------- */

  function renderContactBlock() {
    byId("finalCtaTitle").textContent = D.finalCta.title;
    byId("finalCtaSubtitle").textContent = D.finalCta.subtitle;
    byId("contactBusy").textContent = D.finalCta.busyNote;
    byId("bringTitle").textContent = D.finalCta.bringTitle;
    renderList("bringList", D.finalCta.bring);

    const wrap = byId("messengers");
    messengerLinks().forEach((m) => {
      const a = el("a", "btn btn--outline", m.label);
      a.href = m.href;
      a.target = "_blank";
      a.rel = "noopener";
      a.addEventListener("click", () => track(m.id + "_click", "final_cta"));
      wrap.appendChild(a);
    });

    const meta = byId("contactMeta");
    [
      C.address && `<strong>Адрес:</strong> ${C.address}`,
      C.officeHours && `<strong>Часы работы:</strong> ${C.officeHours}`,
    ]
      .filter(Boolean)
      .forEach((html) => meta.appendChild(el("li", "", html)));
  }

  /* ---------- scroll + reveal ---------- */

  function initScrollButtons() {
    document.querySelectorAll(".js-scroll").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = document.querySelector(btn.dataset.anchor);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((i) => i.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((i) => observer.observe(i));
  }

  /* ---------- road: логотип-автомобиль едет по полосе, уезжает и садится на логотип футера ---------- */

  function initRoad() {
    const road = byId("road");
    const car = byId("roadCar");
    const footer = byId("contacts");
    const footerLogo = byId("footerLogoImg");
    if (!road || !car || !footer || !footerLogo) return;

    const person = byId("roadPerson");
    const PERSON_AT = 0.7;
    const DWELL = 300;
    const STOP_GAP = 36;
    const BOARD_DEPTH = 45;
    const BOARD_SHRINK = 0;
    const FADE_FROM = 0.55;
    const EDGE = 16;
    const LANE_BOTTOM = 5;
    const LANDING = 0.65;
    let ticking = false;

    function update() {
      ticking = false;
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      const roadH = road.offsetHeight;
      const scrollY = window.scrollY;
      const carW = car.offsetWidth;
      const carH = car.offsetHeight;
      const laneTop = vh - LANE_BOTTOM - carH;

      const footerTop = footer.getBoundingClientRect().top + scrollY;
      const logo = footerLogo.getBoundingClientRect();
      const logoTop = logo.top + scrollY;
      const maxScroll = document.documentElement.scrollHeight - vh;

      // S1 — футер начинает появляться над полосой (логотип-автомобиль к этому моменту уже уехал);
      // S1v — логотип футера целиком поднялся над полосой, только тогда автомобиль начинает въезжать;
      // S2 — автомобиль сел на место
      const S1 = Math.max(1, footerTop - (vh - roadH));
      const S1v = Math.max(S1, logo.bottom + scrollY - (vh - roadH));
      const S2 = Math.max(S1v + 40, Math.min(maxScroll - 40, logoTop - LANDING * (vh - roadH)));

      let x;
      let y;
      let scale = 1;
      let progress;
      let landed = false;
      let boarding = 1;

      // Машина останавливается у пассажира: на участке в DWELL пикселей прокрутки она стоит,
      // пока он идёт к ней и садится (boarding: 0 — стоит на дороге, 1 — сел)
      const personLeft = vw * PERSON_AT - (person ? person.offsetWidth : 0) / 2;
      const dwell = person ? Math.min(DWELL, S1 * 0.35) : 0;
      const travel = S1 - dwell;
      const qStop = Math.min(1, Math.max(0, (personLeft - STOP_GAP - carW - EDGE) / (vw - EDGE)));
      const stopStart = qStop * travel;

      if (scrollY < S1) {
        const sy = Math.max(0, scrollY);
        if (sy < stopStart) {
          progress = sy / travel;
          boarding = 0;
        } else if (sy < stopStart + dwell) {
          progress = qStop;
          boarding = (sy - stopStart) / dwell;
        } else {
          progress = (sy - dwell) / travel;
        }
        x = EDGE + progress * (vw - EDGE);
        y = laneTop;
      } else {
        progress = 1;
        // въезжает по горизонтали на неподвижной высоте от низа экрана — той, где логотип футера
        // окажется в момент посадки (S2), в том же размере, что и логотип футера
        const t = Math.min(1, Math.max(0, (scrollY - S1v) / (S2 - S1v)));
        const e = 1 - Math.pow(1 - t, 3);
        scale = logo.height / carH;
        x = -carW * scale + (logo.left + carW * scale) * e;
        y = logoTop - S2;
        landed = t >= 1;
      }

      if (person) {
        const b = boarding * boarding * (3 - 2 * boarding);
        const size = 1 - BOARD_SHRINK * b;
        person.classList.toggle("is-boarding", boarding > 0.005);
        person.style.left = `${personLeft}px`;
        person.style.bottom = `${LANE_BOTTOM}px`;
        person.style.opacity = boarding < FADE_FROM ? "1" : String(Math.max(0, 1 - (boarding - FADE_FROM) / (1 - FADE_FROM)));
        person.style.transform = `translateX(${-(STOP_GAP + BOARD_DEPTH) * b}px) scale(${-size}, ${size})`;
      }

      document.body.classList.toggle("is-footer-stage", scrollY >= S1);

      car.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      car.style.opacity = landed ? "0" : "1";
      footerLogo.style.opacity = scrollY >= S1 && !landed ? "0" : "1";
      road.style.setProperty("--progress", progress.toFixed(4));
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("load", onScroll);
    car.addEventListener("load", onScroll);
    update();
  }

  /* ---------- init ---------- */

  function init() {
    renderBrand();
    renderNav();
    renderFooterContacts();
    renderHero();
    renderWorkTypeCards();
    renderBenefits();
    renderVehicles();
    renderSteps();
    renderConditions();
    renderOwnCar();
    renderRequirements();
    renderTrustPoints();
    renderFaq();
    renderContactBlock();

    initCallLinks();
    initBurger();
    initHeaderScroll();
    initCalculator();
    initScrollButtons();
    initReveal();
    initRoad();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
