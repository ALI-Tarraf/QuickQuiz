import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const OperationAlert = ({ status, error, message, completedAction }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
    dispatch(completedAction());
  };

  useEffect(() => {
    if (status) {
      setOpen(true);
    }
  }, [status]);

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      autoHideDuration={3000}
      open={open}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={error ? "error" : "success"}
        variant="filled"
        sx={{ color: "#FFF" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default OperationAlert;
