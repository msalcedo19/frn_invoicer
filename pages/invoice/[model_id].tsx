import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { useEffect, Fragment, useState } from "react";
import { useRouter } from "next/router";
import FilesRow from "@/components/file/FilesRow";
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
import { PostInvoiceModal } from "@/components/Invoice/InvoiceModal";
import Box from "@mui/material/Box";

import { useDispatch } from "react-redux";
import { dataPageAction, UPDATE_TITLE } from "@/src/actions/dataPage";
import {
  processRequest,
  processRequestNonReponse,
  handleBreadCrumb,
  sendMessageAction,
  getHeaders,
} from "@/pages/index";

const sortByDateAsc = (a: TFile, b: TFile) =>
  new Date(a.created).getTime() <= new Date(b.created).getTime() ? 1 : -1;

export default function CustomerDetail() {
  const [files, setFiles] = useState<TFile[]>([]);
  const {
    query: { model_id },
  } = useRouter();

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
          window.fetch(`/api/files/${key}`, {
            method: "DELETE",
            headers: getHeaders(),
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
            "Una o varias de las versiones no pudo ser eliminada",
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
      setCheckedList(new Map());
    });
  }

  function reload() {
    if (model_id)
      window
        .fetch(`/api/invoice/${model_id}`, {
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
          if (data && data["files"]) {
            setFiles(data["files"].sort(sortByDateAsc));
          }
        });
  }

  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    reload();

    dispatch(
      dataPageAction(UPDATE_TITLE, {
        title: "Versiones",
      })
    );

    if (model_id) handleBreadCrumb(router, dispatch);
  }, [model_id]);

  return (
    <Fragment>
      <PostInvoiceModal
        model_id={model_id}
        customer_id={undefined}
        create_new_invoice={false}
        open={open}
        handleClose={handleClose}
        reload={reload}
      />
      <Container sx={{ marginTop: "5%" }}>
        <Grid container spacing={5} alignItems="flex-end">
          {files != undefined &&
            files.length > 0 &&
            files.map((file: TFile) => (
              <FilesRow
                key={file.id}
                file={file}
                checkedList={checkedList}
                setCheckedList={setCheckedList}
                deleteOp={deleteOp}
              />
            ))}
        </Grid>
        <Container
          sx={{ mt: "100px", width: "100%", textAlign: "center" }}
        ></Container>
      </Container>

      <Box sx={{ position: "fixed", bottom: "32px", right: "32px" }}>
        <OptionsButton
          function_1={delete_obj}
          function_2={() => setDeleteOp(false)}
          check_or_cancel={deleteOp}
        >
          <List>
            <ListItem key={"upload_file"} disablePadding>
              <ListItemButton onClick={handleOpen}>
                <ListItemIcon>
                  <CreateIcon />
                </ListItemIcon>
                <ListItemText primary={"Generar nueva factura"} />
              </ListItemButton>
            </ListItem>
            <ListItem key={"delete_file"} disablePadding>
              <ListItemButton onClick={() => setDeleteOp(true)}>
                <ListItemIcon>
                  <DeleteIcon />
                </ListItemIcon>
                <ListItemText primary={"Eliminar factura/excel"} />
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
