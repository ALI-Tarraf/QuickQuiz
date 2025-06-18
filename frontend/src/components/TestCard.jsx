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
  const { id, title, date, time, teacher_name, duration_minutes, total_marks } =
    value;
  // const status = date == new Date().toLocaleDateString("en-CA");
  const status = true;

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
                label={status ? "Available Now" : "Not Available"}
                size="small"
                sx={{
                  bgcolor: status ? "#D1FAE5" : "#FECACA",
                  color: status ? "#047857" : "#B91C1C",
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
                <AccountCircleIcon />{" "}
                {`Instructor:
                ${teacher_name}`}
              </Typography>
            )}

            <Typography
              variant="body1"
              sx={{ mb: 1, display: "flex", alignItems: "center", gap: "5px" }}
            >
              <DescriptionIcon />{" "}
              {`Total Marks: 
              ${total_marks}`}
            </Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="body1"
              sx={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <TimerOutlinedIcon /> {`Duration: ${duration_minutes} minutes`}
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
              disabled={isInResultsPage ? false : status ? false : true}
            >
              {isInResultsPage ? "Show Results" : "Start test"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default TestCard;
