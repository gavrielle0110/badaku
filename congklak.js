/* Toggle Popup Function (untuk popup-menu & popup-story) */
function togglePopup(popupElement) {
  if (popupElement.classList.contains('show')) {
    popupElement.classList.remove('show');
    popupElement.classList.add('close');
    setTimeout(() => {
      popupElement.style.display = 'none';
      popupElement.classList.remove('close');
    }, 800);
  } else {
    popupElement.style.display = 'block';
    popupElement.classList.remove('close');
    popupElement.classList.add('show');
  }
}

// Popup Menu
const settingBtn = document.getElementById('settingBtn');
const popupMenu = document.getElementById('popupMenu');
settingBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  togglePopup(popupMenu);
});
document.addEventListener('click', (e) => {
  if (!popupMenu.contains(e.target) && e.target !== settingBtn) {
    if (popupMenu.classList.contains('show')) {
      togglePopup(popupMenu);
    }
  }
});

// Popup Story
const startStoryBtn = document.getElementById('start_story');
const popupStory = document.getElementById('popupStory');
startStoryBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  togglePopup(popupStory);
});
document.addEventListener('click', (e) => {
  if (!popupStory.contains(e.target) && e.target !== startStoryBtn) {
    if (popupStory.classList.contains('show')) {
      togglePopup(popupStory);
    }
  }
});
// Pastikan elemen container sudah didefinisikan
// Referensi ke elemen-elemen utama
const homeSection = document.getElementById('homeSection');
const gameContainer = document.getElementById('congklakContainer');
const btnMenyerah = document.getElementById('btnMenyerah');
const btnKembali = document.getElementById('btnKembali');
let game = null; // Instance global game


// Fungsi Menyerah: re-init game Congklak (reset game)
function menyerahGame() {
  togglePopup(popupMenu); // Tutup popup menu
  // Re-inisialisasi game (reset state) tanpa mengubah logika game
  game = new Congklak();
}

// Fungsi Kembali: kembali ke tampilan landing (home) dengan animasi fade
function kembaliLanding() {
  togglePopup(popupMenu); // Tutup popup menu
  // Mulai animasi fade-out pada container game
  gameContainer.classList.add('fade-out');
  setTimeout(() => {
    // Sembunyikan container game dan hapus kelas fade-out
    gameContainer.style.display = 'none';
    gameContainer.classList.remove('fade-out');
    // Tampilkan kembali tampilan home dengan animasi fade-in
    homeSection.style.display = 'flex';
    homeSection.classList.add('fade-in');
    // Sembunyikan tombol Menyerah & Kembali
    btnMenyerah.style.display = 'none';
    btnKembali.style.display = 'none';
    setTimeout(() => {
      homeSection.classList.remove('fade-in');
    }, 500);
    // Hapus class "in-game" sehingga jika ada aturan khusus di CSS kembali ke default
    document.body.classList.remove('in-game');
  }, 500);
}

// Mulai game Congklak saat klik tombol MULAI dengan transisi fade
document.getElementById('startGameBtn').addEventListener('click', () => {
  // Mulai animasi fade-out pada tampilan home
  homeSection.classList.add('fade-out');
  setTimeout(() => {
    homeSection.style.display = 'none';
    homeSection.classList.remove('fade-out');
    // Tampilkan container game dengan animasi fade-in
    gameContainer.style.display = 'block';
    gameContainer.classList.add('fade-in');
    // Tambahkan class "in-game" ke body agar CSS khusus mode game bisa diterapkan (jika ada)
    document.body.classList.add('in-game');
    // Tampilkan tombol Menyerah & Kembali di popup menu
    btnMenyerah.style.display = 'block';
    btnKembali.style.display = 'block';
    // Inisialisasi game Congklak dan simpan instance global
    game = new Congklak();
    setTimeout(() => {
      gameContainer.classList.remove('fade-in');
    }, 500);
  }, 500);
});


// Event untuk membuka popup menu
document.getElementById("settingBtn").addEventListener("click", function() {
  document.getElementById("popupMenu").classList.toggle("active");
});

// Event untuk menutup popup jika klik di luar
document.addEventListener("click", function(event) {
  const menu = document.getElementById("popupMenu");
  if (!menu.contains(event.target) && event.target.id !== "settingBtn") {
      menu.classList.remove("active");
  }
});

// ===================== CLASS CONGKLAK & GAME LOGIC =====================
class Congklak {
  constructor() {
    this.playerHoles = new Array(7).fill(8);
    this.botHoles = new Array(7).fill(8);
    this.playerStore = 0;
    this.botStore = 0;
    this.currentPlayer = 0; // 0: Player, 1: Bot
    
    // Posisi acak tiap biji
    this.playerPositions = Array.from({ length: 7 }, () => []);
    this.botPositions = Array.from({ length: 7 }, () => []);
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 8; j++) {
        this.playerPositions[i].push(this.generateRandomPosition());
        this.botPositions[i].push(this.generateRandomPosition());
      }
    }
    
    this.renderBoard();
    this.updateIndicators();
    if (this.currentPlayer === 1) {
      this.botMove();
    }
  }
  
  generateRandomPosition() {
    return {
      x: Math.random() * 20 - 10,
      y: Math.random() * 20 - 10,
      rotation: Math.random() * 360
    };
  }
  
  updateIndicators() {
    const playerIndicator = document.getElementById('player-indicator');
    const botIndicator = document.getElementById('bot-indicator');
    playerIndicator.style.display = (this.currentPlayer === 0) ? 'block' : 'none';
    botIndicator.style.display = (this.currentPlayer === 1) ? 'block' : 'none';
  }
  
  async botMove() {
    const validMoves = [];
    for (let i = 0; i < 7; i++) {
      if (this.botHoles[i] > 0) validMoves.push(i);
    }
    if (validMoves.length === 0) return;
    await new Promise(resolve => setTimeout(resolve, 1000));
    const moveIndex = validMoves[Math.floor(Math.random() * validMoves.length)];
    await this.move("bot", moveIndex);
  }
  
  async move(side, index) {
    if (this.currentPlayer === 0 && side !== "player") return;
    if (this.currentPlayer === 1 && side !== "bot") return;

    let seeds;
    let movingPositions;
    if (side === "player") {
        if (this.playerHoles[index] === 0) return;
        seeds = this.playerHoles[index];
        this.playerHoles[index] = 0;
        movingPositions = this.playerPositions[index].slice();
        this.playerPositions[index] = [];
    } else {
        if (this.botHoles[index] === 0) return;
        seeds = this.botHoles[index];
        this.botHoles[index] = 0;
        movingPositions = this.botPositions[index].slice();
        this.botPositions[index] = [];
    }
    this.renderBoard();

    let lastPos = null;
    let continueTurn = true;

    while (seeds > 0) {
        let sequence = [];
        let startIndex = index + 1;
        let currentSide = side;

        while (seeds > 0) {
            for (let i = startIndex; i < 7; i++) {
                if (seeds === 0) break;
                sequence.push({ side: currentSide, index: i });
                seeds--;
            }
            if (seeds === 0) break;

            if ((currentSide === "player" && this.currentPlayer === 0) || (currentSide === "bot" && this.currentPlayer === 1)) {
                sequence.push({ side: currentSide + "Store" });
                seeds--;
            }

            if (seeds === 0) break;

            currentSide = (currentSide === "player") ? "bot" : "player";
            startIndex = 0;
        }

        while (sequence.length > 0) {
            lastPos = sequence.shift();
            await this.animateMove(side, index, lastPos);

            if (lastPos.side === "player") {
                this.playerHoles[lastPos.index]++;
                this.playerPositions[lastPos.index].push(this.generateRandomPosition());
            } else if (lastPos.side === "bot") {
                this.botHoles[lastPos.index]++;
                this.botPositions[lastPos.index].push(this.generateRandomPosition());
            } else if (lastPos.side === "playerStore") {
                this.playerStore++;
            } else if (lastPos.side === "botStore") {
                this.botStore++;
            }
            this.renderBoard();
        }

        // **Aturan 1: Jika biji terakhir jatuh di rumah sendiri, dapat giliran lagi**
        if (lastPos.side === "playerStore" && this.currentPlayer === 0) {
            continueTurn = true;
            break;
        } else if (lastPos.side === "botStore" && this.currentPlayer === 1) {
            continueTurn = true;
            break;
        }

        // **Aturan 2: Pencurian hanya berlaku di sisi pemain, bukan di sisi bot**
        if (lastPos.side === "player" && this.playerHoles[lastPos.index] === 1) {
            let oppositeIndex = 6 - lastPos.index;
            if (this.botHoles[oppositeIndex] > 0) {
                this.playerStore += this.botHoles[oppositeIndex]; // **Hanya mencuri biji lawan**
                this.botHoles[oppositeIndex] = 0;
                this.playerHoles[lastPos.index] = 0;
                this.botPositions[oppositeIndex] = [];
                this.playerPositions[lastPos.index] = [];
                this.renderBoard();
            }
        }

        // **Jika biji terakhir jatuh di sisi bot yang kosong, tidak ada pencurian, hanya berganti giliran**
        if (lastPos.side === "bot" && this.botHoles[lastPos.index] === 1) {
            continueTurn = false;
            break;
        }

        // Jika masih ada biji di lubang terakhir, lanjutkan penyebaran
        if (lastPos.side === "player" && this.playerHoles[lastPos.index] > 1) {
            index = lastPos.index;
            side = "player";
            seeds = this.playerHoles[index];
            this.playerHoles[index] = 0;
            this.playerPositions[index] = [];
        } else if (lastPos.side === "bot" && this.botHoles[lastPos.index] > 1) {
            index = lastPos.index;
            side = "bot";
            seeds = this.botHoles[index];
            this.botHoles[index] = 0;
            this.botPositions[index] = [];
        } else {
            continueTurn = false;
            break;
        }
    }

    // Cek apakah permainan selesai
    if (this.playerHoles.every(n => n === 0) || this.botHoles.every(n => n === 0)) {
        this.playerStore += this.playerHoles.reduce((a, b) => a + b, 0);
        this.botStore += this.botHoles.reduce((a, b) => a + b, 0);
        this.playerHoles.fill(0);
        this.botHoles.fill(0);
        this.playerPositions = Array.from({ length: 7 }, () => []);
        this.botPositions = Array.from({ length: 7 }, () => []);
        this.renderBoard();
        setTimeout(() => {
            let winMessage = this.playerStore > this.botStore ? "Selamat! Player Menang!" : this.playerStore < this.botStore ? "Bot Menang!" : "Permainan Seri!";
            showWinModal(winMessage);
        }, 500);
        return;
    }

    // Ganti giliran jika pemain tidak bisa lanjut
    if (!continueTurn) {
        this.currentPlayer = 1 - this.currentPlayer;
    }

    this.updateIndicators();

    if (this.currentPlayer === 1) {
        setTimeout(() => this.botMove(), 500);
    }
}

  
  async animateMove(fromSide, fromIndex, toPos) {
    return new Promise(resolve => {
      let fromElem = document.getElementById(fromSide === "player" ? `player-hole-${fromIndex}` : `bot-hole-${fromIndex}`);
      let toElem;
      if (toPos.side === "player") {
        toElem = document.getElementById(`player-hole-${toPos.index}`);
      } else if (toPos.side === "bot") {
        toElem = document.getElementById(`bot-hole-${toPos.index}`);
      } else if (toPos.side === "playerStore") {
        toElem = document.getElementById("player-store");
      } else {
        toElem = document.getElementById("bot-store");
      }
      if (!fromElem || !toElem) return resolve();
      
      let seedElem = fromElem.querySelector(".kuwuk");
      if (!seedElem) {
        seedElem = document.createElement("img");
        seedElem.src = "source/kuwuk.png";
        seedElem.classList.add("kuwuk");
        fromElem.appendChild(seedElem);
      }
      let clone = seedElem.cloneNode();
      document.body.appendChild(clone);
      let rectFrom = seedElem.getBoundingClientRect();
      let rectTo = toElem.getBoundingClientRect();
      clone.style.position = "absolute";
      clone.style.left = rectFrom.left + "px";
      clone.style.top = rectFrom.top + "px";
      setTimeout(() => {
        clone.style.transform = `translate(${rectTo.left - rectFrom.left}px, ${rectTo.top - rectFrom.top}px)`;
      }, 10);
      setTimeout(() => {
        clone.remove();
        resolve();
      }, 300);
    });
  }
  
  renderBoard() {
    // Render baris atas (bot)
    const rowTop = document.getElementById("row-top");
    rowTop.innerHTML = "";
    for (let i = 0; i < 7; i++) {
      const hole = document.createElement("div");
      hole.classList.add("hole");
      hole.id = `bot-hole-${i}`;
      const count = document.createElement("span");
      count.innerText = this.botHoles[i];
      hole.appendChild(count);
      for (let pos of this.botPositions[i]) {
        const seed = document.createElement("img");
        seed.src = "source/kuwuk.png";
        seed.classList.add("kuwuk");
        seed.style.transform = `translate(${pos.x}px, ${pos.y}px) rotate(${pos.rotation}deg)`;
        hole.appendChild(seed);
      }
      rowTop.appendChild(hole);
    }
    // Render baris bawah (player) terbalik
    const rowBottom = document.getElementById("row-bottom");
    rowBottom.innerHTML = "";
    for (let i = 6; i >= 0; i--) {
      const hole = document.createElement("div");
      hole.classList.add("hole");
      hole.id = `player-hole-${i}`;
      const count = document.createElement("span");
      count.innerText = this.playerHoles[i];
      hole.appendChild(count);
      for (let pos of this.playerPositions[i]) {
        const seed = document.createElement("img");
        seed.src = "source/kuwuk.png";
        seed.classList.add("kuwuk");
        seed.style.transform = `translate(${pos.x}px, ${pos.y}px) rotate(${pos.rotation}deg)`;
        hole.appendChild(seed);
      }
      hole.onclick = () => { if (this.currentPlayer === 0) this.move("player", i); };
      rowBottom.appendChild(hole);
    }
    // Update store
    document.getElementById("player-store").innerText = this.playerStore;
    document.getElementById("bot-store").innerText = this.botStore;
  }
}

// Fungsi modal Congklak
function showWinModal(message) {
  const modal = document.getElementById("winModal");
  const winText = document.getElementById("winText");
  winText.innerText = message;
  modal.style.display = "block";
  
  document.getElementById("closeModal").onclick = () => { modal.style.display = "none"; };
  document.getElementById("restartButton").onclick = () => { location.reload(); };
  window.onclick = (event) => { if (event.target === modal) { modal.style.display = "none"; } };
}