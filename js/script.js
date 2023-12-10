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
        displayCard(movie, true);
    });
};

// Display popular TV shows
const displayPopularShows = async () => {
    const { results } = await fetchAPIData('tv/popular');

    results.forEach(show => {
        displayCard(show, false);
    });
};

// Display movies and TV shows card
const displayCard = (item, isMovie) => {
    const cardDiv = document.createElement('div');
    const cardBody = document.createElement('div');
    const parentId = isMovie ? '#popular-movies' : '#popular-shows';

    const cardImg = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'images/no-image.jpg';
    const link = isMovie ? `movie-details.html?id=${item.id}` : `tv-details.html?id=${item.id}`
    const name = isMovie ? item.original_title : item.name;
    const releaseInfo = isMovie ? `Release: ${item.release_date}` : `Aired: ${item.first_air_date}`;

    cardDiv.classList.add('card');
    cardDiv.innerHTML = `<a href=${link}>
            <img src="${cardImg}"
            class="card-img-top"
            alt="${name}" /> </a>`;

    cardBody.classList.add('card-body');
    cardBody.innerHTML = `<h5 class="card-title">${name}</h5>
            <p class="card-text">
            <small class="text-muted">${releaseInfo}</small>
            </p>`;

    cardDiv.appendChild(cardBody);
    document.querySelector(parentId).appendChild(cardDiv);
};

// Fetch data from TMDB API
const fetchAPIData = async (endpoint) => {
    const API_URL = 'https://api.themoviedb.org/3/';
    const API_KEY = 'f7cad7e0325a6e76fff0ccfbee7268fc';
    //const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);

    showSpinner();
    const response = await fetch(`${API_URL}${endpoint}?language=en-US`, state.options);
    const data = await response.json();
    hideSpinner();

    return data;
};

const showSpinner = () => {
    document.querySelector('.spinner').classList.add('show');
};

const hideSpinner = () => {
    document.querySelector('.spinner').classList.remove('show');
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
            displayPopularShows();
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