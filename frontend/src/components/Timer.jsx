import { Box } from "@mui/material";
import { useState, useEffect } from "react";

const Timer = ({ duration, onTimeUp }) => {
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);
  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
      return;
    }

    const timerInterval = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timeRemaining, onTimeUp]);

  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = (timeRemaining % 3600) % 60;

  return (
    <Box sx={{ fontSize: "24px", color: "red" }}>
      {hours > 0 ? `${hours}:` : ""}
      {minutes < 10 ? `0${minutes}` : minutes}:
      {seconds < 10 ? `0${seconds}` : seconds}
    </Box>
  );
};

export default Timer;
