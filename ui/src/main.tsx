import React from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { DockerMuiV5ThemeProvider } from "@docker/docker-mui-theme";

import { App } from "./App";
import { GlobalStyles } from "@mui/material";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/*
      If you eject from MUI (which we don't recommend!), you should add
      the `dockerDesktopTheme` class to your root <html> element to get
      some minimal Docker theming.
    */}
    <DockerMuiV5ThemeProvider>
      <CssBaseline />
      <GlobalStyles styles={{ body: { padding: "0rem 0.5rem" } }} />
      <App />
    </DockerMuiV5ThemeProvider>
  </React.StrictMode>
);
