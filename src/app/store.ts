import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import graphReducer from '../features/graph/graphSlice';
import menuReducer from '../features/menu/menuSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    graph: graphReducer,
    menu: menuReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
