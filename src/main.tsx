import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import './index.css'
import '@ant-design/v5-patch-for-react-19';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div style={{ padding: 5, backgroundColor: "grey", borderRadius: 8 }}>
      <App />
    </div>
  </React.StrictMode>
);
