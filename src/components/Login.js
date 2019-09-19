import React from 'react';
import io from 'socket.io-client';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import './../css/login.css';
import l2cLogo from './../images/logowhite.png';
import baseurl from '../baseurl'

let userSocket;

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            username: '',
            screen: null,
            pass:''
        }
        console.log("ionside login constructior");
        userSocket = io(baseurl);
        userSocket.on('connect', () => {
            console.log("connected");
        });
        window.uc = userSocket
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
    adminJoin() {
        localStorage.setItem('adminId',this.state.username)
        localStorage.setItem('adminPass',this.state.pass)
        this.props.history.push('/admin-c2c-hidden-97');

    }
    statsJoin() {
        localStorage.setItem('statsId',this.state.username)
        localStorage.setItem('statsPass',this.state.pass)
        this.props.history.push('/stats');
    }
    render() {
        return (
            <div className="login-container" style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <div style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={l2cLogo} alt="code2create" height="150px" />
                </div>
                <div style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',  }}>
                    <div className="login-wrapper z-depth-5" style={{position: 'relative'}}>
                        <h4 style={{ margin: 0 }}>
                            {!this.state.screen ? 'Username: '
                                : this.state.screen === 'admin' ? 'Admin Token' : 'StatsListener Token'}
                        </h4>
                        <input style={{ color: 'white' }} type="text" placeholder={!this.state.screen?'':'Enter your username here'} value={this.state.username} onChange={this.usernameChange} />
                        {this.state.screen?<input style={{ color: 'white' }} type="text" type="password" autoComplete="new-password" placeholder='Enter your password here' value={this.state.pass} onChange={(e)=>this.setState({pass:e.target.value})} />:<span/>}

                        <input type="submit" value="Join" className="btn" onClick={
                            !this.state.screen ? this.handleJoin
                                : this.state.screen === 'admin' ? this.adminJoin.bind(this) : this.statsJoin.bind(this)} />
                        <span style={{ position: "absolute", bottom: 0, right: 0, fontSize:15, cursor:'pointer' }}>
                            <span onClick={()=>this.setState({screen:null})}>User</span>/
                            <span onClick={()=>this.setState({screen:'admin'})}>Admin</span>/
                            <span onClick={()=>this.setState({screen:'statsListen'})}>Stats</span>
                        </span>
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
