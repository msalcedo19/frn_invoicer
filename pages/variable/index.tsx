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
import Typography from "@mui/material/Typography";

import { dataPageAction, UPDATE_TITLE } from "@/src/actions/dataPage";
import { useDispatch } from "react-redux";

function VariableEditor() {
  const [editedVariables, setEditedVariables] = useState<TGlobal[]>([]);

  const handleVariableChange = (
    id: number,
    index: number,
    field: string,
    newValue: string
  ) => {
    const editedVariable = { ...editedVariables[index], [field]: newValue };
    const newVariables = [...editedVariables];
    newVariables[index] = editedVariable;
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
      .then((response) => response.json())
      .then((data) => {
        setEditedVariables(newVariables);
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
              <TableCell>Name</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Last Updated</TableCell>
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
                    onChange={(event) =>
                      handleVariableChange(
                        variable.id,
                        index,
                        "value",
                        event.target.value
                      )
                    }
                  />
                </TableCell>
                <TableCell>{variable.created}</TableCell>
                <TableCell>{variable.updated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
}

export default VariableEditor;
