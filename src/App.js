import React, {useEffect, useRef, useCallback } from 'react';
import {actions, store } from './app/store';
import {useDispatch, useSelector} from 'react-redux';


function DrumPad(props) {
	const audioRef = useRef(null);
	const power = useSelector(state => state.power);
	const volume = useSelector(state => state.volume);
	const dispatch = useDispatch();

	const playAudio = useCallback(() => {
		const audio = audioRef.current;
		if (audio && power) {
			audio.currentTime = 0;
			audio.volume = volume/100;
			audio.play();
			dispatch(actions.setDisplay(props.audio));
		}
	}, [dispatch, power, props.audio, volume]);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key===props.keyName.toLowerCase()) {
				playAudio();
			}
		}
		document.addEventListener('keydown', handleKeyDown);
	}, [props.keyName, playAudio]);

	return (
		<button
			type="button"
			className='drum-pad'
			id={props.audio}
			onClick={playAudio}
		>
			<audio 
				ref={audioRef}
				src={props.src} 
				className='clip' 
				id={props.keyName}
			/>
			{props.keyName}
		</button>
	)
}


function Toggle(props) {
	const dispatch = useDispatch();

	const handleToggle = () => {
		const toggleKey = props.name.toLowerCase();
		dispatch(actions.toggleValue(toggleKey));
		dispatch(actions.setDisplay(props.name + " : " + store.getState(toggleKey)[toggleKey]));
	}

	return (
		<div className="toggle-container">
			{props.name}
			<label className="switch">
			<input type="checkbox" className="switch-input" onClick={handleToggle}/>
			<span className="toggle"></span>
		</label>
		</div>
	);
};


export default function App() {
	const dispatch = useDispatch();
	const display = useSelector(state=> state.display);
	const bank = useSelector(state => state.bank);

	const styles = bank ? {"--primary": "blue"} : {};
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
	];
	const drumPads2 = [
		{ key: "Q", audio: "Chord_1" },
		{ key: "W", audio: "Chord_2" },
		{ key: "E", audio: "Chord_3" },
		{ key: "A", audio: "Give_us_a_light" },
		{ key: "S", audio: "Dry_Ohh" },
		{ key: "D", audio: "Bld_H1" },
		{ key: "Z", audio: "punchy_kick_1" },
		{ key: "X", audio: "side_stick_1" },
		{ key: "C", audio: "Brk_Snr" }
	];

	function displayPads() {
		const chosenPads = bank ? drumPads2 : drumPads;
		return chosenPads.map(element => {
			return (
				<DrumPad
					key={element.key}
					keyName={element.key}
					audio={element.audio}
					src={audioBaseUrl + element.audio + ".mp3"}
				/>
			)
		})
	}

	const onVolumeChange = (e) => {
		dispatch(actions.setVolume(e.target.value));
		dispatch(actions.setDisplay("Volume: " + e.target.value));
	}

	return (
		<div className="inner-container" id="drum-machine" style={styles}>
			<div className="controls-container" id="controls">
				<Toggle name="Power" />
				<Toggle name="Bank" />
				<div id="drum-display" >
					{display}
				</div>
				<input type="range" min="0" max="100" className="slider" onChange={onVolumeChange}/>
			</div>
			<div className="pad-container" id="pads">
				{displayPads()}
			</div>
		</div>
	);
}
