import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background font-inter">
      <div className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-xblue" />
            <span className="font-black text-white">Privacy Policy</span>
          </div>
          <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm">Last updated: April 21, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-sm leading-relaxed text-muted-foreground">

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white">1. Introduction</h2>
            <p>X Post Guardian Pro ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our Service.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white">2. Information We Collect</h2>
            <p><span className="text-white font-semibold">Information you provide:</span> Profile details you enter (display name, X handle, niche, bio, follower count), tweet drafts submitted for analysis, and content submitted to AI tools.</p>
            <p><span className="text-white font-semibold">Automatically collected:</span> Basic usage data such as features accessed and error logs to improve the Service.</p>
            <p><span className="text-white font-semibold">Local storage:</span> Profile settings and scheduled tweet drafts are stored locally in your browser and are not transmitted to our servers unless you use a cloud feature.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white">3. X / Twitter Account Data</h2>
            <p>If you connect your X account or provide X credentials, we access only the data necessary to provide the requested features (e.g., reading your feed for analysis or posting on your behalf). We do not store your X password. OAuth tokens are stored securely and used only to fulfill your requests. You can revoke access at any time from your X account settings.</p>
            <p>Our use of X API data complies with X's <a href="https://developer.twitter.com/en/developer-terms/agreement-and-policy" target="_blank" rel="noopener noreferrer" className="text-xblue underline">Developer Agreement and Policy</a>.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white">4. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>To provide, operate, and improve the Service</li>
              <li>To personalize AI-generated content recommendations</li>
              <li>To analyze tweets for X policy compliance</li>
              <li>To schedule and manage your content queue</li>
              <li>To respond to your requests and provide support</li>
            </ul>
            <p>We do not sell your personal data to third parties.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white">5. AI Processing</h2>
            <p>Content you submit (tweet drafts, feed data, brand information) is processed by AI models to generate analysis and suggestions. This content may be sent to third-party AI providers under their respective privacy policies. We do not use your content to train AI models without your explicit consent.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white">6. Data Sharing</h2>
            <p>We may share data with:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><span className="text-white font-semibold">AI providers</span> — to process content analysis requests</li>
              <li><span className="text-white font-semibold">X Corp</span> — when using X API features, subject to X's privacy policy</li>
              <li><span className="text-white font-semibold">Legal authorities</span> — if required by law</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white">7. Data Retention</h2>
            <p>Profile data stored locally in your browser persists until you clear it or disconnect your profile. Server-side data is retained as long as your account is active. You may request deletion of your data at any time.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white">8. Security</h2>
            <p>We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure. We encourage you to use strong passwords and review your connected app permissions regularly.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white">9. Your Rights</h2>
            <p>Depending on your location, you may have rights to access, correct, delete, or export your personal data. To exercise these rights, contact us through the app. We will respond within 30 days.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white">10. Children's Privacy</h2>
            <p>The Service is not intended for users under the age of 13. We do not knowingly collect data from children.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white">11. Changes to This Policy</h2>
            <p>We may update this Privacy Policy periodically. We will notify users of significant changes by updating the date at the top of this page. Continued use of the Service constitutes acceptance of the updated policy.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white">12. Contact</h2>
            <p>For privacy-related inquiries or data requests, please contact us through the app.</p>
          </section>
        </div>

        <div className="border-t border-border pt-6 flex gap-4 text-sm">
          <Link to="/terms" className="text-xblue hover:text-xblue/80 transition-colors">Terms of Service →</Link>
          <Link to="/" className="text-muted-foreground hover:text-white transition-colors">Home</Link>
        </div>
      </main>
    </div>
  );
}