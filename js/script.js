let pokemonRepository = (function () {
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=300';

    function getAll() {
        return pokemonList;
    }

    //Add a pokemon to the list
    function add(pokemon) {
        if (typeof pokemon === 'object' && pokemon !== null &&
            'name' in pokemon &&
            'detailsUrl' in pokemon) {
            pokemonList.push(pokemon);
            } else {
                console.error('Invalid pokemon format');
        }
    }

    function filterPokemons(query, type) {
        //Filter by name
        let filteredList = pokemonList.filter(pokemon => pokemon.name.toLowerCase().includes(query.toLowerCase()));
        //Then, filter by type if, type is selected
        if (type) {
            filteredList = filteredList.filter(pokemon => pokemon.types.includes(type));
        }
        return filteredList;
    }

    //Load the list of pokemons from the API
    function loadList() {
        return fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                data.results.forEach(item => {
                    let pokemon = {
                        name: item.name,
                        detailsUrl: item.url
                    };
                    add(pokemon);
                });
            })
            .catch(error => {
                console.error("Error while loading Pokemon list", error);
        });
    }

    //Load the details of a pokemon
    function loadDetails(pokemon) {
        return fetch(pokemon.detailsUrl)
            .then(response => response.json())
            .then(details => {
                pokemon.imageUrl = details.sprites.front_default;
                pokemon.height = details.height;
                pokemon.weight = details.weight;
                pokemon.types = details.types.map(typeInfo => typeInfo.type.name).join(', ');
                pokemon.abilities = details.abilities.map(abilityInfo => abilityInfo.ability.name).join(', ');
            })
            .catch(error => {
                console.error("Error while loading Pokemon details", error);
             })
    }

    // Create a list item for each pokemon
    function addListItem(pokemon) {
        let container = document.querySelector('.pokemon-container');
        let card = document.createElement('button');
        card.classList.add('pokemon-card');
        card.innerHTML = `<h3>${pokemon.name}</h3>`;

        loadDetails(pokemon).then(() => {
            let img = document.createElement('img');
            img.src = pokemon.imageUrl;
            img.alt = `Image of ${pokemon.name}`;
            card.appendChild(img);

            let primaryType = pokemon.types.split(',')[0];
            card.style.backgroundColor = typeColors[primaryType] || "#fff";
        });

        card.addEventListener('click', function() {
            showDetails(pokemon);
        });

        container.appendChild(card);
    }

    // Show the details of a specific pokemon
    function showDetails(pokemon) {
        loadDetails(pokemon).then(() => {
            document.getElementById('pokemon-name').innerText = pokemon.name;
            document.getElementById('pokemon-image').src = pokemon.imageUrl;
            document.getElementById('pokemon-height').innerText = `Height: ${pokemon.height}`;
            document.getElementById('pokemon-weight').innerText = `Weight: ${pokemon.weight}`;
            document.getElementById('pokemon-types').innerText = `Types: ${pokemon.types}`;
            document.getElementById('pokemon-ability').innerText = `Abilities: ${pokemon.abilities}`;

            let primaryType = pokemon.types.split(',')[0];
            let modalContent = document.querySelector('.modal-content');
            modalContent.style.border = `5px solid ${typeColors[primaryType] || "#fff"}`;
            
            //Adds flip class to trigger animation
            modalContent.classList.add('flip');

            document.getElementById('modal').classList.add('show');
        });
    }

    return {
        getAll: getAll,
        add: add,
        loadList: loadList,
        addListItem: addListItem,
        filterPokemons: filterPokemons
    }
})();

//Load and diplay pokemon
pokemonRepository.loadList().then(() => {
    pokemonRepository.getAll().forEach(pokemon => {
        pokemonRepository.addListItem(pokemon);
    });
});

//Modal functionality
document.querySelector('.close-button').addEventListener('click', () => {
    document.getElementById('modal').classList.remove('show');
});

window.addEventListener('click', (event) => {
    let modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.classList.remove('show');
    }
});

//Search functionality
document.getElementById('search-form').addEventListener('submit', (event) => {
    event.preventDefault();

    let query = document.getElementById('search-input').value;
    let type = document.getElementById('type-filter').value;
    let filteredPokemons = pokemonRepository.filterPokemons(query, type);

    document.querySelector('.pokemon-container').innerHTML = '';
    filteredPokemons.forEach(pokemon => {
        pokemonRepository.addListItem(pokemon);
    })
})

//Updates the pokemon list when type filter is changed
document.getElementById('type-filter').addEventListener('change', (event) => {
    let query = document.getElementById('search-input').value;
    let type = document.getElementById('type-filter').value;
    let filteredPokemons = pokemonRepository.filterPokemons(query, type);

    document.querySelector('.pokemon-container').innerHTML = '';
    filteredPokemons.forEach(pokemon => {
        pokemonRepository.addListItem(pokemon);
    })
})

// Colors for each type used for the card background and modal border
const typeColors = {
    normal: "#b6ba91",
    fire: "#fa9d66",
    water: "#a8cee0",
    electric: "#f7dc60",
    grass: "#b4e0a8",
    ice: "#96D9D6",
    fighting: "#f77d79",
    poison: "#d092de",
    ground: "#9e8870",
    flying: "#A98FF3",
    psychic: "#c17ef7",
    bug: "#abc265",
    rock: "#a1946f",
    ghost: "#aaa0bd",
    dragon: "#6298fc",
    dark: "#a3765f",
    steel: "#B7B7CE",
    fairy: "#ffdeeb",
};