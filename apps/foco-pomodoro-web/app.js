const timerEl = document.getElementById('timer');
const statusEl = document.getElementById('status');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const modeButtons = document.querySelectorAll('.mode-btn');

const MODES = {
  focus: { seconds: 25 * 60, label: 'Foco' },
  short: { seconds: 5 * 60, label: 'Pausa curta' },
  long: { seconds: 15 * 60, label: 'Pausa longa' }
};

let currentMode = 'focus';
let remaining = MODES[currentMode].seconds;
let interval = null;

function renderTimer() {
  const min = String(Math.floor(remaining / 60)).padStart(2, '0');
  const sec = String(remaining % 60).padStart(2, '0');
  timerEl.textContent = `${min}:${sec}`;
}

function updateStatus(text) {
  statusEl.textContent = text;
}

function switchMode(mode) {
  currentMode = mode;
  remaining = MODES[mode].seconds;
  pauseTimer();
  renderTimer();
  updateStatus(`Modo selecionado: ${MODES[mode].label}.`);

  modeButtons.forEach((button) => {
    const selected = button.dataset.mode === mode;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}

function startTimer() {
  if (interval) return;
  updateStatus(`${MODES[currentMode].label} em andamento...`);

  interval = setInterval(() => {
    remaining -= 1;
    renderTimer();

    if (remaining <= 0) {
      clearInterval(interval);
      interval = null;
      updateStatus(`Ciclo ${MODES[currentMode].label.toLowerCase()} concluído.`);
      alert('Ciclo concluído!');
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  interval = null;
  updateStatus('Pausado. Clique em Iniciar para continuar.');
}

function resetTimer() {
  pauseTimer();
  remaining = MODES[currentMode].seconds;
  renderTimer();
  updateStatus(`Tempo resetado para ${MODES[currentMode].label}.`);
}

modeButtons.forEach((button) => {
  button.addEventListener('click', () => switchMode(button.dataset.mode));
});

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = taskInput.value.trim();
  if (!value) return;

  const li = document.createElement('li');
  const span = document.createElement('span');
  span.textContent = value;

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const doneBtn = document.createElement('button');
  doneBtn.type = 'button';
  doneBtn.textContent = 'Concluir';
  doneBtn.addEventListener('click', () => li.classList.toggle('done'));

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.textContent = 'Remover';
  removeBtn.addEventListener('click', () => li.remove());

  actions.append(doneBtn, removeBtn);
  li.append(span, actions);
  taskList.appendChild(li);
  taskInput.value = '';
  taskInput.focus();
});

renderTimer();
updateStatus('Pronto para iniciar um ciclo de foco.');
