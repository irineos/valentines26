# 💝 Will You Be My Valentine?

A rigged wheel-of-fortune game to ask someone to be your Valentine. The wheel *looks* random but always lands on "Yes".. because love isn't left to chance.

## 🎯 How It Works

1. Wheel displays 5 "No" answers and 1 "Yes" answer
2. Spin the wheel (it's totally random, trust me ;))
3. Watch it magically land on "Yes" every time
4. After 3 rounds, reveal the truth with a sweet message

## 🚀 Live Demo

👉 [Valentines wheel](https://irineos.github.io/valentines26)

## 🛠️ Tech Stack

- HTML / CSS / JavaScript
- No frameworks, no build step
- GoatCounter for privacy-friendly analytics

## 📁 Files

```
index.html - Main app
style.css  - Dark theme with pink accents
script.js  - Rigged wheel logic
```

## 🖥️ Run Locally

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`


## 💡 Customize

Edit the arrays at the top of `script.js`:
- `badAnswers`     - "No" variations
- `winningAnswers` - "Yes" variations  
- `questions`      - Round questions

## 📊 Analytics Events

| Event | Meaning |
|-------|---------|
| `spin-round-1` | Started playing |
| `spin-round-2` | Getting invested |
| `spin-round-3` | Almost there |
| `reached-finale` | Saw the love message 💖 |

---

Made with 💕 for Valentine's Day 2026