import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import ProjectDetail from "./pages/project";
import Navbar from "./components/Navbar/Navbar";
import BackgroundSlideshow from "./components/Background/BackgroundSlideshow";

// Two layers, bottom to top: the photo backdrop (z-0) and the page (z-10 and up).
const App: React.FC = () => {
  return (
    <Router>
      <BackgroundSlideshow />
      <Navbar />
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
