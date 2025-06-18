import { useWeb3AuthConnect } from "@web3auth/modal/react";
import { useWeb3AuthToken } from "../hooks/useWeb3AuthToken";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { isConnected } = useWeb3AuthConnect();
    const { isAuthenticated } = useWeb3AuthToken();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated && router.pathname !== "/login") {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated && router.pathname !== "/login") {
        return null;
    }

    return (
        <div className="w-full min-h-screen bg-gray-100">
            <main className="w-full">
                {children}
            </main>
        </div>
    );
};

export default Layout; 