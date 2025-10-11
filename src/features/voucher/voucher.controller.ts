import type { Request, Response } from "express";
import { VoucherService } from "./voucher.service.js";
import type { VoucherStatus } from "@prisma/client";

export const VoucherController = {
  async getAllVouchers(req: Request, res: Response) {
    const status = (req.query.status as string).toUpperCase() as VoucherStatus;
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.offset as string) || 1;

    const vouchers = await VoucherService.getAll({ limit, page, status });

    res
      .status(200)
      .json({ message: "Vouchers fetched successfully", vouchers });
  },

  async getVoucherById(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const voucher = await VoucherService.getVoucherById(id);
    res.status(200).json({ message: "Voucher fetched successfully", voucher });
  },

  async createVoucher(req: Request, res: Response) {
    const data = req.body;
    const voucher = await VoucherService.createVoucher(data);
    res.status(201).json({ message: "Voucher created successfully", voucher });
  },

  async updateVoucher(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const data = req.body;
    const voucher = await VoucherService.updateVoucher(id, data);
    res.status(200).json({ message: "Voucher updated successfully", voucher });
  },

  async deleteVoucher(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    await VoucherService.deleteVoucher(id);
    res.status(200).json({ message: "Voucher deleted successfully" });
  },
};
