const folder = document.getElementById("open-folder");
const finder = document.getElementById("finder-window");
const startGame = document.getElementById("start-game");
const gameWindow = document.getElementById("game-window");
const closeButtons = document.querySelectorAll(".red");
const startScreen = document.getElementById("start-screen");
const loadingScreen = document.getElementById("loading-screen");
const charSelectView = document.getElementById("character-select-view");

// --- SFX Logic ---
function playSFX(src) {
    const audio = new Audio(src);
    audio.play().catch(e => console.log("SFX play blocked:", e));
}

// Global Click
document.addEventListener("click", (e) => {
    if (e.target.closest("button") || e.target.closest(".btn")) {
        playSFX("assets/click.mp3");
    }
});

// Selection Hover SFX
document.addEventListener("mouseover", (e) => {
    const target = e.target.closest(".console-arrow, .nb-carousel-slide, .dot, .get-started-btn");
    if (target && !target.dataset.hovered) {
        playSFX("assets/bubble.mp3");
        target.dataset.hovered = "true";
        target.addEventListener("mouseleave", () => delete target.dataset.hovered, { once: true });
    }
});

// --- History System ---
const historyStack = [];

function captureState() {
    return {
        finderVisible: !finder.classList.contains("hidden"),
        gameVisible: !gameWindow.classList.contains("hidden"),
        activeGameView: getActiveGameView(),
        gameData: {
            pentaId: game.currentPenta ? game.currentPenta.id : null,
            nodeId: game.currentNodeId,
            correctCount: game.correctCount,
            pathHistory: [...(game.pathHistory || [])],
            slide: currentSlide
        },

        menuOpen: document.getElementById("menu-options").classList.contains("open")
    };
}

function getActiveGameView() {
    const views = ["start-screen", "loading-screen", "character-select-view", "game-view", "result-view"];
    for (const v of views) {
        if (!document.getElementById(v).classList.contains("hidden")) return v;
    }
    return null;
}

function pushHistory() {
    const newState = captureState();
    const lastState = historyStack[historyStack.length - 1];

    // Deep clone to avoid references
    const stateStr = JSON.stringify(newState);
    if (JSON.stringify(lastState) !== stateStr) {
        historyStack.push(JSON.parse(stateStr));
    }
}

function applyState(state) {
    if (!state) return;

    // Explorer/Finder
    state.finderVisible ? finder.classList.remove("hidden") : finder.classList.add("hidden");

    // Game Window
    state.gameVisible ? gameWindow.classList.remove("hidden") : gameWindow.classList.add("hidden");

    // Game Views
    const views = ["start-screen", "loading-screen", "character-select-view", "game-view", "result-view"];
    views.forEach(v => {
        const el = document.getElementById(v);
        if (v === state.activeGameView) el.classList.remove("hidden");
        else el.classList.add("hidden");
    });

    // Restore Game Instance State
    if (state.gameData.pentaId) {
        game.currentPenta = GAME_DATA[state.gameData.pentaId];
        game.currentNodeId = state.gameData.nodeId;
        game.correctCount = state.gameData.correctCount;
        game.pathHistory = [...(state.gameData.pathHistory || [])];
        if (state.activeGameView === "game-view") game.renderQuestion(true);
        if (state.activeGameView === "result-view") game.renderResult(game.correctCount === 3 ? "surprise" : (game.correctCount >= 2 ? "success" : "failure"), true);
    } else {
        game.currentPenta = null;
        game.currentNodeId = null;
        game.correctCount = 0;
    }

    // Carousel Slide
    currentSlide = state.gameData.slide || 0;
    const track = document.getElementById("carousel-track");
    if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Menu
    const menu = document.getElementById("menu-options");
    const trigger = document.getElementById("menu-trigger");
    state.menuOpen ? menu.classList.add("open") : menu.classList.remove("open");
    state.menuOpen ? trigger.classList.add("active") : trigger.classList.remove("active");

    // Sync Selection UI if on that view
    if (state.activeGameView === "character-select-view") {
        updateSelectionUI();
    }
}


// Initial Push
window.addEventListener("load", () => {
    pushHistory();
});


// --- Carousel Logic ---
let currentSlide = 0;
const totalSlides = 3;
const pentaMap = ['penta_wizard', 'penta_chef', 'penta_cupid'];
let loadingTimeout = null;

function moveCarousel(direction) {
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    const track = document.getElementById("carousel-track");
    if (track) {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    updateSelectionUI();
    pushHistory();
}

function updateSelectionUI() {
    const charData = [
        {
            title: "The Math Wizard",
            desc: "Logic. Patterns. Chaos equations.",
            iq: 95, eq: 20, det: 65
        },
        {
            title: "Pentatouille",
            desc: "Feelings. Love languages. Romance.",
            iq: 25, eq: 65, det: 90
        },
        {
            title: "The Homeless Cupid",
            desc: "Career. Ambition. Long-term goals.",
            iq: 10, eq: 95, det: 30
        }
    ];

    const current = charData[currentSlide];
    const titleEl = document.getElementById("char-title");
    const descEl = document.getElementById("char-desc");
    const dots = document.querySelectorAll(".dot");

    if (titleEl) titleEl.textContent = current.title;
    if (descEl) descEl.textContent = current.desc;

    // Update Stats
    const iqBar = document.getElementById("stat-iq");
    const eqBar = document.getElementById("stat-eq");
    const detBar = document.getElementById("stat-det");

    if (iqBar) iqBar.style.width = current.iq + "%";
    if (eqBar) eqBar.style.width = current.eq + "%";
    if (detBar) detBar.style.width = current.det + "%";

    dots.forEach((dot, idx) => {
        if (idx === currentSlide) dot.classList.add("active");
        else dot.classList.remove("active");
    });
}



function confirmSelection() {
    const selectedPenta = pentaMap[currentSlide];
    game.selectPenta(selectedPenta);
    pushHistory();
}


function startLoadingSequence() {
    const startScreen = document.getElementById("start-screen");
    const loadingScreen = document.getElementById("loading-screen");
    const charSelectView = document.getElementById("character-select-view");

    if (loadingTimeout) clearTimeout(loadingTimeout);

    startScreen.classList.add("hidden");
    loadingScreen.classList.remove("hidden");
    pushHistory();

    // Simulate loading
    loadingTimeout = setTimeout(() => {
        loadingScreen.classList.add("hidden");
        charSelectView.classList.remove("hidden");
        pushHistory();
        loadingTimeout = null;
    }, 2500); // 2.5 seconds load time
}



// Flip card logic removed as we use carousel now
// function flipCard(cardElement) { ... }

folder.addEventListener("click", () => {
    finder.classList.remove("hidden");
    finder.style.zIndex = 20;
    pushHistory();
});


startGame.addEventListener("click", () => {
    finder.classList.add("hidden");
    gameWindow.classList.remove("hidden");
    // Ensure we start fresh
    startScreen.classList.remove("hidden");
    loadingScreen.classList.add("hidden");
    charSelectView.classList.add("hidden");
    document.getElementById("game-view").classList.add("hidden");
    document.getElementById("result-view").classList.add("hidden");

    gameWindow.style.zIndex = 20;
    pushHistory();
});


// Close window functionality
closeButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        const window = e.target.closest(".window");
        window.classList.add("hidden");
        pushHistory();
    });
});

// Make buttons clickable
closeButtons.forEach(btn => btn.style.cursor = "pointer");

// --- Home Menu Logic ---

function toggleMenu() {
    const options = document.getElementById("menu-options");
    const trigger = document.getElementById("menu-trigger");

    options.classList.toggle("open");
    trigger.classList.toggle("active");
    pushHistory();
}


function showMessageModal() {
    document.getElementById("custom-modal").classList.remove("hidden");
    // Close menu when showing modal
    const options = document.getElementById("menu-options");
    const trigger = document.getElementById("menu-trigger");
    options.classList.remove("open");
    trigger.classList.remove("active");
}


function closeModal(e) {
    if (e.target.id === "custom-modal" || e.target.closest(".modal-close")) {
        document.getElementById("custom-modal").classList.add("hidden");
    }
}

function closeMasteryModal(e) {
    if (e.target.id === "mastery-modal" || e.target.closest(".modal-close")) {
        document.getElementById("mastery-modal").classList.add("hidden");
    }
}


function closeSystemModal() {
    document.getElementById("system-modal").classList.add("hidden");
}

function showSystemModal(title, message, icon = "⚠️", buttons = null) {
    const modal = document.getElementById("system-modal");
    document.getElementById("system-title").textContent = title;
    document.getElementById("system-desc").innerHTML = message;
    document.getElementById("system-icon").textContent = icon;

    const footer = document.getElementById("system-footer");
    footer.innerHTML = "";

    if (buttons) {
        buttons.forEach(btn => {
            const b = document.createElement("button");
            b.className = `btn ${btn.className || ""}`;
            b.textContent = btn.text;
            b.onclick = () => {
                if (btn.action) btn.action();
                closeSystemModal();
            };
            footer.appendChild(b);
        });
    } else {
        const closeBtn = document.createElement("button");
        closeBtn.className = "btn";
        closeBtn.textContent = "Close";
        closeBtn.onclick = closeSystemModal;
        footer.appendChild(closeBtn);
    }

    modal.classList.remove("hidden");
}

function resetProgress() {
    showSystemModal(
        "Reset All Progress?",
        "Are you sure you want to delete everything? Your milestones, cleared questions, and character masteries will be wiped forever.",
        "🗑️",
        [
            { text: "Cancel", className: "btn-secondary", action: null },
            {
                text: "Reset Everything", className: "btn-danger", action: () => {
                    localStorage.clear();
                    location.reload();
                }
            }
        ]
    );
}


let isMusicPlaying = false;

const audio = new Audio('assets/The theme of Penguin Highway.mp3');

// Ensure looping
audio.loop = true;

// Extra safety for some mobile browsers
audio.addEventListener('ended', () => {
    audio.currentTime = 0;
    audio.play();
});

function toggleMusic() {
    if (isMusicPlaying) {
        audio.pause();
        isMusicPlaying = false;
    } else {
        audio.play().catch(e => console.log("Music error:", e));
        isMusicPlaying = true;
    }
}

function restartGame() {
    document.getElementById("result-view").classList.add("hidden");
    document.getElementById("character-select-view").classList.remove("hidden");
    updateSelectionUI();
    pushHistory();
}


function goBack() {
    if (historyStack.length > 1) {
        // Clear any pending transitions
        if (loadingTimeout) {
            clearTimeout(loadingTimeout);
            loadingTimeout = null;
        }

        const currentState = JSON.stringify(historyStack[historyStack.length - 1]);

        // Pop current state
        historyStack.pop();
        let prevState = historyStack[historyStack.length - 1];

        // Skip states that are effectively identical to current (like just a menu toggle)
        // or skip transient states like loading
        while (historyStack.length > 1) {
            const isTransitionState = prevState.activeGameView === "loading-screen";

            // Check if prevState is just the current state but with menu closed
            const tempState = JSON.parse(JSON.stringify(prevState));
            tempState.menuOpen = true; // Force true to compare with open menu state if needed
            const isMenuToggle = JSON.stringify(tempState) === currentState;

            if (isTransitionState || isMenuToggle) {
                historyStack.pop();
                prevState = historyStack[historyStack.length - 1];
            } else {
                break;
            }
        }

        if (prevState) applyState(prevState);
    }
}


