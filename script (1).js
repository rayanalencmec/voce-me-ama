const noBtn = document.getElementById('no-btn');
const yesBtn = document.getElementById('yes-btn');
const mainCard = document.getElementById('main-card');
const resultCard = document.getElementById('result-card');
const hint = document.getElementById('hint');
const bgHearts = document.getElementById('bg-hearts');

const frases = [
  'Tem certeza? 🥺',
  'Pensa direitinho...',
  'Esse botão é bem escorregadio 😅',
  'Você sabe que quer clicar no Sim 💕',
  'Não adianta fugir!',
  'Os gatinhos estão esperando... 🐱'
];

let yesScale = 1;
let tentativas = 0;
let moved = false;
let lastX = 0, lastY = 0;

/* ---------- Corações ao fundo ---------- */
function criarCoracoesDeFundo(qtd = 14) {
  for (let i = 0; i < qtd; i++) {
    const s = document.createElement('span');
    s.textContent = '❤';
    s.style.left = `${Math.random() * 100}%`;
    s.style.fontSize = `${12 + Math.random() * 18}px`;
    s.style.animationDuration = `${12 + Math.random() * 10}s`;
    s.style.animationDelay = `${-Math.random() * 20}s`;
    s.style.setProperty('--dx', `${(Math.random() - 0.5) * 80}px`);
    bgHearts.appendChild(s);
  }
}
criarCoracoesDeFundo();

/* ---------- Troca suave da frase ---------- */
function mostrarFrase(texto) {
  hint.classList.add('out');
  setTimeout(() => {
    hint.textContent = texto;
    hint.classList.remove('out');
  }, 300);
}

/* ---------- Botão "Não" foge suavemente ---------- */
function prepararFuga() {
  const r = noBtn.getBoundingClientRect();

  // Mantém o espaço do botão dentro do cartão
  const espaco = document.createElement('div');
  espaco.style.width = `${r.width}px`;
  espaco.style.height = `${r.height}px`;
  noBtn.parentNode.insertBefore(espaco, noBtn);

  // Vai para o <body> para não ser afetado pelas transições do cartão
  document.body.appendChild(noBtn);
  noBtn.style.position = 'fixed';
  noBtn.style.margin = '0';
  noBtn.style.left = `${r.left}px`;
  noBtn.style.top = `${r.top}px`;
  noBtn.style.transition =
    'left .7s cubic-bezier(.22,1,.36,1), top .7s cubic-bezier(.22,1,.36,1), opacity .5s ease';
  lastX = r.left;
  lastY = r.top;
  void noBtn.offsetWidth; // força o navegador a registrar a posição inicial
  moved = true;
}

function moverBotao() {
  if (!moved) prepararFuga();

  const margem = 16;
  const maxX = window.innerWidth - noBtn.offsetWidth - margem;
  const maxY = window.innerHeight - noBtn.offsetHeight - margem;

  let x, y, tent = 0;
  do {
    x = margem + Math.random() * Math.max(0, maxX - margem);
    y = margem + Math.random() * Math.max(0, maxY - margem);
    tent++;
  } while (Math.hypot(x - lastX, y - lastY) < 140 && tent < 12);

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  lastX = x;
  lastY = y;

  // Botão "Sim" cresce devagarinho
  yesScale = Math.min(yesScale + 0.12, 2);
  yesBtn.style.transform = `scale(${yesScale})`;

  mostrarFrase(frases[tentativas % frases.length]);
  tentativas++;
}

noBtn.addEventListener('mouseover', moverBotao);
noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moverBotao(); }, { passive: false });
noBtn.addEventListener('click', (e) => { e.preventDefault(); moverBotao(); });

/* ---------- Clicou em "Sim" ---------- */
yesBtn.addEventListener('click', () => {
  noBtn.classList.add('gone');
  mainCard.classList.add('hidden');

  setTimeout(() => {
    resultCard.classList.remove('hidden');
    criarCoracoesDeFundo(10);
    noBtn.remove();
  }, 450);
}, { once: true });
