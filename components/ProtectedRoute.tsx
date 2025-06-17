import { useWeb3AuthConnect } from "@web3auth/modal/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isConnected, loading } = useWeb3AuthConnect();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isConnected) {
            router.push("/login");
        }
    }, [isConnected, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return isConnected ? <>{children}</> : null;
};

export default ProtectedRoute; 