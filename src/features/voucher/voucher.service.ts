import { VoucherRepository } from "./voucher.repository.js";
import type { VoucherInput, VoucherQuerySchema } from "./voucher.types.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";

export const VoucherService = {
  async getAll({ limit, page, status }: VoucherQuerySchema) {
    return await VoucherRepository.getAllVoucher({ limit, page, status });
  },

  async getVoucherById(id: string) {
    return await VoucherRepository.getVoucherById(id);
  },

  async createVoucher(data: VoucherInput) {
    const exisistingVoucher = await VoucherRepository.getVoucherByCode(
      data.code
    );
    if (exisistingVoucher) throw new BadRequestError("Voucher already exists");

    return await VoucherRepository.createVoucher(data);
  },

  async updateVoucher(id: string, data: VoucherInput) {
    const exisistingVoucher = await VoucherRepository.getVoucherById(id);
    if (!exisistingVoucher) throw new NotFoundError("Voucher not found");

    return await VoucherRepository.updateVoucher(id, data);
  },

  async deleteVoucher(id: string) {
    return await VoucherRepository.deleteVoucher(id);
  },
};
