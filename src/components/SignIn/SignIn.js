import React from "react";

class SignIn extends React.Component  {

	constructor(props){
			super(props);
			this.state = {
				signInEmail: "",
				signInPassword: ""
			}
		}

	onEmailChange = (e) =>{
		this.setState({signInEmail: e.target.value})
	}

	onPasswordChange = (e) => {
		this.setState({signInPassword: e.target.value})
	}

	onSubmitSignIn = () => {
		console.log(this.state);
		fetch("http://localhost:3001/signin", {
			method: "post",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				email: this.state.signInEmail,
				password: this.state.signInPassword
			})
		}).then(response => response.json()).then(data => {     //este then es para que no cambie de pagina si el usuario está mal
			if (data.id) {				/// does the user exist? Did we receive a user with a property of id?
				this.props.loadUser(data);
				this.props.onRouteChange("home")
			}
		})
		
	}

	render() {
		const  {onRouteChange} = this.props;
		return (
			<div>
				<article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
				<main className="pa4 black-80">
				  <div className="measure ">
				    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
				      <legend className="f2 fw6 ph0 mh0">Sign In</legend>
				      <div className="mt3">
				        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
				        <input onChange={this.onEmailChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address"/>
				      </div>
				      <div className="mv3">
				        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
				        <input onChange={this.onPasswordChange} className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password"/>
				      </div>
				      <label className="pa0 ma0 lh-copy f6 pointer"><input type="checkbox"/> Remember me</label>
				    </fieldset>
				    <div className="">
				      <input  onClick={this.onSubmitSignIn} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Sign in"/>
				    </div>
				    <div className="lh-copy mt3">
				      <p onClick={() => onRouteChange("register")} href="#0" className="f6 link dim black db pointer">Register</p>
				      <a href="#0" className="f6 link dim black db">Forgot your password?</a>
				    </div>
				  </div>
				</main>
				</article>
			</div>

			)	
		}
	}

export default SignIn;