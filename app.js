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
let me = [];

let firstUser = [
  {
    id: 1,
    name: "Ceyhun",
    password: "1",
  },
  {
    id: 2,
    name: "Eltac",
    password: "2",
  },
  {
    id: 3,
    name: "Yusif",
    password: "3",
  },
  {
    id: 4,
    name: "Nurlan",
    password: "4",
  },
  {
    id: 5,
    name: "Cavid",
    password: "5",
  },
];

// CHECK LOCAL STORAGE
if (JSON.parse(localStorage.getItem("users")) === null) {
  localStorage.setItem("users", JSON.stringify(firstUser));
}

// CHECK LOGIN
formLogin.addEventListener("submit", (e) => {
  let users = JSON.parse(localStorage.getItem("users"));

  let currentUser = users.find(
    (e) =>
      e.password === userPass.value &&
      e.name.toLowerCase() === userName.value.toLowerCase()
  );
  if (!currentUser) {
    errorMessage.style.display = "block";
  } else {
    formLogin.style.display = "none";
    me = currentUser;
  }
  e.preventDefault();
});

// CREATE USER LIST
const users = JSON.parse(localStorage.getItem("users"));
function createUserList() {
  users
    .filter((item) => item.name !== me.name)
    .map((item) => {
      userList.innerHTML += `<li class="user">
  <img src="./img/person.png" alt="" class="user-img" />
  <span class="user-name">${item.name}</span>
</li>`;
    });
}
createUserList();

//GO TO INBOX
const user = document.querySelectorAll(".user");
function goToİnbox() {
  console.log(me);
  user.forEach((item) => {
    item.addEventListener("click", (e) => {
      userList.style.display = "none";
      currentUserName.innerHTML = item.lastElementChild.innerHTML;
    });
  });
}
goToİnbox();

// POST MESSAGE
formMessage.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(message.value);
  message.value = "";
});

// EXİT İNBOX

function exitİnbox() {
  backIcon.addEventListener("click", () => {
    userList.style.display = "block";
  });
}
exitİnbox();
