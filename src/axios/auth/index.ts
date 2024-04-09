import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import axiosInstance, { serverUrl } from "..";
import {
  defaultAdminPermissions,
  defaultEmployeePermissions,
} from "@/_mock/users";
import { AdminType } from "types";

export const handleRegister = async (data: any) => {
  const {
    role,
    password,
    email,
    phone,
    rg,
    cpf,
    dateBorn,
    name,
    username,
    location,
  } = data;
  return axios.post(`${serverUrl}/auth/local/register`, {
    email,
    password,
    name,
    phone,
    cpf,
    rg,
    userType: role,
    firstLetter: name.charAt(0).toUpperCase(),
    dateBorn,
    username,
    location,
    permissions:
      role === "ADMIN" ? defaultAdminPermissions : defaultEmployeePermissions,
  });
};

export const handleLogin = async (data: any) => {
  const { email, password } = data;

  return axios.post(`${serverUrl}/auth/local`, {
    identifier: email,
    password,
  });
};

export const handlePersistLogin = async () => {
  let { data } = await axiosInstance.get(`/users/me`);
  const authData = data;
  return authData;
};

export const handleLogout = async (router: any) => {
  setCookie("jwt", undefined);
  setCookie("user", undefined);
  return await router.push("/auth/login");
};

const sendResetPassword = async () => {
  // setIsLoading(true);
  // setLoadingMessage("Estamos enviando um email para você!");
  // sendPasswordResetEmail(auth, resetEmail)
  //   .then(() => {
  //     setIsLoading(false);
  //     setResetEmail("");
  //     changeResetModalVisible();
  //   })
  //   .catch((error) => {
  //     setIsLoading(false);
  //     const errorCode = error.code;
  //     if (errorCode === "auth/invalid-email") {
  //       return alert("E-mail não cadastrado ou errado");
  //     } else if (errorCode === "auth/missing-email") {
  //       return alert("Digite um e-mail");
  //     } else if (errorCode === "auth/user-not-found") {
  //       return alert("Usuário não cadastrado");
  //     } else return alert(errorCode);
  //   });
};
