import React, { Component } from 'react';
import { getScrapedCities, getResults, getScrapingGeoJson } from './services/summariesService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { connect } from 'react-redux';
import { updateExecutionId, getExecutionId } from '../redux/actions';
import { GeoJSON, Map, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

class ScrapingSummaries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 1,
            skip: 0,
            scraping_id: props.match.params.scraping_id,
            selectedCity: null,
            scrapedCities: null,
            order: -1,
            maxDateDiff: 1000 * 60 * 20,
            retrievedExec: null
        }
        this.changeCity = this.changeCity.bind(this);
    }

    async componentDidMount() {
        if (this.state.scraping_id) {
            const citiesObj = await getScrapedCities(this.state.scraping_id);
            const cities = [];
            citiesObj.map((city) => { cities.push(city.city_name) });
            console.log(cities);
            this.setState({ scrapedCities: cities });
            if (cities[0]) {
                this.setResultsAndGeoJson(cities[0]);
            }
            console.log(this.state.scrapedCities);
        }
    }


    render() {
        return (<div>
            {this.state.scrapedCities && <div class="form-inline col-sm-6 col-lg-3">
                <label htmlFor="sel1">Select city:</label>
                <select className="form-control" id="sel1" onChange={this.changeCity}>
                    {this.state.scrapedCities.map((city) => <option value={city}>{city}</option>)}
                </select>
            </div>}
            {this.state.geoJson &&
                <div>
                    <span>aaaa</span>
                    <Map zoom={13}>
                        <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />

                        <GeoJSON data={this.state.geoJson} />

                    </Map>
                </div>
            }
        </div>);
    }

    changeCity = async (event) => {
        const city = event.target.value;
        this.setState({ selectedCity: city });

        console.log(this.state.selectedCity);
        console.log(this.state.scraping_id);

        this.setResultsAndGeoJson(city);


    }

    setResultsAndGeoJson = async (city) => {
        const geoJson = await getScrapingGeoJson(city, this.state.scraping_id);
        const result = await getResults(city, this.state.scraping_id);
        console.log(result);

        this.setState({ geoJson: geoJson });
        this.setState({ result: result });

        console.log(geoJson);
    }

}

const mapStateToProps = state => ({
    scrapingId: state.scrapingId
});

const mapActionsToProps = {
    onUpdateExecutionId: updateExecutionId,
    onGetExecutionId: getExecutionId,
};

export default connect(mapStateToProps, mapActionsToProps)(ScrapingSummaries);
