const state = {
    currPage: window.location.pathname,
    options: {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmN2NhZDdlMDMyNWE2ZTc2ZmZmMGNjZmJlZTcyNjhmYyIsInN1YiI6IjY1NzRkZGNhY2FkYjZiMDgwZjkwMDM1MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JhgUq0_GzwYAZSBJUBtTbYreulL379q59qAcw5wOXUI'
        }
    }
};

// Display popular movies
const displayPopularMovies = async () => {
    const { results } = await fetchAPIData('movie/popular');

    results.forEach(movie => {
        const cardDiv = document.createElement('div');
        const cardBody = document.createElement('div');
        const cardImg = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'images/no-image.jpg';

        cardDiv.classList.add('card');
        cardDiv.innerHTML = `<a href="movie-details.html?id=${movie.id}">
            <img src="${cardImg}"
            class="card-img-top"
            alt="${movie.title}" /> </a>`;

        cardBody.classList.add('card-body');
        cardBody.innerHTML = `<h5 class="card-title">${movie.original_title}</h5>
            <p class="card-text">
            <small class="text-muted">Release: ${movie.release_date}</small>
            </p>`;

        cardDiv.appendChild(cardBody);
        document.querySelector('#popular-movies').appendChild(cardDiv);
    });
};

// Fetch data from TMDB API
const fetchAPIData = async (endpoint) => {
    const API_URL = 'https://api.themoviedb.org/3/';
    const API_KEY = 'f7cad7e0325a6e76fff0ccfbee7268fc';
    //const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
    const response = await fetch(`${API_URL}${endpoint}?language=en-US`, state.options);
    const data = await response.json();
    return data;
};

// Highlight Active Link
const highlightActiveLink = () => {
    links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.getAttribute('href') === state.currPage ? link.classList.add('active') : null;
    });
};

// Init App
const init = () => {
    switch (state.currPage) {
        case '/':
        case '/index.html':
            console.log('Home');
            displayPopularMovies();
            break;
        case '/shows.html':
            console.log('Shows');
            break
        case '/movie-details.html':
            console.log('Movie details');
            break;
        case '/tv-details.html':
            console.log('TV details');
            break;
        case '/search.html':
            console.log('Search Page');
            break;
    }

    highlightActiveLink();
};

document.addEventListener('DOMContentLoaded', init);