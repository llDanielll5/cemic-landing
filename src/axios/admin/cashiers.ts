import { CreateCashierInfosInterface } from "types/cashier";
import axiosInstance from "..";

export const handleGetCashierOpened = async (
  dateIso: string,
  type: "clinic" | "implant"
) => {
  return await axiosInstance.get(
    `/cashiers/?filters[date][$eq]=${dateIso}&filters[type][$eq]=${type}&populate[adminInfos][populate]=*&populate[cashierInfos][populate]=*`
  );
};

export const handleGetCashierOpenedWithType = async (
  dateIso: string,
  cashierType: string
) => {
  return await axiosInstance.get(
    `/cashiers/?filters[date][$eq]=${dateIso}&filters[type][$eq]=${cashierType}&populate[adminInfos][populate]=*&populate[cashierInfos][populate]=*`
  );
};

export const handleGetMonthCashiers = async (
  startDate: string,
  endDate: string
) => {
  return await axiosInstance.get(
    `/cashiers/?filters[date][$gte]=${startDate}&filters[date][$lte]=${endDate}&populate[cashierInfos][populate]=*&populate[adminInfos][populate]=*`
  );
};

export const handleOpenCashierDb = async (data: any) => {
  return await axiosInstance.post("/cashiers", data);
};

export const generatePatientPaymentInCashier = async (data: any) => {
  return await axiosInstance.post(`/cashier-infos/`, data);
};
