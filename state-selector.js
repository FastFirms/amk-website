(function () {
  var pageMap = {
    'car-accidents.html': 'car-accidents-nsw.html',
    'workers-compensation.html': 'workers-compensation-nsw.html',
    'workcover.html': 'workcover-nsw.html',
    'personal-injury.html': 'personal-injury-nsw.html',
    'public-liability.html': 'public-liability-nsw.html',
    'slip-and-fall.html': 'slip-and-fall-nsw.html',
    'medical-negligence.html': 'medical-negligence-nsw.html',
    'tpd-superannuation.html': 'tpd-superannuation-nsw.html',
    'bike-accidents.html': 'bike-accidents-nsw.html',
    'not-at-fault-car-accidents.html': 'not-at-fault-car-accidents-nsw.html',
    'institutional-abuse.html': 'institutional-abuse-nsw.html',
    'no-win-no-fee.html': 'no-win-no-fee-nsw.html',
    'ctp-lawyer.html': 'ctp-lawyer-nsw.html',
    'ctp-recent-cases.html': 'ctp-recent-cases-nsw.html',
    'workcover-recent-cases.html': 'workcover-recent-cases-nsw.html',
    'public-liability-recent-cases.html': 'public-liability-recent-cases-nsw.html',
    'services.html': 'services-nsw.html',
    'why-choose-us.html': 'why-choose-us-nsw.html'
  };

  var reverseMap = {};
  for (var k in pageMap) { reverseMap[pageMap[k]] = k; }

  // Normalise: handle /page.html and /page (Vercel clean URLs) and /
  function getCurrentPage() {
    var seg = window.location.pathname.split('/').pop() || '';
    if (!seg) return 'index.html';
    if (!seg.endsWith('.html')) seg += '.html';
    return seg;
  }

  function getState() { return localStorage.getItem('amk_state'); }
  function setState(s) { localStorage.setItem('amk_state', s); }

  function closeModal() {
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
    var m = document.getElementById('amk-state-modal');
    if (m) m.remove();
  }

  function applyRedirect(state) {
    var page = getCurrentPage();
    if (state === 'nsw' && pageMap[page]) {
      window.location.replace(pageMap[page]);
    } else if (state === 'qld' && reverseMap[page]) {
      window.location.replace(reverseMap[page]);
    }
  }

  function makeBadgeBtn(id, isNSW) {
    var btn = document.createElement('button');
    btn.id = id;
    btn.className = 'state-badge' + (isNSW ? ' state-badge-nsw' : ' state-badge-qld');
    btn.setAttribute('aria-label', 'Viewing ' + (isNSW ? 'NSW' : 'QLD') + ' — click to change state');
    btn.innerHTML =
      '<span class="state-badge-dot" aria-hidden="true"></span>' +
      '<span class="state-badge-label">' + (isNSW ? 'NSW' : 'QLD') + '</span>' +
      '<span class="state-badge-caret" aria-hidden="true">&#9662;</span>';
    btn.addEventListener('click', function () { showModal(true); });
    return btn;
  }

  function addBadge() {
    var s = getState() || 'qld';
    var isNSW = s === 'nsw';

    // Desktop badge — inside nav-links, before Contact Us
    var links = document.querySelector('.nav-links');
    if (links) {
      var oldLi = document.getElementById('amk-state-li');
      if (oldLi) oldLi.remove();
      var li = document.createElement('li');
      li.id = 'amk-state-li';
      li.appendChild(makeBadgeBtn('amk-state-badge', isNSW));
      var ctaEl = links.querySelector('a.nav-cta');
      var ctaLi = ctaEl ? ctaEl.closest('li') : null;
      if (ctaLi) { links.insertBefore(li, ctaLi); } else { links.appendChild(li); }
    }

    // Mobile badge — directly in nav-inner, before the hamburger button
    var oldMobile = document.getElementById('amk-state-mobile');
    if (oldMobile) oldMobile.remove();
    var burger = document.querySelector('.nav-burger');
    if (burger) {
      var mobileBtn = makeBadgeBtn('amk-state-mobile', isNSW);
      burger.parentNode.insertBefore(mobileBtn, burger);
    }
  }

  function showModal(allowClose) {
    closeModal();
    var modal = document.createElement('div');
    modal.id = 'amk-state-modal';
    var overlay = document.createElement('div');
    overlay.className = 'ssm-overlay';
    if (allowClose) overlay.addEventListener('click', closeModal);
    var box = document.createElement('div');
    box.className = 'ssm-box';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-labelledby', 'ssm-title');
    box.innerHTML =
      '<h2 id="ssm-title">Select your state</h2>' +
      '<p>We\'ll show you the laws and process that apply to you.</p>' +
      '<div class="ssm-btns">' +
        '<button class="ssm-btn ssm-btn-qld" id="ssm-qld">Queensland</button>' +
        '<button class="ssm-btn ssm-btn-nsw" id="ssm-nsw">New South Wales</button>' +
      '</div>' +
      '<p class="ssm-note">AMK Lawyers serves QLD and NSW clients.</p>';
    modal.appendChild(overlay);
    modal.appendChild(box);
    document.body.appendChild(modal);
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.getElementById('ssm-qld').addEventListener('click', function () { window.__amkState('qld'); });
    document.getElementById('ssm-nsw').addEventListener('click', function () { window.__amkState('nsw'); });
  }

  // Swap homepage H1 to reflect selected state (no NSW homepage page exists)
  function applyPageState(state) {
    var page = getCurrentPage();
    if (page !== 'index.html') return;
    var h1 = document.querySelector('.hero-headline');
    if (h1) {
      h1.textContent = state === 'nsw'
        ? 'Compensation Lawyers NSW.'
        : 'Compensation Lawyers Queensland.';
    }
    // Swap homepage QLD text content
    var yearsStats = document.getElementById('yearsStats');
    if (yearsStats) {
      yearsStats.textContent = state === 'nsw'
        ? 'Years of New South Wales compensation law'
        : 'Years of Queensland compensation law';
    }

    var learnHeading = document.getElementById('learnHeading');
    if (learnHeading) {
      learnHeading.textContent = state === 'nsw'
        ? 'Understanding New South Wales Compensation Law.'
        : 'Understanding Queensland Compensation Law.';
    }

    var whyRowTitle1 = document.getElementById('whyRowTitle1');
    if (whyRowTitle1) {
      whyRowTitle1.textContent = state === 'nsw'
        ? 'What Are My Legal Rights Under New South Wales Compensation Law?'
        : 'What Are My Legal Rights Under Queensland Compensation Law?';
    }

    var whyRowP1 = document.getElementById('whyRowP1');
    if (whyRowP1) {
      whyRowP1.textContent = state === 'nsw'
        ? "Compensation laws exist so people can take legal action after an accident, getting sick or being hurt. In New South Wales, different rules apply depending on the nature of your injury and when and where it occurred — the same type of injury can be treated very differently if it's caused by a motor vehicle accident versus happening while you're doing your job."
        : "Compensation laws exist so people can take legal action after an accident, getting sick or being hurt. In Queensland, different rules apply depending on the nature of your injury and when and where it occurred — the same type of injury can be treated very differently if it's caused by a motor vehicle accident versus happening while you're doing your job.";
    }

    var whyRowP2 = document.getElementById('whyRowP2');
    if (whyRowP2) {
      whyRowP2.textContent = state === 'nsw'
        ? "That's because different types of personal injury are processed under different legislation. If you're hurt at work, your claim will usually be managed as a workers' compensation claim through icare. Motor vehicle accidents are handled by the CTP insurance company, while public liability claims are made through the policyholder's insurer. We'll help you understand the process under the relevant New South Wales legislation, so you can make an informed decision about your matter."
        : "That's because different types of personal injury are processed under different legislation. If you're hurt at work, your claim will usually be managed as a workers' compensation claim through WorkCover. Motor vehicle accidents are handled by the CTP insurance company, while public liability claims are made through the policyholder's insurer. We'll help you understand the process under the relevant Queensland legislation, so you can make an informed decision about your matter.";
    }

    // --- "The claims we can help with, in detail" accordion ---

    var ctpP1 = document.getElementById('ctpP1');
    if (ctpP1) {
      ctpP1.textContent = state === 'nsw'
        ? "In New South Wales, car accident compensation claims are typically made through the Compulsory Third Party (CTP) insurance scheme, also known as a Green Slip, paid when people register their vehicles. CTP claims apply to drivers, passengers, pedestrians and cyclists injured on the road, across all vehicle types on New South Wales roads."
        : "In Queensland, car accident compensation claims are typically made through the Compulsory Third Party (CTP) insurance scheme, paid when people register their vehicles. CTP claims apply to drivers, passengers, pedestrians and cyclists injured on the road, across all vehicle types on Queensland roads.";
    }

    // NOTE: ctpP2 references QLD-specific forms and deadlines (Accident Notification Form,
    // 28 days, Notice of Accident Claim Form, nine months). NSW's scheme (Motor Accident
    // Injuries Act 2017, via SIRA) uses different forms and timeframes — confirm the exact
    // figures before publishing rather than relying on the placeholder wording below.
    var ctpP2 = document.getElementById('ctpP2');
    if (ctpP2) {
      ctpP2.textContent = state === 'nsw'
        ? "If you're injured in a motor vehicle accident, you must notify the at-fault driver's CTP insurer as soon as possible. Claims can cover medical expenses, rehabilitation, loss of income, and pain and suffering. Strict time limits apply under the Motor Accident Injuries Act 2017 — [CONFIRM: exact notification and claim lodgement deadlines for NSW]."
        : "If you're injured in a motor vehicle accident, you must notify the at-fault driver's CTP insurer — the Queensland Government can help you find their details if you don't have them. Claims can cover medical expenses, rehabilitation, loss of income, and pain and suffering. Strict time limits apply: an Accident Notification Form within 28 days, and a Notice of Accident Claim Form within nine months of the accident or the onset of symptoms.";
    }

    var wcP1 = document.getElementById('wcP1');
    if (wcP1) {
      wcP1.textContent = state === 'nsw'
        ? "Workers' compensation claims in New South Wales are handled through icare. If you suffer a workplace injury or illness, you must notify your employer and lodge a claim within six months. Claims can cover medical and rehabilitation costs, loss of wages, and permanent impairment benefits."
        : "Workers' compensation claims in Queensland are handled through WorkCover. If you suffer a workplace injury or illness, you must notify your employer and lodge a claim with WorkCover within six months. Claims can cover medical and rehabilitation costs, loss of wages, and permanent impairment benefits.";
    }

    var tpdP1 = document.getElementById('tpdP1');
    if (tpdP1) {
      tpdP1.textContent = state === 'nsw'
        ? "TPD claims are made through various channels including superannuation funds, icare, or private insurance policies. They cover injuries or illnesses resulting in permanent impairment that prevents you from working, and compensation can include lump-sum payments and ongoing financial support."
        : "TPD claims are made through various channels including superannuation funds, WorkCover, or private insurance policies. They cover injuries or illnesses resulting in permanent impairment that prevents you from working, and compensation can include lump-sum payments and ongoing financial support.";
    }

    // --- FAQ section ---

    // NOTE: this references specific QLD office cities (Brisbane, Toowoomba, Gold Coast).
    // Swap in the correct NSW office locations before publishing — placeholder below.
    var faqEvidenceP = document.getElementById('faqEvidenceP');
    if (faqEvidenceP) {
      faqEvidenceP.textContent = state === 'nsw'
        ? "Gathering evidence involves collecting medical records, accident reports, witness statements and expert opinions. Our lawyers in [CONFIRM: NSW office locations] work with you to compile all relevant information — thorough documentation supports your claim and is crucial for a successful outcome under New South Wales law."
        : "Gathering evidence involves collecting medical records, accident reports, witness statements and expert opinions. Our lawyers in Brisbane, Toowoomba and the Gold Coast work with you to compile all relevant information — thorough documentation supports your claim and is crucial for a successful outcome under Queensland law.";
    }
  }

  window.__amkState = function (s) {
    setState(s);
    closeModal();
    addBadge();
    applyPageState(s);
    applyRedirect(s);
  };

  document.addEventListener('DOMContentLoaded', function () {
    var state = getState();
    if (!state) {
      showModal(false);
    } else {
      var page = getCurrentPage();
      if (state === 'nsw' && pageMap[page]) {
        window.location.replace(pageMap[page]);
        return;
      }
      if (state === 'qld' && reverseMap[page]) {
        window.location.replace(reverseMap[page]);
        return;
      }
    }
    addBadge();
    applyPageState(getState() || 'qld');
  });
})();
