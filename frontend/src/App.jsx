import { useState } from "react";

import "./App.css";

function App() {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [message, setMessage] = useState("");

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const response = await axios.post("/api/questions", {
      //   questionText,
      //   options,
      //   correctAnswer,
      // });
      setMessage("تمت إضافة السؤال بنجاح!");
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
    } catch (error) {
      setMessage("حدث خطأ أثناء إضافة السؤال.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>إضافة سؤال جديد</h2>
      <div>
        <label>نص السؤال:</label>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          required
        />
      </div>
      <div>
        {options.map((option, index) => (
          <div key={index}>
            <label>الخيار {index + 1}:</label>
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
            />
          </div>
        ))}
      </div>
      <div>
        <label>الإجابة الصحيحة:</label>
        <select
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          required
        >
          <option value="">اختر الإجابة الصحيحة</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              الخيار {index + 1}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">إضافة السؤال</button>
      {message && <p>{message}</p>}
      <button type="button" onClick={() => setOptions(options.slice(0, -1))}>
        إضافة السؤال111
      </button>
      <button type="button" onClick={() => setOptions([...options, ""])}>
        إضافة 111
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default App;
