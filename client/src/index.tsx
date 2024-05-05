import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from './app/store'
import { Provider } from 'react-redux'
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Tasks from "./pages/Tasks";
import NoPage from "./pages/NoPage";
import './css/app.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="auth" element={<Auth />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);