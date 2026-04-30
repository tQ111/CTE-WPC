import { Routes, Route, Navigate, Link } from "react-router-dom";

import About from "./pages/about.jsx";
import Projects from "./pages/projects.jsx";
import Interests from "./pages/interests.jsx";
import Resume from "./pages/resume.jsx";

function App() {
  return (
    <>
      <nav className="navBar">
        <a href="/about" className="navItem">About</a>
        <a href="/interests" className="navItem">Interests</a>
        <a href="/projects" className="navItem">Projects</a>
        <a href="/resume" className="navItem">Resume</a>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/about" />} />

        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/interests" element={<Interests />} />
        <Route path="/resume" element={<Resume />} />
      </Routes>
    </>
  );
}

export default App;