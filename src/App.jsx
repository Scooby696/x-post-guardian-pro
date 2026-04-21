import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
// Add page imports here
import Home from "./pages/Home";
import GrowthGuide from "./pages/GrowthGuide";
import ScheduledTweets from "./pages/ScheduledTweets";
import DraftTweet from "./pages/DraftTweet";
import ContentLibrary from "./pages/ContentLibrary";
import HookLibrary from "./pages/HookLibrary";
import TemplateLibrary from "./pages/TemplateLibrary";
import BrandAnalyzer from "./pages/BrandAnalyzer";
import MarketingConsultant from "./pages/MarketingConsultant";
import Dashboard from "./pages/Dashboard";
import XConnect from "./pages/XConnect";
import FeedAnalyzer from "./pages/FeedAnalyzer";
import Composer from "./pages/Composer";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import OAuthCallback from "./pages/OAuthCallback";
import VoiceController from "./components/voice/VoiceController";

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/growth-guide" element={<GrowthGuide />} />
      <Route path="/scheduled" element={<ScheduledTweets />} />
      <Route path="/draft" element={<DraftTweet />} />
      <Route path="/library" element={<ContentLibrary />} />
      <Route path="/hooks" element={<HookLibrary />} />
      <Route path="/templates" element={<TemplateLibrary />} />
      <Route path="/brand" element={<BrandAnalyzer />} />
      <Route path="/marketing" element={<MarketingConsultant />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/x-connect" element={<XConnect />} />
      <Route path="/feed-analyzer" element={<FeedAnalyzer />} />
      <Route path="/composer" element={<Composer />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/oauth-callback" element={<OAuthCallback />} />
      {/* Add your page Route elements here */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
    <VoiceController />
    </>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App