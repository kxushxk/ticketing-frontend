import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const token = useSelector((state: RootState) => state.auth.token);

    if (!token) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default ProtectedRoute;