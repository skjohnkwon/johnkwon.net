import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import ProjectDetail from "./pages/project";
import Navbar from "./components/Navbar/Navbar";
import BackgroundSlideshow from "./components/Background/BackgroundSlideshow";
import Shell from "./components/Shell/Shell";
import Footer from "./components/Footer/Footer";

// The photo backdrop (z-0) and, sitting on it, the one column the app lives in.
const App: React.FC = () => {
  return (
    <Router>
      <BackgroundSlideshow />
      {/* min-height, not height, so a page taller than the viewport grows past
          the centre instead of being clipped at the top. */}
      <div className="flex min-h-screen flex-col justify-center">
        <Shell>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
          </Routes>
        </Shell>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
