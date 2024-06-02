import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../reducers/pageSlice'; 

const store = configureStore({
  reducer: counterReducer, 
});

export default store;
