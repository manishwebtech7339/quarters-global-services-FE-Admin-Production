'use client';

import Image from 'next/image';
import { Loader2 } from 'lucide-react';

type AppLoaderProps = {
  label?: string;
};

const AppLoader = ({ label }: AppLoaderProps) => {
  return (
    <div className="flex min-h-[50svh] flex-col items-center justify-center gap-4 bg-background">
      <Image src="/logo.svg" alt="Site Logo" width={80} height={80} priority />
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
};

export default AppLoader;
