import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from "react-router-dom";

export default function CategoryCard({ image, category }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        "& > :not(style)": {
          m: 1,
          width: 290,
          height: 150,
        },
      }}
    >
      <Paper sx={{ backgroundColor: "#e8e8f4" }}>
        <div className="flex h-full justify-start items-center">
          <img className="bg-[#e10f37] p-3 rounded-full me-5 h-40" src={image}  alt="" />
          <div>
            <p className="text-2xl pb-3">{category}</p>
            <Link to={`/search/${category}`} className="bg-[#e10f37] p-2 pb-3 text-white hover:text-black hover:bg-white rounded-full">
              <ArrowForwardIcon />
            </Link>
          </div>
        </div>
      </Paper>
    </Box>
  );
}
