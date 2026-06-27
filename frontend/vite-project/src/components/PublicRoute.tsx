import { Navigate } from "react-router-dom";

interface PublicRouteProps {
    children: React.ReactNode;
}

export function PublicRoute({
    children,
}: PublicRouteProps) {

    const token = sessionStorage.getItem("token");

    if (token) {
        return <Navigate to="/home" replace />;
    }

    return <>{children}</>;
}