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
            {router.pathname !== "/login" && (
                <header className="w-full bg-white shadow">
                    <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-900">dStores</h1>
                        </div>
                    </div>
                </header>
            )}
            <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout; 