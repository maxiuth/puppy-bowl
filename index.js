// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2508-PUPPIES";
const TEAMS = "/teams";
const PLAYERS = "/players";
const teamsAPI = BASE + COHORT + TEAMS;
const playersAPI = BASE + COHORT + PLAYERS;

// === State ===
let puppies = [];
let selectedPuppy;

async function addPuppy(puppy) {
  try {
    const res = await fetch(playersAPI, {
      method: "POST",
      body: JSON.stringify(puppy),
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
    const res = await fetch(playersAPI + "/" + id, {
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

// async function deletePuppy(id) {
//   try {
//     await fetch(playersAPI + "/" + id, {
//       method: "DELETE",
//     });
//     selectedPuppy = undefined;
//     await getPuppies();
//   } catch (e) {
//     console.error(e);
//   }
// }

/** Updates state with all puppies/players from the API */
async function getPuppies() {
  try {
    const response = await fetch(playersAPI);
    const result = await response.json();
    puppies = result.data.players;
    console.log(result);
    render();
  } catch (e) {
    console.error(e);
  }
}

/** Updates state with a single puppy from the API */
async function getPuppy(id) {
  try {
    const response = await fetch(playersAPI + "/" + id);
    const result = await response.json();
    selectedPuppy = result.data.player;
    console.log(selectedPuppy);
    render();
  } catch (e) {
    console.error(e);
  }
}

// === Components ===

/** Puppy name that shows more details about the puppy when clicked */
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

/** Detailed information about the selected puppy */
function SelectedPuppy() {
  if (!selectedPuppy) {
    const $p = document.createElement("p");
    $p.textContent = "Please select a puppy to learn more.";
    return $p;
  }

  const $puppy = document.createElement("section");
  $puppy.innerHTML = `
    <h3>${selectedPuppy.name} #${selectedPuppy.id}</h3>
    <figure>
        <img src="${selectedPuppy.imageUrl}" alt="${selectedPuppy.name}" />
    </figure>
    <p>Breed: ${selectedPuppy.breed}</p>
    <p>Status: ${selectedPuppy.status}</p>
    <p>TeamID: ${selectedPuppy.teamID}</p>
    <button>Delete Puppy</button>
  `;

  const $delete = $puppy.querySelector("button");
  $delete.addEventListener("click", function (e) {
    deletePuppy(selectedPuppy.id);
    render();
  });

  return $puppy;
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
        <h2>Puppies</h2>
        <PuppyList></PuppyList>
        <NewPuppyForm></NewPuppyForm>
      </section>
      <section id="selected">
        <h2>Puppy Details</h2>
        <SelectedPuppy></SelectedPuppy>
      </section>
    </main>
  `;

  $app.querySelector("PuppyList").replaceWith(PuppyList());
  $app.querySelector("SelectedPuppy").replaceWith(SelectedPuppy());
  $app.querySelector("NewPuppyForm").replaceWith(newPuppyForm());
}

async function init() {
  await getPuppies();
  render();
}

init();
