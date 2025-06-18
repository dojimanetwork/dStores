import { useEffect, useState } from "react";
import { useWeb3AuthContext } from "../contexts/Web3AuthContext";
import Cookies from "js-cookie";
import { ethers } from "ethers";

export const useWeb3AuthToken = () => {
    const { isConnected, provider } = useWeb3AuthContext();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const handleToken = async () => {
            if (isConnected && provider) {
                try {
                    // Get the user's address as a token
                    const ethersProvider = new ethers.providers.Web3Provider(provider);
                    const signer = ethersProvider.getSigner();
                    const address = await signer.getAddress();

                    if (address) {
                        // Store the address as a token
                        Cookies.set("web3auth_token", address, { expires: 7 }); // Token expires in 7 days
                        setIsAuthenticated(true);
                    }
                } catch (error) {
                    console.error("Error getting address:", error);
                    Cookies.remove("web3auth_token");
                    setIsAuthenticated(false);
                }
            } else {
                Cookies.remove("web3auth_token");
                setIsAuthenticated(false);
            }
        };

        handleToken();
    }, [isConnected, provider]);

    return {
        isAuthenticated,
    };
}; 