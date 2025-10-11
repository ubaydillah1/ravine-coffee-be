import midtransClient from "midtrans-client";
import { config } from "./config.js";

let midtransCore = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: config.MIDTRANS_SERVER_KEY,
  clientKey: config.MIDTRANS_CLIENT_KEY,
});

export default midtransCore;
