let logout = document.querySelector("#logout");
let putanjaProf = document.querySelector("#putanjaProf");
let body = document.querySelector("body");
let allItem = document.querySelector("#allItem");

// putanja za profesorski deo
putanjaProf.addEventListener("click", () => {
  document.location = "profesor.html";
});

//funkcija koja dinamicki ucitava podatke u ulogovanom korisniku
window.addEventListener("load", dynamicLoad);
async function dynamicLoad(e) {
  e.preventDefault();
  let token = localStorage.getItem("token");

  const result = await fetch("./api/dynamicLoad", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
    }),
  }).then((response) => response.json());

  if (result.status === "ok") {
    const name = document.querySelector("#user");
    const frontSchema = document.querySelector("#allItem");

    name.innerHTML = `${result.name}`;
    for (let i = result.predmet.length - 1; i >= 0; i--) {
      frontSchema.innerHTML += `<section class="allItemDesing">
      <div class="information">
        <p class="ocena">${result.ocena[i]}</p>
        <div class="predmetProsek"> 
          <p class="predmet">${result.predmet[i]}</p>
          <p class="prosek">E-dnevnik</p>
        </div>
      </div>
    </section>`;
  }
  
    // console.log(result.email);
    // console.log(result.id);
    // console.log(result.name)
    // console.log(result.predmet)
    // console.log(result.ocena)
  } else {
    alert(result.error);
  }
}

//provera tokena
if (localStorage.getItem("token") == null) {
  document.location = "index.html";
}

//odjava
logout.addEventListener("click", async () => {
  await localStorage.clear();
  document.location = "index.html";
});
