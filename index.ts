import { homedir } from "node:os";
import { join } from "node:path";
import { readFile, access } from "node:fs/promises";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

// ── Types ───────────────────────────────────────────────────────────────────

interface Flashcard {
  question: string;
  answer: string;
}

interface Config {
  flashcards?: Flashcard[];
}

// ── Default flashcard deck ──────────────────────────────────────────────────

const DEFAULT_FLASHCARDS: Flashcard[] = [
  // Programming & Web
  { question: "What does CSS stand for?", answer: "Cascading Style Sheets" },
  { question: "What does JSON stand for?", answer: "JavaScript Object Notation" },
  { question: "What does DOM stand for?", answer: "Document Object Model" },
  { question: "What does SQL stand for?", answer: "Structured Query Language" },
  { question: "What does API stand for?", answer: "Application Programming Interface" },
  { question: "What does HTML stand for?", answer: "HyperText Markup Language" },
  { question: "What does URL stand for?", answer: "Uniform Resource Locator" },
  { question: "What does HTTP stand for?", answer: "HyperText Transfer Protocol" },
  { question: "What does CRUD stand for?", answer: "Create, Read, Update, Delete" },
  { question: "What does JWT stand for?", answer: "JSON Web Token" },

  // Computer Science
  { question: "What is the time complexity of binary search?", answer: "O(log n)" },
  { question: "What is the time complexity of quicksort (average)?", answer: "O(n log n)" },
  { question: "How many bits are in a byte?", answer: "8" },
  { question: "What is the default port for HTTP?", answer: "80" },
  { question: "What is the default port for HTTPS?", answer: "443" },
  { question: "What does RAM stand for?", answer: "Random Access Memory" },
  { question: "What does CPU stand for?", answer: "Central Processing Unit" },
  { question: "What does SSH stand for?", answer: "Secure Shell" },
  { question: "What does DNS stand for?", answer: "Domain Name System" },
  { question: "What does IP stand for?", answer: "Internet Protocol" },

  // Git
  { question: "What command creates a new branch in git?", answer: "git branch <name>" },
  { question: "What command switches branches in git?", answer: "git checkout <branch> or git switch" },
  { question: "What command shows the current status in git?", answer: "git status" },
  { question: "What command stages changes in git?", answer: "git add" },
  { question: "What command saves staged changes in git?", answer: "git commit" },

  // Linux / Terminal
  { question: "What command lists files in a directory?", answer: "ls" },
  { question: "What command changes directory?", answer: "cd" },
  { question: "What command prints the current directory?", answer: "pwd" },
  { question: "What command searches for text in files?", answer: "grep" },
  { question: "What command shows file contents?", answer: "cat" },

  // JavaScript / TypeScript
  { question: "What keyword declares a constant in JS?", answer: "const" },
  { question: "What keyword declares a block-scoped variable in JS?", answer: "let" },
  { question: "What does 'typeof null' return in JS?", answer: "'object'" },
  { question: "What method converts JSON string to object?", answer: "JSON.parse()" },
  { question: "What does '===' check that '==' does not?", answer: "Strict equality (type + value)" },

  // General Knowledge
  { question: "What is the capital of France?", answer: "Paris" },
  { question: "What is the capital of Japan?", answer: "Tokyo" },
  { question: "What is the largest planet in our solar system?", answer: "Jupiter" },
  { question: "What is the speed of light in vacuum (km/s)?", answer: "~300,000 km/s" },
  { question: "What year did the first moon landing occur?", answer: "1969" },
  { question: "What element has the chemical symbol 'O'?", answer: "Oxygen" },
  { question: "What element has the chemical symbol 'Au'?", answer: "Gold" },
  { question: "How many continents are there?", answer: "7" },
  { question: "What is the hardest natural substance?", answer: "Diamond" },
  { question: "What does a light-year measure?", answer: "Distance" },
];

// ── State ───────────────────────────────────────────────────────────────────

let config: Config = {};
let configPath: string;
let activeFlashcard: Flashcard | null = null;
let lastIndex = -1;

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Pick a random flashcard, never repeating the last one
 */
function getNextFlashcard(): Flashcard {
  const cards =
    config.flashcards && config.flashcards.length > 0
      ? config.flashcards
      : DEFAULT_FLASHCARDS;

  if (cards.length === 0) {
    return { question: "Thinking...", answer: "Done!" };
  }
  if (cards.length === 1) {
    return cards[0];
  }

  let index: number;
  do {
    index = Math.floor(Math.random() * cards.length);
  } while (index === lastIndex);

  lastIndex = index;
  return cards[index];
}

/**
 * Load user config from ~/.pi/flashcards.json
 */
async function loadConfig(): Promise<void> {
  try {
    await access(configPath);
    const content = await readFile(configPath, "utf-8");
    const userConfig = JSON.parse(content) as Config;
    config = {
      ...userConfig,
      // Validate flashcards array
      flashcards: Array.isArray(userConfig.flashcards)
        ? userConfig.flashcards.filter(
            (c) => typeof c.question === "string" && typeof c.answer === "string"
          )
        : undefined,
    };
  } catch {
    config = {};
  }
}

// ── Extension ───────────────────────────────────────────────────────────────

export default async function (pi: ExtensionAPI) {
  configPath = join(homedir(), ".pi", "flashcards.json");
  await loadConfig();

  // Set a neutral collapsed-label on session start
  pi.on("session_start", async (_event, ctx) => {
    if (!ctx.hasUI) return;
    ctx.ui.setHiddenThinkingLabel("Flashcard...");
  });

  // Show a question while the AI is thinking
  pi.on("turn_start", async (_event, ctx) => {
    if (!ctx.hasUI) return;

    activeFlashcard = getNextFlashcard();
    const question = activeFlashcard.question;

    // Working message displayed while the loader spins
    ctx.ui.setWorkingMessage(`Q: ${question}`);

    // Keep the collapsed label neutral until the answer is revealed
    ctx.ui.setHiddenThinkingLabel("Flashcard...");
  });

  // Reveal the answer when thinking is done
  pi.on("turn_end", async (_event, ctx) => {
    if (!ctx.hasUI || !activeFlashcard) return;

    const answer = activeFlashcard.answer;
    const question = activeFlashcard.question;

    // After thinking, the collapsed block (Ctrl+T) shows the answer
    ctx.ui.setHiddenThinkingLabel(`A: ${answer}`);

    // Also log to the chat so the user sees the answer immediately
    ctx.ui.notify(`A: ${answer}`, "info");
  });
}
