import React from 'react';
import io from 'socket.io-client';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import './../css/login.css';
import c2cLogo from './../images/C2C_Logo.svg';

let userSocket;

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            username: ''
        }
        console.log("ionside login constructior");
        userSocket = io(`http://139.59.7.242:80`);
        userSocket.on('connect', () => {
            console.log("connected");
        });
        //below function is when user has already joined then redirect to next page
        userSocket.on('joinToken', (data) => {
            console.log("!CALLED!");
            userSocket.disconnect();
            this.props.history.push('/question');

        });

        userSocket.on('disconnect', () => {
            console.log("disconnected");
        });
        this.usernameChange = this.usernameChange.bind(this);
        this.handleJoin = this.handleJoin.bind(this);
    }

    usernameChange = (e) => {
        this.setState({ username: e.target.value });
    }
    handleJoin = () => {
        console.log("username is : " + this.state.username);
        let username = this.state.username;
        localStorage.setItem('username', username);
        userSocket.emit('join', { username: username }, (err) => {
            console.log(err);
            swal("Oops!", err.err, "error");
            this.setState({ username: '' });
        });
    }
    render() {
        return (
            <div className="login-container" style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <div style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={c2cLogo} alt="code2create" height="150px" />
                </div>
                <div style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="login-wrapper z-depth-5">
                        <h4 style={{margin:0}}>Username: </h4>
                        <input style={{color:'white'}} type="text" onChange={this.usernameChange} />

                        <input type="submit" value="Join" className="btn" onClick={this.handleJoin} />
                    </div>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="footer" style={{ color: '#4a4a4a' }} style={{ display: 'flex', flex: 1 }}>
                        <p>Developed With <i className="fa fa-heart"></i> by ACM</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Login);
