import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative z-10 w-full bg-white/5 backdrop-blur-2xl border-t border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                <p className="text-sm text-gray-400">
                    © {currentYear} BestPickr.store Todos los derechos reservados.
                </p>
                <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
                    <Link
                        href="/politica-privacidad"
                        className="text-gray-400 hover:text-pink-400 transition duration-200"
                    >
                        Política de Privacidad
                    </Link>
                    <span className="hidden md:inline-block text-gray-500">|</span>
                    <Link
                        href="/terminos-servicio"
                        className="text-gray-400 hover:text-pink-400 transition duration-200"
                    >
                        Términos de Servicio
                    </Link>
                </div>
            </div>
        </footer>
    );
}
