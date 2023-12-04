import React from 'react';

function App() {
	const audioBaseUrl = "https://s3.amazonaws.com/freecodecamp/drums/"

	const drumPads = [
		{ key: "Q", audio: "Heater-1" },
		{ key: "W", audio: "Heater-2" },
		{ key: "E", audio: "Heater-3" },
		{ key: "A", audio: "Heater-4_1" },
		{ key: "S", audio: "Heater-6" },
		{ key: "D", audio: "Dsc_Oh" },
		{ key: "Z", audio: "Kick_n_Hat" },
		{ key: "X", audio: "RP4_KICK_1" },
		{ key: "C", audio: "Cev_H2" }
	]

	function displayPads() {
		return drumPads.map(element => {
			return (
				<button type="button" className='drum-pad' id={element.audio} key={element.audio}>
					<audio src={audioBaseUrl + element.audio + ".mp3"} className='clip' id={element.key}>
					</audio>
					{element.key}
				</button>
			)
		})
	}

	return (
		<div className="inner-container" id="drum-machine">
			<div className="controls-container" id="controls">
				<Toggle name="Power"/>
				<Toggle name="Bank"/>
				<div id="drum-display" ></div>
				<input type="range" min="1" max="100" className="slider"/>
			</div>
			<div className="pad-container" id="pads">
				{displayPads()}
			</div>
		</div>
	);
}

function Toggle(props) {
	return (
		<div className="toggle-container">
			{props.name}
			<label className="switch">
			<input type="checkbox" className="switch-input" />
			<span className="toggle"></span>
		</label>
		</div>
		
	);
};



export default App;
