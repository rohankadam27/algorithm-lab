🧪 Algorithm Lab — DAA Visualizer

An interactive, in-browser visualizer for 32 core Design & Analysis of Algorithms (DAA) topics, built for the SPPU MCA 2024 pattern syllabus — but useful for any DAA course.

Every algorithm comes with:
- 🎬 A step-by-step animated visualization with a live narration log
- 🎛 A "Your Data" tab** to run the algorithm on your own input (including a click-to-build visual graph editor for MST / shortest-path algorithms)
- 📖 A story-driven explanation — real-world analogy, how it works, real-world applications, and a common exam pitfall
- 💻 Clean, exam-ready pseudocode
- 📊 A complexity tab with time/space complexity and a full comparison table
- 🎵 Musical feedback — comparisons and swaps play notes from the Sa-Re-Ga-Ma-Pa (Indian sargam) scale, stepped through in Fibonacci order

No installation, no build step, no backend — it's a static site that runs entirely in the browser.

---
🚀 Live Demo

Once GitHub Pages is enabled on this repo, your app will be live at:
```
https://<rohankadam27>.github.io/<algorithm-lab>/
```

🖥 Run it locally

Just open `index.html` in any modern browser (Chrome, Edge, Firefox). That's it — no server or `npm install` required.

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
open index.html      # macOS
start index.html      # Windows
xdg-open index.html   # Linux
```

---

## 📚 Algorithms Covered (32 total)

**Sorting** — Bubble Sort · Selection Sort · Heap Sort · Merge Sort · Randomized Quick Sort

**Searching** — Linear Search · Binary Search

**String Matching** — KMP Algorithm · Rabin-Karp

**Divide & Conquer** — Min-Max Finding · Strassen's Matrix Multiplication

**Greedy** — Activity Selection · Kruskal's MST · Prim's MST · Fractional Knapsack · Job Sequencing · Optimal Merge Pattern · Dijkstra's Algorithm

**Backtracking** — N-Queens · Subset Sum · Graph Coloring

**Dynamic Programming** — 0/1 Knapsack · Longest Common Subsequence (LCS) · Floyd-Warshall

**Approximation & Metaheuristics** — Vertex Cover (2-approx) · TSP (2-approx) · Hill Climbing · Genetic Algorithm

**Supporting Theory** — Master Theorem · Amortized Analysis · Cook's Theorem / NP-Completeness · Job Shop Scheduling

---

## 🗂 Project Structure

```
algorithm-lab/
├── index.html                  # App shell — all tabs, layout, script includes
├── css/
│   ├── tokens.css              # Design tokens: colors, fonts, animated aurora backdrop
│   ├── layout.css              # Topbar, sidebar, main content layout
│   ├── components.css          # Buttons, concept/pseudocode/complexity styling, input forms
│   └── viz.css                 # Visualization elements: bars, graphs, DP tables, etc.
└── js/
    ├── core/
    │   ├── sound.js            # Sa-Re-Ga-Ma-Pa Fibonacci-order sound engine
    │   ├── state.js            # Algorithm registry: metadata + sidebar categories
    │   ├── ui.js                # Sidebar, tabs, and all visualization renderers
    │   └── input.js             # Custom data input forms + visual graph builder
    ├── algos/
    │   └── all.js               # Step generators for all 32 algorithms
    ├── content/
    │   ├── concepts.js          # Story explanations, real-world uses, exam pitfalls
    │   └── pseudocode.js        # Pseudocode for all 32 algorithms
    └── app.js                   # Main controller: playback, tab switching, wiring
```

---

## 🎛 Using Your Own Data

Open any runnable algorithm and click the **"Your Data" tab**:

- **Arrays / strings / numbers** — type comma-separated values directly
- **Graphs** (Kruskal's, Prim's, Dijkstra's, Floyd-Warshall, Vertex Cover, TSP) — use the visual builder: click empty canvas to add a node, switch to "Add Edge" mode and click two nodes to connect them (you'll be prompted for a weight), switch to "Delete" mode to remove nodes/edges
- Click **"Run with this data"** to re-generate the animation with your input

## 🎵 About the Sound Design

Every comparison, swap, and placement plays a note from the **Sa Re Ga Ma Pa Dha Ni Sa'** scale (just-intonation ratios), and the *sequence* of notes is chosen by walking the Fibonacci sequence (1, 1, 2, 3, 5, 8, 13...) modulo the scale length — so the melody is genuinely patterned, not random. The underlying data value only shifts the octave. Toggle it off anytime with the sound button in the top bar.

---

## 🛠 Tech Stack

Pure vanilla **HTML / CSS / JavaScript** — no frameworks, no build tools, no dependencies. Runs entirely client-side using the Web Audio API for sound and SVG/HTML for all visualizations.

## 📄 License

Free to use, modify, and share for educational purposes.

---

*Built as a study aid for Design & Analysis of Algorithms (DAA) — SPPU MCA 2024 pattern.*
