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
                        <span>Connect</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default LoginPage; 