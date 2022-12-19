let registerBTN = document.querySelector("span");
const forma = document.getElementById("formLogin");

//funkcija koja uloguje korisnika
forma.addEventListener("submit", login);
async function login(e) {
  e.preventDefault();
  const email = document.getElementById("emailLogin").value;
  const password = document.getElementById("passwordLogin").value;

  const result = await fetch("./api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then((response) => response.json());

  //email validacija
  let mailErrorWriter = document.querySelector("#loginMailError");
  if (result.status === "mail") {
    mailErrorWriter.innerHTML = `${result.mail} `;
  }

  //password validacija
  let passworErrorWriter = document.querySelector("#loginPassError");
  if (result.status === "password") {
    passworErrorWriter.innerHTML += `${result.password}`;
  }

  if (result.status === "ok") {
    localStorage.setItem("token", result.token);
    console.log(result.token);
    document.location = "ucenik.html";
  }
}

//provera tokena
if (localStorage.getItem("token") !== null) {
  document.location = "ucenik.html";
}

// prebacivanje sa register na login
registerBTN.addEventListener("click", () => {
  document.location = "register.html";
});
