import * as React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { useSelector } from "react-redux";
import { RootState } from "@/src/reducers/rootReducer";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import RefreshIcon from "@mui/icons-material/Refresh";
import { breadcrumbAction, RELOAD_EVENT } from "@/src/actions/breadcrumb";
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
  const router = useRouter();
  const dispatch = useDispatch();

  const handleClick = async () => {
    const currentRoute = router.asPath;
    fetch(`/api/breadcrumbs/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ current_path: currentRoute }),
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(breadcrumbAction(RELOAD_EVENT, data["options"], undefined));
      });
  };

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
      <Box sx={{ mx: 2 }} />
      <RefreshButton onClick={handleClick}>
        <RefreshIcon fontSize="small" />
      </RefreshButton>
    </Box>
  );
}
