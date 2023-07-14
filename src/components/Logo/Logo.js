 import React from "react";

 import ReactDOM from 'react-dom';
import Tilt from 'react-parallax-tilt';

import "./Logo.css"; 
import brain from "./icon.png";

const Logo = () => {
	return (
		<Tilt className=" Tilt br2 shadow-2 h4 w5">
			<div className="ma4 mt0 pa3">
				<img style={{paddingTop: "5px"}} alt="logo" src={brain}/>
			</div>
		{/*<div style={{ height: '300px', backgroundColor: 'darkgreen' }}>
        <h1>React Parallax Tilt 👀</h1>
      </div>*/}
		</Tilt>)
		
}

export default Logo;