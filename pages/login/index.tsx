import { useState } from "react";
import { TextField, Button, Box, Tooltip, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useDispatch } from "react-redux";
import { sendMessageAction } from "@/pages/index";
import { userService } from "@/src/user";
import Router from "next/router";

const LoginForm = () => {
  const [username, setUsername] = useState("msalcedo");
  const [password, setPassword] = useState("msalcedo");

  const dispatch = useDispatch();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    userService.login(username, password, dispatch);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      style={{
        width: "100%",
        maxWidth: "450px",
        margin: "auto",
        marginTop: "250px",
        padding: "40px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        backgroundColor: "#f2f2f2",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Acceder
      </Typography>
      <TextField
        label="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        margin="normal"
        fullWidth
        style={{ marginBottom: "20px" }}
        InputProps={{
          endAdornment: (
            <Tooltip title="Ingresa tu nombre de usuario" placement="top">
              <InfoIcon />
            </Tooltip>
          ),
        }}
      />
      <TextField
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        fullWidth
        style={{ marginBottom: "20px" }}
        InputProps={{
          endAdornment: (
            <Tooltip title="Ingresa tu contraseña" placement="top">
              <InfoIcon />
            </Tooltip>
          ),
        }}
      />
      <Button
        variant="contained"
        type="submit"
        fullWidth
        style={{ backgroundColor: "#007bff", color: "#fff", marginTop: "20px" }}
      >
        Continuar
      </Button>
    </Box>
  );
};

export default LoginForm;
