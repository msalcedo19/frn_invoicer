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
  LinearProgress,
  Link,
  Grid,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ButtonBase from "@mui/material/ButtonBase";

import React, { useEffect, useState, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import {
  processRequest,
  processRequestNonReponse,
  sendMessageAction,
  getHeaders,
  handleBreadCrumb,
} from "@/pages/index";

import {
  breadcrumbAction,
  BACK_EVENT,
  INVOICE,
} from "@/src/actions/breadcrumb";
import { dataPageAction, UPDATE_TITLE } from "@/src/actions/dataPage";
import {
  EnhancedTableHead,
  stableSort,
  getComparator,
  Order,
  EnhancedTableToolbar,
} from "@/components/Invoice/InvoiceTableUtils";
import { PostInvoiceModal } from "@/components/Invoice/InvoiceModal";
import InvoiceOptionsDrawer from "@/components/Invoice/InvoiceOptionsDrawer";
import InvoiceDeleteModal from "@/components/Invoice/InvoiceDeleteModal";
import InvoiceEditable from "@/components/Invoice/InvoiceEditable";
import { DatePickerModal } from "@/components/DatePickerModal";

export default function EnhancedTable() {
  const [rows, setRows] = useState<TInvoice[]>([]);
  const [rowsBackUp, setRowsBackUp] = useState<TInvoice[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<keyof TInvoice>("number_id");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const {
    query: { customer_id },
  } = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  const [openToDownload, setOpenToDownload] = useState(false);
  const handleOpenToDownload = () => setOpenToDownload(true);
  const handleCloseToDownload = () => setOpenToDownload(false);
  const [fileData, setFileData] = useState<string | undefined>();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof TInvoice
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
  const handleClick = (event: React.MouseEvent<unknown>, obj: TInvoice) => {
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
      obj.number_id.toString().toLowerCase().includes(term.toLowerCase())
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
      //console.log(`${value} ${key} ${map}`);
      urls.push(
        window.fetch(`/api/invoice/${value}`, {
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
    setRows([]);
    setLoading(true);
    if (customer_id)
      window
        .fetch(`/api/customer/${customer_id}/invoice`, {
          method: "GET",
          headers: getHeaders(),
        })
        .then((response) =>
          processRequest(
            "error",
            "Hubo un error cargando las facturas, por favor intentelo nuevamente",
            dispatch,
            response
          )
        )
        .then((data: TotalAndInvoices) => {
          if (data && data.invoices) {
            setRows(data.invoices);
            setRowsBackUp(data.invoices);
            setTotalRows(data.total);
          }
          setLoading(false);
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
        INVOICE
      )
    );
    dispatch(
      dataPageAction(UPDATE_TITLE, {
        title: "Facturas",
      })
    );
    reload();
    if (customer_id) handleBreadCrumb(router, dispatch);
  }, [customer_id]);

  function formatDate(date: Date) {
    const new_date = new Date(date);
    const timezoneOffset = new_date.getTimezoneOffset() / 60; // convert to hours
    const formattedDate = new Date(
      new_date.getTime() - timezoneOffset * 60 * 60 * 1000
    )
      .toISOString()
      .slice(0, 10);
    return formattedDate;
  }

  function calculateValues(row: TInvoice) {
    let subtotal = 0;
    let file_url = undefined;
    if (row.files.length > 0) {
      row.files[row.files.length - 1].services.forEach(
        (service) => (subtotal += service.amount)
      );
      file_url = row.files[row.files.length - 1].s3_pdf_url;
    }
    let a_tax_1 = 0;
    let a_tax_2 = 0;
    if (row.with_taxes == undefined || row.with_taxes) {
      a_tax_1 = (row.tax_1 / 100) * subtotal;
      a_tax_2 = (row.tax_2 / 100) * subtotal;
      a_tax_1 = parseFloat(a_tax_1.toFixed(2));
      a_tax_2 = parseFloat(a_tax_2.toFixed(2));
    }

    let a_total = a_tax_1 + a_tax_2 + subtotal;
    a_total = parseFloat(a_total.toFixed(2));
    subtotal = parseFloat(subtotal.toFixed(2));
    return {
      total: a_total,
      subtotal: subtotal,
      total_tax_1: a_tax_1,
      total_tax_2: a_tax_2,
      file_url: file_url,
      created: formatDate(row.created),
      updated: formatDate(row.updated),
    };
  }

  function formatDateYearMonth(inputDate: string): string {
    const dateParts = inputDate.split("-");
    if (dateParts.length !== 3) {
      return inputDate;
    }
    return `${dateParts[0]}-${dateParts[1]}`;
  }

  return (
    <div>
      <PostInvoiceModal
        model_id={undefined}
        customer_id={customer_id}
        number_id={undefined}
        create_new_invoice={true}
        bill_to_id={undefined}
        open={open}
        handleClose={handleClose}
        reload={reload}
      />

      <InvoiceDeleteModal
        open={openToDelete}
        onClose={handleCloseToDelete}
        onDelete={delete_obj}
      />

      <DatePickerModal
        open={openToDownload}
        handleClose={handleCloseToDownload}
        customer_id={customer_id}
        setFileData={setFileData}
      />

      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            handleOpenToDelete={handleOpenToDelete}
            searchTerm={searchTerm}
            handleSearch={handleSearch}
            handleOpenToDownload={handleOpenToDownload}
            fileData={fileData}
            setFileData={setFileData}
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
                <TableRow></TableRow>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  const values = calculateValues(row);

                  return (
                    <TableRow
                      hover
                      onClick={() =>
                        !isEditable &&
                        router.push({
                          pathname: `/invoice/${row.id}`,
                          query: {
                            customer_id: customer_id,
                            number_id: row.number_id,
                          },
                        })
                      }
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
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
                        align="center"
                      >
                        <InvoiceEditable
                          invoice={row}
                          isEditable={isEditable}
                          handleIsEditableClose={handleIsEditableClose}
                        />
                      </TableCell>
                      <TableCell align="center">{values.total}</TableCell>
                      <TableCell align="center">{values.subtotal}</TableCell>
                      <TableCell align="center">{values.total_tax_1}</TableCell>
                      <TableCell align="center">{values.total_tax_2}</TableCell>
                      <TableCell
                        align="center"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Link target="_blank" href={values.file_url}>
                          <Grid
                            container
                            sx={{
                              textAlign: "center",
                              "&:hover": {
                                color: "#115293",
                                "& .MuiTypography-root": {
                                  fontWeight: 800,
                                },
                              },
                            }}
                          >
                            <Grid item xs={12}>
                              <ButtonBase>
                                <PictureAsPdfIcon />
                              </ButtonBase>
                            </Grid>
                          </Grid>
                        </Link>
                      </TableCell>
                      <TableCell align="center">
                        {formatDateYearMonth(values.created)}
                      </TableCell>
                      <TableCell align="center">{values.updated}</TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={9} />
                  </TableRow>
                )}

                {rows.length == 0 && !loading && (
                  <TableRow
                    style={{
                      height: 53,
                    }}
                  >
                    <TableCell colSpan={9} align="center">
                      Aún no se ha generado ningúna factura para este cliente
                    </TableCell>
                  </TableRow>
                )}
                {rows.length == 0 && loading && (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ padding: "0 0 15px 0" }}>
                      <LinearProgress />
                      <div style={{ textAlign: "center", marginTop: "15px" }}>
                        Cargando...
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>

      <InvoiceOptionsDrawer
        handleOpenToDelete={handleOpenToDelete}
        deleteOption={deleteOp}
        setDeleteOption={setDeleteOp}
        handleOpen={handleOpen}
        editable={isEditable}
        setEditable={setIsEditable}
        setSelected={setSelected}
        textCreateOption="Crear nueva factura"
        textUpdateOption="Modificar número de factura"
        textDeleteOption="Eliminar factura (Esto incluye todas los contratos y archivos relacionados con esta)"
      />
    </div>
  );
}
