import * as React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/reducers/rootReducer";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { Box, Breadcrumbs, Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link';

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
            <Link key={option.href} href={option.href} passHref>
            <MuiLink underline="hover" color="inherit">
              {option.value}
            </MuiLink>
          </Link>
          )
        )}
      </Breadcrumbs>
    </Box>
  );
}
