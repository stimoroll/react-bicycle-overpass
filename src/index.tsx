import * as React from "react";
import { render } from "react-dom";
import { createRoot } from 'react-dom/client';

import App from "./App";

const rootElement = document.getElementById("root") as Element;
// render(<App />, rootElement);


const root = createRoot(rootElement);
root.render(<App />);