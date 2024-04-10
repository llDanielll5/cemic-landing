//@ts-nocheck
import React from "react";
import { Box, Button, Stack, Typography, styled } from "@mui/material";
import UserData from "@/atoms/userData";
import PatientData from "@/atoms/patient";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HeaderTopPatientInformations from "./header-top-informations";
import { useRecoilState, useRecoilValue } from "recoil";
import { parseDateIso } from "@/services/services";
import { useRouter } from "next/router";

interface HeaderPatientInterface {
  clientData: any;
}

const HeaderPatientInformations = (props: HeaderPatientInterface) => {
  const { clientData } = props;
  const router = useRouter();

  const adminData: any = useRecoilValue(UserData);
  const [patientData, setPatientData] = useRecoilState(PatientData);
  let client = patientData?.attributes;

  const backPatients = () => {
    return router.push("/admin/patients").then(
      (b) => setPatientData(null),
      (err) => console.log(err)
    );
  };

  return (
    <Container>
      <Stack direction={"row"} alignItems="flex-start">
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={backPatients}
        >{`Voltar para Pacientes`}</Button>
      </Stack>
      <HeaderTopPatientInformations patient={clientData} />
      <Box
        columnGap={1}
        display="flex"
        justifyContent={
          !client?.adminInfos?.updated ? "flex-end" : "space-between"
        }
        alignItems="center"
      >
        {client?.adminInfos?.created?.data !== null ? (
          <Typography variant="caption" color="orangered">
            Criado por {client?.adminInfos?.created?.data?.attributes?.name} dia{" "}
            {parseDateIso(
              client?.adminInfos?.createTimestamp?.substring?.(0, 10)
            )}
          </Typography>
        ) : null}
        {client?.adminInfos?.updated?.data !== null ? (
          <Typography variant="caption" color="green">
            Atualizado por {client?.adminInfos?.updated?.data?.attributes?.name}{" "}
            dia{" "}
            {parseDateIso(
              client?.adminInfos?.updateTimestamp?.substring?.(0, 10)
            )}
          </Typography>
        ) : null}
      </Box>
    </Container>
  );
};

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
`;

export default HeaderPatientInformations;
