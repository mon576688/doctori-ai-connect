import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/config";
import { AuthProvider } from "./hooks/useAuth";
import { LanguageProvider } from "./contexts/LanguageContext";
import { BookingProvider } from "./contexts/BookingContext";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";

// All pages lazy-loaded for code splitting
const Index = lazy(() => import('./pages/Index'));
const Chat = lazy(() => import('./pages/Chat'));
const ChatSummary = lazy(() => import('./pages/ChatSummary'));
const Doctors = lazy(() => import('./pages/Doctors'));
const DoctorProfile = lazy(() => import('./pages/DoctorProfile'));
const Medicine = lazy(() => import('./pages/Medicine'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Register = lazy(() => import('./pages/auth/Register'));
const ProviderRegister = lazy(() => import('./pages/auth/ProviderRegister'));
const Login = lazy(() => import('./pages/auth/Login'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const UserDashboard = lazy(() => import('./pages/dashboard/UserDashboard'));
const ProviderDashboard = lazy(() => import('./pages/dashboard/ProviderDashboard'));
const ProviderPendingPage = lazy(() => import('./pages/dashboard/ProviderPendingPage'));
const AdminDashboard = lazy(() => import('./pages/dashboard/AdminDashboard'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));
const BMICalculator = lazy(() => import('./pages/BMICalculator'));
const Reminders = lazy(() => import('./pages/Reminders'));
const LocationSelect = lazy(() => import('./pages/booking/LocationSelect'));
const ProviderTypeSelect = lazy(() => import('./pages/booking/ProviderTypeSelect'));
const ProviderList = lazy(() => import('./pages/booking/ProviderList'));
const ProviderProfile = lazy(() => import('./pages/booking/ProviderProfile'));
const HospitalProfile = lazy(() => import('./pages/booking/HospitalProfile'));
const DateSelect = lazy(() => import('./pages/booking/DateSelect'));
const TimeSelect = lazy(() => import('./pages/booking/TimeSelect'));
const ReviewConfirm = lazy(() => import('./pages/booking/ReviewConfirm'));
const Confirmed = lazy(() => import('./pages/booking/Confirmed'));
const BloodDonation = lazy(() => import('./pages/BloodDonation'));
const AIAnalysis = lazy(() => import('./pages/AIAnalysis'));
const WritePrescription = lazy(() => import('./pages/provider/WritePrescription'));
const MyPrescriptions = lazy(() => import('./pages/patient/MyPrescriptions'));
const TermsAndConditions = lazy(() => import('./pages/legal/TermsAndConditions'));
const PrivacyPolicy = lazy(() => import('./pages/legal/PrivacyPolicy'));
const DoctorVerificationPolicy = lazy(() => import('./pages/legal/DoctorVerificationPolicy'));
const HealthTipsBD = lazy(() => import('./pages/HealthTipsBD'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const Search = lazy(() => import('./pages/Search'));
const Install = lazy(() => import('./pages/Install'));
const DoctorDirectory = lazy(() => import('./pages/DoctorDirectory'));
const SymptomsIndex = lazy(() => import('./pages/SymptomsIndex'));
const SymptomPage = lazy(() => import('./pages/SymptomPage'));
const ConditionsIndex = lazy(() => import('./pages/ConditionsIndex'));
const ConditionPage = lazy(() => import('./pages/ConditionPage'));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
  </div>
);

const App = () => (
  <I18nextProvider i18n={i18n}>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <BookingProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Index />} />
                    <Route path="search" element={<Search />} />
                    <Route path="chat" element={<Chat />} />
                    <Route path="chat-summary" element={<ChatSummary />} />
                    <Route path="doctors" element={<Doctors />} />
                    <Route path="doctor/:id" element={<DoctorProfile />} />
                    <Route path="medicine" element={<Medicine />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="blog/:slug" element={<BlogPost />} />
                    <Route path="health-tips" element={<HealthTipsBD />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="terms" element={<TermsAndConditions />} />
                    <Route path="privacy" element={<PrivacyPolicy />} />
                    <Route path="doctor-verification" element={<DoctorVerificationPolicy />} />
                    <Route path="profile" element={<UserProfile />} />
                    <Route path="bmi-calculator" element={<BMICalculator />} />
                    <Route path="install" element={<Install />} />
                    <Route path="reminders" element={<Reminders />} />
                    <Route path="blood-donation" element={<BloodDonation />} />
                    <Route path="ai-analysis" element={<AIAnalysis />} />
                    <Route path="doctor-directory" element={<DoctorDirectory />} />
                    
                    <Route path="symptoms" element={<SymptomsIndex />} />
                    <Route path="symptoms/:slug" element={<SymptomPage />} />
                    <Route path="conditions" element={<ConditionsIndex />} />
                    <Route path="conditions/:slug" element={<ConditionPage />} />
                    
                    <Route path="dashboard" element={<Dashboard />} />
                    
                    <Route path="booking" element={<LocationSelect />} />
                    <Route path="booking/location" element={<LocationSelect />} />
                    <Route path="booking/type" element={<ProviderTypeSelect />} />
                    <Route path="booking/providers" element={<ProviderList />} />
                    <Route path="booking/provider/:id" element={<ProviderProfile />} />
                    <Route path="booking/hospital/:id" element={<HospitalProfile />} />
                    <Route path="booking/schedule/:id" element={<DateSelect />} />
                    <Route path="booking/time/:id" element={<TimeSelect />} />
                    <Route path="booking/review" element={<ReviewConfirm />} />
                    <Route path="booking/confirmed" element={<Confirmed />} />
                    
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
                    <Route path="auth/forgot-password" element={<ForgotPassword />} />
                    <Route path="auth/reset-password" element={<ResetPassword />} />
                    
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
                    <Route 
                      path="admin" 
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="provider/prescription" 
                      element={
                        <ProtectedRoute requiredRole="provider" requireApproval={true}>
                          <WritePrescription />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="provider/prescription/:appointmentId" 
                      element={
                        <ProtectedRoute requiredRole="provider" requireApproval={true}>
                          <WritePrescription />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="patient/prescriptions" 
                      element={
                        <ProtectedRoute requiredRole="user">
                          <MyPrescriptions />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="my-prescriptions" 
                      element={
                        <ProtectedRoute requiredRole="user">
                          <MyPrescriptions />
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
  </I18nextProvider>
);

export default App;
