import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-xblue" />
          <span className="font-black text-white">X Rule Guardian</span>
          <span className="text-muted-foreground text-sm">v2.4</span>
        </div>
        <p className="text-muted-foreground text-sm text-center">
          Not affiliated with X Corp. Rules based on publicly available X/Twitter Community Guidelines.
        </p>
        <p className="text-muted-foreground text-sm">© 2026 X Rule Guardian</p>
      </div>
    </footer>
  );
}