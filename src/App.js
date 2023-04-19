import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage/HomePage";
import AboutPage from "./pages/AboutPage/AboutPage";
import HistoryPage from "./pages/HistoryPage/HistoryPage";

// Components
import Header from "./components/Header/Header";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
