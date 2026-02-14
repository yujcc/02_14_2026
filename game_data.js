const GAME_DATA = {
    "penta_chef": {
        "id": "penta_chef",
        "name": "Chef Penta",
        "icon": "assets/penta_chef.svg",
        "description": "Cooks with love (and chaos).",
        "startNode": "q1",
        "nodes": {
            "q1": {
                "text": "It’s February 2026. Your degree says “Applied Mathematics 2025”. Your LinkedIn headline is still “Aspiring {fill_in_the_blank} Analyst”. How many cold DMs have you sent this month?",
                "options": [
                    { "text": "0 — I have dignity", "next": "q3", "correct": false },
                    { "text": "47 — and 46 “seen” with no reply", "next": "q2", "correct": true },
                    { "text": "I lost count after the Excel macros guy blocked me", "next": "q3", "correct": false }
                ]
            },
            "q2": {
                "text": "You tell me you’re “starting a small business”. I ask what kind. Your actual plan right now is:",
                "options": [
                    { "text": "Dropshipping “motivational” candles that say “Manifest a Job”", "next": "q5", "correct": false },
                    { "text": "Freelance “applied math consulting” (aka tutoring high-school calc on Fiverr for $12/hr)", "next": "q4", "correct": true },
                    { "text": "Waiting for the one viral TikTok that makes you rich", "next": "q5", "correct": false }
                ]
            },
            "q3": {
                "text": "A recruiter messages: “Impressive linear algebra projects (What projects?)!” Then they ask your salary expectation. You reply:",
                "options": [
                    { "text": "“Market rate for entry-level quant roles” (you googled $140k)", "next": "q7", "correct": false },
                    { "text": "“I’m flexible… $65k?” (you’re dying inside)", "next": "q7", "correct": false },
                    { "text": "“Honestly anything above ramen budget would be life-changing”", "next": "q6", "correct": true }
                ]
            },
            "q4": {
                "text": "Your classmate just posted “First day as Junior Quant @ Jane Street 💰”. You feel:",
                "options": [
                    { "text": "Pure happiness for them, no bitterness", "next": null, "correct": false },
                    { "text": "A brief flash of “fuck this timeline” before liking the post", "next": null, "correct": false },
                    { "text": "You refresh their profile 8 times to see if it’s Photoshopped", "next": null, "correct": true }
                ]
            },
            "q5": {
                "text": "You’re explaining your “career pivot” at a family dinner. The best spin you can manage is:",
                "options": [
                    { "text": "“Strategically taking time to build my own thing”", "next": null, "correct": false },
                    { "text": "“The market is tough, upskilling in AI”", "next": null, "correct": false },
                    { "text": "“Yeah I fucked up, pass the potatoes”", "next": null, "correct": true }
                ]
            },
            "q6": {
                "text": "You open Notion to plan your week. The three tabs you actually have open are:",
                "options": [
                    { "text": "LeetCode, QuantNet, MVP template", "next": null, "correct": false },
                    { "text": "Indeed, Glassdoor, “remote jobs no experience”", "next": null, "correct": false },
                    { "text": "DoorDash, OnlyFans, “how to leech of off my...”", "next": null, "correct": true }
                ]
            },
            "q7": {
                "text": "Valentine’s Day 2026. No date (unfortunate, you have me). No job. Your most romantic thought right now is:",
                "options": [
                    { "text": "“At least I have my differential equations notes to keep me warm”", "next": null, "correct": false },
                    { "text": "“Maybe if I land a job I can finally afford to be someone’s boyfriend/girlfriend”", "next": null, "correct": false },
                    { "text": "“If I start OnlyFans teaching Sturm-Liouville problems shirtless, is that a career?”", "next": null, "correct": true }
                ]
            }
        }
    },
    "penta_wizard": {
        "id": "penta_wizard",
        "name": "Wizard Penta",
        "icon": "assets/penta_wizard.svg",
        "description": "Casts spells of affection.",
        "startNode": "q1",
        "nodes": {
            "q1": {
                "text": "In a poetic model of romance, two lovers' affection levels \\(x(t)\\) and \\(y(t)\\) evolve over time \\(t\\) (in days since their first date), governed by the coupled ODEs: \\(\\frac{dx}{dt} = -x + 2y, \\frac{dy}{dt} = 3x - 4y\\), rerepresenting mutual attraction with emotional friction. Assuming initial affections \\(x(0)=1\\) (heartfelt) and \\(y(0)=0\\) (hesitant), what is the explicit solution for \\(x(t)\\)?",
                "options": [
                    { "text": "\\(x(t) = e^{-2t} + 2e^{-3t}\\)", "next": "q2", "correct": false },
                    { "text": "\\(x(t) = 3e^{-t} - 2e^{-4t}\\)", "next": "q2", "correct": false },
                    { "text": "\\(x(t) = 2e^{-2t} - e^{-3t}\\)", "next": "q3", "correct": true }
                ]
            },
            "q2": {
                "text": "On Valentine's Day, a hopeless romantic searches for their soulmate in a city of 1 million people, where the probability \\(p\\) of a mutual spark with any stranger is independent and follows a Poisson process for encounters at rate \\(\\lambda=5\\) per hour over an 8-hour date night. What is the probability that they experience exactly 3 sparks, assuming the total encounters are Poisson-distributed with mean \\(\\mu=40\\)?",
                "options": [
                    { "text": "\\(\\frac{e^{-40} 40^3}{3!}\\)", "next": "q5", "correct": true },
                    { "text": "\\(\\frac{e^{-40} 40^3}{3!} \\binom{40}{3} p^3 (1-p)^{37}\\)", "next": "q4", "correct": false },
                    { "text": "\\(e^{-40} \\sum_{k=0}^{3} \\frac{40^k}{k!}\\)", "next": "q4", "correct": false }
                ]
            },
            "q3": {
                "text": "Two lovers pledge eternal fidelity, forming a \"romantic symmetry group\" under operations of sharing secrets (multiplication) and heartfelt apologies (inverses). Consider the Klein four-group \\(V_4 \\{e, a, b, c \\} \\) where \\(a^2 = b^2 = c^2 = e\\), \\(ab = c\\), etc., as a model for their balanced dynamics. What is the order of the automorphism group \\(\\operatorname{Aut}(V_4)\\), representing ways their bond can be symmetrically reinterpreted without breaking?",
                "options": [
                    { "text": "4", "next": "q6", "correct": false },
                    { "text": "6", "next": "q7", "correct": true },
                    { "text": "8", "next": "q6", "correct": false }
                ]
            },
            "q4": {
                "text": "In a Valentine's logic puzzle, a suitor must decode their beloved's feelings using Boolean algebra over propositions: P=\"passion ignites\", Q=\"quiet moments cherished\", R=\"roses given\". The heart's truth table satisfies \\((P \\land Q) \\lor (\\neg R \\land Q)\\), simplified via Karnaugh map or laws. What is the minimal sum-of-products form for this romantic expression?",
                "options": [
                    { "text": "\\(PQ + Q + \\neg R Q\\)", "next": null, "correct": false },
                    { "text": "\\(P + Q + \\neg R\\)", "next": null, "correct": false },
                    { "text": "\\(PQ + \\neg R Q\\)", "next": null, "correct": true }
                ]
            },
            "q5": {
                "text": "A pair of star-crossed lovers play a non-zero-sum game on Valentine's, each choosing to \"commit\" (C) or \"hesitate\" (H), with payoffs: if both C, (5,5) eternal bliss; both H, (0,0) loneliness; one C and one H, ( -1,3) for the hesitator gaining freedom but heartbreak for the other. What is the Nash equilibrium in mixed strategies, assuming they randomize with probabilities \\(p\\) and \\(q\\) for C?",
                "options": [
                    { "text": "\\(p = q = 1/3\\)", "next": null, "correct": true },
                    { "text": "\\(p = 3/4, q = 1/4\\)", "next": null, "correct": false },
                    { "text": "\\(p = q = 3/4\\)", "next": null, "correct": false }
                ]
            },
            "q6": {
                "text": "In the chaotic dance of romance, a couple's emotional state is modeled by the logistic map \\(x_{n+1} = r x_n (1 - x_n)\\) where \\(x_n\\) is affection level \\((0 to 1)\\), and \\(r=3.8\\) represents passionate turbulence on Valentine's eve. Starting from \\(x_0 = 0.5\\)(mutual interest), after 1 iterations, does the system exhibit period-doubling bifurcation leading to chaos, and what is \\(x_1\\) approximately?",
                "options": [
                    { "text": "\\(x_1 = 0.95\\), and yes (since \\(r > 3.57\\))", "next": null, "correct": true },
                    { "text": "\\(x_1 = 0.475\\), and no, as \\(r < 4\\)", "next": null, "correct": false },
                    { "text": "\\(x_1 = 0.722\\), and yes, but only for \\(r=4\\)", "next": null, "correct": false }
                ]
            },
            "q7": {
                "text": "To serenade their valentine, a musician composes a periodic love song with waveform \\(f(t) = |\\sin(\\pi t)|\\) for \\(t\\) in \\([-1,1]\\), extended periodically with period 2. What is the Fourier series coefficient \\(a_2\\) or the even cosine terms in its expansion \\(\\sum_{a}^{n} \\cos(n \\pi t) + b_n \\sin(n \\pi t)\\)?",
                "options": [
                    { "text": "0", "next": null, "correct": false },
                    { "text": "\\(\\frac{4}{3\\pi}\\)", "next": null, "correct": true },
                    { "text": "\\(-\\frac{2}{\\pi}\\)", "next": null, "correct": false }
                ]
            }
        }
    },
    "penta_cupid": {
        "id": "penta_cupid",
        "name": "Cupid Penta",
        "icon": "assets/penta_cupid.svg",
        "description": "Shoots arrows of pure wholesome vibes.",
        "startNode": "q1",
        "nodes": {
            "q1": {
                "text": "Your crush ghosts you for 3 days then sends “miss u” at 2 a.m. You immediately reply with 7 heart emojis and a voice note. What attachment style are you screaming?",
                "options": [
                    { "text": "Chill secure", "next": "q2", "correct": false },
                    { "text": "Anxious gremlin", "next": "q3", "correct": true },
                    { "text": "Avoidant ice cube", "next": "q2", "correct": false }
                ]
            },
            "q2": {
                "text": "You treat dating like a multiplayer game: new match every 20 minutes, flirty banter on cooldown, never upgrade to “official.” Which love style are you running?",
                "options": [
                    { "text": "Obsessive soulmate energy", "next": "q4", "correct": false },
                    { "text": "Ludus (professional fuckboy mode)", "next": "q5", "correct": true },
                    { "text": "Storge (basically roommates)", "next": "q4", "correct": false }
                ]
            },
            "q3": {
                "text": "You’re mid-argument and realize “oh shit I’m being dramatic because I’m scared they’ll leave.” Which emotional intelligence superpower just activated?",
                "options": [
                    { "text": "Self-regulation (breathe and chill)", "next": "q6", "correct": false },
                    { "text": "Self-awareness (clocked your bullshit)", "next": "q7", "correct": true },
                    { "text": "Motivation (pivot to “let's forget this”)", "next": "q6", "correct": false }
                ]
            },
            "q4": {
                "text": "First 3 dates: insane chemistry. Month 4: they leave dishes in the sink and you want to die. Which Helen Fisher stage just crashed and burned?",
                "options": [
                    { "text": "Lust (still horny tho)", "next": null, "correct": false },
                    { "text": "Attraction → Attachment reality check", "next": null, "correct": true },
                    { "text": "Attachment (picking out curtains)", "next": null, "correct": false }
                ]
            },
            "q5": {
                "text": "You cheated but tell yourself: “They never give me attention anyway” + “It was just one time.” What classic dissonance-reduction move is this?",
                "options": [
                    { "text": "Adding shiny new excuses", "next": null, "correct": true },
                    { "text": "Actually changing behavior", "next": null, "correct": false },
                    { "text": "Gaslighting yourself", "next": null, "correct": false }
                ]
            },
            "q6": {
                "text": "You accuse your partner of flirting while secretly thirsting over your ex’s gym selfies. What defense mechanism are you projecting like a cinema?",
                "options": [
                    { "text": "Denial (what selfies?)", "next": null, "correct": false },
                    { "text": "Projection (they’re the horny one)", "next": null, "correct": true },
                    { "text": "Rationalization (it's science)", "next": null, "correct": false }
                ]
            },
            "q7": {
                "text": "You got brutally dumped but now you're hitting the gym, in therapy, and actually like yourself. What spicy post-heartbreak glow-up is this?",
                "options": [
                    { "text": "Post-traumatic growth (hotter, wiser)", "next": null, "correct": true },
                    { "text": "Manic rebound era", "next": null, "correct": false },
                    { "text": "You're just pretending", "next": null, "correct": false }
                ]
            }
        }
    }
};
