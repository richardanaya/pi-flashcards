# pi-flashcards

A pi extension that turns your "thinking" wait time into a micro-learning session. While the AI works, you see a flashcard quiz question. When the thinking is done, the answer is revealed.

## How It Looks

```
Working... [Q: What is the time complexity of binary search?]     ← while thinking
───────────────────────────────────────────────────────────────────
...thinking content...
───────────────────────────────────────────────────────────────────
Thinking... [Q: What is the time complexity of binary search?  →  A: O(log n)]  ← when done
```

**While thinking:** The working message shows `Working... [Q: {question}]`.
**After thinking:** Both the question and answer are revealed — `Thinking... [Q: {question}  →  A: {answer}]` — shown as a notification and as the collapsed thinking label (visible with `Ctrl+T`).

## Installation

### Option 1: Install via npm (recommended)

```bash
pi install npm:pi-flashcards
```

### Option 2: Install from git

```bash
pi install git:github.com/richardanaya/pi-flashcards
```

### Option 3: Local development

Clone or copy this extension to your pi extensions directory:
```bash
git clone <repo-url> ~/.pi/extensions/pi-flashcards
```

Then reload pi to load the extension:
```
/reload
```

## Configuration

Create a `~/.pi/flashcards.json` file to customize your flashcard deck:

```json
{
  "flashcards": [
    {
      "question": "What does CSS stand for?",
      "answer": "Cascading Style Sheets"
    },
    {
      "question": "What is the time complexity of binary search?",
      "answer": "O(log n)"
    },
    {
      "question": "What is the capital of Portugal?",
      "answer": "Lisbon"
    }
  ]
}
```

### Configuration Options

- `flashcards`: An array of `{ question, answer }` objects. Each must have both `question` and `answer` as strings.
  - If empty or missing, the built-in deck of ~45 flashcards is used.
  - Questions are randomly selected each turn, never repeating back-to-back.

## Built-in Flashcards

The extension ships with ~75 flashcards covering:

| Category | Examples |
|----------|----------|
| Programming & Web | CSS, JSON, DOM, SQL, API, HTML, URL, HTTP, CRUD, JWT |
| Computer Science | Big-O notation, bits/bytes, ports, RAM, CPU, SSH, DNS, IP |
| Git | branch, checkout, status, add, commit |
| Linux / Terminal | ls, cd, pwd, grep, cat |
| JavaScript / TypeScript | const, let, typeof null, JSON.parse, === |
| General Knowledge | Capitals, planets, speed of light, moon landing, elements, continents |
| Beginner Japanese | Greetings, manners, food/drink, numbers 1-3, common nouns, question words |

## How It Works

The extension hooks into pi's lifecycle events:

1. **`session_start`** — Sets a neutral collapsed-thinking label (`"Flashcard..."`)
2. **`turn_start`** — Picks a random flashcard, sets the working message to `Working... [Q: {question}]`
3. **`turn_end`** — Reveals both question and answer: `Thinking... [Q: {question}  →  A: {answer}]`

The question and answer are visible in two ways:
- **Immediately:** A notification pops up showing `Thinking... [Q: {question}  →  A: {answer}]`
- **On collapse:** Press `Ctrl+T` to collapse the thinking block and see the same message as its label

## Creating Your Own Decks

Any JSON file with a `flashcards` array works. Here's a deck for learning Rust:

```json
{
  "flashcards": [
    { "question": "What keyword declares an immutable variable in Rust?", "answer": "let" },
    { "question": "What keyword declares a mutable variable in Rust?", "answer": "let mut" },
    { "question": "What does '&' denote in Rust?", "answer": "A reference / borrow" },
    { "question": "What macro prints to stdout in Rust?", "answer": "println!" },
    { "question": "What is Rust's package manager called?", "answer": "Cargo" }
  ]
}
```

## License

MIT
