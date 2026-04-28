const genders = { c: 'male', t: 'male' };
let goalOffset = 0;

function goTo(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function toggleMenu() {
  const links = document.getElementById('nav-links');
  const btn   = document.getElementById('hamburger-btn');
  links.classList.toggle('open');
  btn.classList.toggle('open');
}

function navGo(id) {
  const links = document.getElementById('nav-links');
  const btn   = document.getElementById('hamburger-btn');
  links.classList.remove('open');
  btn.classList.remove('open');
  goTo(id);
}

function toggleTheme() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  if (isLight) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('ciq-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('ciq-theme', 'light');
  }
}

function showTool(name, btn) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tool-tab').forEach(b => b.classList.remove('active'));
  document.getElementById('tool-' + name).classList.add('active');
  btn.classList.add('active');
}

function setGender(g, btn, prefix) {
  genders[prefix] = g;
  btn.parentElement.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function setGoal(offset, btn) {
  goalOffset = offset;
  document.querySelectorAll('.goal-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function bmiInfo(bmi) {
  if (bmi < 18.5) return { cat: 'Underweight', color: '#60A5FA', pos: Math.min((bmi / 18.5) * 20, 19) };
  if (bmi < 25)   return { cat: 'Normal weight', color: '#34D399', pos: 20 + ((bmi - 18.5) / 6.5) * 30 };
  if (bmi < 30)   return { cat: 'Overweight', color: '#FBBF24', pos: 50 + ((bmi - 25) / 5) * 25 };
  return               { cat: 'Obese', color: '#F87171', pos: Math.min(75 + ((bmi - 30) / 10) * 25, 97) };
}

function bmr(gender, w, h, a) {
  return gender === 'male'
    ? 10 * w + 6.25 * h - 5 * a + 5
    : 10 * w + 6.25 * h - 5 * a - 161;
}

function calcCalorie() {
  const age = +document.getElementById('c-age').value;
  const h   = +document.getElementById('c-height').value;
  const w   = +document.getElementById('c-weight').value;
  const act = +document.getElementById('c-activity').value;
  if (!age || !h || !w) { showToast('Please fill in all fields.'); return; }
  if (age < 10 || age > 120) { showToast('Please enter a valid age between 10 and 120.'); return; }

  const tdee = Math.round(bmr(genders.c, w, h, age) * act + goalOffset);
  const pG   = Math.round(tdee * 0.30 / 4);
  const cG   = Math.round(tdee * 0.45 / 4);
  const fG   = Math.round(tdee * 0.25 / 9);
  const bmiV = (w / ((h / 100) ** 2)).toFixed(1);
  const { cat, color, pos } = bmiInfo(+bmiV);

  document.getElementById('c-num').textContent     = tdee.toLocaleString();
  document.getElementById('c-pp').textContent      = '30%';
  document.getElementById('c-pg').textContent      = pG + ' g';
  document.getElementById('c-cp').textContent      = '45%';
  document.getElementById('c-cg').textContent      = cG + ' g';
  document.getElementById('c-fp').textContent      = '25%';
  document.getElementById('c-fg').textContent      = fG + ' g';
  document.getElementById('c-bmi').textContent     = bmiV;
  document.getElementById('c-bmi').style.color     = color;
  document.getElementById('c-bmi-cat').textContent = cat;
  document.getElementById('c-bmi-cat').style.color = color;
  document.getElementById('c-bmi-marker').style.left = pos + '%';

  const r = document.getElementById('c-results');
  r.classList.add('visible');
  r.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function calcBMI() {
  const h = +document.getElementById('b-height').value;
  const w = +document.getElementById('b-weight').value;
  if (!h || !w) { showToast('Please enter height and weight.'); return; }

  const bmiV = (w / ((h / 100) ** 2)).toFixed(1);
  const { cat, color, pos } = bmiInfo(+bmiV);
  const hMin = (18.5 * (h / 100) ** 2).toFixed(1);
  const hMax = (24.9 * (h / 100) ** 2).toFixed(1);

  document.getElementById('b-num').textContent     = bmiV;
  document.getElementById('b-num').style.color     = color;
  document.getElementById('b-cat').textContent     = cat;
  document.getElementById('b-cat').style.color     = color;
  document.getElementById('b-marker').style.left   = pos + '%';
  document.getElementById('b-range').textContent   = hMin + '–' + hMax + ' kg';

  const r = document.getElementById('b-results');
  r.classList.add('visible');
  r.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function calcTDEE() {
  const age = +document.getElementById('t-age').value;
  const h   = +document.getElementById('t-height').value;
  const w   = +document.getElementById('t-weight').value;
  const act = +document.getElementById('t-activity').value;
  if (!age || !h || !w) { showToast('Please fill in all fields.'); return; }

  const b    = Math.round(bmr(genders.t, w, h, age));
  const tdee = Math.round(b * act);

  document.getElementById('t-bmr').textContent  = b.toLocaleString();
  document.getElementById('t-tdee').textContent = tdee.toLocaleString();
  document.getElementById('t-loss').textContent = (tdee - 500).toLocaleString();
  document.getElementById('t-gain').textContent = (tdee + 300).toLocaleString();

  const r = document.getElementById('t-results');
  r.classList.add('visible');
  r.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

const sliders   = { p: 30, c: 45, f: 25 };
const sliderIds = { p: 'rp', c: 'rc', f: 'rf' };
const labelIds  = { p: 'lp', c: 'lc', f: 'lf' };

function syncSliders(changed) {
  sliders[changed] = +document.getElementById(sliderIds[changed]).value;
  const others = ['p', 'c', 'f'].filter(k => k !== changed);
  const remaining = 100 - sliders[changed];
  const a = others[0], b = others[1];
  const sumOthers = sliders[a] + sliders[b];
  if (sumOthers > 0) {
    sliders[a] = Math.max(5, Math.round(remaining * (sliders[a] / sumOthers)));
    sliders[b] = Math.max(5, 100 - sliders[changed] - sliders[a]);
  } else {
    sliders[a] = Math.max(5, Math.floor(remaining / 2));
    sliders[b] = Math.max(5, remaining - sliders[a]);
  }
  ['p', 'c', 'f'].forEach(k => {
    document.getElementById(sliderIds[k]).value = sliders[k];
    document.getElementById(labelIds[k]).textContent = sliders[k] + '%';
  });
  const total = sliders.p + sliders.c + sliders.f;
  document.getElementById('m-warn').textContent =
    total !== 100 ? `Total: ${total}% — sliders will auto-balance` : '';
  updateMacroResults();
}

function updateMacroResults() {
  const cals = +document.getElementById('m-calories').value;
  if (!cals) {
    ['m-pg', 'm-cg', 'm-fg'].forEach(id => document.getElementById(id).textContent = '—');
    return;
  }
  document.getElementById('m-pg').textContent = Math.round(cals * sliders.p / 100 / 4) + ' g';
  document.getElementById('m-cg').textContent = Math.round(cals * sliders.c / 100 / 4) + ' g';
  document.getElementById('m-fg').textContent = Math.round(cals * sliders.f / 100 / 9) + ' g';
}

function filterMeals(cat, btn) {
  document.querySelectorAll('.mfb').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.meal-card').forEach(card => {
    card.style.display = (cat === 'all' || card.dataset.cat.includes(cat)) ? '' : 'none';
  });
}

function showToast(msg) {
  const el = document.createElement('div');
  el.textContent = msg;
  const s = getComputedStyle(document.documentElement);
  Object.assign(el.style, {
    position: 'fixed', top: '76px', left: '50%', transform: 'translateX(-50%)',
    background: s.getPropertyValue('--card').trim(),
    border: '1px solid ' + s.getPropertyValue('--accent').trim(),
    color: s.getPropertyValue('--text').trim(),
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.84rem', fontWeight: '500',
    padding: '12px 22px', borderRadius: '10px', zIndex: '9999',
    boxShadow: '0 8px 32px rgba(0,0,0,0.25)', transition: 'opacity 0.25s',
    whiteSpace: 'nowrap'
  });
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 250); }, 2400);
}
