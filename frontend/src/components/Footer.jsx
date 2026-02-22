export default function Footer() {
    return (
        <footer className="mt-auto border-t border-white/10 bg-dark-900/50 backdrop-blur-md py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">

                <div className="text-center md:text-left">
                    <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                        AI TRANS GLOBAL <span className="text-accent">LIMITED</span>
                    </h3>
                    <p className="text-sm text-slate-400">
                        © {new Date().getFullYear()} AI TRANS GLOBAL LIMITED. All rights reserved.
                    </p>
                </div>

                <div className="flex gap-6 text-sm text-slate-400 items-center">
                    <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
                    <a href="tel:+233246267375" className="hover:text-accent transition-colors font-semibold flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                        +233 24 626 7375
                    </a>
                </div>

            </div>
        </footer>
    );
}
