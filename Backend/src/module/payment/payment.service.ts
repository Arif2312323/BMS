import Razorpay from "razorpay";
import { config } from "../../config/config";
import crypto from "crypto";


export const createOrder = async (paymentData:any)=>{
    const razorpay = new Razorpay({
        key_id : config.razorpayApiKey,
        key_secret : config.razorpayApiKeySecret
    })

    const {amount} = paymentData;

    const option = {
        amount : amount*100,
        currency : "INR",
        receipt : `bms-ticket_${Date.now()}`
    }

    const order = await razorpay.orders.create(option);
    return order;
};

export const verifyPayment = async (paymentData:any)=>{
    const {razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = paymentData;

    const expectedSignature = crypto.createHmac('sha256',config.razorpayApiKeySecret).update(razorpay_order_id+"|"+razorpay_payment_id).digest("hex");

    return expectedSignature === razorpay_signature;
}