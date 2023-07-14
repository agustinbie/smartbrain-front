import React from "react";

const Navigation = ({onRouteChange, route}) => {

		if (route === "home") {
			 
		return 	(<nav style={{display: "flex", justifyContent: "flex-end"}}>
					<article className="br3 ba dark-gray b--black-10 mv2 w-10 w-10-m w-10-l mw5 ma2 shadow-5 ">
					<p onClick={() => onRouteChange("signin")} className="f4 link dim black underline grow pointer">Sing Out</p>
					</article>
				</nav>)} 		else {}
		
}

export default Navigation;


//si no le pones el aroow function en onClick, () => ,  la funcion onRouteChange se ejecuta apenas se carga el componente, lo que 
//resultaba en un loop infinito de cambio de state a signin y home. La arrow function indica que el evento onClick es el 
//que llama a la funcion onRoutechange
