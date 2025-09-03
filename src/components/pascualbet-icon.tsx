import Image from 'next/image';
import { cn } from "@/lib/utils";

interface PascualBetIconProps {
    className?: string;
}

export const PascualBetIcon = ({ className }: PascualBetIconProps) => (
    <Image
        src="https://picsum.photos/48/48"
        alt="PascualBet Icon"
        width={48}
        height={48}
        className={cn("w-10 h-10", className)}
        data-ai-hint="lion crest"
    />
);