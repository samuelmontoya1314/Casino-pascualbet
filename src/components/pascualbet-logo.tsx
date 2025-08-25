import { cn } from "@/lib/utils";

export const PascualBetLogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 200 50" 
        className={cn("w-40 h-auto", className)} {...props}>
        <defs>
            <linearGradient id="pascual-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: 'hsl(221, 83%, 45%)', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: 'hsl(221, 83%, 60%)', stopOpacity: 1}} />
            </linearGradient>
            <linearGradient id="bet-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: 'hsl(0, 84%, 60%)', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: 'hsl(0, 84%, 70%)', stopOpacity: 1}} />
            </linearGradient>
        </defs>
        <text 
            x="0" 
            y="35" 
            fontFamily="'Poppins', sans-serif" 
            fontSize="36" 
            fontWeight="bold"
        >
            <tspan fill="url(#pascual-grad)">Pascual</tspan>
            <tspan fill="url(#bet-grad)">Bet</tspan>
        </text>
    </svg>
);
