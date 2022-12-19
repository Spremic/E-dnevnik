let putanjaUcen = document.querySelector("#putanjaUcen");
let closeModal = document.querySelector(".close");
let openModal = document.querySelector("#openModal");
let form = document.querySelector("#addRating");
let logout = document.querySelector("#logout");
let pravaIobaveze = document.querySelector(".pravaObaveze");
let vestine = document.querySelector(".vestine");
let pravilnikOcenjivanje = document.querySelector(".ocenjivanje");
let pravilnikPonasanje = document.querySelector(".ponasanje");

//prebacivanje na linkove na strani profesora
pravaIobaveze.addEventListener("click", () => {
  window.open(
    "http://www.svetozarmarkovic.edu.rs/index.php/sr/prava-i-obaveze/prava-i-obaveze-nastavnika"
  );
});
pravilnikOcenjivanje.addEventListener("click", () => {
  window.open(
    "https://www.paragraf.rs/propisi/pravilnik-o-ocenjivanju-ucenika-u-osnovnom-obrazovanju-i-vaspitanju.html"
  );
});
pravilnikPonasanje.addEventListener("click", () => {
  window.open("https://www.samubps.edu.rs/0/dokumenti/11ponasanje.pdf");
});
vestine.addEventListener("click", () => {
  window.open(
    "https://www.youtube.com/watch?v=HiDeKtpOHYI&ab_channel=U%C4%8Ditelj21.vijeka"
  );
});

//modal za dodavanje ocena
openModal.addEventListener("click", () => {
  form.style.display = "block";
});
closeModal.addEventListener("click", () => {
  form.style.display = "none";
});

//funkcija koja dinamicki ucitava ime i prezime ulogovanog profesora
window.addEventListener("load", dynamicLoad);
async function dynamicLoad(e) {
  e.preventDefault();
  let token = localStorage.getItem("token");

  const result = await fetch("./api/dynamicLoad", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
    }),
  }).then((response) => response.json());

  if (result.status === "ok") {
    const name = document.querySelector("#user");
    name.innerHTML = `${result.name}`;
  } else {
    alert(result.error);
  }
}

//funkcija koja dodaje ocenu uceniku
form.addEventListener("submit", rating);
async function rating(e) {
  e.preventDefault();
  const keyValidate = document.querySelector("#specialKey").value;
  const numberRating = document.querySelector("#numberRating").value;
  const predmet = document.querySelector("#predmet").value;

  const result = await fetch("./api/rating", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      newRating: numberRating,
      newPredmet: predmet,
      keyValidate,
    }),
  }).then((response) => response.json());

  //validacija input key
  let keyErrorWriter = document.querySelector("#keyErrorWriter");
  if (result.status === "key") {
    keyErrorWriter.innerHTML = `${result.key}`;
  }

  //validacija input za dodavanje predmet
  let predmetErrorWriter = document.querySelector("#predmetErrorWriter");
  if (result.status === "predmet") {
    predmetErrorWriter.innerHTML = `${result.predmet}`;
  }

  //validacija inputa za dodavanje brojacen ocene
  let ocenaErrorWriter = document.querySelector("#ocenaErrorWriter");
  if (result.status === "ocena") {
    ocenaErrorWriter.innerHTML = `${result.ocena}`;
  }
  if (result.status === "ok") {
    keyErrorWriter.innerHTML = "";
    predmetErrorWriter.innerHTML = "";
    ocenaErrorWriter.innerHTML = "";
  }
}

//odjavlivanje
logout.addEventListener("click", async () => {
  await localStorage.clear();
  document.location = "index.html";
});

//prebacivanje na ucenicki deo
putanjaUcen.addEventListener("click", () => {
  document.location = "ucenik.html";
});

//provera tokena
if (localStorage.getItem("token") == null) {
  document.location = "index.html";
}
