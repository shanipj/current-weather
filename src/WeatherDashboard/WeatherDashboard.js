import React, { Component } from 'react';
import './WeatherDashboard.css';
import axios from "axios";
import swal from 'sweetalert';


const api = 'https://api.tomorrow.io/v4/timelines?location=60809ca688a6a60007947ca2&fields=temperature&timesteps=current&units=metric&apikey=HVIwYjZHra24Ah3uihus6Oh5pYRh6fXQ';
const Interval = 900000;

class WeatherDashboard extends Component {
    state = {
        currentTemp: '-',
        status: 'red',
        message: 'Loading...'
      
    }

    componentDidMount() {
        this.intervalId = setInterval(() => this.getData(), Interval);
        this.getData();
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    getData() {
            axios.get(api)
            .then(response => {
                let newTemp = Math.floor(response.data.data.timelines[0].intervals[0].values.temperature)
                this.compareTemp(newTemp);
            }).catch(error => {
                console.log(error);
            })
    }

    compareTemp(newTemp) {
        if (newTemp !== this.state.currentTemp) {
            if (newTemp >= 15) {
                if (this.state.currentTemp < 15) {
                    swal("All Clear!");
                }
                this.setState({ currentTemp: newTemp, status: 'green', message: "All Clear!" });

            } else if (newTemp <= 5) {
                if (this.state.currentTemp > 5) {
                    swal("Stop the work and get inside");
                }
                this.setState({ currentTemp: newTemp, status: 'red', message: "Danger Cold" });

            } else {
                if (this.state.currentTemp >= 15 || this.state.currentTemp <= 5) {
                    swal("Keep You Warm (Hot Drinks/Soups)");
                }
                this.setState({ currentTemp: newTemp, status: 'orange', message: "Extreme Cold" });
            }
        }
    }

    render() {
        return (
            <div className="mainPage"
                style={{
                    background: "url('"+process.env.PUBLIC_URL+ "/" + this.state.status + ".jpg')",
                }}>
                <div className="container">
                    <div className="content">
                        <p className="header">The Current Weather in JKF Is:</p>
                        <span className="currentTemp">
                            {this.state.currentTemp}°
                        </span>
                        <p className="message">{this.state.message}</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default WeatherDashboard;
