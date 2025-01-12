document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');
    
    if (searchQuery) {
        searchMovies(searchQuery);
    }

    document.getElementById('show-more').addEventListener('click', function() {
        searchMovies(searchQuery, true);
    });

    document.getElementById('sort-type').addEventListener('change', function() {
        displayResults(allMovies);
    });
});

let page = 1;
let allMovies = [];

async function searchMovies(query, append = false) {
    const apiKey = 'c88be850';
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}&page=${page}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.Search) {
            allMovies = append ? allMovies.concat(data.Search) : data.Search;
            displayResults(allMovies);
            page++;
            if (data.Search.length === 10) {
                document.getElementById('show-more').style.display = 'block';
            } else {
                document.getElementById('show-more').style.display = 'none';
            }
        } else {
            if (!append) {
                displayNoResults();
            }
            document.getElementById('show-more').style.display = 'none';
        }
    } catch (error) {
        console.error('Error:', error);
        displayError();
        document.getElementById('show-more').style.display = 'none';
    }
}

function displayResults(movies) {
    const sortType = document.getElementById('sort-type').value;
    const sortedMovies = [...movies];

    if (sortType === 'title') {
        sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
    } else if (sortType === 'title-desc') {
        sortedMovies.sort((a, b) => b.Title.localeCompare(a.Title));
    } else if (sortType === 'year') {
        sortedMovies.sort((a, b) => b.Year - a.Year);
    } else if (sortType === 'year-asc') {
        sortedMovies.sort((a, b) => a.Year - b.Year);
    }

    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = sortedMovies.map(movie => `
        <div class="movie-card">
            <h3>${movie.Title}</h3>
            <img class="movie-poster" src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450.png?text=No+Poster'}" alt="${movie.Title} poster">
            <p>${movie.Year}</p>
        </div>
    `).join('');
}

function displayNoResults() {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '<p>No results found.</p>';
}

function displayError() {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '<p>An error occurred while fetching results.</p>';