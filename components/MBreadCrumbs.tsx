import * as React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { useSelector } from "react-redux";
import { RootState } from "@/src/reducers/rootReducer";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

const RefreshButton = styled(Button)({
  backgroundColor: "#1976d2",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#115293",
  },
  minWidth: "25px",
});

export default function BasicBreadcrumbs() {
  const breadcrumbsState = useSelector((state: RootState) => state.push_item);

  return (
    <Box sx={{ display: "flex" }}>
      <Breadcrumbs aria-label="breadcrumb">
        {breadcrumbsState.options.map((option) =>
          option.active ? (
            <Typography key={option.href} color="text.primary">
              {option.value}
            </Typography>
          ) : (
            <Link
              key={option.href}
              underline="hover"
              color="inherit"
              href={option.href}
            >
              {option.value}
            </Link>
          )
        )}
      </Breadcrumbs>
    </Box>
  );
}
