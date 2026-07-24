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
    'public-liability-recent-cases.html': 'public-liability-recent-cases-nsw.html'
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
