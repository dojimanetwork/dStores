import { WALLET_CONNECTORS, WEB3AUTH_NETWORK } from "@web3auth/modal";
import { Web3AuthContextConfig } from "@web3auth/modal/react";

const web3authConfig: Web3AuthContextConfig = {
    web3AuthOptions: {
        clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "", // Get this from Web3Auth Dashboard
        web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    },
};

export default web3authConfig;