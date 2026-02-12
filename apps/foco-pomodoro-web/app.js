const timerEl = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

const POMODORO_SECONDS = 25 * 60;
let remaining = POMODORO_SECONDS;
let interval = null;

function renderTimer() {
  const min = String(Math.floor(remaining / 60)).padStart(2, '0');
  const sec = String(remaining % 60).padStart(2, '0');
  timerEl.textContent = `${min}:${sec}`;
}

function startTimer() {
  if (interval) return;
  interval = setInterval(() => {
    remaining -= 1;
    renderTimer();

    if (remaining <= 0) {
      clearInterval(interval);
      interval = null;
      alert('Pomodoro concluído! Faça uma pausa de 5 minutos.');
      remaining = POMODORO_SECONDS;
      renderTimer();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  interval = null;
}

function resetTimer() {
  pauseTimer();
  remaining = POMODORO_SECONDS;
  renderTimer();
}

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

  const doneBtn = document.createElement('button');
  doneBtn.textContent = 'Concluir';
  doneBtn.addEventListener('click', () => li.classList.toggle('done'));

  li.append(span, doneBtn);
  taskList.appendChild(li);
  taskInput.value = '';
});

renderTimer();
