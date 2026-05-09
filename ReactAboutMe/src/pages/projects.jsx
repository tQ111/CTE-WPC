import {useState} from 'react';

function projects(){
  const pythonSlides = ["/ezg3.png", "/ezg1.png", "/ezg2.png", "/ezg4.png", "/ezg5.png"];
  const [pythonIndex, setPythonIndex] = useState(0);

  const nextPython = (i) => {
    setPythonIndex((prev) => (prev + i + pythonSlides.length) % pythonSlides.length);
  };

  const javaSlides = ["/cte2.png", "/cte3.png", "/cte4.png", "/cte5.png", "/cte6.png"];
  const [javaIndex, setJavaIndex] = useState(0);

  const nextJava = (i) => {
    setJavaIndex((prev) => (prev + i + javaSlides.length) % javaSlides.length);
  };

  return (
    <section className = "bigContent">

      <div className = "projectTitle">
        <h1 id="slideTitle">Python - EasyGame</h1>
      </div>

      <div className = "slideWrap">
        <img src = { pythonSlides[pythonIndex] } className = "slideImg" alt = "Python project slide" />

        <div className = "slideControls">
          <button onClick = { () => nextPython(-1) } className = "slideBtn">←</button>
          <button onClick = { () => nextPython(1) } className = "slideBtn">→</button>
        </div>
      </div>

      <hr></hr>

      <div className = "projectTitle">
        <h1 id="slideTitle">Java - Encryption Project</h1>
      </div>

      <div className = "slideWrap">
        <img src = { javaSlides[javaIndex] } className = "slideImg" alt = "Java project slide" />

        <div className = "slideControls">
          <button onClick = { () => nextJava(-1) } className = "slideBtn">←</button>
          <button onClick = { () => nextJava(1) } className = "slideBtn">→</button>
        </div>
      </div>

    </section>
  );
}

export default projects;