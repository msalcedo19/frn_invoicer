import * as React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { useSelector } from "react-redux";
import { RootState } from "@/src/reducers/rootReducer";

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  console.info("You clicked a breadcrumb.");
}

export default function BasicBreadcrumbs() {
  const breadcrumbsState = useSelector((state: RootState) => state.push_item);
  //console.log(breadcrumbsState)
  return (
    <div role="presentation">
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
    </div>
  );
}
