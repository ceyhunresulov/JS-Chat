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
      userList.innerHTML += `<li class="user">
  <img src="./img/person.png" alt="" class="user-img" />
  <span class="user-name">${item.name}</span>
  <span class="new-msg">${
    (item.messages[me] || []).filter((item) => item.show === false).length || ""
  }</span>
</li>`;
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
    console.log("2");
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
      console.log("3");

      let checkDay = messagesMe[currentUserName.innerHTML].find(
        (item) => item.day === day
      );
      if (checkDay) {
        console.log("4");

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
        console.log("5");

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
      console.log("6");

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
    users = JSON.parse(localStorage.getItem("users"));
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
    if (item.from === me) {
      if (!item.day) {
        chatBox.innerHTML += `<li class="message-list me-list">
      <span class="message message-me">${item.message}
      <span class="date">${item.date}</span>
      </span>
      </li>`;
      } else {
        chatBox.innerHTML += `<li class="day-box"><span class="day">${
          item.day === nowDate ? "today" : item.day
        }</span></li>`;
        chatBox.innerHTML += `<li class="message-list me-list">
        <span class="message message-me">${item.message}
        <span class="date">${item.date}</span>
        </span>
        </li>`;
      }
    } else if (item.from === currentUserName.innerHTML) {
      if (!item.day) {
        chatBox.innerHTML += `<li class="message-list">
      <span class="message">${item.message}
      <span class="date">${item.date}</span>
      </span>
      </li>`;
      } else {
        chatBox.innerHTML += `<li class="day-box"><span class="day">${
          item.day === nowDate ? "today" : item.day
        }</span></li>`;
        chatBox.innerHTML += `<li class="message-list">
      <span class="message">${item.message}
      <span class="date">${item.date}</span>
      </span>
      </li>`;
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
