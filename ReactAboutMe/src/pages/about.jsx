function about(){
  return(
    <section className = "bigContent">
      <div className = "centerWrap">

        <div className = "imageBox">
          <img src = "/baysideImg.jpg" className="schoolImg" alt="Bayside High School" />
        </div>

        <div className = "topBox">
          <h2 id="titleR">Timothy Qiu - Bayside High School</h2>
        </div>

        <div className = "cardRow">
          <div className = "card">
            <h2>Academics</h2>
            <h4>
              I'm currently a student at Bayside High School with my expected graduation in June 2027. I prefer subjects that 
              require thinking, interactive puzzles, and creativity. I apply these interests to computer programming which
              requires a repetition of trial and error, and bug fixing.
            </h4>
          </div>

          <div className = "card">
            <h2>Goals</h2>
            <h4>
              After my time at Bayside High School, I hope to go to a 4 year college for an undergraduate degree. I aspire to 
              continue my academic career and enter medical school for a graduate degree and work in the medical field with my 
              interest of programming on the side to both stand out and maintain my hobby.
            </h4>
          </div>
        </div>

      </div>
    </section>
  );
}

export default about;