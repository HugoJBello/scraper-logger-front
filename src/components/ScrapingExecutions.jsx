import React, { Component } from 'react';
import { getExecutions } from './services/executionService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './scrapingResults.css';
import { connect } from 'react-redux';
import { updateExecutionId, getExecutionId } from '../redux/actions';

class ScrapingExecutions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDb: "state-execution-fotocasa-scraping",
            dbNames: ["state-execution-fotocasa-scraping", "state-execution-airbnb-scraping"],
            //dbName: "state-execution-airbnb-scraping",
            limit: 100,
            skip: 0,
            order: -1,
            maxDateDiff: 1000 * 60 * 20,
            retrievedExec: []
        }
    }

    async componentDidMount() {
        const self = this;
        setInterval(async () => {
            const retrievedExec = await getExecutions(self.state.selectedDb, self.state.limit, self.state.skip, self.state.order);
            this.setState({ retrievedExec })
            //this.onUpdateExecutionId(retrievedExec[0]);
            console.log(self.state);
        }, 1000);

    }

    render() {
        return (<div>
            <br />
            <h2>Scraping executions</h2>
            <div className="row">
                <div className="form-inline col-sm-6 col-lg-3">
                    <label htmlFor="sel1">Select database:</label>
                    <select className="form-control" id="sel1" onChange={this.changeDbName}>
                        {this.state.dbNames.map((dbName, index) => <option key={index} value={dbName}>{dbName}</option>)}
                    </select>
                </div>
            </div>

            <br />
            {this.executionTable()}
        </div>);
    }
    changeDbName = (event) => {
        this.setState({ selectedDb: event.target.value });
    }

    priceFormatter = (cell, row, enumObject, index) => {
        const date = (new Date(cell)).getTime();
        const dateNow = (new Date()).getTime();
        const dateDiff = dateNow - date
        const isActive = dateDiff < this.state.maxDateDiff;
        return (<div>{isActive && <FontAwesomeIcon icon="stroopwafel"></FontAwesomeIcon>}</div>);
    }
    executionTable = () => {
        return (<div className="table-responsive table-big">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">id</th>
                        <th scope="col">date</th>
                        <th scope="col">last city</th>
                        <th scope="col">last piece</th>
                        <th scope="col">state</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.retrievedExec.map((execution, index) =>
                        <tr key={index}>
                            <th scope="row"> <a onClick={this.selectScrapingId} name={index} className="cell-hover">{execution.scrapingId}</a></th>
                            <td className="big-cell">{execution.date}</td>
                            <td>{execution.lastNmun}</td>
                            <td>{execution.lastPart}</td>
                            <td>{this.getActiveIcon(execution)}</td>
                        </tr>
                    )}

                </tbody>
            </table>
        </div>);
    }


    selectScrapingId = (event) => {
        console.log(event.target.name);
        const execution = this.state.retrievedExec[parseInt(event.target.name)];
        this.onUpdateExecutionId(execution);
    }

    getActiveIcon = (execution) => {
        const date = (new Date(execution.date)).getTime();
        const dateNow = (new Date()).getTime();
        const dateDiff = dateNow - date
        const isActive = dateDiff < this.state.maxDateDiff;
        return (<div className="icon-active">{isActive && <FontAwesomeIcon icon="stroopwafel"></FontAwesomeIcon>}</div>);
    }

    onUpdateExecutionId = (execution) => {
        this.props.onUpdateExecutionId(execution);
    }

}

const mapStateToProps = state => ({
    scrapingId: state.scrapingId
});

const mapActionsToProps = {
    onUpdateExecutionId: updateExecutionId,
    onGetExecutionId: getExecutionId,
};

export default connect(mapStateToProps, mapActionsToProps)(ScrapingExecutions);
