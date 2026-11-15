// Dark Mode toggle
const toggleDarkBtn = document.getElementById("toggle-dark");

function setTheme(isDark) {
  document.body.classList.toggle("dark-mode", isDark);
  document.documentElement.setAttribute(
    "data-theme",
    isDark ? "dark" : "light"
  );
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

function applyTheme() {
  setTheme(localStorage.getItem("theme") === "dark");
}
applyTheme();
toggleDarkBtn.onclick = function () {
  setTheme(!document.body.classList.contains("dark-mode"));
};

function setAvatarInitial(userName) {
  const avatar = document.getElementById("profileAvatar");
  const initial = document.getElementById("avatarInitial");
  if (!avatar || !initial || !userName) return;
  initial.textContent = userName.charAt(0).toUpperCase();
  avatar.classList.add("has-initial");
}

// Chat logic with localStorage
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

function loadChatHistory() {
  const history = JSON.parse(
    localStorage.getItem("chatAppHistory") || "[]"
  );
  history.forEach((msg) => {
    appendMessage(msg.text, msg.sender, false);
    if (msg.notice) showNotice(msg.notice); // small note under that reply
  });
}

function saveMessage(text, sender, notice) {
  const history = JSON.parse(
    localStorage.getItem("chatAppHistory") || "[]"
  );
  // Only the latest reply keeps its notice
  if (notice) history.forEach((m) => delete m.notice);
  const entry = { text, sender, timestamp: new Date().toISOString() };
  if (notice) entry.notice = notice;
  history.push(entry);
  localStorage.setItem("chatAppHistory", JSON.stringify(history));
}

function appendMessage(text, sender, save = true) {
  const msgDiv = document.createElement("div");
  msgDiv.className = "message " + sender;
  const span = document.createElement("span");
  span.textContent = text;
  msgDiv.appendChild(span);
  // <div> ${formatDate(text.timestamp)}</div>`
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return msgDiv;
  if (save) saveMessage(text, sender);
}

 // UI Helper functions
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60)
    return diffMinutes <= 1 ? "Just now" : `${diffMinutes} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
}

// Function to append a loading message
function appendLoadingMessage() {
  const loadingMsgElement = document.createElement("div");
  loadingMsgElement.classList.add("loading-message", "bot-message");
  loadingMsgElement.id = "loading-dots";
  loadingMsgElement.textContent = "...";
  chatWindow.appendChild(loadingMsgElement);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
function removeLoadingMessage() {
  const loadingMsgElement = document.getElementById("loading-dots");
  if (loadingMsgElement) {
    loadingMsgElement.remove();
  }
}

const botResponses = {
  time: () => `It's ${new Date().toLocaleTimeString()} right now.`,
  joke: () =>
    "Why did the developer go broke? Because he used up all his cache!",

  weather: () =>
    "I can't check the weather, but I hope it's nice where you are!",
  "your name": () => "I'm ChatApp Bot, your friendly assistant.",
  "how are you": () => "I'm just a bot, but I'm doing great! 😊",
  "love you": (userName) =>
    `Love is a beautiful thing! Spread it around! ❤️. I love you too ${userName}! 😊`,
  hate: () => "Hate is a strong word. Let's focus on positivity!",
  food: (userName) =>
    `I love food! What's your favorite dish ${userName}?`,
  music: (userName) =>
    `Music is a universal language!🎵 What's your favorite genre ${userName}?`,
  movie: (userName) =>
    `Movies are great! Do you have a favorite genre, ${userName}?`,
  gam: (userName) =>
    `I love games! What games do you enjoy playing, ${userName}?`,
  news: () =>
    "I can't browse the news, but I hope you're staying informed!",
  advice: () => "Always be kind and keep learning!",
  football: () =>
    "Football is a great sport! ⚽️, With 'Paris Saint Germain' as the best team presently 👌 Do you have a favorite team?",
  quote: () =>
    "Here's a quote for you: 'The only limit to our realization of tomorrow is our doubts of today.'",
  help: () => "You can ask me anything or just chat!",
  "best club in history": (userName) =>
    `The best club in history of football is 'Real Madrid' with 15 champions leagues in their counter! 🤯And many other trophies, Ranking them top in the history of football. Anything else ${userName}?`,
  chat: (userName) =>
    `That's nice🙂! So, ${userName}, what do you want to talk about?`,
  bored: (userName) =>
    `Ohh sorry ${userName} 🙂, I know how it can be frustrating, but I can help u go out of that situation 😊! How can I help, a joke, a quote, and advice or something else?`,
};
const greetings = ["hello", "hi", "hey", "greetings", "sup"];
const acknowledgements = [
  "ok",
  "kk",
  "okay",
  "alright",
  "yh",
  "love that",
  "love it",
  "like it",
  "like that",
  "yeah",
  "yep",
];
const farewells = ["bye", "goodbye", "see you later", "take care"];
const followUp = ["yes", "maybe", "sure", "absolutely"];
const denial = ["no", "nah"];
const insults = ["idiot", "fool", "stupid", "dumb"];
const thanks = ["thanks", "thank you", "thx", "ty"];
const positivity = [
  "like",
  "appreciate",
  "enjoy",
  "happy",
  "great",
  "good",
  "awesome",
  "fantastic",
  "wonderful",
  "amazing",
  "cool",
  "nice",
  "excellent",
  "super",
  "brilliant",
  "fabulous",
  "marvelous",
  "outstanding",
  "spectacular",
  "terrific",
  "fine",
];
const naps = [
  "nap",
  "sleep",
  "rest",
  "relax",
  "chill",
  "unwind",
  "recharge",
  "take a break",
  "good night",
  "bedtime",
  "gd night",
  "goodnight",
];

// ---------- Daily AI cap + notices ----------
const DAILY_AI_LIMIT = 30; // AI replies per visitor per day
const LOW_AI_WARNING_AT = 3; // warn when this many (or fewer) are left
const USAGE_KEY = "chatAppAiUsage";

const NOTICE_LIMIT =
  "You've reached today's AI limit. I'm now in Basic mode, so my replies will be much simpler and noticeably less intelligent until tomorrow.";
const NOTICE_OFFLINE =
  "The AI is unavailable right now, so I'm in Basic mode. My replies will be much simpler and less intelligent until it's back.";
function noticeLow(left) {
  return left > 0
    ? `${left} AI ${left === 1 ? "reply" : "replies"} left today. After that I'll switch to Basic mode, with much simpler replies.`
    : "That was your last AI reply for today. I'll switch to Basic mode, with much simpler and less intelligent replies, until tomorrow.";
}

function todayKey() {
  const d = new Date();
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}
function getAiUsage() {
  try {
    const u = JSON.parse(localStorage.getItem(USAGE_KEY));
    if (u && u.date === todayKey() && Number.isInteger(u.count)) return u;
  } catch (e) {}
  return { date: todayKey(), count: 0 };
}
function addAiUsage() {
  const u = getAiUsage();
  u.count += 1;
  localStorage.setItem(USAGE_KEY, JSON.stringify(u));
  return u.count;
}

// Small grey note under the latest reply (only one is visible at a time)
function showNotice(text) {
  document.querySelectorAll(".ai-notice").forEach((n) => n.remove());
  const el = document.createElement("div");
  el.className = "ai-notice";
  el.textContent = text;
  chatWindow.appendChild(el);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
(function injectNoticeStyles() {
  const st = document.createElement("style");
  st.textContent =
    ".ai-notice{font-size:.72rem;line-height:1.35;opacity:.7;margin:2px 14px 12px;max-width:85%;text-align:left;}";
  document.head.appendChild(st);
})();

// Tidy the model's text: hidden reasoning, "Bot:" prefixes, markdown
function cleanAIReply(text) {
  return String(text || "")
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<\/?think>/gi, "")
    .replace(/^\s*(?:chatapp bot|assistant|bot)\s*:\s*/i, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/`+/g, "")
    .replace(/\s*\n\s*/g, " ")
    .replace(/^"(.*)"$/, "$1")
    .trim();
}

// ---------- AI reply via Cloudflare Worker ----------
// Paste your deployed Worker URL here (see the setup guide)
const WORKER_URL = "https://chatapp-proxy.YOUR-SUBDOMAIN.workers.dev";
const MAX_CONTEXT_MESSAGES = 10; // how many recent messages are sent as context
const AI_TIMEOUT_MS = 20000;

function buildContextMessages() {
  const history = JSON.parse(
    localStorage.getItem("chatAppHistory") || "[]"
  );
  const merged = [];
  history.slice(-MAX_CONTEXT_MESSAGES).forEach((m) => {
    const role = m.sender === "user" ? "user" : "assistant";
    const last = merged[merged.length - 1];
    // Merge consecutive messages of the same role (some models require alternation)
    if (last && last.role === role) last.content += "\n" + m.text;
    else merged.push({ role, content: m.text });
  });
  // Conversation should start with a user message
  while (merged.length && merged[0].role !== "user") merged.shift();
  return merged;
}

async function getAIReply(userName) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: buildContextMessages(),
        userName,
      }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error("Worker responded " + res.status);
    const data = await res.json();
    if (!data.reply) throw new Error("Empty reply from Worker");
    const clean = cleanAIReply(data.reply);
    if (!clean) throw new Error("Empty reply after cleaning");
    return clean;
  } finally {
    clearTimeout(timer);
  }
}

function typeWriter(text, element, delay = 20, onDone) {
  element.textContent = "";
  const letter = Array.from(text); // keeps emoji intact
  let i = 0;

  function addLetter() {
    if (i < letter.length) {
      element.textContent += letter[i];
      i++;
      setTimeout(addLetter, delay);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    } else if (onDone) {
      onDone();
    }
  }
  addLetter();
}

// ---------- Smarter rule-based fallback ("Basic mode") ----------
// Whole-word matching (so "hi" no longer matches "this"), intent priority,
// reply variety, light memory of the conversation and a few extra skills.
const fbState = { lastIntent: null, pending: null, unknown: 0, lastPick: {} };

const jokes = [
  "Why did the developer go broke? Because he used up all his cache!",
  "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
  "There are 10 kinds of people: those who understand binary and those who don't.",
  "Why was the JavaScript developer sad? Because he didn't Node how to Express himself!",
  "I would tell you a UDP joke, but you might not get it.",
];
const quotes = [
  "The only limit to our realization of tomorrow is our doubts of today.",
  "It always seems impossible until it's done.",
  "Small steps every day lead to big results.",
  "Don't watch the clock; do what it does. Keep going.",
  "You don't have to be great to start, but you have to start to be great.",
];
const adviceList = [
  "Always be kind and keep learning!",
  "Take a short break when you feel stuck. Your brain keeps working in the background.",
  "Drink some water and stretch, small habits make big differences. 💧",
  "Don't compare your chapter 1 to someone else's chapter 20.",
  "Done is better than perfect, start small and improve as you go.",
];
const repeatables = {
  joke: () => pick("joke", jokes),
  quote: () => `Here's another one: '${pick("quote", quotes)}'`,
  advice: () => pick("advice", adviceList),
};
const topicFollowUps = {
  food: [
    "Mmm, that sounds delicious! 😋 Do you cook it yourself or order it?",
    "Nice choice! 🍽️ Is that your go-to comfort food?",
  ],
  music: [
    "Great taste! 🎵 Do you have a favorite artist in that style?",
    "Love that! 🎧 What's the last song you had on repeat?",
  ],
  movie: [
    "Good pick! 🎬 What's the best one you've watched recently?",
    "Nice! 🍿 Do you prefer watching at home or at the cinema?",
  ],
  game: [
    "Awesome! 🎮 Do you play solo or with friends?",
    "Cool! 🕹️ What's the hardest level you've ever beaten?",
  ],
  football: [
    "Nice! ⚽ Do you prefer watching matches or playing them?",
    "Great! Who's your all-time favorite player?",
  ],
};

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
// Whole-word / whole-phrase match against a list of keywords
function hasWord(text, list) {
  const words = Array.isArray(list) ? list : [list];
  return new RegExp(
    "\\b(?:" + words.map(escapeRegex).join("|") + ")\\b",
    "i"
  ).test(text);
}
// Random choice that avoids repeating the previous one
function pick(key, options) {
  if (options.length === 1) return options[0];
  let i;
  do {
    i = Math.floor(Math.random() * options.length);
  } while (i === fbState.lastPick[key]);
  fbState.lastPick[key] = i;
  return options[i];
}
function getUserName() {
  try {
    return JSON.parse(localStorage.getItem("name")) || "User";
  } catch (e) {
    return "User";
  }
}
function tryMath(msg) {
  const m = msg.match(
    /(-?\d+(?:\.\d+)?)\s*([+\-*\/x×÷])\s*(-?\d+(?:\.\d+)?)/
  );
  if (!m) return null;
  const asksMath =
    /^[\d\s.+\-*\/x×÷()=?]+$/.test(msg) ||
    /\b(what'?s|what is|calculate|solve|compute|how much is|equals?)\b/.test(msg);
  if (!asksMath) return null;
  const a = parseFloat(m[1]);
  const b = parseFloat(m[3]);
  const op = m[2];
  let r;
  if (op === "+") r = a + b;
  else if (op === "-") r = a - b;
  else if (op === "*" || op === "x" || op === "×") r = a * b;
  else {
    if (b === 0) return "I can't divide by zero, that would break the universe! 😅";
    r = a / b;
  }
  return `${a} ${op} ${b} = ${parseFloat(r.toFixed(6))}`;
}

function botReply(message) {
  const raw = String(message || "").trim();
  const msg = raw
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\s+/g, " ");
  const words = msg.split(" ").filter(Boolean);
  const n = words.length;
  const name = getUserName();
  const negation = /\b(not|don't|dont|never|isn't|wasn't|can't|cant|no)\b/;

  // Order matters: specific intents first, generic ones last
  const intents = [
    {
      id: "crisis",
      test: () =>
        /\b(suicide|suicidal|kill myself|end my life|want to die|self[- ]?harm)\b/.test(msg),
      reply: () =>
        `I'm really sorry you're feeling this way, ${name}. You deserve real support: please talk to someone you trust, or contact a local emergency number or helpline right now. You don't have to go through this alone. 💙`,
    },
    {
      id: "learn-name",
      test: () => /\b(?:my name is|call me)\s+[a-z\u00c0-\u017f'-]{2,20}/i.test(raw),
      reply: () => {
        const m = raw.match(/\b(?:my name is|call me)\s+([a-z\u00c0-\u017f'-]{2,20})/i);
        const newName = m[1].charAt(0).toUpperCase() + m[1].slice(1);
        localStorage.setItem("name", JSON.stringify(newName));
        setAvatarInitial(newName);
        return `Nice to meet you, ${newName}! 😊 I'll call you that from now on.`;
      },
    },
    {
      id: "my-name",
      test: () =>
        /\b(what'?s|what is|do you (know|remember))\b.*\bmy name\b|\bwho am i\b/.test(msg),
      reply: () =>
        name === "User"
          ? "I don't know your name yet! Tell me with \"my name is ...\" 😊"
          : `Your name is ${name}! 😊`,
    },
    { id: "math", test: () => tryMath(msg) !== null, reply: () => tryMath(msg) },
    {
      id: "repeat",
      keepIntent: true,
      pending: "more",
      test: () =>
        repeatables[fbState.lastIntent] &&
        n <= 4 &&
        ((hasWord(msg, ["another", "again", "one more", "more"]) &&
          !hasWord(msg, greetings)) ||
          (fbState.pending === "more" &&
            hasWord(msg, ["yes", "yeah", "yep", "sure", "ok", "okay", "please", "absolutely"]))),
      reply: () => repeatables[fbState.lastIntent]() + " Want another? 😄",
    },
    {
      id: "farewell",
      test: () => hasWord(msg, farewells),
      reply: () =>
        pick("farewell", [
          `Goodbye! Have a wonderful day, ${name}! See you later! 👋`,
          `Take care, ${name}! Come back anytime. 👋`,
        ]),
    },
    {
      id: "thanks",
      test: () => hasWord(msg, thanks),
      reply: () =>
        pick("thanks", [
          `You're welcome, ${name}! 😊 Need anything else?`,
          `Anytime, ${name}! 😊 Anything else on your mind?`,
        ]),
    },
    {
      id: "insult",
      test: () => hasWord(msg, insults),
      reply: () => `Sorry if I hurt you, ${name}! 😔 Do you want to talk about something else?`,
    },
    {
      id: "greeting",
      test: () => n <= 3 && hasWord(msg, greetings),
      reply: () =>
        pick("greeting", [
          `Hello ${name}! 👋 How can I help you today?`,
          `Hey ${name}! 😊 Good to see you. What's on your mind?`,
          `Hi ${name}! 👋 What would you like to chat about?`,
        ]),
    },
    {
      id: "howareyou",
      test: () =>
        /\bhow (are|r) (you|u)\b|\bhow'?s it going\b|\bwhat'?s up\b|\bhow do you do\b/.test(msg),
      reply: () =>
        pick("howareyou", [
          `I'm just a bot, but I'm doing great! 😊 How about you, ${name}?`,
          `Feeling fantastic, thanks for asking! 😄 How are you doing, ${name}?`,
        ]),
    },
    {
      id: "yourname",
      test: () =>
        /\b(your name|who are you|what are you|are you (a |an )?(bot|robot|ai|human|real))\b/.test(msg),
      reply: () => botResponses["your name"](),
    },
    {
      id: "time",
      test: () =>
        /\bwhat(?:'s| is)? (?:the )?(?:current )?time\b|\bwhat time\b|\btime is it\b|\btell me the time\b|\bcurrent time\b/.test(msg),
      reply: () => botResponses.time(),
    },
    {
      id: "date",
      test: () =>
        /\bwhat(?:'s| is)? (?:the )?(?:today'?s )?date\b|\bwhat day\b|\bwhich day\b|\btoday'?s date\b|\bwhat'?s today\b|\bwhat is today\b/.test(msg),
      reply: () =>
        `Today is ${new Date().toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}.`,
    },
    {
      id: "joke",
      pending: "more",
      test: () => /\bjokes?\b|\bmake me laugh\b|\bfunny\b/.test(msg),
      reply: () => repeatables.joke() + " Want another? 😄",
    },
    {
      id: "quote",
      pending: "more",
      test: () => /\bquotes?\b|\binspire me\b|\binspiration\b/.test(msg),
      reply: () => `Here's a quote for you: '${pick("quote", quotes)}' Want another?`,
    },
    {
      id: "advice",
      pending: "more",
      test: () => /\badvice\b|\bwhat should i do\b|\bany tips?\b/.test(msg),
      reply: () => repeatables.advice() + " Want more?",
    },
    { id: "weather", test: () => hasWord(msg, ["weather", "rain", "raining", "sunny", "temperature"]), reply: () => botResponses.weather() },
    { id: "news", test: () => hasWord(msg, ["news", "headlines"]), reply: () => botResponses.news() },
    { id: "bestclub", test: () => /\bbest (club|team)\b/.test(msg), reply: () => botResponses["best club in history"](name) },
    {
      id: "football",
      pending: "football",
      test: () =>
        hasWord(msg, ["football", "soccer", "psg", "paris saint germain", "real madrid", "barca", "barcelona", "messi", "ronaldo", "champions league"]),
      reply: () => botResponses.football(),
    },
    { id: "love", test: () => /\b(i )?love (you|u)\b/.test(msg), reply: () => botResponses["love you"](name) },
    { id: "hate", test: () => hasWord(msg, "hate"), reply: () => botResponses.hate() },
    {
      id: "food",
      pending: "food",
      test: () => hasWord(msg, ["food", "eat", "eating", "hungry", "dish", "dinner", "lunch", "breakfast", "pizza", "cook", "cooking"]),
      reply: () => botResponses.food(name),
    },
    {
      id: "music",
      pending: "music",
      test: () => hasWord(msg, ["music", "song", "songs", "singer", "rap", "album", "playlist"]),
      reply: () => botResponses.music(name),
    },
    {
      id: "movie",
      pending: "movie",
      test: () => hasWord(msg, ["movie", "movies", "film", "films", "cinema", "series", "netflix"]),
      reply: () => botResponses.movie(name),
    },
    {
      id: "game",
      pending: "game",
      test: () => /\bgam(e|es|ing|er|ers)\b|\bplaystation\b|\bfifa\b|\bpubg\b/.test(msg),
      reply: () => botResponses.gam(name),
    },
    {
      id: "bored",
      test: () => hasWord(msg, ["bored", "boring"]),
      reply: () => botResponses.bored(name),
    },
    {
      id: "feelings",
      test: () => hasWord(msg, ["sad", "stressed", "upset", "lonely", "angry", "depressed", "anxious", "worried"]),
      reply: () =>
        pick("feelings", [
          `I'm sorry you're feeling that way, ${name}. 💙 Want to tell me what's going on?`,
          `That sounds tough, ${name}. I'm here to listen. If it feels heavy, talking to someone you trust can really help. 💙`,
        ]),
    },
    {
      id: "nap",
      test: () => hasWord(msg, naps),
      reply: () => `Naps are great! 😴 They help recharge your energy. Sleep tight ${name}!😴`,
    },
    {
      id: "help",
      test: () => hasWord(msg, "help"),
      reply: () =>
        "I can chat, tell jokes, share quotes and advice, talk football, music, movies, games or food, do quick math and tell you the time. What do you feel like?",
    },
    { id: "chat", test: () => hasWord(msg, ["chat", "talk"]), reply: () => botResponses.chat(name) },
    {
      id: "yes",
      test: () => n <= 4 && hasWord(msg, followUp),
      reply: () => "Great! What would you like to talk about?",
    },
    {
      id: "no",
      test: () => n <= 4 && /\b(?:no(?! (?:problem|worries|worry))|nah|nope)\b/.test(msg),
      reply: () => `Ok then!🥲 What else do you have in mind ${name}?`,
    },
    {
      id: "ack",
      test: () => n <= 5 && hasWord(msg, acknowledgements.concat(["no problem", "no worries"])),
      reply: () =>
        pick("ack", [
          `Got it! If you have anything else to talk about, feel free to share it, ${name}! 😊`,
          `Alright! I'm here whenever you want to chat more, ${name}. 😊`,
        ]),
    },
    {
      // An answer to the question the bot just asked (e.g. "what's your favorite genre?")
      id: "topic-answer",
      test: () => !!topicFollowUps[fbState.pending] && n <= 8,
      keepIntent: true,
      reply: () => pick("topic-" + fbState.pending, topicFollowUps[fbState.pending]),
    },
    {
      id: "positive",
      test: () => hasWord(msg, positivity),
      reply: () =>
        negation.test(msg)
          ? `Oh no, sorry to hear that, ${name}. 😔 Want to talk about it, or should I cheer you up with a joke?`
          : pick("positive", [
              `That's great to hear, ${name}! 😊 Keep spreading the positivity!`,
              `Love the good vibes, ${name}! 😄 What else is on your mind?`,
            ]),
    },
  ];

  for (const intent of intents) {
    if (intent.test()) {
      const reply = intent.reply();
      if (!intent.keepIntent) fbState.lastIntent = intent.id;
      fbState.pending = intent.pending || null;
      fbState.unknown = 0;
      return reply;
    }
  }

  // Nothing matched
  fbState.pending = null;
  fbState.unknown += 1;
  const base = pick("unknown", [
    `Hmm, I'm not sure I got that, ${name}. 🤔 Could you rephrase it?`,
    `I'm a bit lost on that one, ${name}. Want to try asking another way?`,
    `Sorry ${name}, I don't understand that yet. Could you put it differently?`,
  ]);
  if (fbState.unknown >= 2) {
    fbState.unknown = 0;
    return base + " I'm in simple mode right now, but I can chat about jokes, quotes, football, music, movies, games, food, quick math and the time.";
  }
  return base;
}

//   function botReply(message) {
//     message = message.toLowerCase();
//     userName = JSON.parse(localStorage.getItem("name")) || "User";
//     // Bot reply logic
//     let reply;
//     if (message.includes("weather")) {
//       reply =
//         "I can't check the weather, but I hope it's nice where you are!";
//     } else if (message.includes("joke")) {
//       reply =
//         "Why did the developer go broke? Because he used up all his cache!";
//     } else if (message.includes("time")) {
//       reply = "It's " + new Date().toLocaleTimeString() + " right now.";
//     } else if (
//       message.includes("thanks") ||
//       message.includes("thank you")
//     ) {
//       reply = `You're welcome, ${userName}! 😊 Need anything else?`;
//     } else if (
//       message.includes("hello") ||
//       message.includes("hi") ||
//       message.includes("hey")
//     ) {
//       reply = "Hello! 👋 How can I help you today?";
//     } else if (message.includes("how are you")) {
//       reply = "I'm just a bot, but I'm doing great! 😊";
//     } else if (message.includes("your name")) {
//       reply = "I'm ChatApp Bot, your friendly assistant.";
//     } else if (message.includes("bye")) {
//       reply = `Goodbye! Have a wonderful day, ${userName}! See you later! 👋`;
//     } else if (
//       message.includes("ok") ||
//       message.includes("okay") ||
//       message.includes("alright") ||
//       message.includes("yh") ||
//       message.includes("love that") ||
//       message.includes("love it") ||
//       message.includes("like it") ||
//       message.includes("like that") ||
//       message.includes("yeah")
//     ) {
//       reply = "Great!";
//       } else if (
//       message.includes("idiot") ||
//       message.includes("fool") ||
//       message.includes("stupid") ||
//       message.includes("dumb") ||
//       message.includes("fuck you") ||
//       message.includes("fuck u") ||
//       message.includes("dull")
//     ) {
//       reply = `Sorry if I hurt you, ${userName}! 😔 Do you want to talk about something else?`;
//       return reply;
//       for (const message of followUp) {
//         if (message === "yes") {
//           reply = "Great! What would you like to talk about?";
//         } else {
//           reply = "I'm here to chat! Tell me more.";
//         }
//       }
//     } else if (message.includes("help")) {
//       reply = "You can ask me anything or just chat!";
//     } else if (message.includes("chat")) {
//       reply = `Thats nice🙂! So, ${userName} what is your hobby?`;
//     } else if (
//         message.includes("i love you") ||
//         message.includes("i love u")
//     ) {
//       reply = `Love is a beautiful thing! Spread it around! ❤️. I love you too ${userName}! 😊`;
//     } else if (message.includes("hate")) {
//       reply = "Hate is a strong word. Let's focus on positivity!";
//     } else if (message.includes("food")) {
//       reply = `I love food! What's your favorite dish ${userName}?`;
//     } else if (message.includes("music")) {
//       reply = `Music is the language of the soul! What do you like to listen to? ${userName}`;
//     } else if (message.includes("movie")) {
//       reply = `Movies are great! Do you have a favorite genre, ${userName}?`;
//     } else if (message.includes("game")) {
//       reply = `I love games! What games do you enjoy playing, ${userName}?`;
//     } else if (message.includes("news")) {
//       reply =
//         "I can't browse the news, but I hope you're staying informed!";
//     } else if (message.includes("advice")) {
//       reply = "Always be kind and keep learning!";
//     } else if (message.includes("quote")) {
//       reply =
//         "Here's a quote for you: 'The only limit to our realization of tomorrow is our doubts of today.'";
//     } else {
//       reply = "I'm here to chat! Tell me more.";
//     }
//     return reply;
//   }

// Chat form: AI first (with a daily cap), rule-based "Basic mode" as fallback
let isReplying = false;
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

chatForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  if (isReplying) return;

  const userMsg = userInput.value.trim();
  if (!userMsg) return;

  isReplying = true;
  appendMessage(userMsg, "user");
  saveMessage(userMsg, "user");
  userInput.value = "";
  appendLoadingMessage();

  const userName = getUserName();
  let reply;
  let notice = null;

  if (getAiUsage().count >= DAILY_AI_LIMIT) {
    // Daily cap reached: Basic mode + notice
    await pause(700);
    reply = botReply(userMsg);
    notice = NOTICE_LIMIT;
  } else {
    try {
      reply = await getAIReply(userName);
      const left = DAILY_AI_LIMIT - addAiUsage();
      if (left <= LOW_AI_WARNING_AT) notice = noticeLow(left);
    } catch (err) {
      console.warn("AI unavailable, using Basic mode:", err);
      reply = botReply(userMsg);
      notice = NOTICE_OFFLINE;
    }
  }

  removeLoadingMessage();
  const botBubbleElement = appendMessage("", "bot");
  saveMessage(reply, "bot", notice);
  typeWriter(reply, botBubbleElement, 12, () => {
    if (notice) showNotice(notice);
    isReplying = false;
  });
});

// Clear chat logic
document.getElementById("clear-chat").onclick = function () {
  localStorage.removeItem("chatAppHistory");
  chatWindow.innerHTML = "";
  const userName = prompt("Welcome to ChatUp!  Enter your name");

  if (userName) {
  setAvatarInitial(userName);
  const botBubbleElement = appendMessage("", "bot");
  const welcomeMessage = `Nice to meet you, ${userName}! 😊`;
    typeWriter(welcomeMessage, botBubbleElement);
    saveMessage(welcomeMessage, "bot");
  }
  localStorage.setItem("name", JSON.stringify(userName));
  const firstMessage ="I'm ChatApp Bot 🤖. Type something to start chatting.";
  const botBubbleElement = appendMessage("", "bot");
  typeWriter(firstMessage, botBubbleElement);
  saveMessage(firstMessage, "bot");
};

window.onload = () => {
  loadChatHistory();
  const savedName = JSON.parse(localStorage.getItem("name"));
  if (savedName) setAvatarInitial(savedName);
  const history = JSON.parse(
    localStorage.getItem("chatAppHistory") || "[]"
  );
  if (history.length === 0) {
    const userName = prompt("Welcome to ChatUp!  Enter your name");
    if (userName) {
      setAvatarInitial(userName);
      const welcomeMessage = `Nice to meet you, ${userName}! 😊`;
      const botBubbleElement = appendMessage("", "bot");
      typeWriter(welcomeMessage, botBubbleElement);
      saveMessage(welcomeMessage, "bot");
    }
    localStorage.setItem("name", JSON.stringify(userName));
    const firstMessage =
      "I'm ChatApp Bot 🤖. Type something to start chatting.";
    const botBubbleElement = appendMessage("", "bot");
    typeWriter(firstMessage, botBubbleElement);
    saveMessage(firstMessage, "bot");
  }
};