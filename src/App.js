import React from "react";
import MainNav from './components/Navbar';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import Header from './components/Header';
import Landing from './components/Landing';
import { login, signup } from './Connect'

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			showLogin: false,
			showSignup: false,
			showSell: false,
			userId: false
		};
	}

	login(address, password) {
		login(address, password)
			.then(res => {
				var state = this.state
				state.showLogin = false
				state.userId = address
				this.setState(state)
			})
	}

	signup(password) {
		signup(password)
			.then(address => {
				var state = this.state
				state.showLogin = false
				state.userId = address
				this.setState(state)
			})
	}

	logout() {
		var state = this.state;
		state.userId = false;
		this.setState(state);
	}

	render() {
		return (
			<div>
				<MainNav onLoginClicked={() => this.setState({ showLogin: true })}
					onSignupClicked={() => this.setState({ showSignup: true })}
					userId={this.state.userId}
					onLogoutClicked={() => this.logout()} />
				{
					this.state.userId ? 
						<div className="container">
							<Header userId={this.state.userId}/> 
						</div>
					: <Landing />
				}
				<LoginModal showLogin={this.state.showLogin}
					onClose={() => this.setState({ showLogin: false })}
					onLoginClicked={(address, password) => this.login(address, password)} />
				<SignupModal showSignup={this.state.showSignup}
					onClose={() => this.setState({ showSignup: false })}
					onsignupClicked={(password) => this.signup(password)} />
			</div>
		);
	}
}

export default App;