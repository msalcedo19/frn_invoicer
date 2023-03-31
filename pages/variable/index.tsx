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

import { dataPageAction, UPDATE_TITLE } from "@/src/actions/dataPage";
import { useDispatch } from "react-redux";
import { processRequestToObj, sendMessageAction } from "@/pages/index";

function VariableEditor() {
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
    setEditedVariables(newVariables);
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
          setEditedVariables(data);
          sendMessageAction("success", "Se actualizó correctamente", dispatch);
        } else if (previousValue != "") {
          const editedVariable = {
            ...editedVariables[index],
            [field]: previousValue,
          };
          const newVariables = [...editedVariables];
          newVariables[index] = editedVariable;
          setEditedVariables(newVariables);
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

  const dispatch = useDispatch();
  useEffect(() => {
    window
      .fetch(`/api/global/`)
      .then((response) => response.json())
      .then((data) => {
        setEditedVariables(data);
      });

    window
      .fetch(`/api/topInfo/`)
      .then((response) => response.json())
      .then((data) => {
        setTopinfos(data);
      });

    dispatch(
      dataPageAction(UPDATE_TITLE, {
        title: "Variables",
      })
    );
  }, []);

  return (
    <Fragment>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Ultima actualización</TableCell>
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

      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>From</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
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
    </Fragment>
  );
}

export default VariableEditor;
