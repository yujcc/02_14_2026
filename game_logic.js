class GameEngine {
    constructor() {
        this.currentPenta = null;
        this.currentNodeId = null;
        this.correctCount = 0;
        this.pathHistory = [];
        this.masterEggKey = "valentine_master_egg_paths";
        this.answeredQuestionsKey = "valentine_answered_questions";
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
            this.recordQuestionAnswered(this.currentPenta.id, this.currentNodeId);
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
        // Surprise: 3 correct (Perfect)
        // Success: 2 correct
        // Failure: < 2 correct
        let resultType = "failure";
        if (this.correctCount === 3) resultType = "surprise";
        else if (this.correctCount >= 2) resultType = "success";

        // Always check progress/milestones at the end of a run
        let answered = JSON.parse(localStorage.getItem(this.answeredQuestionsKey) || "[]");
        this.checkMasterEgg(answered);

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
            // We only check Master Egg progress via unique answered questions now
        } else {
            console.log("Path already discovered.");
        }
    }

    recordQuestionAnswered(pentaId, nodeId) {
        let answered = JSON.parse(localStorage.getItem(this.answeredQuestionsKey) || "[]");
        const entry = `${pentaId}:${nodeId}`;
        if (!answered.includes(entry)) {
            answered.push(entry);
            localStorage.setItem(this.answeredQuestionsKey, JSON.stringify(answered));
            this.checkMasterEgg(answered);
        }
    }

    checkMasterEgg(answered) {
        // Calculate total questions in the entire game
        let totalQuestions = 0;
        const pentaCompletion = {};

        for (const pentaKey in GAME_DATA) {
            const count = Object.keys(GAME_DATA[pentaKey].nodes).length;
            totalQuestions += count;

            // Check per-character completion
            const charQuestions = answered.filter(entry => entry.startsWith(`${pentaKey}:`));
            const progress = charQuestions.length;

            console.log(`${GAME_DATA[pentaKey].name} Completion: ${progress}/${count}`);

            if (progress >= count) {
                pentaCompletion[pentaKey] = true;
            }
        }

        console.log(`Total Progress: ${answered.length}/${totalQuestions} questions cleared.`);

        // Trigger character-specific "All Correct" animations
        if (this.currentPenta && pentaCompletion[this.currentPenta.id]) {
            console.log(`Triggering milestone for: ${this.currentPenta.id}`);
            this.triggerCharacterMilestone(this.currentPenta.id);
        }

        if (answered.length >= totalQuestions) {
            console.log("MASTER EASTER EGG UNLOCKED!");

            // Delay to allow Character Mastery Modal to be seen first
            setTimeout(() => {
                this.triggerRoseExplosion();

                // Wait for rose animation to peak, then show the secret question
                setTimeout(() => this.showSecretQuest(), 4000);

                document.body.style.backgroundImage = "radial-gradient(#ff0000 1.5px, #fff5f5 1.5px)";
                document.body.style.backgroundSize = "30px 30px";
            }, 4500);
        }
    }

    showSecretQuest() {
        const modal = document.getElementById("secret-quest-modal");
        const optionsEl = document.getElementById("quest-options");
        if (!modal || !optionsEl) return;

        const options = [
            "A. The n = -4 term (smallest radius, fastest rotation)",
            "B. The n = -3 term (largest non-dominant radius ≈ 0.234)",
            "C. The n = -1 term (largest overall radius ≈ 0.976)"
        ];

        optionsEl.innerHTML = "";
        options.forEach((opt, idx) => {
            const btn = document.createElement("button");
            btn.className = "btn";
            btn.innerText = opt;
            btn.onclick = () => this.handleMasterQuest(idx);
            optionsEl.appendChild(btn);
        });

        modal.classList.remove("hidden");

        // Render LaTeX in the quest modal
        if (typeof renderMathInElement === "function") {
            renderMathInElement(modal, {
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

    handleMasterQuest(index) {
        document.getElementById("secret-quest-modal").classList.add("hidden");

        const isCorrect = (index === 1); // B is index 1
        const mainMessage = "You've successfully mapped the geometry of the heart! You've cleared every single challenge of the heart and mind.";

        const finaleTitle = isCorrect ? "Grand Master! 🏆" : "Master of Persistence! 💖";
        const finaleMessage = isCorrect
            ? `Yay ... thats correct... ✨<br><br>${mainMessage}`
            : `Sigh ... wrong again ... 💔<br><br>But your dedication is undeniable! ${mainMessage}`;

        // Trigger the drawing
        this.triggerFourierHeart();

        // Show final message ONLY after the heart drawing is mostly done (~8 seconds)
        setTimeout(() => {
            const fModal = document.getElementById("finale-modal");
            document.getElementById("finale-title").textContent = finaleTitle;
            document.getElementById("finale-desc").innerHTML = finaleMessage;
            fModal.classList.remove("hidden");
        }, 15000);
    }

    openPresent() {
        const container = document.getElementById("present-container");
        const btn = document.getElementById("present-btn");
        container.classList.remove("hidden");

        // Transform button into the "Enjoy" button
        btn.innerText = "Enjoy Your Gift! 💖";
        btn.onclick = () => {
            const trackingCode = "9434640106147000105469";
            navigator.clipboard.writeText(trackingCode).then(() => {
                console.log("Tracking code copied to clipboard!");
                // Optionally show a tiny toast here, but user asked to close
                document.getElementById("finale-modal").classList.add("hidden");
            }).catch(err => {
                console.error("Failed to copy:", err);
                document.getElementById("finale-modal").classList.add("hidden");
            });
        };
    }

    triggerCharacterMilestone(pentaId) {
        const milestoneKey = `milestone_seen_${pentaId}`;
        const hasSeen = localStorage.getItem(milestoneKey);

        if (hasSeen) return;

        const charName = GAME_DATA[pentaId].name;
        let message = "";

        if (pentaId === "penta_wizard") {
            message = "You've mastered every mathematical challenge! The equations of the heart are now yours to control.";
            this.triggerWizardSpell();
        } else if (pentaId === "penta_chef") {
            message = "Career survivor! You've navigated the job market of 2026 and cleared every hurdle (for real pls).";
            this.triggerChefAnimation();
        } else if (pentaId === "penta_cupid") {
            message = "The Master of Attachment! You've successfully mapped the psychology of modern love (I think). You're hot and horny.";
            this.triggerCupidAnimation();
        }

        this.showMilestoneModal(charName, message);
        localStorage.setItem(milestoneKey, "true");
    }

    showMilestoneModal(name, message) {
        const modal = document.getElementById("mastery-modal");
        const titleEl = document.getElementById("mastery-title");
        const bodyEl = document.getElementById("mastery-desc");

        if (titleEl) titleEl.textContent = `${name} Mastered!
            ✨You finished one, YAY! Took you how long?✨`;
        if (bodyEl) bodyEl.innerHTML = `Congratulations! 💖<br>${message}<br><br>But don't worry, ペンタさん の 旅 shall continue. Cuz life ain't stopping.`;

        modal.classList.remove("hidden");
    }

    triggerWizardSpell() {
        const spell = document.getElementById("wizardSpell");
        if (!spell) return;

        spell.classList.remove("hidden");

        // Create spark particles
        for (let i = 0; i < 40; i++) {
            const spark = document.createElement("div");
            spark.style.position = "absolute";
            spark.style.width = Math.random() * 4 + 4 + "px";
            spark.style.height = spark.style.width;
            spark.style.borderRadius = "50%";
            spark.style.background = Math.random() > 0.5 ? "gold" : "#a855f7";
            spark.style.top = "50%";
            spark.style.left = "50%";
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 200 + 50;
            spark.style.setProperty('--tx', Math.cos(angle) * dist + "px");
            spark.style.setProperty('--ty', Math.sin(angle) * dist + "px");
            spark.style.animation = "sparkBurst 2s ease-out forwards";
            spell.appendChild(spark);
            setTimeout(() => spark.remove(), 2000);
        }

        // Create magic math symbols
        const symbols = ["π", "∞", "∫", "∑", "√", "Δ", "Θ"];
        for (let i = 0; i < 20; i++) {
            const sym = document.createElement("div");
            sym.className = "magic-symbol";
            sym.innerText = symbols[Math.floor(Math.random() * symbols.length)];
            sym.style.left = Math.random() * 100 + "vw";
            sym.style.top = Math.random() * 100 + "vh";
            sym.style.setProperty('--rx', (Math.random() - 0.5) * 400 + "px");
            sym.style.setProperty('--ry', (Math.random() - 0.5) * 400 + "px");
            sym.style.animationDelay = Math.random() * 2 + "s";
            spell.appendChild(sym);
            setTimeout(() => sym.remove(), 4000);
        }

        setTimeout(() => {
            spell.classList.add("hidden");
            // Reset content for next time
            spell.innerHTML = `
                <div class="spell-circle"></div>
                <div class="spell-circle-inner"></div>
                <div class="spell-lightning"></div>
            `;
        }, 4000);
    }

    triggerChefAnimation() {
        const chefAnim = document.getElementById("chefAnimation");
        const container = document.getElementById("cash-rain-container");
        if (!chefAnim || !container) return;

        chefAnim.classList.remove("hidden");

        const duration = 6000;
        const cashInterval = setInterval(() => {
            const bill = document.createElement("div");
            bill.classList.add("cash");

            const moneyTypes = ["💵", "💸", "💰"];
            bill.innerText = moneyTypes[Math.floor(Math.random() * moneyTypes.length)];

            bill.style.left = Math.random() * 100 + "vw";

            const size = Math.random() * 20 + 20;
            bill.style.fontSize = size + "px";

            const fallDuration = Math.random() * 4 + 4;
            bill.style.animationDuration = fallDuration + "s";

            container.appendChild(bill);

            setTimeout(() => {
                bill.remove();
            }, fallDuration * 1000);
        }, 120);

        setTimeout(() => {
            clearInterval(cashInterval);
            setTimeout(() => {
                chefAnim.classList.add("hidden");
                container.innerHTML = "";
            }, 4000); // Give it time to finish falling
        }, duration);
    }

    triggerCupidAnimation() {
        const cupidAnim = document.getElementById("cupidAnimation");
        const container = document.getElementById("heart-rain-container");
        if (!cupidAnim || !container) return;

        cupidAnim.classList.remove("hidden");

        const duration = 5000;
        const heartInterval = setInterval(() => {
            const heart = document.createElement("div");
            heart.classList.add("heart");
            heart.innerText = "💖";

            // Random position
            heart.style.left = Math.random() * 100 + "vw";

            // Random size
            const size = Math.random() * 20 + 15;
            heart.style.fontSize = size + "px";

            // Random fall duration
            const fallDuration = Math.random() * 3 + 3;
            heart.style.animationDuration = fallDuration + "s";

            container.appendChild(heart);

            // Remove after animation
            setTimeout(() => {
                heart.remove();
            }, fallDuration * 1000);
        }, 150);

        // Stop rain and hide overlay
        setTimeout(() => {
            clearInterval(heartInterval);
            setTimeout(() => {
                cupidAnim.classList.add("hidden");
                container.innerHTML = ""; // Clear for next time
            }, 3000); // Wait for the last hearts to fall
        }, duration);
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
            resultTitle.textContent = this.currentPenta.surpriseTitle || "Spectacular Success! 🎉";
            resultDesc.textContent = this.currentPenta.surpriseDesc || "You know Penta perfectly!";
            if (!skipHistory) this.triggerConfetti();
        } else if (type === "success") {
            resultTitle.textContent = "Ehhh... not bad.! 🌟";
            // resultDesc.textContent = `You got ${this.correctCount}/3 right! Penta is impressed with your efforts.`;
            resultDesc.textContent = `ペンタさん is impressed with your efforts tho. Try harder.`;
        } else {
            resultTitle.textContent = "Oops... 💔";
            // resultDesc.textContent = `Only ${this.correctCount}/3 correct. That was... not great. Keep trying to win their heart!`;
            resultDesc.textContent = `That's it? That was all... ? ペンタさん is heartbroken for you.`;
        }

        if (!skipHistory && typeof pushHistory === "function") pushHistory();
    }


    triggerConfetti() {
        // Play sound
        const audio = new Audio('assets/firework.mp3');
        audio.play().catch(e => console.log("Firework play blocked:", e));

        const colors = [
            '#ff2d55', '#ff9500', '#ffcc00',
            '#34c759', '#5ac8fa', '#007aff',
            '#af52de'
        ];

        const total = 120; // More pieces for fuller effect

        for (let i = 0; i < total; i++) {
            const confetti = document.createElement('div');

            // Base styling
            confetti.style.position = 'fixed';
            confetti.style.left = '50vw';
            confetti.style.top = '50vh';
            confetti.style.zIndex = '9999';
            confetti.style.pointerEvents = 'none';

            // Random size
            const size = Math.random() * 8 + 6;
            confetti.style.width = size + 'px';
            confetti.style.height = size + 'px';

            // Random shape
            if (Math.random() > 0.5) {
                confetti.style.borderRadius = '50%';
            }

            // Random color
            confetti.style.backgroundColor =
                colors[Math.floor(Math.random() * colors.length)];

            document.body.appendChild(confetti);

            // Physics variables
            const angle = Math.random() * 2 * Math.PI;
            const velocity = Math.random() * 600 + 400;
            const gravity = 1200;
            const rotation = Math.random() * 720;

            let start = null;

            function animate(timestamp) {
                if (!start) start = timestamp;
                const progress = (timestamp - start) / 1000;

                const x = Math.cos(angle) * velocity * progress;
                const y = Math.sin(angle) * velocity * progress + 0.5 * gravity * progress * progress;

                confetti.style.transform = `
                    translate(${x}px, ${y}px)
                    rotate(${rotation * progress}deg)
                `;

                if (progress < 3) {
                    requestAnimationFrame(animate);
                } else {
                    confetti.remove();
                }
            }

            requestAnimationFrame(animate);
        }
    }

    triggerRoseExplosion() {
        const container = document.getElementById("rose-animation-container");
        if (!container) return;

        // Create rose in center
        const rose = document.createElement("div");
        rose.classList.add("rose-center");
        rose.innerText = "🌹";
        container.appendChild(rose);

        // After pop animation, explode petals with a massive burst
        setTimeout(() => {
            rose.remove();
            const petalCount = 250; // Increased density

            for (let i = 0; i < petalCount; i++) {
                const petal = document.createElement("div");
                petal.classList.add("petal");

                const petalTypes = ["🌸", "🌹", "💮", "✨", "💖", "💗", "💕", "💓", "🌺"];
                petal.innerText = petalTypes[Math.floor(Math.random() * petalTypes.length)];

                petal.style.left = "50vw";
                petal.style.top = "50vh";

                // Radial explosion math
                const angle = Math.random() * Math.PI * 2;
                const velocity = Math.random() * 800 + 400; // Stronger blast
                const tx = Math.cos(angle) * velocity;
                const ty = Math.sin(angle) * velocity - 200; // Launch slightly upwards first

                const fallDuration = Math.random() * 2 + 4;
                const size = Math.random() * 15 + 15;

                petal.style.fontSize = size + "px";
                petal.style.setProperty("--tx", tx + "px");
                petal.style.setProperty("--ty", ty + "px");
                petal.style.animation = `petalExplosion ${fallDuration}s cubic-bezier(0.1, 0.8, 0.3, 1) forwards`;

                container.appendChild(petal);

                setTimeout(() => {
                    petal.remove();
                }, fallDuration * 1000);
            }
        }, 800);

        // Clean container after full animation
        setTimeout(() => {
            container.innerHTML = "";
        }, 7000);
    }

    triggerFourierHeart() {
        const container = document.getElementById("fourier-container");
        const canvas = document.getElementById("fourier-canvas");
        const message = document.getElementById("fourier-message");
        if (!container || !canvas || !message) return;

        container.classList.remove("hidden");
        message.classList.remove("show");

        const ctx = canvas.getContext("2d");
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let centerX = width / 2;
        let centerY = height / 2;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            centerX = width / 2;
            centerY = height / 2;
        });

        // Fourier Logic
        const complex = (re, im) => ({ re, im });
        const add = (a, b) => complex(a.re + b.re, a.im + b.im);
        const mult = (a, b) => complex(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
        const expi = (theta) => complex(Math.cos(theta), Math.sin(theta));

        const N = 4; // depth
        const samples = 300;
        let points = [];

        for (let i = 0; i < samples; i++) {
            const t = (i / samples) * 2 * Math.PI;
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
            points.push(complex(x, y));
        }

        // Center and normalize
        let meanX = 0, meanY = 0;
        points.forEach(p => { meanX += p.re; meanY += p.im; });
        meanX /= samples; meanY /= samples;
        points = points.map(p => complex(p.re - meanX, p.im - meanY));

        let avgRadius = 0;
        points.forEach(p => { avgRadius += Math.sqrt(p.re * p.re + p.im * p.im); });
        avgRadius /= samples;
        points = points.map(p => complex(p.re / avgRadius, p.im / avgRadius));

        let coeffs = [];
        for (let n = -N; n <= N; n++) {
            let sum = complex(0, 0);
            for (let k = 0; k < samples; k++) {
                const t = (k / samples) * 2 * Math.PI;
                const c = expi(-n * t);
                sum = add(sum, mult(points[k], c));
            }
            sum.re /= samples; sum.im /= samples;
            coeffs.push({ n, c: sum });
        }

        let time = 0;
        const dt = 0.01;
        let path = [];
        let animationFrame;
        let cycleCompleted = false;

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            let current = complex(0, 0);
            coeffs.forEach(({ n, c }) => {
                const rot = expi(n * time);
                const contribution = mult(c, rot);
                current = add(current, contribution);
            });

            path.unshift(current);
            ctx.beginPath();
            const pathScale = Math.min(width, height) * 0.15;
            for (let i = 0; i < path.length; i++) {
                const p = path[i];
                const x = centerX + p.re * pathScale;
                const y = centerY - p.im * pathScale;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = "rgba(255,183,197,0.9)";
            ctx.lineWidth = 4;
            ctx.stroke();

            time += dt;

            if (time > 2 * Math.PI) {
                if (!cycleCompleted) {
                    message.classList.add("show");
                    cycleCompleted = true;
                }
                // Don't reset path, just loop time or stop
            }

            animationFrame = requestAnimationFrame(draw);
        };

        draw();

        // Cleanup after 10 seconds or when user clicks
        const stopAnimation = () => {
            cancelAnimationFrame(animationFrame);
            container.classList.add("hidden");
            message.classList.remove("show");
            container.removeEventListener("click", stopAnimation);
        };
        container.addEventListener("click", stopAnimation);

        // Auto stop after 15s to return to game
        setTimeout(stopAnimation, 15000);
    }
}

// Initialize
const game = new GameEngine();