let loginBTN = document.querySelector("span");
const forma = document.getElementById("formRegister");

//funkcija koja registruje korisnika
forma.addEventListener("submit", registerUser);
async function registerUser(e) {
  e.preventDefault();
  const nameLastname = document.querySelector("#nameRegister").value;
  const email = document.getElementById("emailRegister").value;
  const password = document.getElementById("passwordRegister").value;
  const specialKey = document.querySelector("#specialKey").value;

  const result = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nameLastname,
      email,
      password,
      specialKey,
    }),
  }).then((response) => response.json());

  //validacija imena i prezimena
  let nameWriteError = document.querySelector("#nameFormatError");
  if (result.status === "name") {
    nameWriteError.innerHTML = `${result.name} `;
  }

  //validacija emaila
  let emailWriteError = document.querySelector("#emailFormatError");
  if (result.status === "email") {
    emailWriteError.innerHTML = `${result.email}</p>`;
  }

  //validacija password-a
  let passwordWriteError = document.querySelector("#passwordFormatError")
  if (result.status=== "password") {
    passwordWriteError.innerHTML = `${result.password}`
  }

  //validacija specialKey-a
  let keyWriteError = document.querySelector("#keyFormatError");
  if (result.status === "key") {
    keyWriteError.innerHTML = ` ${result.key}`;
  }

  if (result.status === "ok") {
    document.location = "index.html";
  }

  // else {
  //   alert(result.error)
  // }
}

// provera tokena
if (localStorage.getItem("token") !== null) {
  document.location = "ucenik.html";
}

// prebacivanje sa login stranice na ucenik
loginBTN.addEventListener("click", () => {
  document.location = "index.html";
});
