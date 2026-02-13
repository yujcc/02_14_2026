const folder = document.getElementById("open-folder");
const finder = document.getElementById("finder-window");
const startGame = document.getElementById("start-game");
const gameWindow = document.getElementById("game-window");
const closeButtons = document.querySelectorAll(".red");
const startScreen = document.getElementById("start-screen");
const loadingScreen = document.getElementById("loading-screen");
const charSelectView = document.getElementById("character-select-view");

function startLoadingSequence() {
    startScreen.classList.add("hidden");
    loadingScreen.classList.remove("hidden");

    // Simulate loading
    setTimeout(() => {
        loadingScreen.classList.add("hidden");
        charSelectView.classList.remove("hidden");
    }, 2500); // 2.5 seconds load time
}

function flipCard(cardElement) {
    cardElement.classList.toggle("flipped");
}

folder.addEventListener("click", () => {
    finder.classList.remove("hidden");
    finder.style.zIndex = 20;
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
});

// Close window functionality
closeButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        const window = e.target.closest(".window");
        window.classList.add("hidden");
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
}

function showMessageModal() {
    document.getElementById("custom-modal").classList.remove("hidden");
    // Close menu when showing modal
    toggleMenu();
}

function closeModal(event) {
    // specific check to allow clicking outside the box to close it
    // OR clicking the close button
    if (event.target.id === "custom-modal" || event.target.closest(".modal-close")) {
        document.getElementById("custom-modal").classList.add("hidden");
    }
}

let isMusicPlaying = false;
let audio = new Audio('assets/bgm.mp3'); // Placeholder path
audio.loop = true;

function toggleMusic() {
    if (isMusicPlaying) {
        audio.pause();
        isMusicPlaying = false;
    } else {
        // audio.play().catch(e => console.log("No music file found yet!"));
        alert("Music On! 🎵\n(Imagine a sweet lo-fi beat playing...)");
        isMusicPlaying = true;
    }
}

function goBack() {
    // Logic: If a window is open, close it.
    // If modal is open, close it.
    const finder = document.getElementById("finder-window");
    const gameWindow = document.getElementById("game-window");
    const modal = document.getElementById("custom-modal");

    if (!modal.classList.contains("hidden")) {
        modal.classList.add("hidden");
    } else if (!gameWindow.classList.contains("hidden")) {
        gameWindow.classList.add("hidden");
    } else if (!finder.classList.contains("hidden")) {
        finder.classList.add("hidden");
    } else {
        // If nothing to go back from, just toggle menu closed
        toggleMenu();
        return;
    }
    // Also close menu after action
    // toggleMenu(); // Optional: keep menu open? Or close it? User said "go back" which implies "back out"
    // Let's close menu to be clean
    if (document.getElementById("menu-options").classList.contains("open")) {
        toggleMenu();
    }
}
