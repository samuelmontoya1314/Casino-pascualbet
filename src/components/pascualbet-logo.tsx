import { cn } from "@/lib/utils";

export const PascualBetLogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 280 60" 
        className={cn("w-48 h-auto", className)} {...props}>
        <defs>
            <linearGradient id="pascual-grad-logo" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: 'hsl(221, 83%, 45%)', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: 'hsl(221, 83%, 60%)', stopOpacity: 1}} />
            </linearGradient>
            <linearGradient id="bet-grad-logo" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: 'hsl(0, 84%, 60%)', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: 'hsl(0, 84%, 70%)', stopOpacity: 1}} />
            </linearGradient>
        </defs>
        <text 
            x="0" 
            y="40" 
            fontFamily="'Poppins', sans-serif" 
            fontSize="48" 
            fontWeight="bold"
            fill="url(#pascual-grad-logo)"
        >
            Pascual
            <tspan fill="url(#bet-grad-logo)">Bet</tspan>
        </text>
        <text
            x="0"
            y="58"
            fontFamily="'Poppins', sans-serif"
            fontSize="10"
            fontWeight="600"
            fill="hsl(var(--muted-foreground))"
            letterSpacing="0.1em"
        >
            YOUR WINNING DESTINATION
        </text>
    </svg>
);
