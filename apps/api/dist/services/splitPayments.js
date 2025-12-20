"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitPaymentService = exports.SplitPaymentService = exports.SPLIT_CONFIGS = exports.TransactionType = void 0;
const stripeClient_1 = require("./stripeClient");
var TransactionType;
(function (TransactionType) {
    TransactionType["TABLE_RESERVATION"] = "TABLE_RESERVATION";
    TransactionType["RPG_SESSION"] = "RPG_SESSION";
    TransactionType["FOOD_ORDER"] = "FOOD_ORDER";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
exports.SPLIT_CONFIGS = {
    [TransactionType.TABLE_RESERVATION]: {
        platformPercentage: 10,
        destinationPercentage: 90,
        description: 'Reserva de mesa física - 90% Loja, 10% Sócio do Tabuleiro',
    },
    [TransactionType.RPG_SESSION]: {
        platformPercentage: 15,
        destinationPercentage: 85,
        description: 'Sessão de RPG - 85% Mestre, 15% Sócio do Tabuleiro',
    },
    [TransactionType.FOOD_ORDER]: {
        platformPercentage: 5,
        destinationPercentage: 95,
        description: 'Venda de comida - 95% Loja, 5% Sócio do Tabuleiro',
    },
};
class SplitPaymentService {
    calculateSplit(amount, transactionType) {
        const config = exports.SPLIT_CONFIGS[transactionType];
        const platformFee = Math.round((amount * config.platformPercentage) / 100);
        const destinationAmount = amount - platformFee;
        return {
            platformFee,
            destinationAmount,
        };
    }
    async createPaymentIntent(params) {
        const stripe = await (0, stripeClient_1.getStripeClient)();
        const config = exports.SPLIT_CONFIGS[params.transactionType];
        const { platformFee, destinationAmount } = this.calculateSplit(params.amount, params.transactionType);
        const paymentIntentParams = {
            amount: params.amount,
            currency: params.currency || 'brl',
            application_fee_amount: platformFee,
            transfer_data: {
                destination: params.destinationAccountId,
            },
            metadata: {
                transaction_type: params.transactionType,
                platform_fee: platformFee.toString(),
                destination_amount: destinationAmount.toString(),
                split_config: config.description,
                ...params.metadata,
            },
            description: params.description || config.description,
        };
        if (params.customerId) {
            paymentIntentParams.customer = params.customerId;
        }
        if (params.paymentMethodId) {
            paymentIntentParams.payment_method = params.paymentMethodId;
            paymentIntentParams.confirm = true;
        }
        const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);
        return {
            paymentIntentId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret,
            status: paymentIntent.status,
            platformFee,
            destinationAmount,
        };
    }
    async createCheckoutSession(params) {
        const stripe = await (0, stripeClient_1.getStripeClient)();
        const config = exports.SPLIT_CONFIGS[params.transactionType];
        const { platformFee } = this.calculateSplit(params.amount, params.transactionType);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'boleto', 'pix'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'brl',
                        product_data: {
                            name: params.productName,
                            description: params.productDescription,
                        },
                        unit_amount: params.amount,
                    },
                    quantity: 1,
                },
            ],
            payment_intent_data: {
                application_fee_amount: platformFee,
                transfer_data: {
                    destination: params.destinationAccountId,
                },
                metadata: {
                    transaction_type: params.transactionType,
                    platform_fee: platformFee.toString(),
                    split_config: config.description,
                    ...params.metadata,
                },
            },
            success_url: params.successUrl,
            cancel_url: params.cancelUrl,
            customer_email: params.customerEmail,
            metadata: {
                transaction_type: params.transactionType,
                ...params.metadata,
            },
        });
        return {
            sessionId: session.id,
            url: session.url,
        };
    }
    async refundPayment(paymentIntentId, amount, reason) {
        const stripe = await (0, stripeClient_1.getStripeClient)();
        const refundParams = {
            payment_intent: paymentIntentId,
            reason,
            refund_application_fee: true,
            reverse_transfer: true,
        };
        if (amount) {
            refundParams.amount = amount;
        }
        return stripe.refunds.create(refundParams);
    }
    async getPaymentIntent(paymentIntentId) {
        const stripe = await (0, stripeClient_1.getStripeClient)();
        return stripe.paymentIntents.retrieve(paymentIntentId);
    }
    async listTransfers(accountId, limit = 10) {
        const stripe = await (0, stripeClient_1.getStripeClient)();
        const transfers = await stripe.transfers.list({
            destination: accountId,
            limit,
        });
        return transfers.data;
    }
    async getBalance(accountId) {
        const stripe = await (0, stripeClient_1.getStripeClient)();
        return stripe.balance.retrieve({
            stripeAccount: accountId,
        });
    }
}
exports.SplitPaymentService = SplitPaymentService;
exports.splitPaymentService = new SplitPaymentService();
