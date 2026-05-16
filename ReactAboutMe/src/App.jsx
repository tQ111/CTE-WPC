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
          <h4>Bayside High School 2026</h4>
          <p>
            WPC Computer Programming
            <br></br>
            Ms.Eilon
          </p>
        </div>

        <div id = "vertRule"></div>

        <div className = "foot">
          <h4>Introduction Pages</h4>
            <Link to = "/about" className = "footItem">About</Link>
            <br></br>
            <Link to = "/interests" className = "footItem">Interests</Link>
        </div>

        <div id = "vertRule"></div>

        <div className = "foot">
          <h4>Information Pages</h4>
            <Link to = "/projects" className = "footItem">Projects</Link>
            <br></br>
            <Link to = "/resume" className = "footItem">Resume</Link> 
        </div>
      </footer>
    </>
  );
}
/** about page picture images slide type shi and then mobile accessbiility  */
export default App;