import { createSlice } from '@reduxjs/toolkit';
import * as actions from './asyncActions';
export const appSlice = createSlice({
	name: 'app',
	initialState: {
		categories: null,
		isLoading: false,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(actions.getCategories.pending, (state, action) => {
			state.isLoading = false;
		});
		builder.addCase(actions.getCategories.fulfilled, (state, action) => {
			state.isLoading = false;
			state.categories = action.payload;
		});
		builder.addCase(actions.getCategories.rejected, (state, action) => {
			state.isLoading = false;
			state.categories = action.payload;
		});
	},
});
export const {} = appSlice.actions;
export default appSlice.reducer;
