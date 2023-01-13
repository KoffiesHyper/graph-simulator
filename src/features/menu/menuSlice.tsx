import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { EdgeType } from "../graph/graphSlice";

type MenuStateType = {
    showDegrees: boolean,
    showEdgeMenu: boolean,
    focusedEdge: EdgeType | null,
    weighted: boolean,
    message: string | null
}

const initialState: MenuStateType = {
    showDegrees: false,
    showEdgeMenu: false,
    focusedEdge: null,
    weighted: false,
    message: null
}

export const menuSlice = createSlice({
    name: 'menu',
    initialState,

    reducers: {
        focusEdge: (state, action: PayloadAction<EdgeType>) => {
            state.focusedEdge = action.payload;
            state.showEdgeMenu = true;
        },
        disableEdgeMenu: (state) => {
            state.focusedEdge = null;
            state.showEdgeMenu = false;
        },
        toggleDegrees: (state) => {
            state.showDegrees = !state.showDegrees;
        },
        toggleWeighted: (state, action: PayloadAction<boolean>) => {
            state.weighted = action.payload;
        },
        showMessage: (state, action: PayloadAction<string | null>) => {
            if (action.payload === null) state.message = null;
            if (!state.message) state.message = action.payload;
        }
    }
});

export const { focusEdge, disableEdgeMenu, toggleDegrees, toggleWeighted, showMessage } = menuSlice.actions;

export const selectDegrees = (state: RootState) => state.menu.showDegrees;
export const selectEdgeMenu = (state: RootState) => state.menu.showEdgeMenu;
export const selectFocusedEdge = (state: RootState) => state.menu.focusedEdge;
export const selectWeighted = (state: RootState) => state.menu.weighted;
export const selectMessage = (state: RootState) => state.menu.message;

export default menuSlice.reducer;