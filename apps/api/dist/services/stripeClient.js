"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStripeClient = getStripeClient;
exports.getStripePublishableKey = getStripePublishableKey;
exports.getStripeSecretKey = getStripeSecretKey;
exports.getStripeSync = getStripeSync;
const stripe_1 = __importDefault(require("stripe"));
let connectionSettings;
async function getCredentials() {
    const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
    const xReplitToken = process.env.REPL_IDENTITY
        ? 'repl ' + process.env.REPL_IDENTITY
        : process.env.WEB_REPL_RENEWAL
            ? 'depl ' + process.env.WEB_REPL_RENEWAL
            : null;
    if (!xReplitToken) {
        throw new Error('X_REPLIT_TOKEN not found for repl/depl');
    }
    const connectorName = 'stripe';
    const isProduction = process.env.REPLIT_DEPLOYMENT === '1';
    const targetEnvironment = isProduction ? 'production' : 'development';
    const url = new URL(`https://${hostname}/api/v2/connection`);
    url.searchParams.set('include_secrets', 'true');
    url.searchParams.set('connector_names', connectorName);
    url.searchParams.set('environment', targetEnvironment);
    const response = await fetch(url.toString(), {
        headers: {
            'Accept': 'application/json',
            'X_REPLIT_TOKEN': xReplitToken
        }
    });
    const data = await response.json();
    connectionSettings = data.items?.[0];
    if (!connectionSettings || (!connectionSettings.settings.publishable || !connectionSettings.settings.secret)) {
        throw new Error(`Stripe ${targetEnvironment} connection not found`);
    }
    return {
        publishableKey: connectionSettings.settings.publishable,
        secretKey: connectionSettings.settings.secret,
    };
}
async function getStripeClient() {
    const { secretKey } = await getCredentials();
    return new stripe_1.default(secretKey, {
        apiVersion: '2025-03-31.basil',
    });
}
async function getStripePublishableKey() {
    const { publishableKey } = await getCredentials();
    return publishableKey;
}
async function getStripeSecretKey() {
    const { secretKey } = await getCredentials();
    return secretKey;
}
let stripeSync = null;
async function getStripeSync() {
    if (!stripeSync) {
        const { StripeSync } = await Promise.resolve().then(() => __importStar(require('stripe-replit-sync')));
        const secretKey = await getStripeSecretKey();
        stripeSync = new StripeSync({
            poolConfig: {
                connectionString: process.env.DATABASE_URL,
                max: 2,
            },
            stripeSecretKey: secretKey,
        });
    }
    return stripeSync;
}
