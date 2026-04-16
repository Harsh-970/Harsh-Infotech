import { createContext, useCallback, useContext, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { BriefcaseBusiness, Lock, Mail, UserRound, X, Loader2 } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";

type LoginMethod = "Email" | "Google";
type AuthAction = "navigate" | "whatsapp" | "email";

type AuthSession = {
  email: string;
  companyName: string;
  jobRole?: string;
  loginMethod: LoginMethod;
  timestamp: string;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  openAuthGate: (onSuccess?: () => void) => void;
  session: AuthSession | null;
};

type DeferredAction = {
  type: AuthAction;
  href?: string;
  target?: string | null;
  emailTo?: string;
  phone?: string;
};

const PERSIST_KEY = "harsh_infotech_auth_persistent";
const SESSION_KEY = "harsh_infotech_auth_session";
const FALLBACK_LOG_KEY = "harsh_infotech_auth_logs";
const LAST_SERVICE_KEY = "harsh_infotech_last_service";

const DISPOSABLE_DOMAINS = new Set([
  "10minutemail.com",
  "guerrillamail.com",
  "mailinator.com",
  "temp-mail.org",
  "tempmail.com",
  "yopmail.com",
  "trashmail.com",
  "fakeinbox.com",
  "sharklasers.com",
  "getnada.com",
  "maildrop.cc",
  "dispostable.com",
  "throwawaymail.com",
  "mailcatch.com",
  "dropmail.me",
  "tempmail.net",
  "mohmal.com",
  "ethereal.email",
]);

const AuthContext = createContext<AuthContextValue | null>(null);

const parseSession = (raw: string | null): AuthSession | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.email || !parsed?.companyName || !parsed?.loginMethod || !parsed?.timestamp) return null;
    return parsed;
  } catch {
    return null;
  }
};

const isValidBusinessEmail = (email: string) => {
  const normalized = email.trim().toLowerCase();
  const basicPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicPattern.test(normalized)) return false;
  const domain = normalized.split("@")[1] ?? "";
  if (!domain || DISPOSABLE_DOMAINS.has(domain)) return false;
  if (domain.endsWith(".invalid") || domain.endsWith(".test")) return false;
  return true;
};

const persistSession = (session: AuthSession, remember: boolean) => {
  const value = JSON.stringify(session);
  if (remember) {
    localStorage.setItem(PERSIST_KEY, value);
    sessionStorage.removeItem(SESSION_KEY);
    return;
  }
  sessionStorage.setItem(SESSION_KEY, value);
  localStorage.removeItem(PERSIST_KEY);
};

const createUserName = (email: string) => {
  const local = (email.split("@")[0] ?? "User").replace(/[._-]+/g, " ").trim();
  if (!local) return "User";
  return local
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const buildWhatsAppMessage = (session: AuthSession, serviceName: string | null) => {
  const userName = createUserName(session.email);
  if (serviceName) {
    return `Hello, I am interested in ${serviceName}.\nName: ${userName}\nCompany: ${session.companyName}`;
  }
  return "Hello, I am interested in Harsh Infotech Consultancy Services.";
};

const buildMailtoLink = (session: AuthSession, emailTo: string) => {
  const userName = createUserName(session.email);
  const subject = encodeURIComponent("Inquiry");
  const body = encodeURIComponent(`Hello,\n\nI am interested in your services.\n\nName: ${userName}\nCompany: ${session.companyName}`);
  return `mailto:${emailTo}?subject=${subject}&body=${body}`;
};

const logAuthRecord = async (session: AuthSession) => {
  try {
    const response = await fetch("/api/auth-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(session),
    });
    if (!response.ok) throw new Error("Failed to store auth log.");
  } catch {
    const existing = localStorage.getItem(FALLBACK_LOG_KEY);
    const parsed = existing ? JSON.parse(existing) as AuthSession[] : [];
    const lowerEmail = session.email.toLowerCase();
    const index = parsed.findIndex((entry) => entry.email.toLowerCase() === lowerEmail);
    if (index >= 0) {
      parsed[index] = session;
    } else {
      parsed.push(session);
    }
    localStorage.setItem(FALLBACK_LOG_KEY, JSON.stringify(parsed));
  }
};

const GoogleBadge = () => (
  <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[13px] font-black leading-none">
    <span className="absolute inset-0 rounded-full border border-white/70" />
    <span className="bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#FBBC05] bg-clip-text text-transparent">G</span>
  </span>
);

const AuthModal = ({
  isOpen,
  onClose,
  onSignIn,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (email: string, companyName: string, jobRole: string, method: LoginMethod, remember: boolean) => void;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [socialActive, setSocialActive] = useState<LoginMethod | null>(null);
  const [isProcessingGoogle, setIsProcessingGoogle] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setErrorMessage("");
      setSocialActive(null);
      setIsProcessingGoogle(false);
    }
  }, [isOpen]);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(res => res.json());

        if (userInfo.email) {
          setEmail(userInfo.email);
          setSocialActive("Google");
          setErrorMessage("");
        } else {
          setErrorMessage("Failed to retrieve Google email.");
        }
      } catch (err) {
        setErrorMessage("Error fetching Google profile.");
      } finally {
        setIsProcessingGoogle(false);
      }
    },
    onError: () => {
      setErrorMessage("Google authentication failed");
      setIsProcessingGoogle(false);
    },
  });

  const handleGoogleClick = () => {
    setIsProcessingGoogle(true);
    setErrorMessage("");
    googleLogin();
  };

  if (!isOpen) return null;

  const submitEmailLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) { setErrorMessage("Email is required"); return; }
    if (!isValidBusinessEmail(email)) { setErrorMessage("Please enter a valid business email"); return; }
    if (!password.trim()) { setErrorMessage("Password is required"); return; }
    if (password.length < 6) { setErrorMessage("Password must be at least 6 characters"); return; }
    if (!companyName.trim()) { setErrorMessage("Company name is required"); return; }

    setErrorMessage("");
    onSignIn(email.trim(), companyName.trim(), jobRole.trim(), "Email", rememberMe);
  };

  const submitSocialComplete = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) { setErrorMessage("Email is required"); return; }
    if (!isValidBusinessEmail(email)) { setErrorMessage("Please enter a valid business email"); return; }
    if (!companyName.trim()) { setErrorMessage("Company name is required"); return; }

    setErrorMessage("");
    onSignIn(email.trim(), companyName.trim(), jobRole.trim(), socialActive!, rememberMe);
  };

  const handleSubmit = socialActive ? submitSocialComplete : submitEmailLogin;

  return (
    <div className="fixed inset-0 z-[260] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-[420px] max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full rounded-[24px] border border-white/35 bg-[linear-gradient(160deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.08)_30%,rgba(255,255,255,0.06)_100%)] p-5 md:p-6 backdrop-blur-3xl shadow-[0_0_46px_rgba(255,255,255,0.16)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-white/70 hover:text-white transition-colors z-10"
          aria-label="Close signup modal"
        >
          <X className="w-5 h-5" />
        </button>

        {socialActive && (
          <button
             type="button"
             onClick={() => { setSocialActive(null); setErrorMessage(""); }}
             className="absolute left-6 top-6 text-sm font-medium text-white/70 hover:text-white transition-colors z-10"
          >
            &larr; Back
          </button>
        )}

        <h2 className="text-2xl font-semibold text-center mb-1 mt-6">
          {socialActive ? `Continue with ${socialActive}` : "Sign In"}
        </h2>
        {socialActive && (
          <p className="text-center text-[#D4AF37] text-xs font-bold mb-4 tracking-wider uppercase">
            Secure Sign In
          </p>
        )}
        {!socialActive && <div className="h-4 w-full" />}
        <div className="h-px w-full bg-white/20 mb-5" />

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-white/90 mb-1.5">Email</label>
            <div className="flex items-center gap-3 rounded-xl border border-white/35 bg-white/5 px-4 py-3">
              <Mail className="w-5 h-5 text-white/70" />
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                className={`w-full bg-transparent text-base placeholder:text-white/45 focus:outline-none`}
              />
            </div>
          </div>

          {!socialActive && (
            <div>
              <label className="block text-sm text-white/90 mb-1.5">Password</label>
              <div className="flex items-center gap-3 rounded-xl border border-white/35 bg-white/5 px-3 py-2.5">
                <Lock className="w-5 h-5 text-white/70" />
                <input
                  type="password"
                  required={!socialActive}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-transparent text-base placeholder:text-white/45 focus:outline-none"
                />
              </div>
            </div>
          )}

          {!socialActive && (
            <div className="flex items-center justify-between text-sm text-white/80 py-1">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-white/40 bg-transparent accent-[#D4AF37]"
                />
                Remember me
              </label>
              <a href="#" className="underline underline-offset-2 text-white/85 hover:text-white" data-auth-skip="true">
                Forgot password?
              </a>
            </div>
          )}

          <div>
            <label className="block text-sm text-white/90 mb-1.5 flex items-center gap-2">Company Name <span className="text-[#D4AF37] text-xs font-bold">*MANDATORY</span></label>
            <div className="flex items-center gap-3 rounded-xl border border-white/35 bg-white/5 px-3 py-2.5">
              <BriefcaseBusiness className="w-5 h-5 text-white/70" />
              <input
                type="text"
                required
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                placeholder="Enter your company name"
                className="w-full bg-transparent text-base placeholder:text-white/45 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/90 mb-1.5">Job Role (Optional)</label>
            <div className="flex items-center gap-3 rounded-xl border border-white/35 bg-white/5 px-3 py-2.5">
              <UserRound className="w-5 h-5 text-white/70" />
              <input
                type="text"
                value={jobRole}
                onChange={(event) => setJobRole(event.target.value)}
                placeholder="Enter your job role (optional)"
                className="w-full bg-transparent text-base placeholder:text-white/45 focus:outline-none"
              />
            </div>
          </div>

          {socialActive && (
            <div className="flex items-center justify-between text-sm text-white/80 mt-1">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-white/40 bg-transparent accent-[#D4AF37]"
                />
                Remember me
              </label>
            </div>
          )}

          {errorMessage && <p className="text-sm text-red-300 bg-red-500/10 p-2 rounded-lg border border-red-500/20">{errorMessage}</p>}

          <button
            type="submit"
            className="w-full mt-2 rounded-xl bg-gradient-to-b from-[#fff5dd] to-[#f5e8c0] py-3 text-base font-semibold text-black shadow-[0_0_24px_rgba(212,175,55,0.35)] transition hover:brightness-105"
          >
            {socialActive ? `Complete ${socialActive} Sign In` : "Sign In"}
          </button>
        </form>

        {!socialActive && (
          <div className="mt-5 space-y-3">
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={isProcessingGoogle}
              className="w-full rounded-xl border border-white/35 bg-black/35 py-3 text-sm font-semibold text-white transition hover:bg-black/50 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessingGoogle ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleBadge />} 
              {isProcessingGoogle ? "Connecting to Google..." : "Continue with Google"}
            </button>
          </div>
        )}

        {!socialActive && (
          <p className="mt-5 text-center text-sm md:text-base text-white/80">
            Don&apos;t have an account? <span className="text-white font-medium cursor-pointer hover:underline">Sign Up</span>
          </p>
        )}
      </div>
    </div>
  );
};

const createDeferredAction = (element: HTMLElement): DeferredAction => {
  const action = element.getAttribute("data-auth-action");
  if (action === "whatsapp") {
    return {
      type: "whatsapp",
      phone: element.getAttribute("data-phone") ?? "917558604483",
    };
  }

  if (action === "email") {
    return {
      type: "email",
      emailTo: element.getAttribute("data-email") ?? "harshinfotech2005@gmail.com",
    };
  }

  return {
    type: "navigate",
    href: element.getAttribute("href") ?? element.getAttribute("data-auth-href") ?? undefined,
    target: element.getAttribute("target"),
  };
};

const performDeferredAction = (action: DeferredAction, session: AuthSession | null) => {
  if (action.type === "whatsapp") {
    if (!session) return;
    const selectedService = sessionStorage.getItem(LAST_SERVICE_KEY);
    const message = buildWhatsAppMessage(session, selectedService);
    const url = `https://wa.me/${action.phone ?? "917558604483"}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }

  if (action.type === "email") {
    if (!session) return;
    const mailtoLink = buildMailtoLink(session, action.emailTo ?? "harshinfotech2005@gmail.com");
    window.location.href = mailtoLink;
    return;
  }

  if (!action.href) return;
  if (action.href.startsWith("#")) {
    window.location.hash = action.href.slice(1);
    return;
  }
  if (action.target === "_blank") {
    window.open(action.href, "_blank", "noopener,noreferrer");
    return;
  }
  window.location.assign(action.href);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<DeferredAction | null>(null);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  useEffect(() => {
    const persisted = parseSession(localStorage.getItem(PERSIST_KEY));
    if (persisted) {
      setSession(persisted);
      return;
    }
    const tabSession = parseSession(sessionStorage.getItem(SESSION_KEY));
    if (tabSession) setSession(tabSession);
  }, []);

  const openAuthGate = useCallback((onSuccess?: () => void) => {
    if (session) {
      if (onSuccess) onSuccess();
      return;
    }
    setPendingCallback(() => onSuccess ?? null);
    setIsModalOpen(true);
  }, [session]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setPendingAction(null);
    setPendingCallback(null);
  }, []);

  const completeSignIn = useCallback(async (email: string, companyName: string, jobRole: string, method: LoginMethod, remember: boolean) => {
    const created: AuthSession = {
      email,
      companyName,
      jobRole: jobRole || "",
      loginMethod: method,
      timestamp: new Date().toISOString(),
    };

    persistSession(created, remember);
    setSession(created);
    setIsModalOpen(false);

    await logAuthRecord(created);

    const deferred = pendingAction;
    const deferredCallback = pendingCallback;
    setPendingAction(null);
    setPendingCallback(null);
    if (deferred) {
      performDeferredAction(deferred, created);
    }
    if (deferredCallback) {
      deferredCallback();
    }
  }, [pendingAction, pendingCallback]);

  useEffect(() => {
    const handleGatedClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("[data-auth-skip='true']")) return;

      const gatedElement = target.closest("[data-auth-gated='true']") as HTMLElement | null;
      if (!gatedElement) return;

      const serviceName = gatedElement.getAttribute("data-service-name");
      if (serviceName?.trim()) {
        sessionStorage.setItem(LAST_SERVICE_KEY, serviceName.trim());
      }

      const deferredAction = createDeferredAction(gatedElement);
      const requiresAuth = gatedElement.getAttribute("data-auth-required") !== "false";

      if (!requiresAuth) return;

      event.preventDefault();
      event.stopPropagation();

      if (session) {
        performDeferredAction(deferredAction, session);
        return;
      }

      setPendingAction(deferredAction);
      setIsModalOpen(true);
    };

    document.addEventListener("click", handleGatedClick, true);
    return () => document.removeEventListener("click", handleGatedClick, true);
  }, [session]);

  const contextValue = useMemo<AuthContextValue>(() => ({
    isAuthenticated: Boolean(session),
    openAuthGate,
    session,
  }), [openAuthGate, session]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      <AuthModal isOpen={isModalOpen} onClose={closeModal} onSignIn={completeSignIn} />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
};
