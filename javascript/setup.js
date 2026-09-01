let pokemons = [" "];

const TOTAL_POKEMONS = 1025;

/**fetch pokemon name and id */
async function getAllNames() {
  let url = `https://pokeapi.co/api/v2/pokemon/?limit=${TOTAL_POKEMONS}`;
  let response = await fetch(url);
  let responseAsJson = await response.json();

  for (let i = 0; i < responseAsJson.results.length; i++) {
    pokemons.push({
      id: i + 1,
      name: responseAsJson.results[i].name,
      types: [],
    });
  }

  getAllTypes();
}

/**fetch pokemon types */
async function getAllTypes() {
  for (let i = 0; i < 18; i++) {
    let url = "https://pokeapi.co/api/v2/type/" + (i + 1);
    let response = await fetch(url);
    let responseAsJson = await response.json();

    const pokemonInType = responseAsJson.pokemon;

    for (j = 0; j < pokemonInType.length; j++) {
      const pokemonId = pokemonInType[j].pokemon.url
        .replace("https://pokeapi.co/api/v2/pokemon/", "")
        .replace("/", "");

      if (pokemonId <= pokemons.length && pokemons[pokemonId]) {
        pokemons[pokemonId].types.push(responseAsJson.name);
      }
    }
  }

  loadingCompletion();
}

/**hide loading div after completion */
function loadingCompletion() {
  const loadingDiv = document.getElementById("loading-div");
  loadingDiv.classList.add("hideLoading");

  setTimeout(function () {
    loadingDiv.classList.replace("hideLoading", "hide");
    document.body.style.overflow = "unset";
  }, 500);

  pokemons.splice(0, 1);
  currentList = pokemons;

  updatePokemonList();
}


/* Night mode: the only functional addition. */
function applySavedTheme() {
  const darkMode = localStorage.getItem("pokedex-night-mode") === "true";
  document.body.classList.toggle("dark-mode", darkMode);
  updateThemeButton();
}

function toggleTheme() {
  const enabled = document.body.classList.toggle("dark-mode");
  localStorage.setItem("pokedex-night-mode", enabled);
  updateThemeButton();
}

function updateThemeButton() {
  const button = document.getElementById("theme-toggle");
  if (!button) return;
  const enabled = document.body.classList.contains("dark-mode");
  button.textContent = enabled ? "☀️" : "🌙";
  button.title = enabled ? "Switch to day mode" : "Switch to night mode";
  button.setAttribute("aria-label", button.title);
}

document.addEventListener("DOMContentLoaded", applySavedTheme);
