import React, {useEffect, useRef, useCallback } from 'react';
import {actions, store } from './app/store';
import {useDispatch, useSelector} from 'react-redux';


// DrumPad component
function DrumPad({ keyName, audio, src }) {
  const audioRef = useRef(null);
  const power = useSelector(state => state.power);
  const volume = useSelector(state => state.volume);
  const dispatch = useDispatch();

  const playAudio = useCallback(() => {
    if (audioRef.current && power) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = volume / 100;
      audioRef.current.play();
      dispatch(actions.setDisplay(audio));
    }
  }, [audio, power, volume, dispatch]);

  useEffect(() => {
    const handleKeyDown = (e) => {
			console.log(e);
      if (e.key === keyName.toLowerCase() || e.key === keyName) {
        playAudio();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [keyName, playAudio]);

  return (
    <button
      type="button"
      className="drum-pad"
      id={audio}
      onClick={playAudio}
    >
      <audio 
        ref={audioRef}
        src={src} 
        className="clip" 
        id={keyName}
      />
      {keyName}
    </button>
  );
}

// Toggle component
function Toggle({ name, checked=false }) {
  const dispatch = useDispatch();
  const toggleValue = useSelector(state => state[name.toLowerCase()]);

  const handleToggle = () => {
    dispatch(actions.toggleValue(name.toLowerCase()));
    dispatch(actions.setDisplay(`${name}: ${!toggleValue}`));
  }

  return (
    <div className="toggle-container">
      {name}
      <label className="switch">
        <input type="checkbox" className="switch-input" onClick={handleToggle} checked={checked? true: null}/>
        <span className="toggle"></span>
      </label>
    </div>
  );
}

// Main App component
export default function App() {
  const dispatch = useDispatch();
  const { display, bank } = useSelector(state => state);
  const styles = bank ? { "--primary": "#7C98B3" } : {};
  const audioBaseUrl = "https://s3.amazonaws.com/freecodecamp/drums/";


  const displayPads = useCallback(() => {
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
    const chosenPads = bank ? drumPads2 : drumPads;
    return chosenPads.map(element => (
      <DrumPad
        key={element.key}
        keyName={element.key}
        audio={element.audio}
        src={audioBaseUrl + element.audio + ".mp3"}
      />
    ));
  }, [bank]);

  const onVolumeChange = (e) => {
    dispatch(actions.setVolume(e.target.value));
    dispatch(actions.setDisplay("Volume: " + e.target.value));
  }

  return (
    <div className="inner-container" id="drum-machine" style={styles}>
      <div className="controls-container" id="controls">
        <Toggle name="Power" checked={store.getState().power}/>
        <Toggle name="Bank" />
        <div id="display">
          {display}
        </div>
        <input type="range" min="0" max="100" className="slider" onChange={onVolumeChange} />
      </div>
      <div className="pad-container" id="pads">
        {displayPads()}
      </div>
    </div>
  );
}

