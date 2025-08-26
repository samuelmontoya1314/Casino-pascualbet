import { cn } from "@/lib/utils";

export const PascualBetLogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 280 50" 
        className={cn("w-48 h-auto", className)} {...props}>
        <defs>
            <linearGradient id="pascual-grad-logo" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: 'hsl(207, 90%, 65%)', stopOpacity: 1}} />
            </linearGradient>
            <linearGradient id="bet-grad-logo" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: 'hsl(var(--accent))', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: 'hsl(326, 91%, 70%)', stopOpacity: 1}} />
            </linearGradient>
        </defs>
        <text 
            x="0" 
            y="40" 
            fontFamily="'Press Start 2P', system-ui" 
            fontSize="40"
            fill="url(#pascual-grad-logo)"
        >
            Pascual
            <tspan fill="url(#bet-grad-logo)">Bet</tspan>
        </text>
    </svg>
);
