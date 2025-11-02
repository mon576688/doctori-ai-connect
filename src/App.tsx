import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { LanguageProvider } from "./contexts/LanguageContext";
import { BookingProvider } from "./contexts/BookingContext";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import ChatSummary from "./pages/ChatSummary";
import Doctors from "./pages/Doctors";
import DoctorProfile from "./pages/DoctorProfile";
import Medicine from "./pages/Medicine";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Register from "./pages/auth/Register";
import ProviderRegister from "./pages/auth/ProviderRegister";
import Login from "./pages/auth/Login";
import UserDashboard from "./pages/dashboard/UserDashboard";
import ProviderDashboard from "./pages/dashboard/ProviderDashboard";
import ProviderPendingPage from "./pages/dashboard/ProviderPendingPage";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import NotFound from "./pages/NotFound";
import BMICalculator from "./pages/BMICalculator";
import Reminders from "./pages/Reminders";
import LocationSelect from "./pages/booking/LocationSelect";
import ProviderTypeSelect from "./pages/booking/ProviderTypeSelect";
import ProviderList from "./pages/booking/ProviderList";
import ProviderProfile from "./pages/booking/ProviderProfile";
import DateSelect from "./pages/booking/DateSelect";
import TimeSelect from "./pages/booking/TimeSelect";
import ReviewConfirm from "./pages/booking/ReviewConfirm";
import Confirmed from "./pages/booking/Confirmed";

const queryClient = new QueryClient();

const HealthTipsBD = lazy(() => import('./pages/HealthTipsBD'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const Search = lazy(() => import('./pages/Search'));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <BookingProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Index />} />
                    <Route path="search" element={<Search />} />
                    <Route path="chat" element={<Chat />} />
                    <Route path="chat-summary" element={<ChatSummary />} />
                    <Route path="doctors" element={<Doctors />} />
                    <Route path="doctor/:id" element={<DoctorProfile />} />
                    <Route path="medicine" element={<Medicine />} />
                    {/* Blog routes */}
                    <Route path="blog" element={<Blog />}>
                      <Route path="health-tips-bd" element={<HealthTipsBD />} />
                    </Route>
                    <Route path="blog/:slug" element={<BlogPost />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="profile" element={<UserProfile />} />
                    <Route path="bmi-calculator" element={<BMICalculator />} />
                    <Route path="reminders" element={<Reminders />} />
                    
                    {/* Booking Routes */}
                    <Route path="booking/location" element={<LocationSelect />} />
                    <Route path="booking/type" element={<ProviderTypeSelect />} />
                    <Route path="booking/providers" element={<ProviderList />} />
                    <Route path="booking/provider/:id" element={<ProviderProfile />} />
                    <Route path="booking/schedule/:id" element={<DateSelect />} />
                    <Route path="booking/time/:id" element={<TimeSelect />} />
                    <Route path="booking/review" element={<ReviewConfirm />} />
                    <Route path="booking/confirmed" element={<Confirmed />} />
                    
                    {/* Authentication Routes */}
                    <Route path="auth/register/user" element={<Register />} />
                    <Route path="auth/register/provider" element={<ProviderRegister />} />
                    <Route path="auth/register/admin" element={<Register />} />
                    <Route path="register/user" element={<Register />} />
                    <Route path="register/provider" element={<ProviderRegister />} />
                    <Route path="register/admin" element={<Register />} />
                    <Route path="register" element={<Register />} />
                    <Route path="login" element={<Login />} />
                    <Route path="auth/login" element={<Login />} />
                    <Route path="login/admin" element={<Login />} />
                    
                    {/* Protected Dashboard Routes */}
                    <Route 
                      path="dashboard/user" 
                      element={
                        <ProtectedRoute requiredRole="user">
                          <UserDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="dashboard/provider" 
                      element={
                        <ProtectedRoute requiredRole="provider" requireApproval={true}>
                          <ProviderDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="dashboard/provider/pending" 
                      element={
                        <ProtectedRoute requiredRole="provider">
                          <ProviderPendingPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="dashboard/admin" 
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminDashboard />
                        </ProtectedRoute>
                      } 
                    />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </BookingProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
