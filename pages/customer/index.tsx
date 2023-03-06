import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import AddIcon from "@mui/icons-material/Add";
import PostModal from "@/components/customer/CustomerModal";
import CustomerCard from "@/components/customer/CustomerCard";
import { useEffect, Fragment, useState } from "react";

function CustomerContent() {
  const [consumerList, setConsumerList] = useState<TConsumer[]>([]);
  const [checkedList, setCheckedList] = useState<Map<number, boolean>>(
    new Map()
  );
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    window
      .fetch("/api/customer")
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        setConsumerList(data);
      });
  }, []);

  return (
    <Fragment>
      <PostModal
        consumerList={consumerList}
        setConsumerList={setConsumerList}
        open={open}
        handleClose={handleClose}
      />
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          <Grid
            item
            key="new_consumer"
            xs={12}
            //sm={consumer.title === "Enterprise" ? 12 : 6}
            md={4}
          >
            <Button variant="contained" fullWidth onClick={handleOpen}>
              <AddIcon />
            </Button>
          </Grid>
          {consumerList.map((consumer) => (
            <CustomerCard
              key={consumer.id}
              consumer={consumer}
              checkedList={checkedList}
              setCheckedList={setCheckedList}
            />
          ))}
        </Grid>
      </Container>
    </Fragment>
  );
}

export default function Customer() {
  return <CustomerContent />;
}
