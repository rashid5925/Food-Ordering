import Typography from "@mui/material/Typography";
import Title from "./Title";

export default function StatsCard({ title, body1, body2 }) {
  return (
    <>
      <Title>{title}</Title>
      <div className="flex flex-col h-full justify-between">
        <Typography component="p" variant="h4">
          {body1}
        </Typography>
        <Typography color="text.secondary">{body2}</Typography>
      </div>
    </>
  );
}
