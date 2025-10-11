export interface MidtransQrisAction {
  name: "generate-qr-code" | "generate-qr-code-v2";
  method: "GET";
  url: string;
}

export interface MidtransQrisResponse {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  merchant_id: string;
  gross_amount: string;
  currency: "IDR";
  payment_type: "qris";
  transaction_time: string;
  transaction_status: "pending" | "settlement" | "expire" | "cancel" | "deny";
  fraud_status: "accept" | "deny" | "challenge";
  actions?: MidtransQrisAction[];
  acquirer: "gopay" | "shopeepay" | string;
  qr_string: string;
  expiry_time: string;
}
