import { useWeb3AuthConnect } from "@web3auth/modal/react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import type { IProvider, LoginParamMap, WALLET_CONNECTOR_TYPE, Web3AuthError } from "@web3auth/no-modal";

interface IUseWeb3AuthConnect {
    isConnected: boolean;
    loading: boolean;
    error: Web3AuthError | null;
    connectorName: WALLET_CONNECTOR_TYPE | null;
    connect(): Promise<IProvider | null>;
    connectTo<T extends WALLET_CONNECTOR_TYPE>(connector: T, params?: LoginParamMap[T]): Promise<IProvider | null>;
}

interface Web3AuthContextType extends IUseWeb3AuthConnect {
    provider: IProvider | null;
    address: string | null;
    balance: string | null;
    getAddress: () => Promise<string>;
    getBalance: () => Promise<string>;
}

const Web3AuthContext = createContext<Web3AuthContextType | null>(null);

export const Web3AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [address, setAddress] = useState<string | null>(null);
    const [balance, setBalance] = useState<string | null>(null);
    const [provider, setProvider] = useState<IProvider | null>(null);
    const web3AuthContext = useWeb3AuthConnect();

    useEffect(() => {
        if (web3AuthContext.isConnected) {
            web3AuthContext.connect().then((newProvider) => {
                if (newProvider) {
                    setProvider(newProvider);
                }
            });
        } else {
            setProvider(null);
        }
    }, [web3AuthContext.isConnected]);

    useEffect(() => {
        if (provider) {
            getAddress();
            getBalance();
        }
    }, [provider]);

    const getAddress = async () => {
        try {
            if (!provider) throw new Error("Provider not initialized");
            const ethersProvider = new ethers.providers.Web3Provider(provider);
            const signer = ethersProvider.getSigner();
            const address = await signer.getAddress();
            setAddress(address);
            return address;
        } catch (error) {
            console.error("Error getting address:", error);
            return "";
        }
    };

    const getBalance = async () => {
        try {
            if (!provider) throw new Error("Provider not initialized");
            const ethersProvider = new ethers.providers.Web3Provider(provider);
            const signer = ethersProvider.getSigner();
            const address = await signer.getAddress();
            const balance = await ethersProvider.getBalance(address);
            const formattedBalance = ethers.utils.formatEther(balance);
            setBalance(formattedBalance);
            return formattedBalance;
        } catch (error) {
            console.error("Error getting balance:", error);
            return "0";
        }
    };

    return (
        <Web3AuthContext.Provider
            value={{
                ...web3AuthContext,
                provider,
                address,
                balance,
                getAddress,
                getBalance,
            }}
        >
            {children}
        </Web3AuthContext.Provider>
    );
};

export const useWeb3AuthContext = () => {
    const context = useContext(Web3AuthContext);
    if (!context) {
        throw new Error("useWeb3AuthContext must be used within a Web3AuthProvider");
    }
    return context;
}; 