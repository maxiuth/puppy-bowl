// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2803-PUPPIES";
const TEAMS = "/teams";
const PLAYERS = "/players";
const apiTeams = BASE + COHORT + TEAMS;
const apiPlayers = BASE + COHORT + PLAYERS;

// === State ===
let puppies = [];
let selectedPuppy;

async function addPuppy(puppy) {
  try {
    const res = await fetch(apiPlayers, {
      method: "POST",
      body: JSON.stringify(party),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();
    await getPuppies();
  } catch (e) {
    console.error(e);
  }
}

async function deletePuppy(id) {
  try {
    const res = await fetch(apiPlayers + "/" + id, {
      method: "DELETE",
    });
    const json = await res.json();
    selectedPuppy = undefined;
    await getPuppies();
    render();
  } catch (e) {
    console.error(e);
  }
}

/** Updates state with all puppies/players from the API */
async function getPuppies() {
  try {
    const response = await fetch(apiPlayers);
    const result = await response.json();
    puppies = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

/** Updates state with a single party from the API */
async function getPuppy(id) {
  try {
    const response = await fetch(apiPlayers + "/" + id);
    const result = await response.json();
    selectedPuppy = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

// === Components ===

/** Party name that shows more details about the party when clicked */
function PuppyListItem(puppy) {
  const $li = document.createElement("li");

  if (puppy.id === selectedPuppy?.id) {
    $li.classList.add("selected");
  }

  $li.innerHTML = `
    <a href="#selected">${puppy.name}</a>
  `;
  $li.addEventListener("click", () => getPuppy(puppy.id));
  return $li;
}

/** A list of names of all puppies */
function PuppyList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("puppies");

  const $puppies = puppies.map(PuppyListItem);
  $ul.replaceChildren(...$puppies);

  return $ul;
}

/** Detailed information about the selected party */
function SelectedPuppy() {
  if (!selectedPuppy) {
    const $p = document.createElement("p");
    $p.textContent = "Please select a puppy to learn more.";
    return $p;
  }

  const $puppy = document.createElement("section");
  $puppy.innerHTML = `
    <h3>${selectedPuppy.name} #${selectedPuppy.id}</h3>
    // <time datetime="${selectedParty.date}">
    //   ${selectedParty.date.slice(0, 10)}
    // </time>
    // <address>${selectedParty.location}</address>
    // <p>${selectedParty.description}</p>
    <button>Delete Puppy</button>
  `;

  const $delete = $party.querySelector("button");
  $delete.addEventListener("click", function (e) {
    deleteParty(selectedParty.id);
    render();
  });

  return $party;
}

function newPuppyForm() {
  const $form = document.createElement("form");
  $form.innerHTML = `
  <h2>Add a New Puppy</h2>
    <label>
        Puppy Name
        <input name="name" required />
    </label>
    <label>
        Breed
        <input name="breed" required />
    </label>
    <label>
        Image of Puppy
        <input name="imageUrl" />
    <button>Add Puppy</button>
    `;
  $form.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData($form);
    addPuppy({
      name: formData.get("name"),
      breed: formData.get("breed"),
      imageUrl: formData.get("imageUrl"),
    });
  });
  return $form;
}

// === Render ===
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Puppy Bowl</h1>
    <main>
      <section>
        <h2>Upcoming Parties</h2>
        <PartyList></PartyList>
        <NewPuppyForm></NewPuppyForm>
      </section>
      <section id="selected">
        <h2>Party Details</h2>
        <SelectedParty></SelectedParty>
      </section>
    </main>
  `;

  $app.querySelector("PartyList").replaceWith(PuppyList());
  //$app.querySelector("SelectedParty").replaceWith(SelectedParty());
  $app.querySelector("NewPuppyForm").replaceWith(newPuppyForm());
}

async function init() {
  await getPuppies();
  render();
}

init();
