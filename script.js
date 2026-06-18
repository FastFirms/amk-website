
/* ---------- Page toggle (no reload) ---------- */




/* ---------- Mobile menu ---------- */
function toggleMenu(){
  document.getElementById('navLinks').classList.toggle('open');
}
function closeMenu(){
  document.getElementById('navLinks').classList.remove('open');
}

/* ============================================================
   CLAIM CHECK WIZARD
   Questions + conditional logic mirrored from client reference.
   ============================================================ */
var wizAnswers = {};
var wizIndex = 0;
var wizDone = false;

var wizSteps = [
  {
    id:'location', type:'cards', cols:2,
    q:'Where did your accident occur?',
    options:[{v:'Queensland'},{v:'Another State'}]
  },
  {
    id:'nature', type:'cards', cols:3,
    q:'What is the nature of your accident?',
    options:[{v:'Car/Road Accident'},{v:'Workplace Accident'},{v:'Other Accidents'}]
  },
  {
    id:'lumpSumOffer', type:'cards', cols:2,
    q:'Have you received an offer of lump sum compensation in a Notice of Assessment?',
    options:[{v:'Yes'},{v:'No'}],
    condition:function(a){ return a.nature === 'Workplace Accident'; },
    sub:{
      id:'lumpSumAccepted', type:'cards', cols:2,
      q:'Did you accept the offer of lump sum compensation?',
      options:[{v:'Yes'},{v:'No'}],
      showIf:function(a){ return a.lumpSumOffer === 'Yes'; }
    }
  },
  {
    id:'last3Years', type:'cards', cols:2,
    q:'Did your accident occur in the last 3 years?',
    options:[{v:'Yes'},{v:'No'}],
    sub:{
      id:'accidentDate', type:'date',
      q:'Please enter the date of your accident',
      showIf:function(a){ return a.last3Years === 'Yes'; }
    }
  },
  {
    id:'blame', type:'cards', cols:2,
    q:'Was there someone else to blame for your accident?',
    help:'For example, another vehicle hitting you from behind, instructed by an employer to undertake an unsafe task, slipping on milk in a supermarket.',
    options:[{v:'Yes'},{v:'No'}]
  },
  {
    id:'injurySeverity', type:'cards', cols:3,
    q:'Please select the box which best describes the nature of your injuries?',
    options:[
      {v:'Minor', d:'Such as Whiplash, Soft-Tissue, no broken bones, no surgery/hospitalisation, no major time off work, little impact on employment'},
      {v:'Medium', d:'Serious Whiplash, Disc Injury/Bulge, Broken bones, Fractures, Surgery/Hospital treatment, time off work (more than 4 weeks), impact on future employment, some care and assistance'},
      {v:'Major', d:'Serious, life changing injuries requiring long term treatment, giving up work, care and assistance to function.'}
    ]
  },
  {
    id:'employed', type:'cards', cols:2,
    q:'Were you employed at the time of the accident?',
    options:[{v:'Yes'},{v:'No'}]
  },
  {
    id:'futureIncomeLoss', type:'cards', cols:2,
    q:'Will you lose income in the future due to your injuries?',
    help:'For example, do you anticipate reducing your work hours, looking for alternative employment or ceasing work for a period of time?',
    options:[{v:'Yes'},{v:'No'}]
  },
  {
    id:'careAssistance', type:'cards', cols:2,
    q:'Have you required care and assistance for your injuries?',
    options:[{v:'Yes'},{v:'No'}]
  },
  {
    id:'medicalExpenses', type:'cards', cols:2,
    q:'Are you incurring medical expenses?',
    options:[{v:'Yes'},{v:'No'}],
    sub:{
      id:'medicalExpenseRange', type:'select',
      q:'Approximately how much?',
      options:['$0-$1000','$1000-$2500','$2500-$5000','$5000-$10000','$10000+'],
      showIf:function(a){ return a.medicalExpenses === 'Yes'; }
    }
  },
  {
    id:'preExisting', type:'cards', cols:2,
    q:'Do you suffer from any pre-accident injuries/illnesses or disabilities?',
    options:[{v:'Yes'},{v:'No'}]
  },
  {
    id:'age', type:'slider',
    q:'What is your age?',
    min:0, max:100, def:30
  },
  {
    id:'contact', type:'contact',
    q:'Thank you for completing this calculator.',
    help:'Please enter your email and phone number to see the results.'
  }
];

function wizVisible(){
  return wizSteps.filter(function(s){ return !s.condition || s.condition(wizAnswers); });
}

function esc(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function wizRender(){
  var steps = wizVisible();
  if(wizIndex >= steps.length){ wizIndex = steps.length - 1; }
  var step = steps[wizIndex];
  var body = document.getElementById('wizBody');
  var html = '';

  document.getElementById('wizProgress').textContent =
    'Free Claim Check \u00B7 Step ' + (wizIndex + 1) + ' of ' + steps.length;

  html += renderQuestion(step);
  if(step.sub && step.sub.showIf(wizAnswers)){
    html += '<div class="wiz-sub">' + renderQuestion(step.sub) + '</div>';
  }
  body.innerHTML = html;

  /* restore field values + bind events */
  bindFields(step);
  if(step.sub && step.sub.showIf(wizAnswers)){ bindFields(step.sub); }

  document.getElementById('wizBack').style.display = wizIndex === 0 ? 'none' : 'inline-block';
  document.getElementById('wizNext').textContent = step.type === 'contact' ? 'Submit' : 'Continue';
  wizHideError();
}

function renderQuestion(step){
  var html = '<div class="wiz-q">' + esc(step.q) + '</div>';
  if(step.help){ html += '<p class="wiz-help">' + esc(step.help) + '</p>'; }

  if(step.type === 'cards'){
    html += '<div class="wiz-options' + (step.cols === 3 ? ' cols-3' : '') + '">';
    step.options.forEach(function(o){
      var sel = wizAnswers[step.id] === o.v ? ' selected' : '';
      html += '<div class="wiz-card' + sel + '" data-step="' + step.id + '" data-value="' + esc(o.v) + '" tabindex="0" role="button" aria-pressed="' + (sel ? 'true' : 'false') + '">'
            + '<span class="wiz-check">\u2713</span>'
            + '<div class="wiz-card-title">' + esc(o.v) + '</div>'
            + (o.d ? '<div class="wiz-card-desc">' + esc(o.d) + '</div>' : '')
            + '</div>';
    });
    html += '</div>';
  }
  else if(step.type === 'date'){
    html += '<input type="date" id="wiz-' + step.id + '" aria-label="' + esc(step.q) + '" value="' + esc(wizAnswers[step.id] || '') + '">';
  }
  else if(step.type === 'select'){
    html += '<select id="wiz-' + step.id + '" aria-label="' + esc(step.q) + '">';
    html += '<option value="">Please Choose...</option>';
    step.options.forEach(function(o){
      var sel = wizAnswers[step.id] === o ? ' selected' : '';
      html += '<option value="' + esc(o) + '"' + sel + '>' + esc(o) + '</option>';
    });
    html += '</select>';
  }
  else if(step.type === 'slider'){
    var val = wizAnswers[step.id] !== undefined ? wizAnswers[step.id] : step.def;
    html += '<div class="wiz-slider-value" id="wiz-' + step.id + '-out">' + val + '</div>';
    html += '<div class="wiz-slider-row">'
          + '<span class="wiz-slider-bound">' + step.min + '</span>'
          + '<input type="range" id="wiz-' + step.id + '" min="' + step.min + '" max="' + step.max + '" value="' + val + '" aria-label="' + esc(step.q) + '">'
          + '<span class="wiz-slider-bound">' + step.max + '</span>'
          + '</div>';
  }
  else if(step.type === 'contact'){
    html += '<div class="wiz-grid-2">'
          + field('firstName','First Name','text')
          + field('lastName','Last Name','text')
          + field('email','Email','email')
          + field('phone','Phone','tel')
          + '</div>'
          + '<label class="wiz-consent">'
          + '<input type="checkbox" id="wiz-consent"' + (wizAnswers.consent ? ' checked' : '') + '>'
          + '<span>By entering my details, I consent to one of the staff at AMK Lawyers contacting me to discuss a potential claim in a no obligation free consultation.</span>'
          + '</label>';
  }
  return html;
}

function field(id,label,type){
  return '<div class="wiz-field">'
       + '<span class="wiz-field-label">' + label + '</span>'
       + '<input type="' + type + '" id="wiz-' + id + '" value="' + esc(wizAnswers[id] || '') + '" aria-label="' + label + '">'
       + '</div>';
}

function bindFields(step){
  if(step.type === 'cards'){
    document.querySelectorAll('.wiz-card[data-step="' + step.id + '"]').forEach(function(card){
      function pick(){
        wizAnswers[step.id] = card.getAttribute('data-value');
        /* clear stale sub-answers when the controlling answer changes */
        if(step.sub && !step.sub.showIf(wizAnswers)){ delete wizAnswers[step.sub.id]; }
        /* Verdict tags on court case rows */
document.querySelectorAll('.case-row').forEach(function(row){
  var amt = row.querySelector('.case-amount');
  var left = row.children[0];
  if(!amt || !left) return;
  var t = amt.textContent;
  var lost = /overturned|failed|dismissed|set aside/i.test(t);
  var won = t.trim().charAt(0) === '$' && !lost;
  var chip = document.createElement('span');
  chip.className = 'verdict ' + (won ? 'won' : 'lost');
  chip.textContent = won ? 'Damages Awarded' : 'No Award';
  left.insertBefore(chip, left.firstChild);
});

function scrollReviews(dir){
  var strip = document.getElementById('reviewsStrip');
  if(strip){ strip.scrollBy({left: dir * 380, behavior:'smooth'}); }
}

if(document.getElementById("wizBody")){ wizRender(); }
      }
      card.addEventListener('click', pick);
      card.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); pick(); } });
    });
  }
  else if(step.type === 'date' || step.type === 'select'){
    var el = document.getElementById('wiz-' + step.id);
    if(el){ el.addEventListener('change', function(){ wizAnswers[step.id] = el.value; }); }
  }
  else if(step.type === 'slider'){
    var sl = document.getElementById('wiz-' + step.id);
    var out = document.getElementById('wiz-' + step.id + '-out');
    wizAnswers[step.id] = parseInt(sl.value, 10);
    sl.addEventListener('input', function(){
      wizAnswers[step.id] = parseInt(sl.value, 10);
      out.textContent = sl.value;
    });
  }
  else if(step.type === 'contact'){
    ['firstName','lastName','email','phone'].forEach(function(id){
      var el = document.getElementById('wiz-' + id);
      el.addEventListener('input', function(){ wizAnswers[id] = el.value; });
    });
    var c = document.getElementById('wiz-consent');
    c.addEventListener('change', function(){ wizAnswers.consent = c.checked; });
  }
}

function wizValidate(step){
  if(step.type === 'cards'){
    if(!wizAnswers[step.id]){ return false; }
    if(step.sub && step.sub.showIf(wizAnswers) && !wizAnswers[step.sub.id]){ return false; }
    return true;
  }
  if(step.type === 'slider'){ return wizAnswers[step.id] !== undefined; }
  if(step.type === 'contact'){
    var ok = ['firstName','lastName','email','phone'].every(function(id){
      return wizAnswers[id] && String(wizAnswers[id]).trim() !== '';
    });
    return ok && wizAnswers.consent === true;
  }
  return true;
}

function wizShowError(){ document.getElementById('wizError').hidden = false; }
function wizHideError(){ document.getElementById('wizError').hidden = true; }

function wizNext(){
  if(wizDone){ return; }
  var steps = wizVisible();
  var step = steps[wizIndex];
  if(!wizValidate(step)){ wizShowError(); return; }
  if(step.type === 'contact'){ wizFinish(); return; }
  wizIndex++;
  function scrollReviews(dir){
  var strip = document.getElementById('reviewsStrip');
  if(strip){ strip.scrollBy({left: dir * 380, behavior:'smooth'}); }
}

wizRender();
}

function wizBack(){
  if(wizDone || wizIndex === 0){ return; }
  wizIndex--;
  function scrollReviews(dir){
  var strip = document.getElementById('reviewsStrip');
  if(strip){ strip.scrollBy({left: dir * 380, behavior:'smooth'}); }
}

wizRender();
}

function wizFinish(){
  wizDone = true;
  document.getElementById('wizProgress').textContent = 'Free Claim Check \u00B7 Complete';
  document.getElementById('wizBody').innerHTML =
    '<div class="wiz-done-title">Thanks, ' + esc(wizAnswers.firstName) + ' \u2014 your claim check is in.</div>'
    + '<p class="wiz-done-body">One of our team will review your answers and be in touch shortly to talk through what your claim could be worth. It\u2019s free, and there\u2019s no obligation.</p>';
  document.getElementById('wizNav').style.display = 'none';
  document.getElementById('wizError').hidden = true;
}

function scrollReviews(dir){
  var strip = document.getElementById('reviewsStrip');
  if(strip){ strip.scrollBy({left: dir * 380, behavior:'smooth'}); }
}

if(document.getElementById("wizBody")){ wizRender(); }


/* Hero rotating tagline */
(function(){
  var el = document.getElementById('heroRotator');
  if(!el) return;
  var phrases = ['No Win, No Fee*', 'Free Consultation', 'Free Online Claim Check'];
  var i = 0;
  setInterval(function(){
    el.classList.add('swap');
    setTimeout(function(){
      i = (i + 1) % phrases.length;
      el.textContent = phrases[i];
      el.classList.remove('swap');
    }, 350);
  }, 2800);
})();


/* Lawyer contact form (article sidebar) */
function submitLawyerContact(e){
  e.preventDefault();
  var form = e.target;
  var thanks = document.getElementById('contactThanks');
  if(thanks){ thanks.classList.add('show'); }
  form.querySelectorAll('input,textarea,button').forEach(function(el){ el.style.display='none'; });
  if(thanks){ thanks.style.display='block'; }
  return false;
}
