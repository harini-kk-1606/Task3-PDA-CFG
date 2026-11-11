# AutomataLab — CFG & PDA Case Studies

An interactive web project for **21CSC301T – Formal Language and Automata, CLA-2 Task 3** at SRM Institute of Science and Technology. It demonstrates Context-Free Grammars (CFGs) and Pushdown Automata (PDAs) using three language-validation case studies.

## Case studies

1. **Balanced parentheses** — CFG `S → (S)S | ε`; a deterministic stack procedure pushes on `(` and pops on `)`.
2. **Arithmetic expression validation** — an unambiguous expression grammar with precedence (`*`, `/` before `+`, `-`) and a recursive-descent parser that displays production steps.
3. **Palindrome checking** — CFG `S → aSa | bSb | a | b | ε`; an NPDA-style simulator tries possible midpoint choices and compares the second half against the stack.

## Features

- Responsive dark interface; no build tools or dependencies required.
- Interactive input validation and example strings.
- Step-by-step stack or grammar-production trace.
- CFG productions, language definition, PDA explanation, and model notes.
- Accepted and rejected cases, including invalid alphabet symbols.
- Comparison of the three models and discussion of limitations.

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a modern browser.
3. Select a case study, enter a string, and click **Run automaton** (or press Enter).

No server, package installation, or API key is required.

## Deploy on GitHub Pages

1. Create a public GitHub repository, for example `CLA2-Task3-PDA-CFG`.
2. Upload all files and folders from this project; keep `index.html` at the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**, choose `main` and `/ (root)`, then save.
5. Wait for the Pages deployment and open the published URL.

## Project structure

```text
CLA2-Task3-PDA-CFG/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── docs/
│   └── CASE_STUDY_REPORT.md
└── README.md
```

## Important modelling notes

- A PDA is the formal machine model; the browser implementation is an educational simulator of the relevant stack/parser behaviour, not a low-level formal transition-table interpreter for every case.
- Balanced parentheses are a deterministic one-type bracket matching example.
- Arithmetic parsing uses a recursive-descent implementation of the stated CFG. It validates syntax only; it does not evaluate expressions, perform type checking, or verify variable declarations.
- Palindrome recognition over `{a,b}` uses nondeterministic midpoint selection. The simulator checks all possible split points conceptually and displays one successful split when one exists.
- A finite automaton cannot recognize arbitrary balanced-parenthesis nesting or the general palindrome language because those require unbounded memory.

## Academic integrity

Use this project as a learning and demonstration aid. Review the grammar, traces, and report, test the examples yourself, and adapt the explanation to your own understanding and course submission requirements. Add your own name, register number, team/member details, screenshots, and contribution statement where required.

## Course alignment

- Course: **21CSC301T — Formal Language and Automata**
- Assessment: **Continuous Learning Assessment 2, Task 3**
- Topic: **Case Study-Based Analysis and Design using Pushdown Automata and Context-Free Grammar**
- SDG alignment stated in the assignment: **SDG 9 — Industry, Innovation and Infrastructure**
