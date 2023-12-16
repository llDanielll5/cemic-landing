import { useCallback, useState, useRef } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import Loading from "@/components/loading";
import CModal from "@/components/modal";
import { handleLogin } from "@/services/requests/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/services/firebase";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  InputAdornment,
  Link,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  styled,
} from "@mui/material";

const Page = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [method, setMethod] = useState("email");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Deve adicionar um email válido")
        .max(255)
        .required("Email é obrigatório"),
      password: Yup.string().max(255).required("A senha é obrigatória"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        handleSubmit(values);
      } catch (err: any) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  const handleSubmit = async (values: any) => {
    const { email, password } = values;
    setIsLoading(true);
    setLoadingMessage("Estamos realizando o seu login.");
    return await handleLogin({ email, password })
      .then(async (res) => {
        if (res === null || res === undefined) {
          return;
        } else if (res?.role === "admin" || res?.role === "employee") {
          router.push("/admin");
        } else if (res?.role === "professional") {
          router.push("/professional");
        } else router.push("/");
      })
      .finally(() => setIsLoading(false));
  };

  const sendResetPassword = async () => {
    setIsLoading(true);
    setLoadingMessage("Estamos enviando um email para você!");
    sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        setIsLoading(false);
        setResetEmail("");
        changeResetModalVisible();
      })
      .catch((error) => {
        setIsLoading(false);
        const errorCode = error.code;
        if (errorCode === "auth/invalid-email") {
          return alert("E-mail não cadastrado ou errado");
        } else if (errorCode === "auth/missing-email") {
          return alert("Digite um e-mail");
        } else if (errorCode === "auth/user-not-found") {
          return alert("Usuário não cadastrado");
        } else return alert(errorCode);
      });
  };

  const handleMethodChange = useCallback((event: any, value: any) => {
    setMethod(value);
  }, []);

  const handleResetModal = (e: any) => {
    e.preventDefault();
    setResetPasswordModal(!resetPasswordModal);
    setResetEmail("");
  };
  const changeResetModalVisible = () => {
    setResetPasswordModal(!resetPasswordModal);
    setResetEmail("");
  };
  const handleTogglePasswordVisible = (e: any) =>
    setPasswordVisible(!passwordVisible);

  return (
    <>
      <Head>
        <title>Entrar | CEMIC</title>
      </Head>
      {isLoading && <Loading message={loadingMessage} />}

      <CModal
        closeModal={changeResetModalVisible}
        visible={resetPasswordModal}
        styles={{ width: "80%" }}
      >
        <Typography variant="h6" mb={2}>
          Digite seu email, para recuperar sua senha.
        </Typography>

        <TextField
          fullWidth
          label="Email"
          name="email"
          onChange={(e) => setResetEmail(e.target.value)}
          type="email"
          value={resetEmail}
        />
        <Button
          fullWidth
          size="large"
          sx={{ mt: 3 }}
          type="submit"
          variant="contained"
          onClick={sendResetPassword}
        >
          Recuperar Senha
        </Button>
      </CModal>

      <Container>
        <InnerContainer>
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Entrar</Typography>
              <Typography color="text.secondary" variant="body2">
                É um parceiro e não possui cadastro? &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/register"
                  underline="hover"
                  variant="subtitle2"
                >
                  Registre-se
                </Link>
              </Typography>
            </Stack>
            <Tabs onChange={handleMethodChange} sx={{ mb: 3 }} value={method}>
              <Tab label="Email" value="email" />
              {/* <Tab label="Phone Number" value="phoneNumber" /> */}
            </Tabs>
            {method === "email" && (
              <form noValidate onSubmit={formik.handleSubmit}>
                <Stack spacing={3} mb={2}>
                  <TextField
                    error={!!(formik.touched.email && formik.errors.email)}
                    fullWidth
                    helperText={formik.touched.email && formik.errors.email}
                    label="Email"
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="email"
                    value={formik.values.email}
                    onKeyDown={({ key }) => {
                      if (key === "Enter") return formik.handleSubmit();
                    }}
                  />
                  <TextField
                    ref={inputRef}
                    error={
                      !!(formik.touched.password && formik.errors.password)
                    }
                    fullWidth
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                    label="Senha"
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type={!passwordVisible ? "password" : "text"}
                    value={formik.values.password}
                    onKeyDown={({ key }) => {
                      if (key === "Enter") return formik.handleSubmit();
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {!passwordVisible ? (
                            <VisibilityIcon
                              onClick={handleTogglePasswordVisible}
                              sx={{ cursor: "pointer" }}
                            />
                          ) : (
                            <VisibilityOffIcon
                              onClick={handleTogglePasswordVisible}
                              sx={{ cursor: "pointer" }}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>

                {formik.errors.submit && (
                  <Typography color="error" sx={{ mt: 3 }} variant="body2">
                    {formik.errors.submit}
                  </Typography>
                )}
                <a
                  onClick={handleResetModal}
                  style={{ color: "blue", fontSize: "14px" }}
                  href=""
                >
                  Esqueceu sua Senha?
                </a>
                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                >
                  Entrar
                </Button>
              </form>
            )}
            {method === "phoneNumber" && (
              <div>
                <Typography sx={{ mb: 1 }} variant="h6">
                  Não disponível por enquanto...
                </Typography>
                <Typography color="text.secondary">
                  O sistema de login por método de telefone ainda está
                  desabilitado
                </Typography>
              </div>
            )}
          </div>
        </InnerContainer>
      </Container>
    </>
  );
};

Page.getLayout = (page: any) => <AuthLayout>{page}</AuthLayout>;

const Container = styled(Box)`
  background-color: ${"background.paper"};
  flex: 1 1 auto;
  align-items: center;
  display: flex;
  justify-content: center;
`;
const InnerContainer = styled(Box)`
  max-width: 550px;
  padding: 100px 24px;
  width: 100%;
`;

export default Page;
