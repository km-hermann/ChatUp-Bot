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
  history.forEach((msg) => appendMessage(msg.text, msg.sender, false));
}

function saveMessage(text, sender) {
  const history = JSON.parse(
    localStorage.getItem("chatAppHistory") || "[]"
  );
  history.push({ text, sender, timestamp: new Date().toISOString() });
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

// ---------- AI reply via Cloudflare Worker ----------
// Paste your deployed Worker URL here (see the setup guide)
const WORKER_URL = "https://chatup-bot.hermannmea777.workers.dev/";
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
    return data.reply;
  } finally {
    clearTimeout(timer);
  }
}

function typeWriter(text, element, delay = 20) {
  element.textContent = "";
  const letter = text.split("");
  let i = 0;

  function addLetter() {
    if (i < letter.length) {
      element.textContent += letter[i] + "";
      i++;
      setTimeout(addLetter, delay);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  }
  addLetter();
}

function botReply(message) {
  message = message.toLowerCase();
  const userName = JSON.parse(localStorage.getItem("name")) || "User";
  // Bot reply logic

  // Check for greetings
  for (const greeting of greetings) {
    if (message.includes(greeting)) {
      return `Hello ${userName}! 👋 How can I help you today? `;
    }
  }
  // Check for farewells
  for (const farewell of farewells) {
    if (message.includes(farewell)) {
      return `Goodbye! Have a wonderful day, ${userName}! See you later! 👋`;
    }
  }
  // Check for insults
  for (const insult of insults) {
    if (message.includes(insult)) {
      return `Sorry if I hurt you, ${userName}! 😔 Do you want to talk about something else?`;
    }
  }
  // Check for follow-up questions
  for (const follow of followUp) {
    if (message.includes(follow)) {
      return `Great! What would you like to talk about?`;
    }
  }

  for (const deny of denial) {
    if (message.includes(deny)) {
      return `Ok then!🥲 What else do you have in mind ${userName}?`;
    }
  }
  // Check for thanks
  for (const thank of thanks) {
    if (message.includes(thank)) {
      return `You're welcome, ${userName}! 😊 Need anything else?`;
    }
  }
  // Check for help requests
  if (message.includes("help")) {
    return "You can ask me anything or just chat!";
  }
  // Check for positivity
  for (const positive of positivity) {
    if (message.includes(positive)) {
      return `That's great to hear, ${userName}! 😊 Keep spreading the positivity!`;
    }
  }
  // Check for naps
  for (const nap of naps) {
    if (message.includes(nap)) {
      return `Naps are great! 😴 They help recharge your energy. Sleep tight ${userName}!😴`;
    }
  }

  // Check for specific command-based replies
  for (const command in botResponses) {
    if (message.includes(command)) {
      // If the response is a function, call it with the userName
      const response = botResponses[command];
      if (typeof response === "function") {
        return response(userName);
      }
      // Otherwise, return the static string
      return response;
    }
  }
  // Check for acknowledgements
  for (const ack of acknowledgements) {
    if (message.includes(ack)) {
      return `Got it! If you have any other thing to talk about, feel free to come fort with it ${userName}! 😊`;
    }
  }
  // Fallback if no conditions are met
  return `I'm sorry ${userName}, I don't understand. Can you rephrase that? Or maybe ask me something else?`;
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

// Chat form: try the AI first, fall back to the rule-based botReply()
let isReplying = false;
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

  const userName = JSON.parse(localStorage.getItem("name")) || "User";
  let reply;
  try {
    reply = await getAIReply(userName);
  } catch (err) {
    console.warn("AI unavailable, using rule-based fallback:", err);
    reply = botReply(userMsg);
  }

  removeLoadingMessage();
  const botBubbleElement = appendMessage("", "bot");
  typeWriter(reply, botBubbleElement, 12);
  saveMessage(reply, "bot");
  isReplying = false;
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