import { useEffect, Suspense, lazy } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ErrorBoundary from "./components/ErrorBoundary";
import DashboardLayout from "./layouts/DashboardLayout";
import { ToastProvider } from "./shared/context/ToastContext";
import { ToastContainer } from "./shared/components/ToastContainer";
import { getPersistedAuth } from "./features/auth/authThunk";
import { setCredentials } from "./redux/auth/authSlice";
import type { AppDispatch } from "./redux/store";
import { DetailSkeleton } from "./shared/components/Skeleton";
import { PageTransition } from "./shared/components/PageTransition";
import { Loader } from "./components/Loader/Loader";

const AppRoutes = lazy(() => import("./routes/AppRoutes"));

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  useEffect(() => {
    const persisted = getPersistedAuth();
    if (persisted) {
      dispatch(setCredentials({ user: persisted.user, token: persisted.accessToken }));
    }
  }, [dispatch]);

  return (
    <Loader>
      <ErrorBoundary>
        <ToastProvider>
          <DashboardLayout>
            <Suspense fallback={<div className="p-8"><DetailSkeleton /></div>}>
              <AnimatePresence mode="wait">
                <PageTransition key={location.pathname}>
                  <AppRoutes />
                </PageTransition>
              </AnimatePresence>
            </Suspense>
          </DashboardLayout>
          <ToastContainer />
        </ToastProvider>
      </ErrorBoundary>
    </Loader>
  );
}

export default App;