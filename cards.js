import configuration from './configure.js';
import api from './api.js';

const getOptions = () => {
    const options = {
        headers: {}
    };

    if (configuration.apiKey)
        options.headers['X-Api-Key'] = configuration.apiKey;

    return options;
}

const get = (type, args) => {
    return axios.get(`${configuration.host}/${type}${args && '?' + window.Qs.stringify(args)}`, getOptions())
        .then(response => response.data);
}

export default (type) => ({
    find: id => {
        return axios(`${configuration.host}/${type}/${id}`, getOptions())
            .then(response => response.data.data);
    },
    where: (args) => get(type, args),
    all: (args={}, data=[]) => {
        const getAll = (type, args) => {
            const page = args.page ? args.page + 1 : 1;

            return get(type, {...args, page})
                .then(response => {
                    data.push(...response.data);

                    if (!response.totalCount || (response.pageSize * response.page) >= response.totalCount) {
                        return data;
                    }

                    return getAll(type, {...args, page})
                })
                .catch(error => console.error(error));
        }
        return getAll(type, args);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    api.configure({ apiKey: configuration.apiKey });

    const cardContainer = document.getElementById('card-container');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            fetchCards(query);
        } else {
            fetchAllCards();
        }
    });

    function fetchCards(query) {
        const params = {};

        if (isType(query)) {
            params.types = query;
        } else if (isRarity(query)) {
            params.rarity = query;
        } else {
            params.name = query;
        }

        api.card.where(params).then(data => {
            cardContainer.innerHTML = ''; 
            const cards = data.data;
            cards.forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.classList.add('card');

                const cardImage = document.createElement('img');
                cardImage.src = card.images.small;
                cardImage.alt = card.name;

                const cardName = document.createElement('h3');
                cardName.textContent = card.name;

                cardElement.appendChild(cardImage);
                cardElement.appendChild(cardName);
                cardContainer.appendChild(cardElement);
            });
        }).catch(error => console.error('Error:', error));
    }

    function fetchAllCards() {
        api.card.all().then(data => {
            cardContainer.innerHTML = ''; 
            const cards = data.data;
            cards.forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.classList.add('card');

                const cardImage = document.createElement('img');
                cardImage.src = card.images.small;
                cardImage.alt = card.name;

                const cardName = document.createElement('h3');
                cardName.textContent = card.name;

                cardElement.appendChild(cardImage);
                cardElement.appendChild(cardName);
                cardContainer.appendChild(cardElement);
            });
        }).catch(error => console.error('Error:', error));
    }

    function isType(query) {
        const types = ['Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Fighting', 'Darkness', 'Metal', 'Fairy', 'Dragon', 'Colorless'];
        return types.includes(query);
    }

    function isRarity(query) {
        const rarities = ['Common', 'Uncommon', 'Rare', 'Rare Holo', 'Rare Holo EX', 'Rare Holo GX', 'Rare Holo V', 'Rare Holo VMAX'];
        return rarities.includes(query);
    }
    console.log('cards.js loaded');
});