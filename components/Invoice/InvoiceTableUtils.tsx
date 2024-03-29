import { alpha } from "@mui/material/styles";
import {
  Box,
  TableHead,
  TableSortLabel,
  TableCell,
  TableRow,
  Toolbar,
  Typography,
  Checkbox,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import { ChangeEvent, Dispatch } from "react";
import SearchIcon from "@mui/icons-material/Search";

function descendingComparator<T>(
  a: TInvoice,
  b: TInvoice,
  orderBy: keyof TInvoice
) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export type Order = "asc" | "desc";

export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: keyof TInvoice
): (a: TInvoice, b: TInvoice) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
export function stableSort<T>(
  array: readonly TInvoice[],
  comparator: (a: TInvoice, b: TInvoice) => number
) {
  const stabilizedThis = array.map(
    (el, index) => [el, index] as [TInvoice, number]
  );
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof TInvoice;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "number_id",
    numeric: true,
    disablePadding: true,
    label: "Número Factura",
  },
  {
    id: "total",
    numeric: true,
    disablePadding: false,
    label: "Total",
  },
  {
    id: "subtotal",
    numeric: true,
    disablePadding: false,
    label: "Subtotal",
  },
  {
    id: "tax_1",
    numeric: true,
    disablePadding: false,
    label: "TPS",
  },
  {
    id: "tax_2",
    numeric: true,
    disablePadding: false,
    label: "TVQ",
  },
  {
    id: "last_invoice",
    numeric: false,
    disablePadding: false,
    label: "Factura más reciente",
  },
  {
    id: "created",
    numeric: false,
    disablePadding: false,
    label: "Periodo",
  },
  {
    id: "updated",
    numeric: false,
    disablePadding: false,
    label: "Fecha Última Actualización",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof TInvoice
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  deleteOption: boolean;
}

export function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof TInvoice) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          {props.deleteOption && (
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all desserts",
              }}
            />
          )}
        </TableCell>

        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              hideSortIcon={true}
              sx={{ fontWeight: "bold" }}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export interface EnhancedTableToolbarProps {
  numSelected: number;
  handleOpenToDelete: () => void;
  handleOpenToDownload: () => void;
  setFileData: Dispatch<React.SetStateAction<string | undefined>>;
  fileData: string | undefined;
  searchTerm: string;
  handleSearch: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
}

export function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 && (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={props.handleOpenToDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <div>
          <Tooltip title="Filtrar por número de factura">
            <TextField
              size="small"
              value={props.searchTerm}
              onChange={props.handleSearch}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Tooltip>
          {props.fileData && (
            <Button
              variant="contained"
              startIcon={<DescriptionIcon />}
              component="a" // Render the Button as an anchor element
              href={props.fileData} // Set the href to the file data URL
              download="downloaded-file.xlsx" // Set the download attribute
              disabled={!props.fileData} // Disable the button if props.fileData is falsy
            >
              Descargar archivo
            </Button>
          )}
          {props.fileData && (
            <Tooltip title="Delete File">
              <Button
                sx={{ color: "red" }}
                onClick={() => props.setFileData(undefined)}
              >
                <DeleteIcon />
              </Button>
            </Tooltip>
          )}
        </div>
      )}
    </Toolbar>
  );
}
