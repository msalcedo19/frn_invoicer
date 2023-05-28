import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Paper,
  Checkbox,
} from "@mui/material";

import React, { useEffect, useState, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import {
  processRequest,
  processRequestNonReponse,
  sendMessageAction,
  getHeaders,
} from "@/pages/index";

import {
  breadcrumbAction,
  BACK_EVENT,
  CUSTOMER,
} from "@/src/actions/breadcrumb";
import { dataPageAction, UPDATE_TITLE } from "@/src/actions/dataPage";
import PostModal from "@/components/Customer/CustomerModal";
import CustomerDeleteModal from "@/components/Customer/CustomerDeleteModal";
import CustomerOptionsDrawer from "@/components/Customer/CustomerOptionsDrawer";
import CustomerEditable from "@/components/Customer/CustomerEditable";
import {
  EnhancedTableHead,
  stableSort,
  getComparator,
  Order,
  EnhancedTableToolbar,
} from "@/components/Customer/CustomerTableUtils";

export default function EnhancedTable() {
  const [rows, setRows] = useState<TCustomer[]>([]);
  const [rowsBackUp, setRowsBackUp] = useState<TCustomer[]>([]);
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof TCustomer>("name");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof TCustomer
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const router = useRouter();
  const handleClick = (event: React.MouseEvent<unknown>, obj: TCustomer) => {
    const selectedIndex = selected.indexOf(obj.id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, obj.id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [rows, order, orderBy, page, rowsPerPage]
  );

  const [searchTerm, setSearchTerm] = useState("");
  function handleSearch(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = rowsBackUp.filter((obj) =>
      obj.name.toLowerCase().includes(term.toLowerCase())
    );
    setRows(filtered);
  }

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [isEditable, setIsEditable] = useState(false);
  const handleIsEditableClose = () => setIsEditable(false);

  const [openToDelete, setOpenToDelete] = useState(false);
  const handleOpenToDelete = () => setOpenToDelete(true);
  const handleCloseToDelete = () => setOpenToDelete(false);
  const [deleteOp, setDeleteOp] = useState<boolean>(
    selected.length > 0 ? true : false
  );
  function delete_obj() {
    let urls: Array<Promise<Response>> = [];
    if (selected.length == 0) {
      sendMessageAction(
        "warning",
        "No has seleccionado ningún cliente",
        dispatch
      );
      return;
    }

    selected.forEach((value: number, key: number, map: readonly number[]) => {
      console.log(`${value} ${key} ${map}`);
      urls.push(
        window.fetch(`/api/customer/${value}`, {
          method: "DELETE",
          headers: getHeaders(),
        })
      );
    });
    Promise.all(urls).then((responses) => {
      let failed = false;
      for (let response of responses) {
        if (
          processRequestNonReponse(
            "warning",
            "Uno o varios de los clientes no pudo ser eliminado",
            dispatch,
            response
          )
        ) {
          failed = true;
          break;
        }
      }

      if (!failed)
        sendMessageAction("success", "Se eliminaron correctamente", dispatch);

      reload();
      setDeleteOp(false);
      setSelected([]);
    });
  }

  function reload() {
    window
      .fetch(`/api/customer`, {
        method: "GET",
        headers: getHeaders(),
      })
      .then((response) =>
        processRequest(
          "error",
          "Hubo un error, por favor intentelo nuevamente",
          dispatch,
          response
        )
      )
      .then((data) => {
        if (data) {
          setRows(data);
          setRowsBackUp(data);
        }
        //setLoading(false);
      });
  }

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      breadcrumbAction(
        BACK_EVENT,
        {
          href: "",
          value: "",
          active: true,
        },
        CUSTOMER
      )
    );
    dispatch(
      dataPageAction(UPDATE_TITLE, {
        title: "Clientes",
      })
    );
    reload();
  }, []);

  return (
    <div>
      <PostModal reload={reload} open={open} handleClose={handleClose} />

      <CustomerDeleteModal
        open={openToDelete}
        onClose={handleCloseToDelete}
        onDelete={delete_obj}
      />

      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            handleOpenToDelete={handleOpenToDelete}
            searchTerm={searchTerm}
            handleSearch={handleSearch}
          />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="medium"
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                deleteOption={deleteOp}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={() =>
                        !isEditable && router.push(`/customer/${row.id}`)
                      }
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        {deleteOp && (
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleClick(event, row);
                            }}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        )}
                      </TableCell>

                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        <CustomerEditable
                          customer={row}
                          isEditable={isEditable}
                          handleIsEditableClose={handleIsEditableClose}
                        />
                      </TableCell>
                      <TableCell align="right">{row.num_invoices}</TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>

      <CustomerOptionsDrawer
        handleOpenToDelete={handleOpenToDelete}
        deleteOption={deleteOp}
        setDeleteOption={setDeleteOp}
        handleOpen={handleOpen}
        editable={isEditable}
        setEditable={setIsEditable}
        setSelected={setSelected}
        textCreateOption="Crear nuevo cliente"
        textUpdateOption="Modificar nombre cliente"
        textDeleteOption="Eliminar cliente (Esto incluye todos las facturas asociadas a este)"
      />
    </div>
  );
}
