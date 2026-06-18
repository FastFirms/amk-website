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

  function getCurrentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
  }

  function getState() { return localStorage.getItem('amk_state'); }
  function setState(s) { localStorage.setItem('amk_state', s); }

  function closeModal() {
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

  function addBadge() {
    var links = document.querySelector('.nav-links');
    if (!links) return;
    var old = document.getElementById('amk-state-badge');
    if (old) old.remove();
    var s = getState() || 'qld';
    var li = document.createElement('li');
    var btn = document.createElement('button');
    btn.id = 'amk-state-badge';
    btn.className = 'state-badge';
    btn.setAttribute('aria-label', 'Change state');
    btn.innerHTML = (s === 'nsw' ? 'NSW' : 'QLD') + ' <span aria-hidden="true">&#9662;</span>';
    btn.onclick = function () { showModal(true); };
    li.appendChild(btn);
    links.appendChild(li);
  }

  function showModal(allowClose) {
    closeModal();
    var modal = document.createElement('div');
    modal.id = 'amk-state-modal';
    modal.innerHTML =
      '<div class="ssm-overlay"' + (allowClose ? ' onclick="(function(){var m=document.getElementById(\'amk-state-modal\');if(m)m.remove();})()"' : '') + '></div>' +
      '<div class="ssm-box" role="dialog" aria-modal="true" aria-labelledby="ssm-title">' +
        '<h2 id="ssm-title">Select your location</h2>' +
        '<p>So we can show you the most relevant information — different laws apply by state.</p>' +
        '<div class="ssm-btns">' +
          '<button class="ssm-btn" onclick="window.__amkState(\'qld\')">QLD</button>' +
          '<button class="ssm-btn" onclick="window.__amkState(\'nsw\')">NSW</button>' +
        '</div>' +
        '<p class="ssm-note">AMK Lawyers currently serves Queensland and New South Wales.</p>' +
      '</div>';
    document.body.appendChild(modal);
  }

  window.__amkState = function (s) {
    setState(s);
    closeModal();
    addBadge();
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
  });
})();
