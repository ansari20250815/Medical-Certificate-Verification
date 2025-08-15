import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeDir: 'ltr',
  activeMode: 'light', // This can be light or dark
  activeTheme: 'CRIMSON_RED', // CRIMSON_RED, CELTIC_BLUE, PIGMENT_GREEN, CRIMSON_RED_STANDARD, PIGMENT_GREEN_STANDARD
  sidebarWidth: 270,
  miniSidebarWidth: 75,
  topbarHeight: 80,
  isLayout: 'full', // This can be full or boxed
  isCollapse: false, // to make sidebar Mini by default
  isSidebarHover: false,
  isMobileSidebar: false,
  isHorizontal: false,
  language: 'en',
  isCardShadow: true,
  borderRadius: 8,
};

export const customizerSlice = createSlice({
  name: 'customizer',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.activeTheme = action.payload;
    },
    setDarkMode: (state, action) => {
      state.activeMode = action.payload;
    },

    setDir: (state, action) => {
      state.activeDir = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setCardShadow: (state, action) => {
      state.isCardShadow = action.payload;
    },
    toggleSidebar: (state) => {
      state.isCollapse = !state.isCollapse;
    },
    hoverSidebar: (state, action) => {
      state.isSidebarHover = action.payload;
    },
    toggleMobileSidebar: (state) => {
      state.isMobileSidebar = !state.isMobileSidebar;
    },
    toggleLayout: (state, action) => {
      state.isLayout = action.payload;
    },
    toggleHorizontal: (state, action) => {
      state.isHorizontal = action.payload;
    },
    setBorderRadius: (state, action) => {
      state.borderRadius = action.payload;
    },
  },
});

export const {
  setTheme,
  setDarkMode,
  setDir,
  toggleSidebar,
  hoverSidebar,
  toggleMobileSidebar,
  toggleLayout,
  setBorderRadius,
  toggleHorizontal,
  setLanguage,
  setCardShadow,
} = customizerSlice.actions;

export default customizerSlice.reducer;
