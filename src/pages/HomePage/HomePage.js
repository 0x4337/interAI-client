import "./HomePage.scss";
import { Link } from "react-router-dom";

import graphic1 from "../../assets/objects/Object_3_(iridescent).png";
import glassPanels from "../../assets/objects/glassPanels.mp4";

const HomePage = () => {
  return (
    <hero className="home">
      {/* <img
        className="home__graphic"
        src={graphic1}
        alt="purple, florecent background graphic"
      /> */}
      <video className="home__video" autoPlay loop muted>
        <source src={glassPanels} type="video/mp4" />
      </video>
      <section className="brief">
        <h1 className="brief__title">InterAI</h1>

        <p className="brief__description">
          InterAI is a platform that allows you to practice your interview
          skills with dynamic, AI powered questions and responses.
        </p>
      </section>

      <section className="main">
        <Link to="/interview" className="main__start">
          Start Interview
        </Link>
      </section>
    </hero>
  );
};

export default HomePage;
