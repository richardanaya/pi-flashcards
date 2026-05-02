# pi-flashcards

Learn while you wait. Each time pi thinks, you get a flashcard quiz question. When it's done, the answer is revealed.

## How It Looks

```
Working... [Q: What is the time complexity of binary search?]
──────────────────────────────────────────────────────────────
...AI thinking...
──────────────────────────────────────────────────────────────
Thinking... [Q: What is the time complexity of binary search?  →  A: O(log n)]
```

The question pops up while pi works, and after it finishes you see both the question and answer together.

## Installation

```bash
pi install npm:pi-flashcards
```

Or from git:

```bash
pi install git:github.com/richardanaya/pi-flashcards
```

## Configuration

Create a `~/.pi/flashcards.json` file with your own cards:

```json
{
  "flashcards": [
    { "question": "What does CSS stand for?", "answer": "Cascading Style Sheets" },
    { "question": "What is the capital of Portugal?", "answer": "Lisbon" }
  ]
}
```

If you don't create a config file, the built-in deck of ~75 cards is used. Questions are randomized and never repeat back-to-back.

## Built-in Flashcards

The extension ships with ~75 cards covering:

| Category | Examples |
|----------|----------|
| Programming & Web | CSS, JSON, DOM, SQL, API, HTML, URL, HTTP, CRUD, JWT |
| Computer Science | Big-O notation, bits/bytes, ports, RAM, CPU, SSH, DNS, IP |
| Git | branch, checkout, status, add, commit |
| Linux / Terminal | ls, cd, pwd, grep, cat |
| JavaScript / TypeScript | const, let, typeof null, JSON.parse, === |
| General Knowledge | Capitals, planets, speed of light, moon landing, elements, continents |
| Beginner Japanese | Greetings, manners, food/drink, numbers 1-3, common nouns, question words |

## Build Your Own Deck

Ask pi to generate one for you:

```
Write 20 flashcards to ~/.pi/flashcards.json on the topic of <your topic>.
Each card needs a "question" and "answer" field.
```

## License

MIT
