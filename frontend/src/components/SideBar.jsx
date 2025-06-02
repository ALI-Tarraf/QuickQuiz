import { Stack } from "@mui/material";

import QuizIcon from "@mui/icons-material/Quiz";
import RuleIcon from "@mui/icons-material/Rule";
const categories = [
  { name: "Tests", icon: <QuizIcon /> },
  { name: "Tests Result", icon: <RuleIcon /> },
];
const SideBar = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <Stack
      sx={{
        overflowY: "auto",
        height: "100%",
        width: "100%",
        flexDirection: "column",
        background: "rgb(1, 119, 145)",
      }}
    >
      {categories.map((categorie) => (
        <button
          className="category-btn"
          onClick={() => {
            setSelectedCategory(categorie.name);
          }}
          style={{
            background: categorie.name === selectedCategory && "white",
            color: "rgb(1, 119, 145)",
          }}
          key={categorie.name}
        >
          <span
            style={{
              color:
                categorie.name === selectedCategory
                  ? "rgb(1, 119, 145)"
                  : "white",
              marginRight: "15px",
            }}
          >
            {categorie.icon}
          </span>
          <span
            style={{
              color:
                categorie.name === selectedCategory
                  ? "rgb(1, 119, 145)"
                  : "white",
              opacity: categorie.name === selectedCategory ? "1" : "0.8",
            }}
          >
            {categorie.name}
          </span>
        </button>
      ))}
    </Stack>
  );
};

export default SideBar;
