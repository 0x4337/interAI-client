import "./InterviewPage.scss";
import { useState } from "react";
import RecordRTC, { invokeSaveAsDialog } from "recordrtc";

import axios from "axios";

import morph from "../../assets/objects/morph.mp4";

const InterviewPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [recorder, setRecorder] = useState(null);
  const [recording, setRecording] = useState(false);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const getCategoryClassName = (category) => {
    return (
      "info__category" +
      (selectedCategory === category ? " info__category--selected" : "")
    );
  };

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const audioRecorder = RecordRTC(stream, {
          type: "audio",
          mimeType: "audio/webm",
        });
        audioRecorder.startRecording();
        setRecorder(audioRecorder);
        setRecording(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const stopRecording = async () => {
    recorder.stopRecording(async () => {
      //   invokeSaveAsDialog(recorder.getBlob(), "audio.webm");
      setRecording(false);

      // Sending recorded audio to the server
      const formData = new FormData();
      formData.append("audio", recorder.getBlob(), "audio.webm");

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/openai/generate`,
          formData
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    });
  };

  // TODO:
  // 1. When a user clicks start, check what category they selected.
  // 2. Depending on their selected category, prompt GPT-4 to start an interview based around that category.
  // 3. Feed the GPT-4 output to Eleven Labs API to generate speech.
  // 4. Play the speech to the user.
  // 5. Add a record button to record the user's response.
  // 6. Take the recorded response and transform it into a .mp3 file.
  // 7. Feed the .mp3 file to OpenAI's Whisper api to generate a transcript.
  // 8. Feed the transcript to GPT-4 to generate a response.
  // 9. Repeat steps 3-8 until the user is done with the interview.

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
          onClick={recording ? stopRecording : startRecording}
        >
          {recording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>
    </section>
  );
};

export default InterviewPage;
