import {useState} from "react";

function Interests() {

  const ProjectSAT = ["/satp1.png","/satp2.png","/satp3.png","/satp4.png","/satp5.png"];
  const [ProjectSATindex,setProjectSATindex] = useState(0);

  const nextSAT = (i) => {
    setProjectSATindex((prev)=>(prev + i + ProjectSAT.length)%ProjectSAT.length);
  };

  return (
    <section className="bigContent">

      <div className="centerWrap">

        <div className="topBox">
          <h1 id="titleR">Interests</h1>
        </div>

        <div className="cardRow">

          <div className="flipBox">
            <div className="flipInner">

              <div className="flipFront">
                <div className="flipTitle">Sports</div>
              </div>

              <div className="flipBack">
                <div className="flipText">
                  I mainly play soccer, but I play other sports for fun
                </div>

                <ul className="flipStuff">
                  <li>Soccer</li>
                  <li>Volleyball</li>
                </ul>
              </div>

            </div>
          </div>

          <div className="flipBox">
            <div className="flipInner">

              <div className="flipFront">
                <div className="flipTitle">Technology</div>
              </div>

              <div className="flipBack">
                <div className="flipText">
                  I am learning different programming languages and building projects
                </div>

                <ul className="flipStuff">
                  <li>HTML</li>
                  <li>CSS</li>
                  <li>JavaScript</li>
                  <li>Java</li>
                  <li>SQL</li>
                </ul>
              </div>

            </div>
          </div>

          <div className="flipBox">
            <div className="flipInner">

              <div className="flipFront">
                <div className="flipTitle">Free Time</div>
              </div>

              <div className="flipBack">
                <div className="flipText">
                  I like balancing time alone and with friends
                </div>

                <ul className="flipStuff">
                  <li>Video Games</li>
                  <li>Board Games</li>
                  <li>Going out to eat</li>
                  <li>Listening to Music</li>
                </ul>
              </div>

            </div>
          </div>

        </div>

      </div>

      <br></br>
      <hr></hr>
      <br></br>

      <div className="projectTitle">
        <h1 id="slideTitle">Side Project - SAT Study Tool with AI</h1>
      </div>

      <div className="slideWrap">

        <img
          src={ProjectSAT[ProjectSATindex]}
          className="slideImg"
          alt="SAT Project"
        />

        <div className="slideControls">
          <button onClick={()=>nextSAT(-1)} className="slideBtn">←</button>
          <button onClick={()=>nextSAT(1)} className="slideBtn">→</button>
        </div>

      </div>

    </section>
  );
}

export default Interests;