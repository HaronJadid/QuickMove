import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./Authprovider";


export default function Privateroute({ allowedRoles }) {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to='/login' />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to home if user doesn't have required role
        return <Navigate to='/' />;
    }

    return <Outlet />;
}
