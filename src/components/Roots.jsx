import React, { Component } from 'react';
import ScrapingExecutions from './ScrapingExecutions'
import ScrapingSummaries from './ScrapingSummaries'
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './Home';

class Roots extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <div className="container">
                <Route path="/home" component={ScrapingExecutions} />
                <Route path="/scraping-executions" component={ScrapingExecutions} />
                <Route path="/scraping-summaries/:scraping_id" component={ScrapingSummaries} />
            </div>);
    }
}

export default Roots;