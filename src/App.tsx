import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Dashboard from "./components/Pages/Dashboard";
import Robots from "./components/Pages/Robots";
import BlogPosts from "./components/Pages/BlogPosts";
import Leads from "./components/Pages/Leads";
import Testimonials from "./components/Pages/Testimonials/testimonials";
import AdminLayout from "./components/Layout/AdminLayout";
import Banners from "./components/Pages/Banner/Banner";
import BlogPost from "./components/Pages/BlogPost/BlogPost";
import Research from "./components/Pages/Research/Research";
import Login from "./components/Pages/Login/Login";
import { AuthProvider, useAuth } from "./components/Pages/Authcontext/Authcontext";
import ForgotPassword from "./components/Pages/Forgotpassword/Forgotpassword";
import Casestudy from "./components/Pages/Casestudy/Casestudy";
import Behindscenes from "./components/Pages/Behindscenes/Behindscenes";
import CurrentProjects from "./components/Pages/Current_project/Current_project";
import Rent_Robot from "./components/Pages/Rent_Robot/Rent_Robot";
import Buy_Quote from "./components/Pages/Buy_Quote/Buy_Quote";

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public - Login */}
          <Route path="/login" element={<LoginWrapper />} />
          <Route
            path="/forgot-password"
            element={<ForgotPassword onBack={() => window.history.back()} />}
          />

          {/* Protected - Admin Panel */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route
                      path="/"
                      element={<Navigate to="/dashboard" replace />}
                    />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/robots" element={<Robots />} />
                    <Route path="/blog" element={<BlogPost />} />
                    <Route path="/research" element={<Research />} />
                    <Route path="/banners" element={<Banners />} />
                    <Route path="/testimonials" element={<Testimonials />} />
                    <Route path="/leads" element={<Leads />} />

                    <Route path="/Casestudy" element={<Casestudy />} />
                    <Route path="/Behindscenes" element={<Behindscenes />} />
                        <Route path="/CurrentProjects" element={<CurrentProjects />} />
                        <Route path="/Rent_Robot" element={<Rent_Robot />} />
                        <Route path="/Buy_Robot" element={<Buy_Quote />} />




                    <Route
                      path="/partners"
                      element={
                        <div className="text-center py-12">
                          <div className="text-gray-500">🤝</div>
                          <h3 className="mt-2 text-lg font-medium text-gray-900">
                            Partners & Certifications
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Coming soon - Manage partners and certifications
                          </p>
                        </div>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <div className="text-center py-12">
                          <div className="text-gray-500">⚙️</div>
                          <h3 className="mt-2 text-lg font-medium text-gray-900">
                            Settings
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Coming soon - Admin settings and configuration
                          </p>
                        </div>
                      }
                    />
                    <Route
                      path="*"
                      element={<Navigate to="/dashboard" replace />}
                    />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

function LoginWrapper() {
  const navigate = useNavigate();
  return <Login onForgotPassword={() => navigate("/forgot-password")} />;
}
