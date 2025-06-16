import React from "react";
import { Paper, Typography } from "@mui/material";

interface RadioPageProps {
  title: string;
  children?:
    | React.FunctionComponent<{ children: React.ReactNode; disabled?: boolean }>
    | React.ReactElement
    | React.ReactElement[];
  isHidden: boolean;
}
const RadioPage: React.FC<RadioPageProps> = ({ title, children }) => {
  return (
    <Paper sx={{ height: "fit-content", p: 1 }} elevation={3}>
      <Typography variant="h6">{title}</Typography>
      {children}
    </Paper>
  );
};

export default RadioPage;
