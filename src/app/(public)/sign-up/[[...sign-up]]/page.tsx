import { SignUp } from "@clerk/nextjs";
import { Logo } from "@/components/ui/logo";
import styles from "../../landing.module.css";

const appearance = {
  variables: { colorPrimary: "#f26722", colorForeground: "#171714", colorMutedForeground: "#68635d", colorBackground: "#ffffff", colorInputBackground: "#ffffff", colorInputText: "#171714", borderRadius: "0.75rem" },
  elements: {
    rootBox: "w-full", cardBox: "w-full shadow-none", card: "w-full shadow-none border border-[#e9e3dc] rounded-2xl",
    headerTitle: "text-2xl font-semibold tracking-tight", headerSubtitle: "text-sm",
    socialButtonsBlockButton: "min-h-11 border border-[#e9e3dc] rounded-xl hover:bg-[#f7f1e9] transition-colors",
    formFieldInput: "min-h-11 rounded-xl border border-[#e9e3dc] focus:border-[#f26722] focus:ring-2 focus:ring-[#f26722]/20",
    formButtonPrimary: "min-h-11 rounded-xl bg-[#f26722] hover:bg-[#d94d0c] shadow-none",
    footerActionLink: "text-[#d94d0c] hover:text-[#b83f08]", identityPreviewEditButton: "text-[#d94d0c]",
    dividerLine: "bg-[#e9e3dc]", dividerText: "text-[#8a837c]",
  },
};

function Brand() { return <Logo className={styles.brand} textClassName={styles.brandText} />; }

export default function SignUpPage() {
  return <div className={styles.authPage}><aside className={styles.authBrandPanel}><Brand /><div className={styles.authLogoArt} aria-hidden="true" /></aside><main className={styles.authFormPanel}><div className={styles.authFormWrap}><div className={styles.authMobileBrand}><Brand /></div><SignUp appearance={appearance} /></div></main></div>;
}
