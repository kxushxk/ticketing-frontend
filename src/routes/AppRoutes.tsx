import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Dashboard from "../pages/Dashboard";
import CreateTicket from "../pages/CreateTicket";
import TicketDetails from "../pages/TicketDetails";
import NotFound from "../pages/NotFound";
import Users from "../pages/Users";
import PendingApprovals from "../pages/PendingApprovals";
import ProtectedRoute from "./ProtectedRoute";
import { AuthorizedRoute } from "./AuthorizedRoute";
import { Permissions } from "../features/auth/permissions";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/create-ticket"
                element={
                    <AuthorizedRoute permission={Permissions.TICKETS_CREATE}>
                        <CreateTicket />
                    </AuthorizedRoute>
                }
            />
            <Route
                path="/ticket/:id"
                element={
                    <ProtectedRoute>
                        <TicketDetails />
                    </ProtectedRoute>
                }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
                path="/users"
                element={
                    <ProtectedRoute>
                        <Users />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/pending-approvals"
                element={
                    <AuthorizedRoute roles={["ADMIN"]}>
                        <PendingApprovals />
                    </AuthorizedRoute>
                }
            />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AppRoutes;
