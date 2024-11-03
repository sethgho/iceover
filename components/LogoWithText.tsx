import Logo from "./Logo.tsx";

export default function LogoWithText() {
    return (
        <div className="flex items-center gap-4">
            <Logo />
            <div class="flex flex-col items-start">
                <h1 class="text-logoBlue font-inter font-black text-2xl uppercase">
                    IceTime Alerts
                </h1>
                <span className="text-xs">
                    for The Crossover in Cedar Park, TX
                </span>
            </div>
        </div>
    );
}
