import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { useEffect, Fragment, useState, ChangeEvent } from "react";
import { useRouter } from "next/router";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";

import {
  breadcrumbAction,
  BACK_EVENT,
  CONTRACT,
} from "@/src/actions/breadcrumb";
import { dataPageAction, UPDATE_TITLE } from "@/src/actions/dataPage";
import { useDispatch } from "react-redux";
import {
  sortByNameDesc,
  sortByNameAsc,
  processRequest,
  handleBreadCrumb,
} from "@/pages/index";
import ContractCard from "@/components/Contract/ContractCard";

const styles = {
  container: {
    marginTop: "100px",
    width: "100%",
    textAlign: "center",
  },
  optionsButton: {
    marginBottom: "50px",
  },
  button: {
    color: "white",
    fontWeight: "bold",
    "&:hover": {
      color: "black",
      backgroundColor: "white",
    },
  },
};

export default function Customer() {
  const [objList, setObjList] = useState<TContract[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  function handleSearch(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = objList.filter((obj) =>
      obj.name.toLowerCase().includes(term.toLowerCase())
    );
    setSortedList(filtered);
  }

  const [sortedList, setSortedList] = useState(objList);
  const [sortOrder, setSortOrder] = useState("asc");
  const handleSort = () => {
    if (sortOrder === "asc") {
      setSortedList(sortedList.sort(sortByNameDesc));
      setSortOrder("desc");
    } else {
      setSortedList(sortedList.sort(sortByNameAsc));
      setSortOrder("asc");
    }
  };

  function reload() {
    window
      .fetch(`/api/contract/`)
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
          setObjList(data);
          setSortedList(data);
        }
      });
  }

  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    dispatch(
      dataPageAction(UPDATE_TITLE, {
        title: "Contratos",
      })
    );
    reload();
  }, []);

  return (
    <Fragment>
      <Grid container spacing={2}>
        <Grid item>
          <TextField
            size="small"
            label="Buscar por nombre"
            value={searchTerm}
            onChange={handleSearch}
          />
        </Grid>
        <Grid item>
          <Button onClick={handleSort} variant="outlined">
            Ordenar por nombre (
            {sortOrder === "asc" ? "ascendente" : "descendente"})
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ marginY: 2 }} />
      <Grid container spacing={5} alignItems="flex-end">
        {sortedList.map((obj) => (
          <ContractCard
            key={obj.id}
            contract={obj}
            checkedList={undefined}
            setCheckedList={undefined}
            deleteOp={false}
          />
        ))}
      </Grid>
      <Container sx={styles.container}>
        {sortedList.length == 0 && (
          <Typography>
            {searchTerm.length > 0
              ? "Ningún contrato coincide con la busqueda"
              : "Aún no has creado ningún contrato"}
          </Typography>
        )}
      </Container>
    </Fragment>
  );
}
