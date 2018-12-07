import React, { Component } from 'react';
import { getExecutions, getScrapingRemainingAllDevices } from './services/executionService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './scrapingResults.css';
import { connect } from 'react-redux';
import { updateExecutionId, getExecutionId } from '../redux/actions';
import { Link } from "react-router-dom";

class ScrapingExecutions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 100,
            skip: 0,
            order: -1,
            maxDateDiff: 1000 * 60 * 20,
            retrievedExec: [],
            statusExec: {},
            timer: null
        }
    }

    async componentDidMount() {
        const self = this;
        this.setState({
            timer: setInterval(async () => {
                getExecutions(self.state.limit, self.state.skip, self.state.order).then((data) => {
                    const retrievedExec = data;
                    this.setState({ retrievedExec });
                });

                getScrapingRemainingAllDevices().then((data) => {
                    const statusExec = data;
                    this.setState({ statusExec });
                });


                //this.onUpdateExecutionId(retrievedExec[0]);
                console.log(self.state);
            }, 1000)
        })

    }

    render() {
        return (<div>
            <br />
            <h2>Scraping executions</h2>
            <br />
            {this.executionTable()}
        </div>);
    }


    executionTable = () => {
        return (<div className="table-responsive table-big">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">id</th>
                        <th scope="col">date</th>
                        <th scope="col">last piece</th>
                        <th scope="col">app</th>
                        <th scope="col">state</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.retrievedExec.map((execution, index) =>
                        <tr key={index}>
                            <th scope="row"> <Link onClick={this.selectScrapingId} to={'/scraping-summaries/' + execution.scraping_id} name={index} className="cell-hover">{execution.scraping_id}</Link></th>
                            <td className="big-cell">{execution.date_scraped}</td>
                            <td>{execution.last_piece}</td>
                            <td>{execution.app_id}</td>
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
        this.setState({ timer: null })
        clearInterval(this.state.timer);
    }

    getActiveIcon = (execution) => {
        const date = (new Date(execution.date_scraped)).getTime();
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
