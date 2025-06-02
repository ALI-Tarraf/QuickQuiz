import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
const TestCard = ({ value, isInResultsPage = false }) => {
  const { id, title, date, time, instructor, duration, totalMarks, status } =
    value;

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
            {isInResultsPage ? (
              ""
            ) : (
              <Chip
                label={
                  status === "available" ? "Available Now" : "Not Available"
                }
                size="small"
                sx={{
                  bgcolor: status === "available" ? "#D1FAE5" : "#FECACA",
                  color: status === "available" ? "#047857" : "#B91C1C",
                  fontSize: 12,
                  fontWeight: 500,
                  borderRadius: "9999px",
                }}
              />
            )}
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
                <CalendarMonthIcon /> <Typography>Date:</Typography> {date}
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
                <AccessTimeIcon /> <Typography>Time:</Typography> {time}
              </Typography>
            </Stack>
            {isInResultsPage ? (
              ""
            ) : (
              <Typography
                variant="body1"
                sx={{
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <AccountCircleIcon /> <Typography>Instructor:</Typography>
                {instructor}
              </Typography>
            )}

            <Typography
              variant="body1"
              sx={{ mb: 1, display: "flex", alignItems: "center", gap: "5px" }}
            >
              <DescriptionIcon /> <Typography>Total Marks:</Typography>
              {totalMarks}
            </Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="body2"
              sx={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <TimerOutlinedIcon /> Duration: {duration}
            </Typography>
            <Button
              variant="contained"
              href={isInResultsPage ? `/testresults/${id}` : `/testpage/${id}`}
              sx={{
                bgcolor: "#4F46E5",
                "&:hover": { bgcolor: "#4338CA" },
                borderRadius: 2,
                textTransform: "none",
                px: 2,
                py: 1,
              }}
              disabled={status === "not available" ? true : false}
            >
              {isInResultsPage ? "Show Results" : "Start Exam"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default TestCard;
