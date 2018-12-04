import axios from 'axios';

//const BASE_URL = 'http://hbello.info:3001';
const BASE_URL = 'https://scraper-logger-back.herokuapp.com';

const dbSummariesFotocasa = "summaries-fotocasa-scraping"

export { getScrapedCities, getResults, getScrapingGeoJson };

const getScrapedCities = (scrapingId) => {
    const url = `${BASE_URL}/mysql-summary-scraping/scraped_cities/?scraping_id=${scrapingId}`;
    //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    return axios.get(url).then(response => response.data);
}


const getScrapingGeoJson = (city, scrapingId) => {
    const url = `${BASE_URL}/mysql-summary-scraping/geoJson/?city=${city}&scraping_id=${scrapingId}`;
    //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    return axios.get(url).then(response => response.data);
}


const getResults = (city, scrapingId) => {
    const url = `${BASE_URL}/mysql-summary-scraping/results/?city=${city}&scraping_id=${scrapingId}`;
    //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    return axios.get(url).then(response => response.data);
}

