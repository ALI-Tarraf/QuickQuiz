import { Box } from "@mui/material";
import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";

const Timer = ({ testHour, startDate, duration, onTimeUp }) => {
  // const { id } = useParams();
  const now = new Date();
  // const key = `test_end_time_${id}`;
  // let endTime = sessionStorage.getItem(key);
  let startTime = new Date(`${startDate}T${testHour}`);

  let endTime = new Date(startTime.getTime() + duration * 60000);

  const [timeRemaining, setTimeRemaining] = useState(
    endTime ? Math.floor((endTime - now) / 1000) : duration * 60
  );
  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = (timeRemaining % 3600) % 60;

  // useEffect(() => {
  //   if (!endTime) {
  //     // const newTime = new Date(now.getTime() + duration * 60000); // 60000 ms = 1 minute
  //     const newTime = new Date(startTime.getTime() + duration * 60000); // 60000 ms = 1 minute

  //     sessionStorage.setItem(key, newTime);
  //   }
  // }, []);

  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
      sessionStorage.clear();
      return;
    }
    const timerInterval = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timeRemaining, onTimeUp]);

  return (
    <Box
      sx={{
        fontSize: "24px",
        color: "red",
      }}
    >
      {hours > 0 ? `${hours}:` : ""}
      {minutes < 10 ? `0${minutes}` : minutes}:
      {seconds < 10 ? `0${seconds}` : seconds}
    </Box>
  );
};

export default Timer;
