import "./InterviewPage.scss";
import { useState } from "react";

import morph from "../../assets/objects/morph.mp4";

const InterviewPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const getCategoryClassName = (category) => {
    return (
      "info__category" +
      (selectedCategory === category ? " info__category--selected" : "")
    );
  };

  return (
    <section className="interview">
      <video className="interview__video" autoPlay loop muted>
        <source src={morph} type="video/mp4" />
      </video>
      <h1 className="interview__title">InterAI</h1>

      <div className="info">
        <p className="info__text">
          Select from one of the following interview categories, then press
          start.
        </p>

        <div className="info__categories">
          <div
            onClick={() => handleCategorySelect("software")}
            className={getCategoryClassName("software")}
          >
            <p className="info__subtitle">Software Engineering •</p>
            <p className="info__level">Junior</p>
          </div>
          <div
            onClick={() => handleCategorySelect("ui")}
            className={getCategoryClassName("ui")}
          >
            <p className="info__subtitle">UI/UX Designer •</p>
            <p className="info__level">Junior</p>
          </div>
          <div
            onClick={() => handleCategorySelect("project")}
            className={getCategoryClassName("project")}
          >
            <p className="info__subtitle">Project Management •</p>
            <p className="info__level">Junior</p>
          </div>
        </div>
      </div>

      <div className="start">
        <button
          className={
            "start__button" + (selectedCategory ? " start__button--active" : "")
          }
        >
          Start
        </button>
      </div>
    </section>
  );
};

export default InterviewPage;
