//@ts-nocheck
import { format } from "date-fns";
import PropTypes from "prop-types";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Scrollbar } from "src/components/new-admin/comps/scrollbar";
import { SeverityPill } from "src/components/new-admin/comps/severity-pill";
import { parseToBrl } from "@/components/admin/patient/modals/receipt-preview";

const cashierType = {
  clinic: "primary",
  implant: "info",
};
const cashierName = {
  clinic: "Clínico",
  implant: "Implante",
};

export const OverviewLatestOrders = (props: any) => {
  const { orders = [], sx } = props;

  const sumAllValues = (values: any) => {
    let total =
      values["bank_check"] +
      values["cash"] +
      values["credit"] +
      values["debit"] +
      values["pix"] +
      values["transfer"];

    return +total;
  };

  return (
    <Card sx={sx}>
      <CardHeader title="Últimos Pagamentos" />
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Caixa</TableCell>
                <TableCell>Paciente</TableCell>
                <TableCell sortDirection="desc">Data</TableCell>
                <TableCell>Valor R$</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order: any) => {
                const attr = order.attributes;
                const cashier = attr?.cashier?.data?.attributes?.type;
                const patient = attr?.patient?.data?.attributes?.name;
                const datePayment = format(
                  new Date(attr?.date),
                  "dd/MM/yyyy HH:mm"
                );
                return (
                  <TableRow hover key={order.id}>
                    <TableCell>
                      <SeverityPill color={cashierType[cashier]}>
                        {cashierName[cashier]}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>{patient}</TableCell>
                    <TableCell>{datePayment}</TableCell>
                    <TableCell>
                      {parseToBrl(sumAllValues(attr?.total_values))}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <Divider />
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          color="inherit"
          endIcon={
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          }
          size="small"
          variant="text"
        >
          Ver Todos
        </Button>
      </CardActions>
    </Card>
  );
};

OverviewLatestOrders.prototype = {
  orders: PropTypes.array,
  sx: PropTypes.object,
};
