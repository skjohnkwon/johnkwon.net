import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import ProjectDetail from "./pages/project";
import Navbar from "./components/Navbar/Navbar";
import BackgroundSlideshow from "./components/Background/BackgroundSlideshow";
import { GlassProvider } from "./components/Glass/Glass";

// Three layers, bottom to top: the photo canvas (z-0), the glass the panels are
// drawn on (z-5, inside GlassProvider), and the text (z-10 and up).
const App: React.FC = () => {
  return (
    <Router>
      <GlassProvider>
        <BackgroundSlideshow />
        <Navbar />
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
          </Routes>
        </div>
      </GlassProvider>
    </Router>
  );
};

export default App;
