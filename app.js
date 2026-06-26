import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBEqzYDvZquO7dr4sPKOwlVeCnWimfWbMI",
  authDomain: "chatter121-4631a.firebaseapp.com",
  projectId: "chatter121-4631a",
  storageBucket: "chatter121-4631a.firebasestorage.app",
  messagingSenderId: "376373225270",
  appId: "1:376373225270:web:db8afef07146cc839e3597"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let username = "";
let roomCode = "";

window.joinChat = function () {

  username = document.getElementById("usernameInput").value.trim();
  roomCode = document.getElementById("roomInput").value.trim();

  if (!username || !roomCode) {
    alert("Enter a username and room code.");
    return;
  }

  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("chatScreen").style.display = "flex";

  document.getElementById("roomLabel").textContent =
    "Room: " + roomCode;

  loadMessages();

};

window.createRoom = function () {

  roomCode = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

  document.getElementById("roomInput").value = roomCode;

};

window.copyRoom = async function () {

  if (!roomCode) return;

  try {

    await navigator.clipboard.writeText(roomCode);

    alert("Room code copied!");

  } catch (err) {

    alert("Couldn't copy room code.");

  }

};
window.sendMessage = async function () {

  const input = document.getElementById("message");
  const text = input.value.trim();

  if (!text) return;

  input.value = "";

  try {

    await addDoc(
      collection(
        db,
        "rooms",
        roomCode,
        "messages"
      ),
      {
        username: username,
        text: text,
        time: Date.now()
      }
    );

  } catch (err) {

    alert("Couldn't send message.");

  }

};

function loadMessages() {

  const q = query(
    collection(
      db,
      "rooms",
      roomCode,
      "messages"
    ),
    orderBy("time")
  );

  onSnapshot(q, (snapshot) => {

    const messages =
      document.getElementById("messages");

    messages.innerHTML = "";

    snapshot.forEach((doc) => {

      const data = doc.data();

      const div =
        document.createElement("div");

      div.className = "message";

      div.innerHTML =
        "<b>" +
        data.username +
        "</b>" +
        data.text;

      messages.appendChild(div);

    });

    messages.scrollTop =
      messages.scrollHeight;

  });

}

document
  .getElementById("message")
  .addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

      sendMessage();

    }

  });
  // ---------- Online status & typing (local UI for now) ----------

const statusEl = document.getElementById("status");
const typingEl = document.getElementById("typing");
const messageInput = document.getElementById("message");

if (statusEl) {
  statusEl.textContent = "🟢 Online";
}

let typingTimer;

if (messageInput) {

  messageInput.addEventListener("input", () => {

    if (typingEl) {
      typingEl.textContent = "Typing...";
    }

    clearTimeout(typingTimer);

    typingTimer = setTimeout(() => {

      if (typingEl) {
        typingEl.textContent = "";
      }

    }, 1500);

  });

}

// ---------- Call buttons (placeholder until WebRTC) ----------

window.startCall = function () {

  alert("Voice calling will be added next.");

};

window.hangUp = function () {

  alert("No active call.");

};

console.log("✅ Chatter121 loaded successfully.");