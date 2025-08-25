import { cn } from "@/lib/utils";

export const PascualBetIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 100 125" 
        className={cn("w-10 h-auto", className)} {...props}>
        <defs>
            <linearGradient id="pascual-icon-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f5e18c" />
                <stop offset="100%" stopColor="#c5a242" />
            </linearGradient>
        </defs>
        <path fill="#021a6e" d="M50 0C25 25 0 50 0 75c0 25 25 25 50 25s50 0 50-25C100 50 75 25 50 0z" />
        <path fill="#2c72ff" d="M50 0v125c25 0 50-25 50-50S75 25 50 0z" />
        <path fill="#b90000" d="M50 0C25 25 0 50 0 75c0 12.5 6.25 18.75 12.5 25C25 87.5 37.5 75 50 62.5V0z" />
        <path fill="#008631" d="M50 125c-25 0-50-25-50-50 0-12.5 6.25-18.75 12.5-25C25 62.5 37.5 75 50 87.5V125z" />
        <path fill="url(#pascual-icon-gold)" d="M50 12.5c-6.25 6.25-12.5 12.5-18.75 18.75-6.25 6.25-12.5 12.5-12.5 25s6.25 18.75 12.5 25c6.25 6.25 12.5 12.5 18.75 18.75 6.25-6.25 12.5-12.5 18.75-18.75 6.25-6.25 12.5-12.5 12.5-25s-6.25-18.75-12.5-25C62.5 25 56.25 18.75 50 12.5z" />
    </svg>
);
