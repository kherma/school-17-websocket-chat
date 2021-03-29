// =====================
// Selectors
// =====================

const loginForm = document.getElementById("welcome-form");
const messagesSection = document.getElementById("messages-section");
const messagesList = document.getElementById("messages-list");
const addMessageForm = document.getElementById("add-messages-form");
const userNameInput = document.getElementById("username");
const messageContentInput = document.getElementById("message-content");

// =====================
// Global variables
// =====================

const socket = io();
let userName;

// =====================
// Hide Message Section
// =====================

messagesSection.classList.remove("show");

// =====================
// Event listeners
// =====================

loginForm.addEventListener("submit", (event) => {
  login(event);
});

addMessageForm.addEventListener("submit", (event) => {
  sendMessage(event);
});

socket.on("message", ({ author, content }) => addMessage(author, content));

// =====================
// Utils functions
// =====================

// Validate empy field
const isFieldEmpty = (fieldValue) => {
  return fieldValue ? true : alert("Field can't be empty.");
};

// Create HTML element with class & context
const createHTMLElement = (tag, className, context) => {
  const element = document.createElement(tag);
  element.setAttribute("class", className);
  if (context) {
    const text = document.createTextNode(context);
    element.appendChild(text);
  }
  return element;
};

// =====================
// Application functions
// =====================

// Set user login nick and show chat form
const login = (event) => {
  event.preventDefault();
  if (isFieldEmpty(userNameInput.value)) {
    userName = userNameInput.value;
    loginForm.classList.remove("show");
    messagesSection.classList.add("show");
  }
};

// Send message and clear input field
const sendMessage = (event) => {
  event.preventDefault();
  if (isFieldEmpty(messageContentInput.value)) {
    addMessage(userName, messageContentInput.value);
    socket.emit("message", {
      author: userName,
      content: messageContentInput.value,
    });
    messageContentInput.value = "";
  }
};

// Add message to messages list
const addMessage = (author, content) => {
  // Classes for all masseges
  const classes = ["message", "message--received"];
  // Check if author is same as userName and create li element
  const message = createHTMLElement(
    "li",
    author === userName
      ? `${classes.join(" ")} message--self`
      : `${classes.join(" ")}`
  );
  // Check if author is same as userName and add correct heading
  message.appendChild(
    createHTMLElement(
      "h3",
      "message__author",
      author === userName ? "You" : author
    )
  );
  // Add message content
  message.appendChild(createHTMLElement("div", "message__content", content));
  // Add message to end of the list
  messagesList.insertAdjacentHTML("beforeend", message.outerHTML);
};
