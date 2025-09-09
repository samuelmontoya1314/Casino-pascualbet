'use client';

import Image from 'next/image';
import { cn } from "@/lib/utils";

interface PascualBetLogoProps {
    className?: string;
}

export const PascualBetLogo = ({ className }: PascualBetLogoProps) => (
    <Image
        src="https://picsum.photos/280/150"
        alt="PascualBet Logo"
        width={280}
        height={150}
        className={cn("w-48 h-auto", className)}
        data-ai-hint="lion logo"
    />
);