import React, { useState } from "react";
import { useRouter } from "next/router";
import { AuthErrors } from "@/services/errors";
import { nameCapitalized } from "@/services/services";
import { createEmployee } from "@/services/requests/auth";
import { StyledTextField } from "@/components/patient/profile";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import { Typography, Box, IconButton, InputAdornment } from "@mui/material";
import styles from "../../../styles/ProfessionalRegister.module.css";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import ModalSuccess from "@/components/modalSuccess";
import ModalError from "@/components/modalError";
import Loading from "@/components/loading";
import Input from "@/components/input";
import Modal from "@/components/modal";

const baseData = {
  rg: "",
  id: "",
  cpf: "",
  uid: "",
  name: "",
  phone: "",
  email: "",
  payments: [],
  protocols: [],
  treatments: [],
  profileImage: "",
};

const ProfessionalRegister = () => {
  const router = useRouter();
  const [data, setData] = useState<any>(baseData);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [finishRegister, setFinishRegister] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(true);
  const [modalError, setModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [code, setCode] = useState("");
  const [chances, setChances] = useState(3);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleChange = (e: any, field: string) => {
    return setData((prev: any) => ({ ...prev, [field]: e }));
  };
  const handleMasked = (value: string, type: string) => {
    const masked = type === "cpf" ? cpfMask : phoneMask;
    setData((prev: any) => ({ ...prev, [type]: masked(value) }));
  };

  const phoneMask = (value: any) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    return value;
  };
  const cpfMask = (value: any) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return value;
  };

  const handleCloseErrorModal = () => {
    setModalError(false);
    setErrorMessage("");
  };

  const handleSubmit = async () => {
    const { cpf, email, name, phone, rg } = data;
    if (
      name === "" ||
      email === "" ||
      password === "" ||
      cpf.length < 14 ||
      phone.length < 15 ||
      rg === ""
    )
      return alert("Preencha os campos!");

    const phoneReplaced = data
      ?.phone!.replace("(", "")
      .replace(")", "")
      .replace("-", "")
      .replace(" ", "");
    const cpfReplaced = data
      ?.cpf!.replace(".", "")
      .replace("-", "")
      .replace(".", "");

    setIsLoading(true);

    const completeName = nameCapitalized(name);

    const dataChange = {
      cpf,
      email,
      name: completeName,
      phone,
      rg,
    };

    return await createEmployee(
      dataChange,
      password,
      cpfReplaced,
      phoneReplaced
    )
      .then(() => {
        setIsLoading(false);
        setData(baseData);
        setPassword("");
        setFinishRegister(true);
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.code === AuthErrors["01"]) {
          setModalError(true);
          setErrorMessage("Email já está em uso");
          return;
        } else if (err.code === "auth/invalid-email") {
          setModalError(true);
          setErrorMessage(
            "Email inválido. Verifique corretamente o email adicionado!"
          );
        } else return alert(err.code);
      });
  };

  const handleFinishRegister = async () => {
    const isLogout = await router.push("/login");
    if (isLogout) setFinishRegister(false);
  };

  const handleVerify = () => {
    if (code === process.env.ADMIN_PASSWORD) return setModalConfirm(false);
    else {
      setChances((prev) => prev - 1);
      if (chances === 0) {
        router.push("/login");
      } else
        return alert(`Código incorreto. Você tem mais ${chances} chance(s)`);
    }
  };

  const handlePressVerify = ({ key }: any) => {
    if (key === "Enter") return handleVerify();
  };

  return (
    <div className={styles.container}>
      {isLoading && <Loading message="Estamos criando sua conta..." />}

      <Modal visible={modalConfirm} closeModal={() => {}}>
        <Typography variant="semibold">
          Digite o código de administrador:
        </Typography>
        <Input
          onChange={(e) => setCode(e)}
          label="Código"
          value={code}
          onKeyDown={handlePressVerify}
        />
        <StyledButton onClick={handleVerify}>Verificar</StyledButton>
      </Modal>

      <ModalSuccess
        actionButton={handleFinishRegister}
        message={"Você criou sua conta na CEMIC com sucesso!"}
        closeModal={handleFinishRegister}
        visible={finishRegister}
      />
      <ModalError
        actionButton={
          <StyledButton onClick={handleCloseErrorModal}>Ok</StyledButton>
        }
        message={errorMessage}
        closeModal={handleCloseErrorModal}
        visible={modalError}
      />
      <div className={styles.register}>
        <h3>Registro de Funcionário</h3>
        <Box display="flex" flexDirection="column" rowGap={2} px={2} mt={2}>
          <StyledTextField
            label="Nome Completo *"
            onChange={(e) => handleChange(e.target.value, "name")}
            inputProps={{ style: { textTransform: "capitalize" } }}
            value={data.name}
          />

          <StyledTextField
            label="Telefone *"
            onChange={(e) => handleMasked(e.target.value, "phone")}
            value={data.phone}
            inputProps={{ maxLength: 15 }}
          />
          <StyledTextField
            label="CPF *"
            onChange={(e) => handleMasked(e.target.value, "cpf")}
            value={data.cpf}
            inputProps={{ maxLength: 14 }}
          />
          <StyledTextField
            label="RG *"
            onChange={(e) => handleChange(e.target.value, "rg")}
            value={data.rg}
          />

          <StyledTextField
            label="Email *"
            onChange={(e) => handleChange(e.target.value, "email")}
            value={data.email}
          />

          <StyledTextField
            label="Senha para acesso *"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <StyledButton onClick={handleSubmit}>
            Registrar Administrador
          </StyledButton>
        </Box>
      </div>
    </div>
  );
};

export default ProfessionalRegister;
