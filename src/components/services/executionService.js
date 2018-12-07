import axios from 'axios';

//const BASE_URL = 'http://hbello.info:3001';
const BASE_URL = 'https://scraper-logger-back.herokuapp.com';

const dbExecutionFotocasa = "state-execution-airbnb-scraping"

export { getExecutionsMongo, getExecution, getExecutions, getScrapingRemainingAllDevices };

const getExecution = (entryName) => {
    //const url = `${BASE_URL}/entries/entry/name=${entryName}`;
    //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    //return axios.get(url).then(response => response.data);
}

// /stateExecution/state-execution-airbnb-scraping?skip=0&limit=2
const getExecutionsMongo = (dbName, limit, skip, order) => {
    const url = `${BASE_URL}/stateExecution/${dbName}?skip=${skip}&limit=${limit}&order=${order}`;
    //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    return axios.get(url).then(response => response.data);
}

// /stateExecution/state-execution-airbnb-scraping?skip=0&limit=2
const getExecutions = (limit, skip, order) => {
    const url = `${BASE_URL}/mysql-scraping-log/?skip=${skip}&limit=${limit}&order=${order}`;
    //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    return axios.get(url).then(response => response.data);
}

const getScrapingRemainingAllDevices = () => {
    const url = `${BASE_URL}/mysql-summary-scraping/scrapingRemainingAllDevices`;
    //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    return axios.get(url).then(response => response.data);
}
