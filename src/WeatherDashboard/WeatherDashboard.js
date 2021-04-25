import React, { Component } from 'react';
import './WeatherDashboard.css';
import axios from "axios";
import swal from 'sweetalert';
import * as Constans from '../Utils/constants';

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
          Constans.Interval);
        this.getData();
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    getData = async () => {
        try {
            const response = await axios.get(Constans.API);
                let newTemp = Math.floor(response.data.data.timelines[0].intervals[0].values.temperature);
                this.compareTemp(newTemp);
        } catch (err) {
            swal('No Information Available');
        }
    };
    

    compareTemp(newTemp) {
        let {status, message, alertMessage} = this.state
        let newStatus = '';
        
        switch (true) {
            case ( newTemp <= 15 ):
                message = 'All Clear!';
                alertMessage= "All Clear!";
                newStatus = "green";
                break;
            case ( newTemp <= 5 ):
                message = 'Danger Cold';
                alertMessage = 'Stop the work and get inside';
                newStatus = 'red';
                break;
            case ( newTemp > 5 && newTemp < 15 ):
                message = 'Extreme Cold';
                alertMessage = 'Keep You Warm (Hot Drinks/Soups)';
                newStatus = 'orange';  
                break;
            default: 
                break;
        }
        if ( status !== newStatus ) {
            swal(alertMessage);
        }
        this.setState({ currentTemp: newTemp, message: message ,status: newStatus});
    }  

    render() {
         const {status, message, currentTemp} = this.state
  
        return (
            <div className="mainPage"
                style={{
                    background:  `url(/current-weather/${status}.jpg)`
                }}>
                <div className="container">
                    <div className="content">
                        <p className="header">The Current Weather in JKF Is:</p>
                        <span className="currentTemp">
                            {currentTemp}°
                        </span>
                        <p className="message">{message}</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default WeatherDashboard;
