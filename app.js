const btn = document.querySelector(".btn");
const message = document.querySelector(".input");
const formMessage = document.querySelector(".form");
const formLogin = document.querySelector(".login-form");
const userName = document.getElementById("name");
const userPass = document.getElementById("pass");
const errorMessage = document.getElementById("errorMessage");
const userList = document.querySelector(".users");
const currentUserName = document.querySelector(".current-user-name");
const backIcon = document.querySelector(".back-icon");
const chatBox = document.querySelector(".chat-box");
const logoutBtn = document.querySelector(".logout");
let me = [];

// CHECK LOCAL STORAGE
if (JSON.parse(localStorage.getItem("users")) === null) {
  window.location = "/register.html";
}

// CHECK LOGIN
formLogin.addEventListener("submit", (e) => {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  let currentUser = users.find(
    (e) =>
      e.password === userPass.value &&
      e.name.toLowerCase() === userName.value.toLowerCase()
  );
  if (!currentUser) {
    errorMessage.style.display = "block";
  } else {
    errorMessage.style.display = "none";
    formLogin.style.display = "none";
    userName.value = "";
    userPass.value = "";
    me = currentUser.name || [];
    logoutBtn.style.display = "block";
    createUserList(users);
    goToİnbox(users);
    postMessage(users);
  }
  e.preventDefault();
});

// CREATE USER LIST

function createUserList(users) {
  userList.innerHTML = "";
  users
    .filter((item) => item.name !== me)
    .sort((a, b) => {
      let chekcA = a.messages[me];
      let chekcB = b.messages[me];
      if (chekcA && chekcB) {
        return (a.messages[me].at(-1).mlSeconds || 0) <
          (b.messages[me].at(-1).mlSeconds || 0)
          ? 0
          : -1;
      } else if (chekcA) {
        return -1;
      } else if (chekcB) {
        return 0;
      }
    })
    .map((item) => {
      // create elements
      const li = document.createElement("li");
      const img = document.createElement("img");
      const spanName = document.createElement("span");
      const spanMsg = document.createElement("span");
      // add class
      li.classList.add("user");
      img.classList.add("user-img");
      spanName.classList.add("user-name");
      spanMsg.classList.add("new-msg");
      img.setAttribute("src", "./img/person.png");
      console.log("salam");
      // add elements
      spanName.innerHTML = item.name;
      spanMsg.innerHTML =
        (item.messages[me] || []).filter((item) => item.show === false)
          .length || "";

      li.appendChild(img);
      li.appendChild(spanName);
      li.appendChild(spanMsg);

      userList.appendChild(li);
    });
}

//GO TO INBOX
function goToİnbox(users) {
  const user = document.querySelectorAll(".user");
  user.forEach((item) => {
    item.addEventListener("click", (e) => {
      userList.style.display = "none";
      currentUserName.innerHTML =
        item.lastElementChild.previousElementSibling.innerHTML;
      const messages =
        users.find((item) => item.name === me).messages[
          currentUserName.innerHTML
        ] || [];
      (
        users.find((item) => item.name === currentUserName.innerHTML).messages[
          me
        ] || []
      ).forEach((item) => {
        item.from === currentUserName.innerHTML ? (item.show = true) : item;
      });

      localStorage.setItem("users", JSON.stringify(users));
      createMessage(messages);
    });
  });
}

// POST MESSAGE
function postMessage(users) {
  formMessage.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("salam");
    console.log("salam");
    const month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let newDate = `${new Date().getHours()}:${new Date().getMinutes()}`;
    let day = `${new Date().getDate()} ${
      month[new Date().getMonth()]
    } ${new Date().getFullYear()}`;
    let mlSeconds = new Date().getTime();
    const messagesMe = users.find((item) => item.name === me).messages;
    const messagesFrom = users.find(
      (item) => item.name === currentUserName.innerHTML
    ).messages;
    if (messagesMe[currentUserName.innerHTML]) {
      let checkDay = messagesMe[currentUserName.innerHTML].find(
        (item) => item.day === day
      );
      if (checkDay) {
        messagesMe[currentUserName.innerHTML].push({
          from: me,
          message: message.value,
          date: newDate,
          mlSeconds: mlSeconds,
          show: false,
        });
        messagesFrom[me].push({
          from: me,
          message: message.value,
          date: newDate,
          mlSeconds: mlSeconds,
        });
      } else {
        messagesMe[currentUserName.innerHTML].push({
          from: me,
          message: message.value,
          date: newDate,
          day: day,
          mlSeconds: mlSeconds,
          show: false,
        });
        messagesFrom[me].push({
          from: me,
          message: message.value,
          date: newDate,
          day: day,
          mlSeconds: mlSeconds,
        });
      }
    } else {
      messagesMe[currentUserName.innerHTML] = [
        {
          from: me,
          message: message.value,
          date: newDate,
          day: day,
          mlSeconds: mlSeconds,
          show: false,
        },
      ];
      messagesFrom[me] = [
        {
          from: me,
          message: message.value,
          date: newDate,
          day: day,
          mlSeconds: mlSeconds,
        },
      ];
    }
    localStorage.setItem("users", JSON.stringify(users));
    createMessage(messagesMe[currentUserName.innerHTML]);
    userList.innerHTML = "";
    createUserList(users);
    goToİnbox(users);
    message.value = "";
  });
}

// CREATE MESSAGE
function createMessage(messages) {
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let nowDate = `${new Date().getDate()} ${
    month[new Date().getMonth()]
  } ${new Date().getFullYear()}`;
  chatBox.innerHTML = "";

  messages.forEach((item) => {
    const li = document.createElement("li");
    const spanMsg = document.createElement("span");
    const spanDate = document.createElement("span");
    li.classList.add("message-list");
    spanMsg.classList.add("message");
    spanDate.classList.add("date");
    spanMsg.innerHTML = item.message;
    spanDate.innerHTML = item.date;
    spanMsg.appendChild(spanDate);
    li.appendChild(spanMsg);
    if (item.from === me) {
      li.classList.add("me-list");
      spanMsg.classList.add("message-me");
      if (!item.day) {
        chatBox.appendChild(li);
      } else {
        const liDay = document.createElement("li");
        const spanDay = document.createElement("span");
        liDay.classList.add("day-box");
        spanDay.classList.add("day");
        spanDay.innerHTML = item.day === nowDate ? "today" : item.day;
        liDay.appendChild(spanDay);
        chatBox.appendChild(liDay);
        chatBox.appendChild(li);
      }
    } else if (item.from === currentUserName.innerHTML) {
      if (!item.day) {
        chatBox.appendChild(li);
      } else {
        const liDay = document.createElement("li");
        const spanDay = document.createElement("span");
        liDay.classList.add("day-box");
        spanDay.classList.add("day");
        spanDay.innerHTML = item.day === nowDate ? "today" : item.day;
        liDay.appendChild(spanDay);
        chatBox.appendChild(liDay);
        chatBox.appendChild(li);
      }
    }
  });
}

// LOGOUT
function logout() {
  logoutBtn.addEventListener("click", () => {
    window.location = "/index.html";
  });
}
logout();

// EXİT İNBOX

function exitİnbox() {
  backIcon.addEventListener("click", () => {
    userList.style.display = "block";
    const newUsers = JSON.parse(localStorage.getItem("users"));
    createUserList(newUsers);
    goToİnbox(newUsers);
  });
}
exitİnbox();
