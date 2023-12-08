import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialState = {
	power: false,
	bank: false,
	display: "",
	volume: 50
}

export const appSlice = createSlice({
	name: 'app',
	initialState: initialState,
	reducers: {
		toggleValue: (state, action) => {
			state[action.payload] = !state[action.payload];
		},
		setDisplay: (state, action) => {
      state.display = action.payload;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    }
	}
});

export const actions = appSlice.actions;

export const store = configureStore({
  reducer: appSlice.reducer
});
