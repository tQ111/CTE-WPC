// ── CONFIG ──
const API_BASE = 'https://qbank-api.collegeboard.org/msreportingquestionbank-prod/questionbank/digital';

const DOMAINS = {
  math: [
    { id: 'H', label: 'Algebra' },
    { id: 'P', label: 'Advanced Math' },
    { id: 'Q', label: 'Problem Solving' },
    { id: 'S', label: 'Geometry & Trig' },
  ],
  rw: [
    { id: 'INI', label: 'Information & Ideas' },
    { id: 'CAS', label: 'Craft & Structure' },
    { id: 'EOI', label: 'Expression of Ideas' },
    { id: 'SEC', label: 'Standard English' },
  ]
};

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

// ── STATE ──
const state = {
  section: 'math',
  activeDiffs: new Set(['E', 'M', 'H']),
  activeDomains: new Set(),
  questions: [],
  currentIdx: null,
  currentQuestion: null,
  selectedChoice: null,
  submitted: false,
  loadingQuestion: false,
};

// ── KATEX ──
function initKatex() {
  // called by KaTeX auto-render onload
}

function renderMath(el) {
  if (window.renderMathInElement) {
    renderMathInElement(el, {
      delimiters: [
        { left: '\\(', right: '\\)', display: false },
        { left: '\\[', right: '\\]', display: true },
        { left: '$',   right: '$',   display: false },
      ],
      throwOnError: false,
    });
  }
}

// ── INIT ──
function init() {
  DOMAINS.math.forEach(d => state.activeDomains.add(d.id));
  renderDomainFilters();
}

// ── SECTION TOGGLE ──
function setSection(s, event) {
  state.section = s;
  state.activeDomains = new Set();
  DOMAINS[s].forEach(d => state.activeDomains.add(d.id));
  state.questions = [];
  state.currentIdx = null;
  state.currentQuestion = null;

  document.querySelectorAll('.section-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');

  renderDomainFilters();
  renderQList();
  renderViewer();
  document.getElementById('qCounter').textContent = 'No questions loaded';
}

// ── DOMAIN FILTERS ──
function renderDomainFilters() {
  const container = document.getElementById('domainFilters');
  container.innerHTML = '';
  DOMAINS[state.section].forEach(d => {
    const btn = document.createElement('button');
    btn.className = 'pill' + (state.activeDomains.has(d.id) ? ' active' : '');
    btn.textContent = d.label;
    btn.onclick = () => toggleDomain(btn, d.id);
    container.appendChild(btn);
  });
}

function toggleDomain(btn, id) {
  if (state.activeDomains.has(id)) {
    state.activeDomains.delete(id);
    btn.classList.remove('active');
  } else {
    state.activeDomains.add(id);
    btn.classList.add('active');
  }
}

function toggleDiff(btn) {
  const d = btn.dataset.diff;
  if (state.activeDiffs.has(d)) {
    state.activeDiffs.delete(d);
    btn.classList.remove('active');
  } else {
    state.activeDiffs.add(d);
    btn.classList.add('active');
  }
}

// ── LOAD QUESTIONS ──
async function loadQuestions() {
  if (state.activeDomains.size === 0) { alert('Select at least one domain.'); return; }
  if (state.activeDiffs.size === 0)   { alert('Select at least one difficulty.'); return; }

  const btn = document.getElementById('loadBtn');
  btn.disabled = true;
  btn.textContent = 'Loading…';

  const body = document.getElementById('qlistBody');
  body.innerHTML = '<div class="loading-state"><div class="spinner"></div><span>Fetching questions…</span></div>';

  try {
    const asmtEventId = 99; // SAT
    const test = state.section === 'math' ? 2 : 1;

    const fetches = [...state.activeDomains].map(domain =>
      fetch(`${API_BASE}/get-questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ asmtEventId, test, domain })
      }).then(r => r.json())
    );

    const results = await Promise.all(fetches);
    let all = results.flat();

    // filter by selected difficulties
    all = all.filter(q => state.activeDiffs.has(q.difficulty));

    // shuffle
    all = all.sort(() => Math.random() - 0.5);

    state.questions = all;
    state.currentIdx = null;
    state.currentQuestion = null;

    renderQList();
    renderViewer();
    document.getElementById('qCounter').textContent = `${all.length} question${all.length !== 1 ? 's' : ''}`;

  } catch (err) {
    body.innerHTML = `<div class="error-banner">Failed to load questions. Check your connection and try again.<br><small>${err.message}</small></div>`;
    document.getElementById('qCounter').textContent = 'Error';
  }

  btn.disabled = false;
  btn.textContent = 'Load Questions';
}

// ── RENDER QUESTION LIST ──
function renderQList() {
  const body = document.getElementById('qlistBody');
  if (state.questions.length === 0) {
    body.innerHTML = '<div class="qlist-empty">No questions loaded yet.</div>';
    return;
  }
  body.innerHTML = '';
  state.questions.forEach((q, i) => {
    const item = document.createElement('div');
    item.className = 'qitem' + (state.currentIdx === i ? ' active' : '');
    item.id = `qitem-${i}`;
    item.onclick = () => selectQuestion(i);

    const domainLabel = getDomainLabel(q.primary_class_cd || q.primaryClassCd);
    const skillShort = (q.skill_desc || q.skillDesc || domainLabel || '—').split(' ').slice(0, 4).join(' ');

    item.innerHTML = `
      <div class="qitem-num">${i + 1}</div>
      <div class="qitem-info">
        <div class="qitem-skill">${skillShort}</div>
        <div class="qitem-meta">
          <span class="diff-badge diff-${q.difficulty}">${diffLabel(q.difficulty)}</span>
        </div>
      </div>
    `;
    body.appendChild(item);
  });
}

function getDomainLabel(cd) {
  const all = [...DOMAINS.math, ...DOMAINS.rw];
  const found = all.find(d => d.id === cd);
  return found ? found.label : (cd || '');
}

function diffLabel(d) {
  return d === 'E' ? 'Easy' : d === 'M' ? 'Medium' : 'Hard';
}

// ── SELECT QUESTION ──
async function selectQuestion(idx) {
  if (state.loadingQuestion) return;

  state.currentIdx = idx;
  state.selectedChoice = null;
  state.submitted = false;
  state.currentQuestion = null;

  document.querySelectorAll('.qitem').forEach((el, i) => {
    el.classList.toggle('active', i === idx);
  });

  renderViewer('loading');
  state.loadingQuestion = true;

  try {
    const q = state.questions[idx];
    const externalid = q.external_id || q.externalId || q.uId;

    const res = await fetch(`${API_BASE}/get-question`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ externalid })
    });

    const data = await res.json();
    state.currentQuestion = data;
    renderViewer();

  } catch (err) {
    renderViewer('error', err.message);
  }

  state.loadingQuestion = false;
}

// ── RENDER VIEWER ──
function renderViewer(loadState, errMsg) {
  const viewer = document.getElementById('viewer');

  if (state.currentIdx === null) {
    viewer.innerHTML = `
      <div class="viewer-empty">
        <div class="viewer-empty-icon">📖</div>
        <div class="viewer-empty-text">Select a question to begin</div>
      </div>`;
    return;
  }

  if (loadState === 'loading') {
    viewer.innerHTML = `<div class="loading-state"><div class="spinner"></div><span>Loading question…</span></div>`;
    return;
  }

  if (loadState === 'error') {
    viewer.innerHTML = `<div class="error-banner">Failed to load question. ${errMsg || ''}</div>`;
    return;
  }

  const q = state.currentQuestion;
  const meta = state.questions[state.currentIdx];
  if (!q) return;

  const stemHTML = q.stem || '';
  const keys = q.keys || [];

  viewer.innerHTML = '';
  const qview = document.createElement('div');
  qview.className = 'question-view';

  const leftPanel  = document.createElement('div');
  leftPanel.className = 'passage-panel';

  const rightPanel = document.createElement('div');
  rightPanel.className = 'answer-panel';

  // determine layout: long stem goes on left as passage, short stays left too
  const textLen = document.createElement('div');
  textLen.innerHTML = stemHTML;
  const charCount = textLen.textContent.length;

  if (charCount > 400) {
    leftPanel.innerHTML = `<div class="passage-label">Passage</div><div class="passage-text">${stemHTML}</div>`;
    rightPanel.innerHTML = `<div class="question-stem"><strong>Question ${state.currentIdx + 1}</strong></div>`;
  } else {
    leftPanel.innerHTML = `
      <div class="passage-label">Question ${state.currentIdx + 1} of ${state.questions.length}</div>
      <div class="passage-text">${stemHTML}</div>`;
    rightPanel.innerHTML = '';
  }

  // domain + difficulty badge
  const infoEl = document.createElement('div');
  infoEl.style.cssText = 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;';
  const skillName   = meta.skill_desc || meta.skillDesc || '';
  const domainName  = getDomainLabel(meta.primary_class_cd || meta.primaryClassCd);
  infoEl.innerHTML  = `
    <span class="diff-badge diff-${meta.difficulty}">${diffLabel(meta.difficulty)}</span>
    <span style="font-size:12px;color:var(--text-light);">${domainName}${skillName ? ' · ' + skillName : ''}</span>
  `;
  rightPanel.appendChild(infoEl);

  // answer choices
  const choicesList = document.createElement('div');
  choicesList.className = 'choices-list';
  choicesList.id = 'choicesList';

  keys.forEach((key, i) => {
    const choiceEl = document.createElement('div');
    choiceEl.className = 'choice';
    choiceEl.id = `choice-${i}`;
    choiceEl.onclick = () => selectChoice(i);

    const keyContent = typeof key === 'object'
      ? (key.body || key.content || key.text || JSON.stringify(key))
      : key;

    choiceEl.innerHTML = `
      <div class="choice-letter">${LETTERS[i] || i}</div>
      <div class="choice-text">${keyContent}</div>
      <div class="choice-icon" id="choiceIcon-${i}"></div>
    `;
    choicesList.appendChild(choiceEl);
  });

  rightPanel.appendChild(choicesList);

  // submit button
  const submitRow = document.createElement('div');
  submitRow.className = 'submit-row';
  submitRow.id = 'submitRow';
  submitRow.innerHTML = `<button class="submit-btn" id="submitBtn" onclick="submitAnswer()" disabled>Submit</button>`;
  rightPanel.appendChild(submitRow);

  // rationale placeholder
  const rationaleEl = document.createElement('div');
  rationaleEl.id = 'rationaleBox';
  rightPanel.appendChild(rationaleEl);

  qview.appendChild(leftPanel);
  qview.appendChild(rightPanel);
  viewer.appendChild(qview);

  renderMath(viewer);
}

// ── SELECT CHOICE ──
function selectChoice(idx) {
  if (state.submitted) return;
  state.selectedChoice = idx;

  document.querySelectorAll('.choice').forEach((el, i) => {
    el.classList.toggle('selected', i === idx);
  });

  document.getElementById('submitBtn').disabled = false;
}

// ── SUBMIT ──
function submitAnswer() {
  if (state.selectedChoice === null || state.submitted) return;
  state.submitted = true;

  const q = state.currentQuestion;
  const correctAnswers = q.correct_answer || [];
  const keys = q.keys || [];

  // find correct indices
  const correctIndices = new Set();
  keys.forEach((key, i) => {
    const keyId   = typeof key === 'object' ? String(key.id || key.key_id || '') : '';
    const keyBody = typeof key === 'object' ? (key.body || key.content || key.text || '') : key;
    if (
      correctAnswers.includes(keyId) ||
      correctAnswers.includes(keyBody) ||
      correctAnswers.includes(String(i))
    ) {
      correctIndices.add(i);
    }
  });

  const isCorrect = correctIndices.has(state.selectedChoice);

  // style each choice
  document.querySelectorAll('.choice').forEach((el, i) => {
    el.classList.add('disabled');
    el.classList.remove('selected');
    if (correctIndices.has(i)) {
      el.classList.add('correct');
      document.getElementById(`choiceIcon-${i}`).textContent = '✓';
    } else if (i === state.selectedChoice && !isCorrect) {
      el.classList.add('incorrect');
      document.getElementById(`choiceIcon-${i}`).textContent = '✗';
    }
  });

  // swap submit → next
  document.getElementById('submitRow').innerHTML = `
    <button class="next-btn" onclick="nextQuestion()">Next →</button>
  `;

  // show rationale
  const rationaleBox = document.getElementById('rationaleBox');
  rationaleBox.innerHTML = `
    <div class="rationale-box">
      <div class="rationale-header">Explanation</div>
      <div class="rationale-result ${isCorrect ? 'correct' : 'incorrect'}">
        ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
      </div>
      <div class="rationale-content">${q.rationale || '<p>No explanation available.</p>'}</div>
    </div>
  `;

  renderMath(rationaleBox);
}

// ── NEXT QUESTION ──
function nextQuestion() {
  if (state.currentIdx < state.questions.length - 1) {
    const next = state.currentIdx + 1;
    selectQuestion(next);
    const el = document.getElementById(`qitem-${next}`);
    if (el) el.scrollIntoView({ block: 'nearest' });
  }
}

// ── START ──
init();