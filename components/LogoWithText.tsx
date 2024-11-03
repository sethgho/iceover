import Logo from "./Logo.tsx";

export default function LogoWithText() {
    return (
        <div className="flex items-center gap-4">
            <Logo />
            <h1 class="text-logoBlue font-inter font-black text-2xl uppercase">
                IceTime Alerts
            </h1>
        </div>
    );
}
