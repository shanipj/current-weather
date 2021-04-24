import React, { Component } from 'react';
import './WeatherDashboard.css';
import axios from "axios";
import swal from 'sweetalert';

const api = 'https://api.tomorrow.io/v4/timelines?location=60809ca688a6a60007947ca2&fields=temperature&timesteps=current&units=metric&apikey=HVIwYjZHra24Ah3uihus6Oh5pYRh6fXQ';
const Interval = 900000;

class WeatherDashboard extends Component {
    state = {
        currentTemp: "-",
        message: 'Loading...',
        alertMessage: '',
        status: 'loadingColor'
      
    }

    componentDidMount() {
        this.intervalId = setInterval(
          () => this.getData(),
           Interval);
        this.getData();
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    getData() {
            axios.get(api)
            .then(response => {
                let temperature = response.data.data.timelines[0].intervals[0].values.temperature;
                let newTemp = Math.floor(temperature);
                this.compareTemp(newTemp);
            }).catch(error => {
                swal('No Information Available');
            })
    }

    compareTemp(newTemp) {
        let message = '';
        let alertMessage = '';
        let status = '';
        let currentStatus = this.state.status;
    
        if ( newTemp >= 15 ){
            message = 'All Clear!';
            alertMessage = 'All Clear!';
            status = 'green';  
        }else if( newTemp <= 5 ){
            message = 'Danger Cold';
            alertMessage = 'Stop the work and get inside';
            status = 'red';
        }else {
            message = 'Extreme Cold';
            alertMessage = 'Keep You Warm (Hot Drinks/Soups)';
            status = 'orange';  
        }
                    
        if ( currentStatus !== status ) {
            swal(alertMessage);
            this.setState({ currentTemp: newTemp, message: message ,status: status});
        }
    }  

    render() {
        const currentStatus = this.state.status;
        const currentMessage = this.state.message;
        const currentTemp = this.state.currentTemp;

        return (
            <div className="mainPage"
                style={{
                    background: "url('"+process.env.PUBLIC_URL+ "/" + currentStatus + ".jpg')",
                }}>
                <div className="container">
                    <div className="content">
                        <p className="header">The Current Weather in JKF Is:</p>
                        <span className="currentTemp">
                            {currentTemp}°
                        </span>
                        <p className="message">{currentMessage}</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default WeatherDashboard;
