import { VoucherStatus } from "@prisma/client";
import prisma from "../../lib/prisma.js";
import type { VoucherInput, VoucherQuerySchema } from "./voucher.types.js";

export const VoucherRepository = {
  getAllVoucher: async ({ limit, page, status }: VoucherQuerySchema) => {
    const skip = (page - 1) * limit;

    return await prisma.voucher.findMany({
      take: limit,
      skip,
      orderBy: { createdAt: "desc" },
      select: {
        name: true,
        code: true,
        startDate: true,
        currentUsage: true,
        endDate: true,
        status: true,
      },
...(status && { where: { status } }),
    });
  },

  getVoucherByCode: async (code: string) => {
    return await prisma.voucher.findUnique({ where: { code } });
  },

  getVoucherById: async (id: string) => {
    return await prisma.voucher.findUnique({ where: { id } });
  },

  createVoucher: async (data: VoucherInput) => {
    return await prisma.voucher.create({
      data: { ...data, status: VoucherStatus.ACTIVE },
    });
  },

  updateVoucher: async (id: string, data: VoucherInput) => {
    return await prisma.voucher.update({ where: { id }, data });
  },

  deleteVoucher: async (id: string) => {
    return await prisma.voucher.delete({ where: { id } });
  },
};
