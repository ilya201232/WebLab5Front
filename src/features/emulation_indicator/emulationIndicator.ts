import { createSlice } from '@reduxjs/toolkit'

export const emulationIndicatorSlice = createSlice({
    name: 'emulationIndicator',
    initialState: {
        is_working: false,
        current_date: "",
        start_date: "",
        interval: 0
    },
    reducers: {
        updateData: (state, payload) => {
            state.is_working = payload.payload.is_working;
            state.current_date = payload.payload.current_date;
            state.start_date = payload.payload.start_date;
            state.interval = payload.payload.interval;
        }
    },
})

// Action creators are generated for each case reducer function
export const { updateData } = emulationIndicatorSlice.actions

export default emulationIndicatorSlice.reducer
