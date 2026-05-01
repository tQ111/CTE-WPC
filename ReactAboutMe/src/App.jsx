import { Routes, Route, Navigate, Link } from "react-router-dom";

import About from "./pages/about.jsx";
import Projects from "./pages/projects.jsx";
import Interests from "./pages/interests.jsx";
import Resume from "./pages/resume.jsx";

function App() {
  return (
    <>
      <nav className="navBar">
        <Link to="/about" className="navItem">About</Link>
        <Link to="/interests" className="navItem">Interests</Link>
        <Link to="/projects" className="navItem">Projects</Link>
        <Link to="/resume" className="navItem">Resume</Link>
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