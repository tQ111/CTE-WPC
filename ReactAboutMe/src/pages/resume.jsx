import "../style.css";

function resume(){
  return (
    <div>

      <section className = "bigContent">
        <div className = "resumeDownload">
          <a href = "/Resume426.pdf" download className = "downloadBtn">
            <h4>Resume Download (PDF)</h4>
          </a>
        </div>

        <div className = "resumeWrap">
          <img src = "/cte1.png" className = "resumeImg" />
        </div>
      </section>
    </div>
  );
}

export default resume;