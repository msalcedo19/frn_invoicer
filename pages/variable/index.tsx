import { useState, Fragment, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import OptionsButton from "@/components/OptionsButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import {
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

import { useDispatch } from "react-redux";
import {
  processRequestNonReponse,
  sendMessageAction,
  style,
  processRequestToObj,
} from "@/pages/index";
import UpdateModalVariable from "@/components/Variable/UpdateModal";
import PostModalVariable from "@/components/Variable/PostModal";

function VariableEditor() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [checkedList, setCheckedList] = useState<Map<number, boolean>>(
    new Map()
  );
  const [deleteOp, setDeleteOp] = useState<boolean>(false);
  function delete_obj() {
    let urls: Array<Promise<Response>> = [];
    checkedList.forEach(
      (value: boolean, key: number, map: Map<number, boolean>) => {
        urls.push(
          window.fetch(`/api/billTo/${key}`, {
            method: "DELETE",
          })
        );
      }
    );
    Promise.all(urls).then((responses) => {
      let failed = false;
      for (let response of responses) {
        if (
          processRequestNonReponse(
            "warning",
            "Uno o varios no pudieron ser eliminados",
            dispatch,
            response
          )
        ) {
          failed = true;
          break;
        }
      }

      if (!failed) {
        sendMessageAction("success", "Se eliminaron correctamente", dispatch);
        window
          .fetch(`/api/billTo/`)
          .then((response) => response.json())
          .then((data) => {
            setBillTos(data);
          });
      }

      setDeleteOp(false);
      setCheckedList(new Map());
    });
  }

  const [editedVariables, setEditedVariables] = useState<TGlobal[]>([]);
  const [topinfos, setTopinfos] = useState<TTopInfo[]>([]);
  const [previousValue, setpreviousValue] = useState("");
  const [previousValueTI, setpreviousValueTI] = useState("");

  function getDateFormat(date_to_format: string) {
    const date = new Date(date_to_format);
    const timezoneOffset = date.getTimezoneOffset() / 60; // convert to hours
    const formattedDate = new Date(
      date.getTime() - timezoneOffset * 60 * 60 * 1000
    );
    return `${formattedDate
      .toISOString()
      .slice(0, 10)} ${formattedDate.getHours()}:${formattedDate.getMinutes()}`;
  }

  const handleVariableChange = (
    index: number,
    field: string,
    newValue: string,
    previousvalue: string
  ) => {
    if (previousValue == "") setpreviousValue(previousvalue);
    const editedVariable = { ...editedVariables[index], [field]: newValue };
    const newVariables = [...editedVariables];
    newVariables[index] = editedVariable;
    sortGlobal(newVariables);
  };

  const handleVariableBlur = (
    index: number,
    id: number,
    field: string,
    newValue: string
  ) => {
    let updatedGlobal: { [key: string]: string } = {};
    updatedGlobal[field] = newValue;
    window
      .fetch(`/api/global/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedGlobal),
      })
      .then((response) =>
        processRequestToObj(
          "error",
          "Hubo un error actualizando la variable, por favor intentelo nuevamente",
          dispatch,
          response
        )
      )
      .then((data) => {
        if (data) {
          sortGlobal(data);
          sendMessageAction("success", "Se actualizó correctamente", dispatch);
        } else if (previousValue != "") {
          const editedVariable = {
            ...editedVariables[index],
            [field]: previousValue,
          };
          const newVariables = [...editedVariables];
          newVariables[index] = editedVariable;
          sortGlobal(newVariables);
          setpreviousValue("");
        }
      });
  };

  const handleTopInfoChange = (
    index: number,
    field: string,
    newValue: string,
    previousvalue: string
  ) => {
    if (previousValueTI == "") setpreviousValueTI(previousvalue);
    const topinfo = { ...topinfos[index], [field]: newValue };
    const newVariables = [...topinfos];
    newVariables[index] = topinfo;
    setTopinfos(newVariables);
  };

  const handleTopInfoBlur = (
    index: number,
    id: number,
    field: string,
    newValue: string
  ) => {
    let updatedTopInfo: { [key: string]: string } = {};
    updatedTopInfo[field] = newValue;
    window
      .fetch(`/api/topInfo/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTopInfo),
      })
      .then((response) =>
        processRequestToObj(
          "error",
          "Hubo un error actualizando la información, por favor intentelo nuevamente",
          dispatch,
          response
        )
      )
      .then((data) => {
        if (data) {
          setTopinfos(data);
          sendMessageAction("success", "Se actualizó correctamente", dispatch);
        } else if (previousValueTI != "") {
          const editedTopInfo = {
            ...topinfos[index],
            [field]: previousValueTI,
          };
          const newTopInfos = [...topinfos];
          newTopInfos[index] = editedTopInfo;
          setTopinfos(newTopInfos);
          setpreviousValueTI("");
        }
      });
  };

  const sortGlobal = (data: TGlobal[]) => {
    data.sort((v1, v2) => v1.name.localeCompare(v2.name));
    setEditedVariables(data);
  };
  const [billTos, setBillTos] = useState<TBillTo[]>([]);
  const dispatch = useDispatch();
  useEffect(() => {
    window
      .fetch(`/api/global/`)
      .then((response) => response.json())
      .then((data) => {
        sortGlobal(data);
      });

    window
      .fetch(`/api/topInfo/`)
      .then((response) => response.json())
      .then((data) => {
        setTopinfos(data);
      });

    window
      .fetch(`/api/billTo/`)
      .then((response) => response.json())
      .then((data) => {
        setBillTos(data);
      });
  }, []);

  function handleChange(model_id: any, e: any) {
    let isChecked = e.target.checked;
    // do whatever you want with isChecked value
    if (checkedList.get(model_id) == undefined)
      setCheckedList(new Map(checkedList.set(model_id, isChecked)));
    else {
      checkedList.delete(model_id);
      setCheckedList(new Map(checkedList));
    }
  }

  const [updateBillTo, setUpdateBillTo] = useState<TBillTo>();
  const [openUpdateBillTo, setOpenUpdateBillTo] = useState(false);
  const handleOpenBillTo = () => setOpenUpdateBillTo(true);
  const handleCloseBillTo = () => setOpenUpdateBillTo(false);
  const reloadBillTo = () => {
    window
      .fetch(`/api/billTo/`)
      .then((response) => response.json())
      .then((data) => {
        setBillTos(data);
        setUpdateBillTo(undefined);
      });
  };

  style.width = 500;
  return (
    <Fragment>
      <PostModalVariable
        open={open}
        handleClose={handleClose}
        reload={reloadBillTo}
      />

      {updateBillTo && (
        <UpdateModalVariable
          openUpdateBillTo={openUpdateBillTo}
          updateBillTo={updateBillTo}
          handleCloseBillTo={handleCloseBillTo}
          reloadBillTo={reloadBillTo}
        />
      )}

      <Typography variant="h5" component="h2" sx={{ marginBottom: "2%" }}>
        Variables
      </Typography>

      <TableContainer>
        <Table sx={{ minWidth: 750 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Valor</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Ultima actualización
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {editedVariables.map((variable, index) => (
              <TableRow key={index}>
                <TableCell>{variable.name}</TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    value={variable.value}
                    onBlur={(event) =>
                      handleVariableBlur(
                        index,
                        variable.id,
                        "value",
                        event.target.value
                      )
                    }
                    onChange={(event) =>
                      handleVariableChange(
                        index,
                        "value",
                        event.target.value,
                        variable.value
                      )
                    }
                  />
                </TableCell>
                <TableCell>{getDateFormat(variable.updated)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ marginY: 10 }} />

      <Typography variant="h5" component="h2" sx={{ marginBottom: "1%" }}>
        Información remitente
      </Typography>
      <TableContainer>
        <Table sx={{ minWidth: 750 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>De</TableCell>
              <TableCell sx={{ width: "35%", fontWeight: "bold" }}>
                Dirección
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Correo</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Teléfono</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {topinfos.map((variable, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    value={variable.ti_from}
                    onBlur={(event) =>
                      handleTopInfoBlur(
                        index,
                        variable.id,
                        "ti_from",
                        event.target.value
                      )
                    }
                    onChange={(event) =>
                      handleTopInfoChange(
                        index,
                        "ti_from",
                        event.target.value,
                        variable.ti_from
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    sx={{ width: "100%" }}
                    variant="outlined"
                    size="small"
                    value={variable.addr}
                    onBlur={(event) =>
                      handleTopInfoBlur(
                        index,
                        variable.id,
                        "addr",
                        event.target.value
                      )
                    }
                    onChange={(event) =>
                      handleTopInfoChange(
                        index,
                        "addr",
                        event.target.value,
                        variable.addr
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    value={variable.email}
                    onBlur={(event) =>
                      handleTopInfoBlur(
                        index,
                        variable.id,
                        "email",
                        event.target.value
                      )
                    }
                    onChange={(event) =>
                      handleTopInfoChange(
                        index,
                        "email",
                        event.target.value,
                        variable.email
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    value={variable.phone}
                    onBlur={(event) =>
                      handleTopInfoBlur(
                        index,
                        variable.id,
                        "phone",
                        event.target.value
                      )
                    }
                    onChange={(event) =>
                      handleTopInfoChange(
                        index,
                        "phone",
                        event.target.value,
                        variable.phone
                      )
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ marginY: 10 }} />

      <Typography variant="h5" component="h2" sx={{ marginBottom: "2.5%" }}>
        Destinatarios
      </Typography>
      {billTos.map((billTo, index) => (
        <Grid container key={index}>
          <Grid item xs={11}>
            <Accordion
              key={index}
              style={{
                marginBottom: "16px",
                borderRadius: "8px",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                position: "relative",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandCircleDownIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
                style={{ fontWeight: "bold" }}
              >
                <Typography sx={{ fontWeight: "bold" }}>{billTo.to}</Typography>
              </AccordionSummary>
              <AccordionDetails style={{ display: "block" }}>
                <Typography
                  variant="body1"
                  style={{ marginBottom: "4px" }}
                >{`Address: ${billTo.addr}`}</Typography>
                <Typography
                  variant="body1"
                  style={{ marginBottom: "4px" }}
                >{`Phone: ${billTo.phone}`}</Typography>
                <Typography
                  variant="body1"
                  style={{ marginBottom: "4px" }}
                >{`Email: ${billTo.email}`}</Typography>

                <div
                  style={{
                    position: "absolute",
                    bottom: "0",
                    right: "0",
                    margin: "16px",
                  }}
                >
                  <IconButton
                    onClick={() => {
                      setUpdateBillTo(billTo);
                      handleOpenBillTo();
                    }}
                  >
                    <AutoFixHighIcon />
                  </IconButton>
                </div>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={1} sx={{ paddingTop: "5px" }}>
            {deleteOp && (
              <Checkbox
                checked={checkedList.get(billTo.id) ?? false}
                inputProps={{
                  "aria-label": "Checkbox A",
                }}
                onChange={(e) => handleChange(billTo.id, e)}
              />
            )}
          </Grid>
        </Grid>
      ))}

      <Box sx={{ position: "fixed", bottom: "32px", right: "32px" }}>
        <OptionsButton
          function_1={delete_obj}
          function_2={() => setDeleteOp(false)}
          check_or_cancel={deleteOp}
        >
          <List>
            <ListItem key={"new_key"} disablePadding>
              <ListItemButton onClick={handleOpen}>
                <ListItemIcon>
                  <CreateIcon />
                </ListItemIcon>
                <ListItemText primary={"Crear nuevo destinatario"} />
              </ListItemButton>
            </ListItem>
            <ListItem key={"delete_key"} disablePadding>
              <ListItemButton onClick={() => setDeleteOp(true)}>
                <ListItemIcon>
                  <DeleteIcon />
                </ListItemIcon>
                <ListItemText primary={"Eliminar información destinatario"} />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem key={"exit"} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={"Cerrar"} />
              </ListItemButton>
            </ListItem>
          </List>
        </OptionsButton>
      </Box>
    </Fragment>
  );
}

export default VariableEditor;
