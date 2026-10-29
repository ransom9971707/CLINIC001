(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const treatments = [
    {
      short: 'PREVENTION',
      tagline: 'Keep good things going.',
      description:
        'Thoughtful check-ups, gentle hygiene and a clear view of your oral health—without the lecture. We look for the small things, so they stay small.',
      details: ['Comprehensive exam', 'Gentle hygiene', 'Digital imaging only when needed'],
      meta: '60 MIN · EVERY 6 MONTHS',
    },
    {
      short: 'ALIGN',
      tagline: 'A subtle shift. A big difference.',
      description:
        'Straighten your smile with a digitally planned sequence of nearly invisible aligners. Your plan is built around your face, your bite and your actual life.',
      details: ['3D smile planning', 'Progress check-ins', 'Retainers and aftercare'],
      meta: 'DIGITAL PLAN · NO IMPRESSIONS',
    },
    {
      short: 'REFINE',
      tagline: 'Still you. Just more luminous.',
      description:
        'Conservative cosmetic dentistry that respects what makes your smile yours. We consider shape, proportion and tone before recommending any treatment.',
      details: ['Smile preview', 'Minimal-prep options', 'Natural porcelain artistry'],
      meta: 'BESPOKE PLAN · PREVIEW FIRST',
    },
    {
      short: 'BRIGHTEN',
      tagline: 'Brighter, never artificial.',
      description:
        'Professional whitening calibrated to your enamel and sensitivity. Choose an in-studio refresh or a gradual at-home protocol, with a shade that still feels like you.',
      details: ['Sensitivity assessment', 'In-studio or take-home', 'Personal maintenance plan'],
      meta: 'FROM 75 MIN · ENAMEL-AWARE',
    },
    {
      short: 'RESTORE',
      tagline: 'Strength that looks effortless.',
      description:
        'From a single filling to a complete restoration, we combine precise digital planning with meticulous craftsmanship to bring back comfort, function and confidence.',
      details: ['Tooth-coloured restorations', 'Crowns and bridges', 'Implant restoration'],
      meta: 'PLANNED DIGITALLY · MADE TO LAST',
    },
  ];

  const testimonials = [
    {
      quote:
        'I used to put off the dentist for years. Here, everything is explained before it happens, nobody rushes you, and the space is genuinely beautiful. I left feeling looked after.',
      name: 'Nina R.',
      detail: 'NEW PATIENT · PREVENTIVE CARE',
    },
    {
      quote:
        'The result is exactly what I hoped for: brighter, more balanced, and still completely me. The preview made every decision feel easy and considered.',
      name: 'Marcus T.',
      detail: 'SMILE DESIGN PATIENT',
    },
    {
      quote:
        'Clear aligners fitted around my work and travel without any drama. Every check-in was on time, and seeing the progress was oddly addictive.',
      name: 'Leah K.',
      detail: 'CLEAR ALIGNER PATIENT',
    },
  ];

  const toothGuide = {
    molar: {
      number: '01',
      name: 'Molar',
      description:
        'Your back teeth do the heavy lifting, grinding food into smaller, easier-to-digest pieces.',
      tip: 'Angle your brush toward the gumline and clean every chewing surface—not just the front.',
    },
    canine: {
      number: '02',
      name: 'Canine',
      description:
        'The pointed teeth beside your incisors help tear food and guide the way your upper and lower jaws meet.',
      tip: 'Be gentle along the gumline here. A soft brush and light pressure help protect this prominent area.',
    },
    incisor: {
      number: '03',
      name: 'Incisor',
      description:
        'These are your front teeth. Their thin, shaped edges help you bite into food and support clear speech.',
      tip: 'Clean the backs of your front teeth too. Try small circles with the brush held slightly upright.',
    },
  };

  /* ----------------------------------------------------------------------
     Motion
     ---------------------------------------------------------------------- */
  function initMotion() {
    if (reducedMotion.matches || !window.AOS) {
      document.documentElement.classList.add('aos-disabled');
      return;
    }

    window.AOS.init({
      duration: 650,
      easing: 'ease-out-cubic',
      once: true,
      offset: 48,
      delay: 0,
      anchorPlacement: 'top-bottom',
    });

    window.addEventListener('load', () => window.AOS.refresh(), { once: true });
  }

  /* ----------------------------------------------------------------------
     Header and accessible dialog primitives
     ---------------------------------------------------------------------- */
  const header = $('#site-header');
  const menuOverlay = $('#menu-overlay');
  const bookingOverlay = $('#booking-overlay');
  const menuOpenButton = $('#menu-open');
  let lastScrollY = window.scrollY;
  let scrollTicking = false;
  let activeOverlay = null;
  let returnFocusTo = null;
  let previousBodyOverflow = '';

  function updateHeader() {
    const currentY = window.scrollY;
    if (!activeOverlay) {
      if (currentY > 140 && currentY > lastScrollY + 4) {
        header.classList.add('site-header--hidden');
      } else if (currentY < lastScrollY - 4 || currentY < 80) {
        header.classList.remove('site-header--hidden');
      }
    }
    lastScrollY = currentY;
    scrollTicking = false;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(updateHeader);
        scrollTicking = true;
      }
    },
    { passive: true },
  );

  function getFocusable(overlay) {
    return $$(
      'a[href], button:not([disabled]):not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      overlay,
    ).filter((element) => !element.hidden && element.getClientRects().length > 0);
  }

  function openOverlay(overlay, trigger) {
    if (activeOverlay && activeOverlay !== overlay) {
      closeOverlay(activeOverlay, false);
    }

    returnFocusTo = trigger && !menuOverlay.contains(trigger) ? trigger : menuOpenButton;
    previousBodyOverflow = document.body.style.overflow;
    activeOverlay = overlay;
    overlay.inert = false;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    header.classList.remove('site-header--hidden');

    if (overlay === menuOverlay) {
      menuOpenButton.setAttribute('aria-expanded', 'true');
    }

    window.requestAnimationFrame(() => getFocusable(overlay)[0]?.focus());
  }

  function closeOverlay(overlay, restoreFocus = true) {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.inert = true;

    if (overlay === menuOverlay) {
      menuOpenButton.setAttribute('aria-expanded', 'false');
    }

    if (activeOverlay === overlay) {
      activeOverlay = null;
      document.body.style.overflow = previousBodyOverflow;
      if (restoreFocus) returnFocusTo?.focus();
    }
  }

  document.addEventListener('keydown', (event) => {
    if (!activeOverlay) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeOverlay(activeOverlay);
      return;
    }

    if (event.key !== 'Tab') return;
    const focusable = getFocusable(activeOverlay);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  menuOpenButton.addEventListener('click', () => openOverlay(menuOverlay, menuOpenButton));
  $$('[data-close-menu]').forEach((control) => {
    control.addEventListener('click', () => closeOverlay(menuOverlay));
  });
  $$('[data-close-booking]').forEach((control) => {
    control.addEventListener('click', () => closeOverlay(bookingOverlay));
  });
  $$('[data-book]').forEach((button) => {
    button.addEventListener('click', () => openOverlay(bookingOverlay, button));
  });

  /* ----------------------------------------------------------------------
     Treatment explorer
     ---------------------------------------------------------------------- */
  const treatmentTabs = $$('.treatment-tabs [role="tab"]');
  const treatmentPanel = $('#treatment-panel');
  let activeTreatment = 0;

  function renderTreatment(index, moveFocus = false) {
    activeTreatment = (index + treatments.length) % treatments.length;
    const treatment = treatments[activeTreatment];

    treatmentTabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === activeTreatment;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });

    $('#treatment-index').textContent = String(activeTreatment + 1).padStart(2, '0');
    $('#treatment-short').textContent = treatment.short;
    $('#treatment-tagline').textContent = treatment.tagline;
    $('#treatment-description').textContent = treatment.description;
    $('#treatment-meta').textContent = treatment.meta;
    treatmentPanel.setAttribute('aria-labelledby', `treatment-tab-${activeTreatment}`);

    const details = $('#treatment-details');
    details.replaceChildren(
      ...treatment.details.map((detail) => {
        const item = document.createElement('li');
        item.innerHTML =
          '<svg class="icon" aria-hidden="true"><use href="#icon-check"></use></svg>';
        item.append(document.createTextNode(detail));
        return item;
      }),
    );

    if (!reducedMotion.matches) {
      treatmentPanel.animate(
        [
          { opacity: 0.55, transform: 'translateY(8px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 220, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
      );
    }

    if (moveFocus) treatmentTabs[activeTreatment].focus();
  }

  treatmentTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => renderTreatment(index));
    tab.addEventListener('keydown', (event) => {
      let nextIndex = null;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = activeTreatment + 1;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = activeTreatment - 1;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = treatments.length - 1;
      if (nextIndex === null) return;
      event.preventDefault();
      renderTreatment(nextIndex, true);
    });
  });

  /* ----------------------------------------------------------------------
     Patient stories
     ---------------------------------------------------------------------- */
  let activeStory = 0;

  function renderStory(direction) {
    activeStory = (activeStory + direction + testimonials.length) % testimonials.length;
    const story = testimonials[activeStory];
    const quote = $('#story-quote');

    quote.textContent = story.quote;
    $('#story-name').textContent = story.name;
    $('#story-detail').textContent = story.detail;
    $('#story-count').textContent = `( ${activeStory + 1} / ${testimonials.length} )`;

    if (!reducedMotion.matches) {
      $('.stories__quote').animate(
        [
          { opacity: 0.45, transform: `translateX(${direction * 10}px)` },
          { opacity: 1, transform: 'translateX(0)' },
        ],
        { duration: 240, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
      );
    }
  }

  $('#story-prev').addEventListener('click', () => renderStory(-1));
  $('#story-next').addEventListener('click', () => renderStory(1));

  /* ----------------------------------------------------------------------
     FAQs
     ---------------------------------------------------------------------- */
  $$('.faq-item').forEach((item) => {
    const button = $('button', item);
    const answer = $('.faq-item__answer', item);

    button.addEventListener('click', () => {
      const willOpen = button.getAttribute('aria-expanded') !== 'true';

      $$('.faq-item').forEach((otherItem) => {
        const otherButton = $('button', otherItem);
        const otherAnswer = $('.faq-item__answer', otherItem);
        const open = otherItem === item && willOpen;
        otherItem.classList.toggle('is-open', open);
        otherButton.setAttribute('aria-expanded', String(open));
        otherAnswer.hidden = !open;
        $('use', otherButton).setAttribute('href', open ? '#icon-minus' : '#icon-plus');
      });
    });
  });

  /* ----------------------------------------------------------------------
     Interactive 3D anatomy and floating hotspot card
     ---------------------------------------------------------------------- */
  const model = $('#teeth-model');
  const modelStage = $('#model-stage');
  const modelStatus = $('#model-status');
  const modelReset = $('#model-reset');
  const hotspotCard = $('#hotspot-card');
  const hotspotClose = $('#hotspot-close');
  const hotspotTriggers = $$('[data-hotspot], [data-hotspot-target]');
  let activeTooth = null;
  let activeHotspotTrigger = null;
  let positionFrame = null;

  function clearHotspotPosition() {
    hotspotCard.style.removeProperty('left');
    hotspotCard.style.removeProperty('right');
    hotspotCard.style.removeProperty('top');
    hotspotCard.style.removeProperty('bottom');
  }

  function positionHotspotCard() {
    if (!activeTooth || hotspotCard.hidden) return;

    if (
      window.innerWidth < 560 ||
      !activeHotspotTrigger?.classList.contains('hotspot-pin') ||
      !activeHotspotTrigger.getClientRects().length
    ) {
      clearHotspotPosition();
      return;
    }

    const stageRect = modelStage.getBoundingClientRect();
    const pinRect = activeHotspotTrigger.getBoundingClientRect();
    const cardWidth = Math.min(320, stageRect.width - 32);
    const cardHeight = hotspotCard.offsetHeight;
    const gutter = 16;

    let left = pinRect.right - stageRect.left + 16;
    if (left + cardWidth > stageRect.width - gutter) {
      left = pinRect.left - stageRect.left - cardWidth - 16;
    }
    left = clamp(left, gutter, Math.max(gutter, stageRect.width - cardWidth - gutter));

    let top = pinRect.top - stageRect.top + pinRect.height / 2 - cardHeight / 2;
    top = clamp(top, 76, Math.max(76, stageRect.height - cardHeight - 58));

    hotspotCard.style.width = `${cardWidth}px`;
    hotspotCard.style.left = `${left}px`;
    hotspotCard.style.top = `${top}px`;
    hotspotCard.style.right = 'auto';
    hotspotCard.style.bottom = 'auto';
  }

  function scheduleHotspotPosition() {
    if (positionFrame) return;
    positionFrame = window.requestAnimationFrame(() => {
      positionHotspotCard();
      positionFrame = null;
    });
  }

  function openHotspot(key, trigger) {
    const tooth = toothGuide[key];
    if (!tooth) return;

    activeTooth = key;
    activeHotspotTrigger = trigger;
    $('#hotspot-label').textContent = `TOOTH GUIDE · ${tooth.number}`;
    $('#hotspot-title').textContent = tooth.name;
    $('#hotspot-description').textContent = tooth.description;
    $('#hotspot-tip').textContent = tooth.tip;

    hotspotTriggers.forEach((control) => {
      const controlKey = control.dataset.hotspot || control.dataset.hotspotTarget;
      control.setAttribute('aria-expanded', String(controlKey === key));
    });

    clearHotspotPosition();
    hotspotCard.style.removeProperty('width');
    hotspotCard.hidden = false;
    scheduleHotspotPosition();

    if (!trigger.classList.contains('hotspot-pin')) {
      modelStage.scrollIntoView({
        behavior: reducedMotion.matches ? 'auto' : 'smooth',
        block: 'center',
      });
    }
  }

  function closeHotspot(restoreFocus = false) {
    if (!activeTooth) return;
    activeTooth = null;
    hotspotCard.hidden = true;
    hotspotTriggers.forEach((control) => control.setAttribute('aria-expanded', 'false'));
    if (restoreFocus) activeHotspotTrigger?.focus();
    activeHotspotTrigger = null;
  }

  hotspotTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const key = trigger.dataset.hotspot || trigger.dataset.hotspotTarget;
      if (activeTooth === key && activeHotspotTrigger === trigger) {
        closeHotspot(true);
      } else {
        openHotspot(key, trigger);
      }
    });
  });

  hotspotClose.addEventListener('click', () => closeHotspot(true));
  model.addEventListener('camera-change', scheduleHotspotPosition);
  window.addEventListener('resize', scheduleHotspotPosition, { passive: true });

  document.addEventListener('pointerdown', (event) => {
    if (
      activeTooth &&
      !hotspotCard.contains(event.target) &&
      !event.target.closest('[data-hotspot], [data-hotspot-target]')
    ) {
      closeHotspot(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && activeTooth && !activeOverlay) {
      closeHotspot(true);
    }
  });

  model.addEventListener('load', () => {
    modelStatus.hidden = true;
    modelStatus.classList.remove('is-error');
    modelReset.disabled = false;
    scheduleHotspotPosition();
  });

  model.addEventListener('error', () => {
    modelStatus.hidden = false;
    modelStatus.classList.add('is-error');
    modelStatus.textContent =
      'The 3D view is unavailable right now. You can still explore every tooth type using the guide.';
    modelReset.disabled = true;
    closeHotspot(false);
  });

  modelReset.addEventListener('click', () => {
    closeHotspot(false);
    model.cameraOrbit = '0deg 68deg 5.4m';
    model.cameraTarget = '0m 0m 0m';
    model.fieldOfView = '30deg';
    if (typeof model.resetTurntableRotation === 'function') model.resetTurntableRotation();
    if (typeof model.jumpCameraToGoal === 'function') model.jumpCameraToGoal();
  });

  /* ----------------------------------------------------------------------
     Small production details
     ---------------------------------------------------------------------- */
  $('#current-year').textContent = String(new Date().getFullYear());
  initMotion();
})();
