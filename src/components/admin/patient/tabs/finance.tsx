import React, { useEffect, useState } from "react";
import Link from "next/link";
import Modal from "@/components/modal";
import Loading from "@/components/loading";
import PatientData from "@/atoms/patient";
import AddTreatment from "../modals/add-payment";
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import { parseDateIso } from "@/services/services";
import { useRecoilState } from "recoil";
import {
  Box,
  Typography,
  IconButton,
  styled,
  Button,
  Paper,
} from "@mui/material";
import AddPaymentPatientModal from "../modals/add-payment";
import { handleGetTreatmentsToPay } from "@/axios/admin/odontogram";

interface PatientFinaceTabProps {
  onUpdatePatient: any;
}

const PatientFinanceTab = (props: PatientFinaceTabProps) => {
  const { onUpdatePatient } = props;
  const [patientData, setPatientData] = useRecoilState(PatientData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [treatmentsToPay, setTreatmentsToPay] = useState<any>([]);
  const [idReceipt, setIdReceipt] = useState("");

  const client = patientData?.attributes;

  const handleCloseModalDelete = () => {
    setIdReceipt("");
    setDeleteVisible(false);
  };

  const getReceiptId = (id: string) => {
    setIdReceipt(id);
    setDeleteVisible(true);
  };

  const handleCloseAddPayment = () => setTreatmentsToPay([]);
  const handleGeneratePayment = async () => {
    const res = await handleGetTreatmentsToPay(client?.odontogram?.data?.id!);
    setTreatmentsToPay(res.data);
  };

  const handleDeleteReceipt = async () => {
    // setIsLoading(true);
    //deletar documento
  };

  const handleSubmit = async () => {
    // if (receiptDate === "") return alert("Adicione a data do Recibo");
    // setIsLoading(true);
    // const timestamp = Timestamp.now().seconds;
    // const clientRef = collection(db, "clients_receipts");
    // const imgName = `${props?.client?.name.replaceAll(" ", "")}-${timestamp}`;
    // const imgUpload = await uploadFile(
    //   "clients_receipts",
    //   imgName,
    //   document.img
    // );
    // if (imgUpload.state === "Success") {
    //   return await addDoc(clientRef, {
    //     media: imgUpload.url,
    //     client: props?.client!.id,
    //     title: `Recibo ${props?.client?.id}-${timestamp}`,
    //     date: receiptDate,
    //   })
    //     .then(async (e) => {
    //       setIsLoading(false);
    //       const document = doc(db, "clients_receipts", e.id);
    //       closeAddReceipt();
    //       return await updateDoc(document, { id: e.id });
    //     })
    //     .catch((err) => {
    //       setIsLoading(false);
    //       return alert("Erro ao adicionar documento");
    //     });
    // } else {
    //   return alert("Erro ao realizar upload de documento");
    // }
    //Criar pagamento!!!
  };

  if (isLoading)
    return (
      <Box position="fixed" top={0} left={0} zIndex={999999}>
        <Loading message="Atualizando..." />
      </Box>
    );
  else
    return (
      <Box>
        <Modal visible={deleteVisible} closeModal={handleCloseModalDelete}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h5">
              Deseja realmente apagar este pagamento?
            </Typography>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              columnGap={2}
            >
              <StyledButton onClick={handleDeleteReceipt}>Sim</StyledButton>
              <StyledButton onClick={handleCloseModalDelete}>Não</StyledButton>
            </Box>
          </Box>
        </Modal>

        <AddPaymentPatientModal
          visible={treatmentsToPay.length > 0}
          closeModal={handleCloseAddPayment}
          treatmentsToPay={treatmentsToPay}
        />

        <HeaderContainer elevation={10}>
          <Typography variant="h5">Histórico Financeiro</Typography>
          <Box display={"flex"} alignItems="center" columnGap={2}>
            <Button
              title={"Adicionar Pagamento"}
              variant="contained"
              onClick={handleGeneratePayment}
              startIcon={<AttachMoneyIcon />}
            >
              Add
            </Button>
          </Box>
        </HeaderContainer>

        {/* <Box p={2} width="100%">
          <ReceiptTableContainer>
            <TextId variant="subtitle1">ID Recibo</TextId>
            <Typography variant="subtitle1">Data do Recibo</Typography>
            <Box display="flex" columnGap={1} />
          </ReceiptTableContainer>
          {[{ id: 1, date: "1997-01-27" }].map((v, i) => (
            <ReceiptSingle key={i}>
              <TextId variant="subtitle1">{v?.id}</TextId>
              <Typography variant="subtitle1">
                {parseDateIso(v?.date)}
              </Typography>
              <Box display="flex" columnGap={1}>
                <Link passHref href={"#"} target="_blank">
                  <Button variant="text">Visualizar</Button>
                </Link>
                <IconButton
                  title={`Excluir recibo ${v?.id}`}
                  // onClick={() => getReceiptId(v?.id)}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>
            </ReceiptSingle>
          ))}
        </Box> */}
      </Box>
    );
};

const HeaderContainer = styled(Paper)`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  padding: 1rem 1rem;
`;
const ReceiptTableContainer = styled(Box)`
  padding: 0 1rem;
  margin: 0.5rem 0;
  width: 100%;
  display: flex;
  border-radius: 1rem;
  justify-content: space-between;
  align-items: center;
`;

const ReceiptSingle = styled(Box)`
  padding: 0.5rem 1rem;
  margin: 8px 0;
  width: 100%;
  display: flex;
  border-radius: 1rem;
  justify-content: space-between;
  border: 1px solid #f3f3f3;
  align-items: center;
`;
const TextId = styled(Typography)`
  @media screen and (max-width: 600px) {
    display: none;
  }
`;
const ViewReceiptButton = styled(StyledButton)`
  @media screen and (max-width: 470px) {
    font-size: 12px;
  }
`;

export default PatientFinanceTab;
