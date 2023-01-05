import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { EdgeType } from "../graph/graphSlice";

type MenuStateType = {
    edgeMenu: boolean,
    focusedEdge: EdgeType | null
}

const initialState: MenuStateType = {
    edgeMenu: false,
    focusedEdge: null
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
            state.edgeMenu = true;
        }
    }
});

export const { focusEdge, disableEdgeMenu } = menuSlice.actions;

export const selectEdgeMenu = (state: RootState) => state.menu.edgeMenu;
export const selectFocusedEdge = (state: RootState) => state.menu.focusedEdge;

export default menuSlice.reducer;