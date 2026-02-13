const GAME_DATA = {
    "penta_chef": {
        "id": "penta_chef",
        "name": "Chef Penta",
        "icon": "assets/penta_chef.png",
        "description": "Cooks with love (and chaos).",
        "startNode": "q1",
        "nodes": {
            "q1": {
                "text": "Chef Penta is making a Valentine's cake! What's the secret ingredient?",
                "options": [
                    { "text": "Love (obviously)", "next": "q2a", "correct": true },
                    { "text": "Spicy Chili", "next": "q2b", "correct": false },
                    { "text": "Tears of joy", "next": "q2c", "correct": true }
                ]
            },
            "q2a": {
                "text": "Classic choice! Now, how should we decorate it?",
                "options": [
                    { "text": "Heart sprinkles", "next": "q3a", "correct": true },
                    { "text": "Edible glitter", "next": "q3b", "correct": true },
                    { "text": "A photo of you", "next": "q3c", "correct": false }
                ]
            },
            "q2b": {
                "text": "Spicy! A bold move. What do we serve it with?",
                "options": [
                    { "text": "Milk", "next": "q3a", "correct": true },
                    { "text": "More chili", "next": "q3b", "correct": false },
                    { "text": "Ice cream", "next": "q3c", "correct": true }
                ]
            },
            "q2c": {
                "text": "Emotional baking. I like it. What's the final touch?",
                "options": [
                    { "text": "A hug", "next": "q3a", "correct": true },
                    { "text": "A handwritten note", "next": "q3b", "correct": true },
                    { "text": "Buying a backup cake", "next": "q3c", "correct": false }
                ]
            },
            // Placeholder end nodes for now - in reality these would branch further
            "q3a": { "text": "END", "options": [] },
            "q3b": { "text": "END", "options": [] },
            "q3c": { "text": "END", "options": [] }
        }
    },
    "penta_wizard": {
        "id": "penta_wizard",
        "name": "Wizard Penta",
        "icon": "assets/penta_wizard.png",
        "description": "Casts spells of affection.",
        "startNode": "q1",
        "nodes": {
            "q1": {
                "text": "Wizard Penta needs a spell for eternal romance. What's the catalyst?",
                "options": [
                    { "text": "A rose petal", "next": "q2a", "correct": true },
                    { "text": "A frog leg", "next": "q2b", "correct": false },
                    { "text": "A text message", "next": "q2c", "correct": false }
                ]
            },
            "q2a": { "text": "END", "options": [] },
            "q2b": { "text": "END", "options": [] },
            "q2c": { "text": "END", "options": [] }
        }
    },
    "penta_cupid": {
        "id": "penta_cupid",
        "name": "Cupid Penta",
        "icon": "assets/penta_cupid.png",
        "description": "Shoots arrows of pure wholesome vibes.",
        "startNode": "q1",
        "nodes": {
            "q1": {
                "text": "Cupid Penta is aiming for a heart. What connects the shot?",
                "options": [
                    { "text": "A compliment", "next": "q2a", "correct": true },
                    { "text": "A bad pun", "next": "q2b", "correct": true },
                    { "text": "A meme", "next": "q2c", "correct": false }
                ]
            },
            "q2a": { "text": "END", "options": [] },
            "q2b": { "text": "END", "options": [] },
            "q2c": { "text": "END", "options": [] }
        }
    }
};
