import { Routes, Route, Navigate, Link } from "react-router-dom";

import About from "./pages/about.jsx";
import Projects from "./pages/projects.jsx";
import Interests from "./pages/interests.jsx";
import Resume from "./pages/resume.jsx";

function App() {
  return (
    <>
      <nav className = "navBar">
        <Link to = "/about" className = "navItem">About</Link>
        <Link to = "/interests" className = "navItem">Interests</Link>
        <Link to = "/projects" className = "navItem">Projects</Link>
        <Link to = "/resume" className = "navItem">Resume</Link>
      </nav>

      <Routes>
        <Route path = "/" element = {<Navigate to = "/about" />} />

        <Route path = "/about" element = {<About />} />
        <Route path = "/projects" element  = {<Projects />} />
        <Route path = "/interests" element = {<Interests />} />
        <Route path = "/resume" element = {<Resume />} />
      </Routes>

      <footer>
        <div className = "foot">
          <h4>Socials</h4>
          <p>
            Instagram: @tondisx
            <br></br>
            Discord: .sibun
          </p>
        </div>
        <div id = "vertRule"></div>
        <div className = "foot">
          test
        </div>
        <div id = "vertRule"></div>
        <div className = "foot">
          test
        </div>
      </footer>
    </>
  );
}

export default App;