let pokemonRepository = (function () {
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    function getAll() {
        return pokemonList;
    }

    function add(pokemon) {
        if (typeof pokemon === 'object' && pokemon !== null &&
            'name' in pokemon &&
            'detailsUrl' in pokemon) {
            pokemonList.push(pokemon);
            } else {
                console.error('Invalid pokemon format');
        }
    }

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

    function loadDetails(pokemon) {
        return fetch(pokemon.detailsUrl)
            .then(response => response.json())
            .then(details => {
                pokemon.imageUrl = details.sprites.front_default;
                pokemon.height = details.height;
                pokemon.types = details.types.map(typeInfo => typeInfo.type.name).join(', ');
            })
            .catch(error => {
                console.error("Error while loading Pokemon details", error);
             })
    }

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
        });

        card.addEventListener('click', function() {
            showDetails(pokemon);
        });

        container.appendChild(card);
    }

    function showDetails(pokemon) {
        loadDetails(pokemon).then(() => {
            document.getElementById('pokemon-name').innerText = pokemon.name;
            document.getElementById('pokemon-image').src = pokemon.imageUrl;
            document.getElementById('pokemon-height').innerText = `Height: ${pokemon.height}`;
            document.getElementById('pokemon-types').innerText = `Types: ${pokemon.types}`;
            document.getElementsById('modal').classList.add('show');
        });
    }

    return {
        getAll: getAll,
        add: add,
        loadList: loadList,
        addListItem: addListItem
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
    document.getElementsById('modal').classList.remove('show');
});

window.addEventListener('click', (event) => {
    let modal = document.getElementsByName('modal');
    if (event.target === modal) {
        modal.classList.remove('show');
    }
});