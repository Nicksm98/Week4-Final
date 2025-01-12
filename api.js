const apiKey = 'c88be850'; 
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchType = document.getElementById('search-type');
const resultsContainer = document.getElementById('results');

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    const type = searchType.value;

    if (searchTerm) {
        try {
            const movies = await searchMovies(searchTerm, type);
            displayResults(movies);
        } catch (error) {
            console.error('Error:', error);
            resultsContainer.innerHTML = '<p>An error occurred while fetching results.</p>';
        }
    }
});

async function searchMovies(searchTerm, type) {
    let url = `http://www.omdbapi.com/?apikey=${apiKey}`;

    switch (type) {
        case 'title':
            url += `&s=${searchTerm}`;
            break;
        case 'year':
            url += `&y=${searchTerm}&type=movie`;
            break;
        case 'id':
            url += `&i=${searchTerm}`;
            break;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === 'True') {
        return type === 'id' ? [data] : data.Search;
    } else {
        throw new Error(data.Error);
    }
}

function displayResults(movies) {
    resultsContainer.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <h2>${movie.Title}</h2>
            <p>IMDb ID: ${movie.imdbID}</p>
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450.png?text=No+Poster'}" alt="${movie.Title} Poster">
            <p>Year: ${movie.Year}</p>
            `;
        resultsContainer.appendChild(movieCard);
    });
}