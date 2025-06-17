import { useWeb3AuthConnect } from "@web3auth/modal/react";
import { useWeb3AuthToken } from "../hooks/useWeb3AuthToken";
import { useRouter } from "next/router";
import { useEffect } from "react";

const LoginPage = () => {
    const { connect, isConnected, loading } = useWeb3AuthConnect();
    const { isAuthenticated } = useWeb3AuthToken();
    const router = useRouter();

    useEffect(() => {
        const handleAuth = async () => {
            if (isAuthenticated) {
                try {
                    await router.push("/dashboard");
                } catch (error) {
                    console.error("Navigation error:", error);
                }
            }
        };

        handleAuth();
    }, [isAuthenticated, router]);

    const handleConnect = async () => {
        try {
            await connect();
        } catch (error) {
            console.error("Connection error:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl w-96 border border-white/20">
                <h1 className="text-3xl font-bold text-center mb-8 text-white">Welcome to dStores</h1>

                {loading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <button
                        onClick={handleConnect}
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Connect with Web3Auth</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default LoginPage; 