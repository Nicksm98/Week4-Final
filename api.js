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
    const page = 1;
    const response = await fetch(`/search?query=${encodeURIComponent(searchTerm)}&type=${type}&page=${page}`);
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