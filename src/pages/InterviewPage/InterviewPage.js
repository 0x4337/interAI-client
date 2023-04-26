import "./InterviewPage.scss";
import { useState, useEffect } from "react";

import RecordRTC, { invokeSaveAsDialog } from "recordrtc";

import axios from "axios";

import morph from "../../assets/objects/morph.mp4";
import swirl from "../../assets/objects/Object_9_(iridescent).png";
import vector from "../../assets/vectors/Abstract Shape 01 (white on transparent).png";
import vector2 from "../../assets/vectors/Abstract Shape 38 (white on transparent).png";
import vector3 from "../../assets/vectors/Abstract Shape 20 (white on transparent).png";
import vector4 from "../../assets/vectors/Abstract Shape 09 (white on transparent).png";

const InterviewPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [recorder, setRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [text, setText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [roleLevel, setRoleLevel] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  const [started, setStarted] = useState(false);

  //   const handleCategorySelect = (category) => {
  //     setSelectedCategory(category);
  //   };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStarted(true);
    setConversationHistory([
      {
        role: "system",
        content:
          "You are an AI interviewer for a company. You are interviewing a candidate for a job based on the job description and role level initially provided. The candidate's responses will be provided by the user. You should start the interview by asking the candidate to introduce themselves, and then ask dynamic questions based on the candidate's responses or move onto a new question if needed. Depending on the role level, adjust the complexity / toughness of your questions, perhaps dig into their responses more. Once you feel you have enough data to conclude the interview, end the interview and give an honest score from 1-10, whether you would have hired them or not, and provide detailed and honest feedback on the interview, avoid discussing the things they were good at, instead mention the things they could have improved.",
      },
      {
        role: "user",
        content: `Job description: ${jobDescription}, Role level: ${roleLevel}`,
      },
    ]);
  };

  const generateGPT4Response = async (updatedConversationHistory) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/openai/generate`,
        {
          messages: updatedConversationHistory || conversationHistory,
        }
      );
      return data.response;
    } catch (error) {
      console.log(error);
    }
  };

  const playSynthesizedSpeech = async (text) => {
    try {
      // Call the Eleven Labs API to convert text to speech
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/elevenlabs/speech`,
        { text }
      );

      // Play the synthesized speech
      const audio = new Audio(`data:audio/mpeg;base64,${data.audio_data}`);
      audio.play();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setRoleLevel(category);
  };

  const getCategoryClassName = (category) => {
    return (
      "info__category" +
      (selectedCategory === category ? " info__category--selected" : "")
    );
  };

  useEffect(() => {
    if (
      conversationHistory.length > 0 &&
      conversationHistory.slice(-1)[0].role === "user"
    ) {
      const fetchAssistantResponse = async () => {
        const assistantResponse = await generateGPT4Response();

        await playSynthesizedSpeech(assistantResponse);
        setConversationHistory([
          ...conversationHistory,
          { role: "assistant", content: assistantResponse },
        ]);
      };
      fetchAssistantResponse();
    }
  }, [conversationHistory]);

  //   useEffect(() => {
  //     if (text) {
  //       // Update conversation history when the user's response is transcribed
  //       setConversationHistory([
  //         ...conversationHistory,
  //         { role: "user", content: text },
  //       ]);

  //       // Call GPT-4 with the updated conversation history
  //       setLoading(true);
  //       generateGPT4Response();
  //     }
  //   }, [text]);

  //   const generateGPT4Response = async () => {
  //     try {
  //       const { data } = await axios.post(
  //         `${process.env.REACT_APP_BACKEND_URL}/api/openai/generate`,
  //         {
  //           messages: conversationHistory,
  //         }
  //       );
  //       // Update conversation history with GPT-4 response
  //       setConversationHistory([
  //         ...conversationHistory,
  //         { role: "assistant", content: data.response },
  //       ]);
  //       setLoading(false);

  //       // TODO: Call Eleven Labs API to convert GPT-4 response to speech
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  const startRecording = () => {
    setText("");

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
        const { data } = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/openai/whisper`,
          formData
        );
        console.log(data.whisper.text);
        setText(data.whisper.text);
      } catch (error) {
        console.log(error);
      }
    });
  };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     if (!jobDescription || !roleLevel) {
  //       alert("Please fill in all fields");
  //       return;
  //     }
  //     console.log("Job Description:", jobDescription);
  //     console.log("Role Level:", roleLevel);

  //     // Start the interview with the job description and role level
  //     setConversationHistory([
  //       {
  //         role: "system",
  //         content:
  //           "You are an AI interviewer for a company. You are interviewing a candidate for a job based on the job description and role level initially provided. The candidate's responses will be provided by the user. You should start the interview by asking the candidate to introduce themselves, and then ask dynamic questions based on the candidate's responses or move onto a new question if needed. Once you feel you have enough data to conclude the interview, end the interview and give a score from 1-10, whether you would have hired them or not, and provide detailed feedback on the interview.",
  //       },
  //       {
  //         role: "user",
  //         content: `Job description: ${jobDescription}, Role level: ${roleLevel}`,
  //       },
  //     ]);

  // Generate the first response from GPT-4
  //     generateGPT4Response();
  //   };

  useEffect(() => {
    if (text) {
      setConversationHistory([
        ...conversationHistory,
        { role: "user", content: text },
      ]);
    }
  }, [text]);

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
      {/* <video className="interview__video" autoPlay loop muted>
        <source src={morph} type="video/mp4" />
      </video> */}
      {/* <img
        className="interview__swirl"
        src={swirl}
        alt="purple swirl background graphic"
      /> */}
      {/* <img src={vector} alt="globe vector" className="interview__vector" /> */}
      {/* <img src={vector2} alt="globe vector" className="interview__vector1" /> */}
      {/* <img src={vector3} alt="globe vector" className="interview__vector2" /> */}
      <img src={vector4} alt="globe vector" className="interview__vector3" />
      <h1 className="interview__title">InterAI</h1>

      {/* <div className="info">
        <p className="info__text">
          Describe the job role in a few short sentances. This will be given as
          additional context to the AI. For example: "A junior software
          engineering role at a fintech startup looking for a team player and to
          be paid in equity."
        </p>

        <div className="info__categories">
          <div
            onClick={() => handleCategorySelect("easy")}
            className={getCategoryClassName("easy")}
          >
            <p className="info__subtitle">Easy •</p>
            <p className="info__level">Junior</p>
          </div>
          <div
            onClick={() => handleCategorySelect("mid")}
            className={getCategoryClassName("mid")}
          >
            <p className="info__subtitle">Average •</p>
            <p className="info__level">Mid</p>
          </div>
          <div
            onClick={() => handleCategorySelect("hard")}
            className={getCategoryClassName("hard")}
          >
            <p className="info__subtitle">Hard •</p>
            <p className="info__level">Senior</p>
          </div>
        </div>
      </div> */}

      <div className="info">
        <form className="info__form" onSubmit={handleSubmit}>
          <p className="info__text">
            Describe the job role in a few short sentences. This will be given
            as additional context to the AI.
          </p>
          <textarea
            className="info__textarea"
            value={jobDescription}
            placeholder="e.g: Software engineering role in a fintech startup, looking for a
            team player to be paid in equity..."
            onChange={(e) => setJobDescription(e.target.value)}
          />
          {/* <p className="info__text">Select the level of the role:</p> */}
          <div className="info__categories">
            <div
              onClick={() => handleCategorySelect("junior")}
              className={getCategoryClassName("junior")}
            >
              <p className="info__subtitle">Easy •</p>
              <p className="info__level">Junior</p>
            </div>
            <div
              onClick={() => handleCategorySelect("mid")}
              className={getCategoryClassName("mid")}
            >
              <p className="info__subtitle">Average •</p>
              <p className="info__level">Mid</p>
            </div>
            <div
              onClick={() => handleCategorySelect("senior")}
              className={getCategoryClassName("senior")}
            >
              <p className="info__subtitle">Hard •</p>
              <p className="info__level">Senior</p>
            </div>
          </div>
          <button
            className={
              conversationHistory
                ? "info__submit info__submit--active"
                : "info__submit"
            }
            type="submit"
          >
            {
              // If its been clicked, show loading, otherwise show start
              started ? "Restart Interview" : "Start Interview"
            }
          </button>
        </form>
      </div>

      <div className="start">
        <button
          className={
            // "start__button" +
            // (jobDescription && roleLevel ? " start__button--active" : "")
            // "start__button"
            recording ? "start__button start__button--active" : "start__button"
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
