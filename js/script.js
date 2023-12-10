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

const displayMovieDetails = async () => {
    const queryStr = window.location.search.slice(1).split('=');
    const movieId = getQueryObject(queryStr).id;
    const movie = await fetchAPIData(`movie/${movieId}`);
    displayDetails(movie, true);
};

const displayTVDetails = async () => {
    const queryStr = window.location.search.slice(1).split('=');
    const seriesId = getQueryObject(queryStr).id;
    const show = await fetchAPIData(`tv/${seriesId}`);
    displayDetails(show, false);
};

const displayDetails = (item, isMovie) => {
    const name = isMovie ? item.original_title : item.name;
    const releaseInfo = isMovie ? `Release Date: ${item.release_date}` : `Aired Date: ${item.first_air_date}`;
    const imgSrc = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'images/no-image.jpg';

    const divTop = document.querySelector('.details-top');
    const divBottom = document.querySelector('.details-bottom');
    const divImg = document.createElement('div');
    const divInfo = document.createElement('div');

    divImg.innerHTML = `<img src="${imgSrc}"
							class="card-img-top"
							alt="${name}" />`;

    divInfo.innerHTML = `<h2>${name}</h2>
						<p><i class="fas fa-star text-primary"></i> ${item.vote_average.toFixed(1)} / 10</p>
						<p class="text-muted">${releaseInfo}</p>
						<p> ${item.overview} </p>
						<h5>Genres</h5>
						<ul class="list-group">
							${item.genres.map(genre => `<li>${genre.name}</li>`).join('')}
						</ul>
						<a href="${item.homepage}" target="_blank" class="btn">Visit ${isMovie ? `Movie` : `Show`} Homepage</a>`;

    divBottom.innerHTML = isMovie ? `<h2>Movie Info</h2>
        <ul>
        <li><span class="text-secondary">Budget:</span> $${formatCurrency(item.budget)}</li>
        <li><span class="text-secondary">Revenue:</span> $${formatCurrency(item.revenue)}</li>
        <li><span class="text-secondary">Runtime:</span> ${item.runtime} minutes</li>
        <li><span class="text-secondary">Status:</span> ${item.status}</li>
        </ul>
        <h4>Production Companies</h4>
        <div class="list-group">
        ${item.production_companies.map(comp => `${comp.name}`).join(', ')}</div>` :

        `<h2>Show Info</h2>
        <ul>
          <li><span class="text-secondary">Number Of Episodes:</span> ${item.number_of_episodes}</li>
          <li><span class="text-secondary">Last Episode To Air:</span> ${item.last_episode_to_air.name} (S${item.last_episode_to_air.season_number}E${item.last_episode_to_air.episode_number})</li>
          <li><span class="text-secondary">Status:</span> ${item.status}</li>
        </ul>
        <h4>Production Companies</h4>
        <div class="list-group">${item.production_companies.map(comp => `${comp.name}`).join(', ')}</div>`;

    divTop.appendChild(divImg);
    divTop.appendChild(divInfo);
};

const getQueryObject = (queryStr) => {
    let paramsObj = {};
    for (let i = 0; i < queryStr.length; i += 2) {
        paramsObj[queryStr[i]] = queryStr[i + 1];
    }
    return paramsObj;
};

// Fetch data from TMDB API
const fetchAPIData = async (endpoint) => {
    const API_URL = 'https://api.themoviedb.org/3/';
    // const API_KEY = 'f7cad7e0325a6e76fff0ccfbee7268fc';
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

const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
            displayMovieDetails();
            break;
        case '/tv-details.html':
            console.log('TV details');
            displayTVDetails();
            break;
        case '/search.html':
            console.log('Search Page');
            break;
    }

    highlightActiveLink();
};

document.addEventListener('DOMContentLoaded', init);