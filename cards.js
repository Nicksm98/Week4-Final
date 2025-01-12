let movies;

async function renderMovies(filter) {
    const movieWrapper = document.querySelector('.movies');

    moviesWrapper.classList += ' movies__loading'

    if (!movies) {
        movies = await getMovies();
    }

    moviesWrapper.classList.remove('movies__loading');

    if (filter === 'A_TO_Z') {
        movies = movies.sort(
            (a, b) =>
                a.title - b.title
        )
    } else if (filter === 'Z_TO_A') {
        movies = movies.sort(
            (a, b) =>
                b.title - a.title
        )
    } else if (filter === 'YEAR') {
        movies = movies.sort(
            (a, b) =>
                a.year - b.year
        )
    }
}

