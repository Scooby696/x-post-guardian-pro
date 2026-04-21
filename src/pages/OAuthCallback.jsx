import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { CheckCircle, XCircle, Loader2, Shield } from "lucide-react";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function handleCallback() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const state = params.get("state");
      const errorParam = params.get("error");

      if (errorParam) {
        setStatus("error");
        setError(errorParam === "access_denied" ? "You declined the X authorization request." : errorParam);
        return;
      }

      if (!code) {
        setStatus("error");
        setError("No authorization code received from X.");
        return;
      }

      // Retrieve stored verifier and state from sessionStorage
      const storedVerifier = sessionStorage.getItem("twitter_code_verifier");
      const storedState = sessionStorage.getItem("twitter_oauth_state");

      if (!storedVerifier) {
        setStatus("error");
        setError("OAuth session expired or missing. Please try again.");
        return;
      }

      if (storedState && storedState !== state) {
        setStatus("error");
        setError("State mismatch — possible CSRF attack. Please try again.");
        return;
      }

      sessionStorage.removeItem("twitter_code_verifier");
      sessionStorage.removeItem("twitter_oauth_state");

      try {
        const res = await base44.functions.invoke("twitterAuthCallback", {
          code,
          codeVerifier: storedVerifier,
        });

        if (res.data?.success) {
          setProfile(res.data.profile);
          setStatus("success");

          // Also update localStorage profile for XConnect page
          const xUser = res.data.profile;
          const existing = JSON.parse(localStorage.getItem("xpg_profile") || "{}");
          localStorage.setItem("xpg_profile", JSON.stringify({
            ...existing,
            display_name: xUser.name,
            handle: xUser.username,
            bio: xUser.description || existing.bio || "",
            followers: xUser.public_metrics?.followers_count?.toLocaleString() || existing.followers || "",
            twitter_connected: true,
          }));

          setTimeout(() => navigate("/dashboard"), 2500);
        } else {
          setStatus("error");
          setError(res.data?.error || "Failed to complete X authorization.");
        }
      } catch (err) {
        setStatus("error");
        setError(err.message || "An unexpected error occurred.");
      }
    }

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen bg-background font-inter flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center space-y-5"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-xblue" />
          <span className="font-black text-white">X Post Guardian Pro</span>
        </div>

        {status === "loading" && (
          <>
            <div className="w-16 h-16 rounded-full bg-xblue/10 border border-xblue/30 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-xblue animate-spin" />
            </div>
            <h2 className="text-xl font-black text-white">Connecting your X account…</h2>
            <p className="text-muted-foreground text-sm">Exchanging tokens and fetching your profile.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-xl font-black text-white">
              {profile ? `@${profile.username} connected!` : "X Account Connected!"}
            </h2>
            <p className="text-muted-foreground text-sm">Redirecting you to the dashboard…</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-black text-white">Connection Failed</h2>
            <p className="text-red-300 text-sm">{error}</p>
            <div className="flex gap-3 justify-center pt-2">
              <Link to="/x-connect"
                className="bg-xblue text-black font-black px-5 py-2.5 rounded-full hover:bg-xblue/90 transition-all text-sm">
                Try Again
              </Link>
              <Link to="/dashboard"
                className="border border-border text-muted-foreground font-bold px-5 py-2.5 rounded-full hover:text-white transition-all text-sm">
                Dashboard
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}