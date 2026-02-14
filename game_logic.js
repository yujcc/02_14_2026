class GameEngine {
    constructor() {
        this.currentPenta = null;
        this.currentNodeId = null;
        this.correctCount = 0;
        this.pathHistory = []; // Tracks the path taken in current session
        this.masterEggKey = "valentine_master_egg_paths";
    }

    // --- State Management ---

    selectPenta(pentaId) {
        if (!GAME_DATA[pentaId]) {
            console.error("Invalid Penta ID:", pentaId);
            return;
        }
        this.currentPenta = GAME_DATA[pentaId];
        this.currentNodeId = this.currentPenta.startNode;
        this.correctCount = 0;
        this.pathHistory = [pentaId]; // Start path with character ID

        this.renderQuestion();
    }



    handleAnswer(optionIndex) {
        const node = this.currentPenta.nodes[this.currentNodeId];
        const option = node.options[optionIndex];

        if (!option) return;

        // Record correctness
        if (option.correct) {
            this.correctCount++;
        }

        // Track path for Easter Egg
        this.pathHistory.push(`${this.currentNodeId}_${optionIndex}`);

        // Move to next node
        if (option.next && this.currentPenta.nodes[option.next] && this.currentPenta.nodes[option.next].text !== "END") {
            this.currentNodeId = option.next;
            this.renderQuestion();
        } else {
            this.finishGame();
        }
    }



    finishGame() {
        // Calculate result
        // Success: >= 2 correct
        // Surprise: 3 correct (Perfect)
        // Failure: < 2 correct
        let resultType = "failure";
        if (this.correctCount === 3) resultType = "surprise";
        else if (this.correctCount >= 2) resultType = "success";

        this.savePathProgress();
        this.renderResult(resultType);
    }

    // --- Persistence (Master Easter Egg) ---

    savePathProgress() {
        // Create a unique signature for this specific run
        // e.g., "penta_chef|q1_0|q2a_1|q3b_0"
        const pathSignature = this.pathHistory.join("|");

        let savedPaths = JSON.parse(localStorage.getItem(this.masterEggKey) || "[]");

        if (!savedPaths.includes(pathSignature)) {
            savedPaths.push(pathSignature);
            localStorage.setItem(this.masterEggKey, JSON.stringify(savedPaths));
            console.log("New path discovered!", pathSignature);
            this.checkMasterEgg(savedPaths);
        } else {
            console.log("Path already discovered.");
        }
    }

    checkMasterEgg(savedPaths) {
        // Simple logic: if they have found 5 unique paths
        if (savedPaths.length >= 5) {
            console.log("MASTER EASTER EGG UNLOCKED!");
            // Show a special notification or change theme
            alert("💖 MASTER EASTER EGG UNLOCKED! 💖\nYou found all the paths of love!");
            document.body.style.backgroundImage = "radial-gradient(#ff0000 1px, transparent 1px)";
        }
    }

    // --- UI Rendering (Bridging to DOM) ---

    renderQuestion(skipHistory = false) {
        const node = this.currentPenta.nodes[this.currentNodeId];
        const view = document.getElementById("game-view");
        const questionText = document.getElementById("question-text");
        const optionsContainer = document.getElementById("options-container");
        const avatarEl = document.getElementById("game-avatar");

        // Show game view, hide others
        document.getElementById("character-select-view").classList.add("hidden");
        document.getElementById("result-view").classList.add("hidden");
        view.classList.remove("hidden");

        // Update Avatar
        if (avatarEl && this.currentPenta && this.currentPenta.icon) {
            avatarEl.src = this.currentPenta.icon;
        }

        // Update Text
        questionText.textContent = node.text;

        // Update Options
        optionsContainer.innerHTML = "";
        node.options.forEach((opt, index) => {
            const btn = document.createElement("button");
            btn.className = "btn option-btn";
            btn.textContent = opt.text;
            btn.onclick = () => this.handleAnswer(index);
            optionsContainer.appendChild(btn);
        });

        if (!skipHistory && typeof pushHistory === "function") pushHistory();

        // Render LaTeX
        if (typeof renderMathInElement === "function") {
            renderMathInElement(view, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false },
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: true }
                ],
                throwOnError: false
            });
        }
    }


    renderResult(type, skipHistory = false) {
        const resultView = document.getElementById("result-view");
        const resultTitle = document.getElementById("result-title");
        const resultDesc = document.getElementById("result-desc");

        document.getElementById("game-view").classList.add("hidden");
        resultView.classList.remove("hidden");

        if (type === "surprise") {
            resultTitle.textContent = "Spectacular Success! 🎉";
            resultDesc.textContent = "You know Penta perfectly! (Surprise Unlocked)";
            if (!skipHistory) this.triggerConfetti();
        } else if (type === "success") {
            resultTitle.textContent = "Ehhh alright.";
            resultDesc.textContent = "You did okay. Penta is mildly impressed.";
        } else {
            resultTitle.textContent = "Oh no...";
            resultDesc.textContent = "That was... not great. (Sad message). Try again?";
        }

        if (!skipHistory && typeof pushHistory === "function") pushHistory();
    }


    triggerConfetti() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.transition = 'top 3s ease-in, transform 3s linear';
            confetti.style.zIndex = '1000';
            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.style.top = '100vh';
                confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            }, 100);

            setTimeout(() => confetti.remove(), 3000);
        }
    }
}

// Initialize
const game = new GameEngine();
