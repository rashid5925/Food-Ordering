import * as React from "react";
import StarPurple500Icon from "@mui/icons-material/StarPurple500";
import TableBarIcon from "@mui/icons-material/TableBar";
import FastfoodIcon from "@mui/icons-material/Fastfood";

export default function FeatureCard({ icon, heading, content }) {
  return (
    <div className="flex flex-col mx-10 my-3 text-white h-full justify-center items-center">
      {icon === "star" ? (
        <StarPurple500Icon sx={{ fontSize: 48 }} />
      ) : icon === "table" ? (
        <TableBarIcon sx={{ fontSize: 48 }} />
      ) : icon === "food" ? (
        <FastfoodIcon sx={{ fontSize: 48 }} />
      ) : null}
      <p >{heading}</p>
      <p>{content}</p>
    </div>
  );
}
