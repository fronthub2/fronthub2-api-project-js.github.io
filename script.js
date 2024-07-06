const API_KEY = '8c8e1a50-6322-4135-8875-5d40a5420d86'
const API_TOP250_URL = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_250_MOVIES&page=1'

getMovie(API_TOP250_URL)
async function getMovie(url) {
    const responce = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY,
        }
    })
    const responceData = await responce.json()
    showMovieItems(responceData)
    counterPages(responceData)
}

function ratingMovie(num) {
    if (num >= 8) {
        return 'green'
    } else if (num > 6) {
        return 'orange'
    } else {
        return 'red'
    }
}

function showMovieItems(data) {
    const moviesEl = document.querySelector('.movies')

    moviesEl.innerHTML = ''

    data.items.forEach((movie) => {
        const movieElm = document.createElement('div')
        movieElm.classList.add('movie')

        movieElm.innerHTML = `
        <div class="movie__item">
            <div href="#" class="movie__cover__inner">
                <img class="movie__cover" src="${movie.posterUrl}" alt="">
            </div>
            <p class="movie__title">${movie.nameRu}</p>
            <p class="movie__genre">${movie.genres.map((el) => ` ${el.genre}`)}</p>
            <p class="movie__rating movie__rating--${ratingMovie(parseFloat(movie.ratingKinopoisk))}">${parseFloat(movie.ratingKinopoisk)}</p>
        </div>
        `
        const btnBlock = document.querySelector('.btn_block')
        btnBlock.classList.remove('show')
        movieElm.addEventListener('click', () => getModal(movie.kinopoiskId))
        moviesEl.appendChild(movieElm)
    })
}


//переключение страниц
const btnLast = document.querySelector('.left')
const btnNext = document.querySelector('.right')

//фикс цикла переключения страниц
function removeArrLength() {
    arrayPages.length = 0
}

function counterPages(data) {
    let pages = data.totalPages

    removeArrLength()

    for (let i = 0; i < pages; i++) {
        arrayPages.push(i)
    }
    console.log('pages >>>>>', pages)
}

const arrayPages = []
const pages = document.querySelector('.pages')
let currentPage = 1

function numPages() {
    pages.textContent = currentPage
    console.log(arrayPages[currentPage])
}
numPages()

let apiKey = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_250_MOVIES&page='

function apiPages() {
    const newApiKey = `${apiKey}${arrayPages[currentPage]}`
    getMovie(newApiKey)
    numPages()
    const header = document.querySelector('.header')
    header.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
    console.log(apiKey)
}

btnLast.addEventListener('click', function () {
    if (currentPage > 0) {
        currentPage--
        apiPages()
    }

})

btnNext.addEventListener('click', function (e) {
    if (currentPage < arrayPages.length - 1) {
        currentPage++
        apiPages()
    }

    console.log('array >>>', arrayPages)
    console.log('arrlengt >>>', arrayPages.length)
})

function stopDefAction(evt) {
    evt.preventDefault();
}

//модалка
const API_MODAL_KEY = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/'
const modalElm = document.querySelector('.modal')

async function getModal(id) {
    const responce = await fetch(API_MODAL_KEY + id, {
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY,
        }
    })

    const responceData = await responce.json()

    modalElm.classList.add('modal--show')
    document.body.classList.add('stop-scrolling')
    modalElm.style.backdropFilter = 'blur(2px)'

    modalElm.innerHTML = `
    <div class="modal__card">
        <img class="modal__movie-backdrop" src="${responceData.posterUrlPreview}" alt="">
        <h2 class="modal__movie-text">
        <span class="modal__movie-title">${responceData.nameRu}</span>
        </h2>
        <ul class="modal__movie-info">
        <div class="loader"></div>
        <li class="modal__movie-release-year modal_li">Год - ${responceData.year} </li>
        <li class="modal__movie-runtime modal_li">Время - ${(responceData.filmLength)} минут</li>
        <li class="modal__movie-overview modal_li">Описание - ${responceData.shortDescription} </li>
        </ul>
        <div class="modal__movie-btn">
        <a class="modal__movie-link" href="${link(responceData.webUrl)}">Перейти к просмотру</a>
        <a class="modal__movie-linkkk">Смотреть</a>
        <button type="button" class="modal__button-close">Закрыть</button>
        </div>
    </div>
    `
    console.log(responceData.webUrl)
    const btnCloseModal = document.querySelector('.modal__button-close')
    btnCloseModal.addEventListener('click', () => closeModal())

    const watchMovie = document.querySelector('.modal__movie-linkkk')
    const ap = `${link(responceData.webUrl)}`

    watchMovie.addEventListener('click', function () {
        modalElm.innerHTML = `
            <div class="modal--block">
                <div class="modal__btn--close">
                    <span class="modal__btn--sp1"></span>
                    <span class="modal__btn--sp2"></span>
                </div>
                <iframe id="myIframe" width="560" height="315" src="${ap}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
        `

        const mo = document.querySelector('.modal__btn--close')
        mo.addEventListener('click', () => closeModal())
    })
}

//подмена букв в строке
function link(domen) {
    const str = domen.indexOf('kino')
    if (str !== -1) {
        return domen = domen.substring(0, str) + 'ss' + domen.substring(str + 4)
    }
}

//закрытие модалки
function closeModal() {
    modalElm.classList.remove('modal--show')
    document.body.classList.remove('stop-scrolling')
    modalElm.innerHTML = ''
}

window.addEventListener('click', function (event) {
    if (event.target === modalElm) {
        closeModal()
    }
})

window.addEventListener('keydown', function (event) {
    if (event.keyCode === 27) {
        closeModal()
    }
})

//аккардион
const mainMenuTitle = document.querySelectorAll('.main__menu--title')
const mainMenu = document.querySelectorAll('.main__menu')

mainMenuTitle.forEach((e) => {
    e.addEventListener('click', function () {
        remover()
        e.nextElementSibling.style.display = 'block'
        e.style.color = '#4a4a4a'
        e.style.textDecoration = 'underline'

    })
})

function remover() {
    mainMenuTitle.forEach((e) => {
        e.style.color = '#FFFFFF'
        e.style.textDecoration = 'none'
    })
    mainMenu.forEach((e) => {
        e.style.display = 'none'
    })
}

//клик вне области 
window.addEventListener('click', function (event) {
    const isClickedInside = filterBlock.contains(event.target);
    if (!isClickedInside || event.target === filterBlock) {
        remover();
    }
})

//меню
const filterBlock = document.querySelector('.main__menu--filterblock')
const mainMenuBtn = document.querySelector('.main__menu--btn')
const mainMenuFilterBtn = document.querySelector('.main__menu--filterblock--btn')


mainMenuBtn.addEventListener('click', function () {
    filterBlock.classList.add('main__menu--filterblock--active')
})

mainMenuFilterBtn.addEventListener('click', function () {
    filterBlock.classList.remove('main__menu--filterblock--active')
})

//закрывание меню при скролле 
function scrolling(elm, clss) {
    if (this.pageYOffset > 0) {
        elm.classList.remove(clss)
    }
}

window.addEventListener('scroll', function() {
    let filtblock = filterBlock.classList.contains('main__menu--filterblock--active')
    if (filtblock) {
        scrolling(filterBlock, 'main__menu--filterblock--active')
        console.log('scrolllint')
    }
})

//категория меню 
function removeCurrentPages() {
    currentPage = 1
    pages.textContent = currentPage
}

const familyLink = document.querySelector('#family')
familyLink.addEventListener('click', function () {
    removeCurrentPages()
    const api_tv_movie = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=FAMILY&page=1'
    getMovie(api_tv_movie)
    apiKey = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=FAMILY&page='
})

const filmsLink = document.querySelector('#films')
filmsLink.addEventListener('click', function () {
    removeCurrentPages()
    getMovie(API_TOP250_URL)
    apiKey = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_250_MOVIES&page='
})

const seriesLink = document.querySelector('#series')
seriesLink.addEventListener('click', function () {
    removeCurrentPages()
    const api_tv_series = 'https://kinopoiskapiunofficial.tech/api/v2.2/films?order=RATING&type=TV_SERIES&ratingFrom=0&ratingTo=10&yearFrom=1000&yearTo=3000&page=1'
    getMovie(api_tv_series)
    apiKey = 'https://kinopoiskapiunofficial.tech/api/v2.2/films?order=RATING&type=TV_SERIES&ratingFrom=0&ratingTo=10&yearFrom=1000&yearTo=3000&page='
})

const horrorLink = document.querySelector('#horror')
horrorLink.addEventListener('click', function () {
    removeCurrentPages()
    const api_tv_horror = 'https://kinopoiskapiunofficial.tech/api/v2.2/films?genres=1&order=RATING&type=ALL&ratingFrom=0&ratingTo=10&yearFrom=1000&yearTo=3000&page=1'
    getMovie(api_tv_horror)
    apiKey = 'https://kinopoiskapiunofficial.tech/api/v2.2/films?genres=1&order=RATING&type=ALL&ratingFrom=0&ratingTo=10&yearFrom=1000&yearTo=3000&page='
})

//поиск по кл слову
const API_KEY_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword='
const searchForm = document.querySelector('#searchForm')

async function getFilms(url) {
    const responce = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY,
        }
    })

    const responceData = await responce.json()
    const moviesEl = document.querySelector('.movies')

    moviesEl.innerHTML = ''

    responceData.films.forEach((movie) => {
        const movieElm = document.createElement('div')
        movieElm.classList.add('movie')

        movieElm.innerHTML = `
        <div class="movie__item">
            <div href="#" class="movie__cover__inner">
                <img class="movie__cover" src="${movie.posterUrl}" alt="">
            </div>
            <p class="movie__title">${movie.nameRu}</p>
            <p class="movie__genre">${movie.genres.map((el) => ` ${el.genre}`)}</p>
            ${parseFloat(movie.rating) ? `<p class="movie__rating movie__rating--${ratingMovie(parseFloat(movie.rating))}">${parseFloat(movie.rating)}</p>` : ''}
        </div>
        `
        movieElm.addEventListener('click', () => getModal(movie.filmId))
        moviesEl.appendChild(movieElm)

        const btnBlock = document.querySelector('.btn_block')
        btnBlock.classList.add('show')
    })
    // const watchMovie = document.querySelector('.modal__movie-linkkk')
    // const ap = `${link(responceData.webUrl)}`

    // watchMovie.addEventListener('click', function () {

    //     modalElm.innerHTML = `
    //         <iframe id="myIframe" width="560" height="315" src="${ap}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    //     `
    // })
}

searchForm.addEventListener('submit', function (e) {
    e.preventDefault()

    const input = document.querySelector('#searchInp')
    let search = input.value
    const apiNew = `${API_KEY_SEARCH}${search}`

    getFilms(apiNew)
    input.value = ''
})

