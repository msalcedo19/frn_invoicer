import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";

import Button from "@mui/material/Button";
import { useEffect, Fragment, useState, ChangeEvent } from "react";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import {
  breadcrumbAction,
  BACK_EVENT,
  CONTRACT,
} from "@/src/actions/breadcrumb";
import { useDispatch } from "react-redux";
import { dataPageAction, UPDATE_TITLE } from "@/src/actions/dataPage";
import { processRequest, handleBreadCrumb, getHeaders } from "@/pages/index";
import ContractCard from "@/components/Contract/ContractCard";

const sortByNameAsc = (a: TContract, b: TContract) =>
  a.title.localeCompare(b.title);
const sortByNameDesc = (a: TContract, b: TContract) =>
  b.title.localeCompare(a.title);

export default function FileDetail() {
  const [contracts, setContracts] = useState<TContract[]>([]);
  const {
    query: { file_id },
  } = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  const [searchTerm, setSearchTerm] = useState("");
  function handleSearch(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = contracts.filter((obj) =>
      obj.title.toString().toLowerCase().includes(term.toLowerCase())
    );
    setSortedList(filtered);
  }

  const [sortedList, setSortedList] = useState(contracts);
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
    if (file_id)
      window
        .fetch(`/api/files/${file_id}`, {
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
          if (data && data["services"]) {
            setContracts(data["services"]);
            setSortedList(data["services"]);
          }
          setLoading(false);
        });
  }

  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    dispatch(
      breadcrumbAction(
        BACK_EVENT,
        {
          href: "",
          value: "",
          active: true,
        },
        CONTRACT
      )
    );
    dispatch(
      dataPageAction(UPDATE_TITLE, {
        title: "Contratos",
      })
    );
    reload();

    if (file_id) handleBreadCrumb(router, dispatch);
  }, [file_id]);

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
        {sortedList != undefined &&
          sortedList.length > 0 &&
          sortedList.map((contract: TContract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
            />
          ))}
      </Grid>
      <Container sx={{ mt: "100px", width: "100%", textAlign: "center" }}>
        {loading && (
          <Box sx={{ width: "100%" }}>
            <CircularProgress />
          </Box>
        )}
        {!loading && sortedList && sortedList.length == 0 && (
          <Typography>
            {searchTerm.length > 0
              ? "Ningún contrato coincide con la busqueda"
              : "Aún no has generado ningún contrato"}
          </Typography>
        )}
      </Container>
    </Fragment>
  );
}
