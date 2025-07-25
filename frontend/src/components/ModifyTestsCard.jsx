import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DescriptionIcon from "@mui/icons-material/Description";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useDispatch } from "react-redux";
import { deleteTest } from "../store/slices/tests/testsSlice";
const ModifyTestsCard = ({ value }) => {
  const { id, title, date, time, duration_minutes, total_marks } = value;
  const dispatch = useDispatch();
  return (
    <>
      <Card
        sx={{
          bgcolor: "#ecebeb",
          boxShadow: 6,
          borderRadius: 4,
          border: "1px solid #1F2937",
          height: "100%",
        }}
      >
        <CardContent
          sx={{
            p: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h5" fontWeight={700}>
              {title}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              flexDirection: "column",
              mb: "7px",
            }}
          >
            <Stack direction={"row"} justifyContent={"space-between"} gap={1}>
              <Typography
                variant="body1"
                sx={{
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <CalendarMonthIcon /> {`Date: ${date}`}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <AccessTimeIcon /> {`Time: ${time}`}
              </Typography>
            </Stack>

            <Typography
              variant="body1"
              sx={{
                mb: 1,
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <DescriptionIcon />{" "}
              {`Total Marks: 
              ${total_marks}`}
            </Typography>

            <Typography
              variant="body2"
              sx={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <TimerOutlinedIcon /> {`Duration: ${duration_minutes}`}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 3, pt: "10px" }}>
            <Button
              variant="outlined"
              color="info"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 2,
                py: 1,
                width: "100%",
              }}
              href={`/testsdashboard/${id}`}
              startIcon={<EditIcon />}
            >
              Edit test
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 2,
                py: 1,
                width: "100%",
              }}
              startIcon={<DeleteIcon />}
              onClick={() => dispatch(deleteTest(id))}
            >
              Delete test
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default ModifyTestsCard;
