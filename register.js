const userName = document.getElementById("name");
const password = document.getElementById("password");
const registerForm = document.querySelector(".register");
const error = document.querySelector(".error");

const users = JSON.parse(localStorage.getItem("users")) || [];

registerForm.addEventListener("submit", (e) => {
  let nameValue = userName.value.toLowerCase();
  let passwordValue = password.value;
  let chekcName = users.find((item) => item.name === nameValue);
  let chekcPassword = users.find((item) => item.password === passwordValue);
  e.preventDefault();
  if (!nameValue) {
    error.innerHTML = "username is empty!";
    error.style.display = "block";
  } else if (!passwordValue) {
    error.innerHTML = "password is empty!";
    error.style.display = "block";
  } else if (chekcName || chekcPassword) {
    error.innerHTML = "change username or password!";
    error.style.display = "block";
  } else {
    const newUser = {
      id: users.length + 1,
      name: nameValue,
      password: passwordValue,
      messages: {},
    };
    localStorage.setItem("users", JSON.stringify([...users, newUser]));
    window.location = "/index.html";
  }
});
