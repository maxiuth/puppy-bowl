// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api/";
const COHORT = "/2508-PUPPIES";
const TEAMS = "/teams";
const PLAYERS = "/players";
const apiTeams = BASE + COHORT + TEAMS;
const apiPlayers = BASE + COHORT + PLAYERS;

// === State ===
let puppies = [];
let selectedPuppy;
// let rsvps = [];
// let guests = [];

async function addParty(party) {
  try {
    const res = await fetch(API + "/events", {
      method: "POST",
      body: JSON.stringify(party),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();
    await getParties();
  } catch (e) {
    console.error(e);
  }
}

async function deleteParty(id) {
  try {
    const res = await fetch(API + "/events/" + id, {
      method: "DELETE",
    });
    const json = await res.json();
    selectedParty = undefined;
    await getParties();
    render();
  } catch (e) {
    console.error(e);
  }
}

/** Updates state with all parties from the API */
async function getParties() {
  try {
    const response = await fetch(API + "/events");
    const result = await response.json();
    parties = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

/** Updates state with a single party from the API */
async function getParty(id) {
  try {
    const response = await fetch(API + "/events/" + id);
    const result = await response.json();
    selectedParty = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

/** Updates state with all RSVPs from the API */
// async function getRsvps() {
//   try {
//     const response = await fetch(API + "/rsvps");
//     const result = await response.json();
//     rsvps = result.data;
//     render();
//   } catch (e) {
//     console.error(e);
//   }
// }

/** Updates state with all guests from the API */
// async function getGuests() {
//   try {
//     const response = await fetch(API + "/guests");
//     const result = await response.json();
//     guests = result.data;
//     render();
//   } catch (e) {
//     console.error(e);
//   }
// }

// === Components ===

/** Party name that shows more details about the party when clicked */
function PartyListItem(party) {
  const $li = document.createElement("li");

  if (party.id === selectedParty?.id) {
    $li.classList.add("selected");
  }

  $li.innerHTML = `
    <a href="#selected">${party.name}</a>
  `;
  $li.addEventListener("click", () => getParty(party.id));
  return $li;
}

/** A list of names of all parties */
function PartyList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("parties");

  const $parties = parties.map(PartyListItem);
  $ul.replaceChildren(...$parties);

  return $ul;
}

/** Detailed information about the selected party */
function SelectedParty() {
  if (!selectedParty) {
    const $p = document.createElement("p");
    $p.textContent = "Please select a party to learn more.";
    return $p;
  }

  const $party = document.createElement("section");
  $party.innerHTML = `
    <h3>${selectedParty.name} #${selectedParty.id}</h3>
    <time datetime="${selectedParty.date}">
      ${selectedParty.date.slice(0, 10)}
    </time>
    <address>${selectedParty.location}</address>
    <p>${selectedParty.description}</p>
    <GuestList></GuestList>
    <button>Delete Party</button>
  `;
  $party.querySelector("GuestList").replaceWith(GuestList());

  const $delete = $party.querySelector("button");
  $delete.addEventListener("click", function (e) {
    deleteParty(selectedParty.id);
    render();
  });

  return $party;
}

/** List of guests attending the selected party */
// function GuestList() {
//   const $ul = document.createElement("ul");
//   const guestsAtParty = guests.filter((guest) =>
//     rsvps.find(
//       (rsvp) => rsvp.guestId === guest.id && rsvp.eventId === selectedParty.id
//     )
//   );

//   // Simple components can also be created anonymously:
//   const $guests = guestsAtParty.map((guest) => {
//     const $guest = document.createElement("li");
//     $guest.textContent = guest.name;
//     return $guest;
//   });
//   $ul.replaceChildren(...$guests);

//   return $ul;
// }

function newPartyForm() {
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
    const date = new Date(formData.get("event-date"));
    addParty({
      name: formData.get("name"),
      description: formData.get("description"),
      date: date.toISOString(),
      location: formData.get("location"),
    });
  });
  return $form;
}

// === Render ===
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Party Planner</h1>
    <main>
      <section>
        <h2>Upcoming Parties</h2>
        <PartyList></PartyList>
        <NewPartyForm></NewPartyForm>
      </section>
      <section id="selected">
        <h2>Party Details</h2>
        <SelectedParty></SelectedParty>
      </section>
    </main>
  `;

  $app.querySelector("PartyList").replaceWith(PartyList());
  $app.querySelector("SelectedParty").replaceWith(SelectedParty());
  $app.querySelector("NewPartyForm").replaceWith(newPartyForm());
}

async function init() {
  await getParties();
  await getRsvps();
  await getGuests();
  render();
}

init();
