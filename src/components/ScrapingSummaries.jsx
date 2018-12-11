import React, { Component } from 'react';
import { getScrapedCities, getResults, getScrapingGeoJson } from './services/summariesService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { connect } from 'react-redux';
import { updateExecutionId, getExecutionId } from '../redux/actions';
import { GeoJSON, Map, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

class ScrapingSummaries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 1,
            skip: 0,
            scraping_id: props.match.params.scraping_id,
            selectedCity: "",
            styleOptions: [],
            selectedStyleOption: "",
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
            this.setState({ scrapedCities: cities });
            if (cities[0]) {
                await this.setResultsAndGeoJson(cities[0]);
                this.setStyleOptions();
                await this.generateMap()
            }
        }
    }

    setResultsAndGeoJson = async (city) => {
        const geoJson = await getScrapingGeoJson(city, this.state.scraping_id);
        const result = await getResults(city, this.state.scraping_id);

        this.setState({ geoJson: geoJson });
        this.setState({ result: result });
    }

    setStyleOptions = () => {
        const sample = this.state.geoJson.features[0].properties;
        const styleOptions = Object.keys(sample);
        this.setState({ styleOptions });
    }


    render() {
        const position = [51.505, -0.09]

        return (<div>
            {this.state.scrapedCities && <div className="form-inline col-sm-6 col-lg-3">
                <label htmlFor="sel1">Select city:</label>
                <select className="form-control" id="sel1" onChange={this.changeCity} value={this.state.selectedCity}>
                    {this.state.scrapedCities.map((city, index) => <option key={index} value={city}>{city}</option>)}
                </select>
            </div>}
            <br></br>
            {this.state.styleOptions && <div className="form-inline col-sm-6 col-lg-3">
                <label htmlFor="sel1">option:</label>
                <select className="form-control" id="sel1" onChange={this.changeOption} value={this.state.selectedStyleOption}>
                    {this.state.styleOptions.map((option, index) => <option key={index} value={option}>{option}</option>)}
                </select>
            </div>}
            <br></br>
            {this.state.geoJson &&
                <div>
                    {this.state.map}
                </div>
            }
        </div>);
    }

    generateMap = () => {
        this.setState({ map: null });
        const position = [this.state.geoJson.features[0].bbox[1], this.state.geoJson.features[0].bbox[0]]
        //const position = [40.505, -3.09]
        console.log("------");
        console.log(this.state.selectedCity);
        const map = (
            <Map center={position} className="map-geojson" zoom={13}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <GeoJSON data={this.state.geoJson} style={this.style} />
            </Map>
        );
        this.setState({ map });
    }

    style = (feature) => {
        const option = this.state.selectedStyleOption;
        return {
            fillOpacity: feature.properties[option] * 0.8,
            fillColor: "#ff0000"
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        //if (this.state.map) this.state.map.remove();
    }
    changeCity = async (event) => {
        const city = event.target.value;
        this.setState({ selectedCity: city });
        await this.setResultsAndGeoJson(city);
        await this.generateMap()

    }

    changeOption = async (event) => {
        const option = event.target.value;
        this.setState({ selectedStyleOption: option });
        await this.generateMap()

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
