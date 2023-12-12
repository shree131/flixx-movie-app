const state = {
    currPage: window.location.pathname,
    options: {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmN2NhZDdlMDMyNWE2ZTc2ZmZmMGNjZmJlZTcyNjhmYyIsInN1YiI6IjY1NzRkZGNhY2FkYjZiMDgwZjkwMDM1MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JhgUq0_GzwYAZSBJUBtTbYreulL379q59qAcw5wOXUI'
        }
    },
    search: {
        term: '',
        type: '',
        page: 1,
        totalPages: 1
    }
};

// Display popular movies
const displayPopularMovies = async () => {
    const { results } = await fetchAPIData('movie/popular');
    const displayLocation = '#popular-movies';

    results.forEach(movie => {
        displayCard(movie, true, displayLocation);
    });
};

// Display popular TV shows
const displayPopularShows = async () => {
    const { results } = await fetchAPIData('tv/popular');
    const displayLocation = '#popular-shows';

    results.forEach(show => {
        displayCard(show, false, displayLocation);
    });
};

// Display movies and TV shows card
const displayCard = (item, isMovie, parentId) => {
    const cardDiv = document.createElement('div');
    const cardBody = document.createElement('div');
    // const parentId = isMovie ? '#popular-movies' : '#popular-shows';

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
    const queryStr = window.location.search.slice(1).split('&');
    const movieId = getQueryObject(queryStr).id;
    const movie = await fetchAPIData(`movie/${movieId}`);

    // Overlay background image
    displayBackgroungImage('movie', movie.backdrop_path);

    displayDetails(movie, true);
};

const displayTVDetails = async () => {
    const queryStr = window.location.search.slice(1).split('&');
    const seriesId = getQueryObject(queryStr).id;
    const show = await fetchAPIData(`tv/${seriesId}`);

    // Overlay background image
    displayBackgroungImage('show', show.backdrop_path);

    displayDetails(show, false);
};

// Display movies and shows details
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

// Display backdrop on details pages
const displayBackgroungImage = (type, backdropPath) => {
    const overlayDiv = document.createElement('div');
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backdropPath})`;
    overlayDiv.classList.add('backdrop');

    const parentDiv = type === 'movie' ? document.querySelector('#movie-details') : document.querySelector('#show-details');
    parentDiv.appendChild(overlayDiv);
};

// Search Movies/Shows
const search = async () => {
    const paramsObj = getQueryObject(window.location.search.slice(1).split('&'));
    const { type } = paramsObj;
    const searchTerm = paramsObj['search-term'];
    const displayLocation = '#search-results';

    if (searchTerm !== '' && searchTerm !== null) {
        // Fetch data and display
        const isMovie = type === 'movie' ? true : false;
        const endpoint = isMovie ? 'search/movie' : 'search/tv';
        const { results } = await fetchSearchData(endpoint, searchTerm);

        // Display results
        results.forEach(item => {
            displayCard(item, isMovie, displayLocation);
        });

    } else {
        showAlert('Search Term Cannot Be Empty');
    }

};

// Convert query parameters into an object
const getQueryObject = (queryStr) => {
    let paramsObj = {};
    for (let i = 0; i < queryStr.length; i++) {
        let params = queryStr[i].split('=');
        paramsObj[params[0].replaceAll('+', ' ')] = params[1].replaceAll('+', ' ');
    }
    return paramsObj;
};

// Display slider movies
const displaySlider = async () => {
    const { results } = await fetchAPIData('movie/now_playing');

    results.forEach(movie => {
        const divSlide = document.createElement('div');
        const imgSrc = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'images/no-image.jpg';

        divSlide.classList.add('swiper-slide');
        divSlide.innerHTML = `<a href="movie-details.html?id=${movie.id}">
        <img src="${imgSrc}" alt="${movie.original_title}" /> </a>
        <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
        </h4>`;

        document.querySelector('.swiper-wrapper').appendChild(divSlide);
        initSwiper();
    });
};

const initSwiper = () => {
    const swiper = new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        freeMode: true,
        loop: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: true,
        },
        breakpoints: {
            500: {
                slidesPerView: 2,
            },
            700: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 4,
            },
        },
    });
}

// Fetch data from TMDB API
const fetchAPIData = async (endpoint) => {
    const API_URL = 'https://api.themoviedb.org/3/';
    //const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);

    showSpinner();
    const response = await fetch(`${API_URL}${endpoint}?language=en-US`, state.options);
    const data = await response.json();
    hideSpinner();

    return data;
};

// Fetch Seach Data from API
const fetchSearchData = async (endpoint, searchTerm) => {
    const API_URL = 'https://api.themoviedb.org/3/';

    showSpinner();
    const res = await fetch(`${API_URL}${endpoint}?query=${searchTerm}&include_adult=false&language=en-US`, state.options);
    const results = await res.json();
    hideSpinner();

    return results;
};

// Show search alert
const showAlert = (message) => {
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', 'alert-error');
    alertDiv.appendChild(document.createTextNode(message));
    document.querySelector('#alert').appendChild(alertDiv);

    setTimeout(() => { alertDiv.remove() }, 5000);
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
            displaySlider();
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
            search();
            break;
    }

    highlightActiveLink();
};

document.addEventListener('DOMContentLoaded', init);