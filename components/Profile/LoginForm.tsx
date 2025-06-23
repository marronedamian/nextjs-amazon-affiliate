
import { signIn } from "next-auth/react";
import LiquidGlassWrapper from "@/components/Shared/LiquidGlassWrapper";
import Background from "../Shared/Background";

const LoginForm = ({ t }: { t: any }) => {
    return (
        <Background>
            <div className="relative flex items-center justify-center min-h-screen px-4">
                <LiquidGlassWrapper className="relative max-w-md w-full px-6 py-12 border border-white/10 rounded-3xl shadow-xl text-center">
                    <h1 className="text-3xl font-bold mb-4">{t("login.welcome")}</h1>
                    <p className="text-sm text-gray-300 mb-8">{t("login.title")}</p>

                    <div className="bg-white/5 backdrop-blur-sm rounded-full border border-white/10 shadow-sm inline-block">
                        <button
                            onClick={() =>
                                signIn("google", { callbackUrl: "/" })
                            }
                            className="cursor-pointer px-6 py-3 rounded-full text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                        >
                            {t("login.signInWithGoogle")}
                        </button>
                    </div>
                </LiquidGlassWrapper>
            </div>
        </Background>
    );
}

export default LoginForm;