import * as React from "react"
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const ImageGeneration = ({ children }) => {
  const [progress, setProgress] = React.useState(0);
  const [loadingState, setLoadingState] = React.useState("starting");
  const duration = 5000;

  React.useEffect(() => {
    const startingTimeout = setTimeout(() => {
      setLoadingState("generating");

      const startTime = Date.now();

      const interval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const progressPercentage = Math.min(
          100,
          (elapsedTime / duration) * 100
        );

        setProgress(progressPercentage);

        if (progressPercentage >= 100) {
          clearInterval(interval);
          setLoadingState("completed");
        }
      }, 16);

      return () => clearInterval(interval);
    }, 1000);

    return () => clearTimeout(startingTimeout);
  }, [duration]);

  return (
    <div className="flex flex-col gap-4">
      <motion.span
        className="bg-[linear-gradient(110deg,rgba(255,255,255,0.5),35%,rgba(255,255,255,1),50%,rgba(255,255,255,0.5),75%,rgba(255,255,255,0.5))] bg-[length:200%_100%] bg-clip-text text-transparent text-lg font-medium text-center"
        initial={{ backgroundPosition: "200% 0" }}
        animate={{
          backgroundPosition:
            loadingState === "completed" ? "0% 0" : "-200% 0",
        }}
        transition={{
          repeat: loadingState === "completed" ? 0 : Infinity,
          duration: 3,
          ease: "linear",
        }}
      >
        {loadingState === "starting" && "Initializing AI..."}
        {loadingState === "generating" && "Generating your invoice..."}
        {loadingState === "completed" && "Invoice created successfully!"}
      </motion.span>
      <div className="relative rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm overflow-hidden">
        {children}
        <motion.div
          className="absolute w-full h-[125%] -top-[25%] pointer-events-none backdrop-blur-3xl"
          initial={false}
          animate={{
            clipPath: `polygon(0 ${progress}%, 100% ${progress}%, 100% 100%, 0 100%)`,
            opacity: loadingState === "completed" ? 0 : 1,
          }}
          style={{
            clipPath: `polygon(0 ${progress}%, 100% ${progress}%, 100% 100%, 0 100%)`,
            maskImage:
              progress === 0
                ? "linear-gradient(to bottom, black -5%, black 100%)"
                : `linear-gradient(to bottom, transparent ${progress - 5}%, transparent ${progress}%, black ${progress + 5}%)`,
            WebkitMaskImage:
              progress === 0
                ? "linear-gradient(to bottom, black -5%, black 100%)"
                : `linear-gradient(to bottom, transparent ${progress - 5}%, transparent ${progress}%, black ${progress + 5}%)`,
          }}
        />
      </div>
    </div>
  );
};

ImageGeneration.displayName = "ImageGeneration";