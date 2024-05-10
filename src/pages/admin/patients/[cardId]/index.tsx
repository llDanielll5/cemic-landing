/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard/layout";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import PatientDetails from "@/components/admin/patient";
import dynamic from "next/dynamic";

const SingleUser = dynamic(import("@/components/admin/patient"), {
  ssr: true,
});

const PatientSingle = (props: any) => {
  const router = useRouter();
  const card = router?.query?.cardId ?? "";
  const [patientCardId, setPatientCardId] = useState(card);

  const getPatient = useCallback(async () => {
    setPatientCardId(card);
  }, [card]);

  useEffect(() => {
    if (!card || card === undefined) return;
    else getPatient();
  }, [getPatient, card]);

  return (
    <Box p={4}>
      {patientCardId !== "" ? <SingleUser cardId={patientCardId} /> : null}
    </Box>
  );
};

PatientSingle.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default PatientSingle;
