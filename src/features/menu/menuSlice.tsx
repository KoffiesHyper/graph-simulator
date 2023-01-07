import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { EdgeType } from "../graph/graphSlice";

type MenuStateType = {
    edgeMenu: boolean,
    focusedEdge: EdgeType | null,
    weighted: boolean
}

const initialState: MenuStateType = {
    edgeMenu: false,
    focusedEdge: null,
    weighted: true
}

export const menuSlice = createSlice({
    name: 'menu',
    initialState,

    reducers: {
        focusEdge: (state, action: PayloadAction<EdgeType>) => {
            state.focusedEdge = action.payload;
            state.edgeMenu = true;
        },
        disableEdgeMenu: (state) => {
            state.focusedEdge = null;
            state.edgeMenu = false;
        },
        toggleWeighted: (state, action: PayloadAction<boolean>) => {
            state.weighted = action.payload;
        }
    }
});

export const { focusEdge, disableEdgeMenu, toggleWeighted } = menuSlice.actions;

export const selectEdgeMenu = (state: RootState) => state.menu.edgeMenu;
export const selectFocusedEdge = (state: RootState) => state.menu.focusedEdge;
export const selectWeighted = (state: RootState) => state.menu.weighted;

export default menuSlice.reducer;