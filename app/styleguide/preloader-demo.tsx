"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Preloader } from "@/components/ui/preloader";

/** Re-mounts the inline preloader so its animation can be watched again. */
export function PreloaderDemo() {
  const [run, setRun] = useState(0);
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="relative w-full overflow-hidden">
        {/* The finished state: what sits underneath once the preloader fades. */}
        <p className="absolute inset-0 flex items-center justify-center text-fg-muted">
          Page content
        </p>
        <Preloader key={run} id={`preloader-demo-${run}`} inline />
      </div>
      <Button variant="link" icon="arrow" onClick={() => setRun((n) => n + 1)}>
        Replay preloader
      </Button>
    </div>
  );
}
