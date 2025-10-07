import React from "react";
import { WebGLShader } from "@/components/ui/web-gl-shader";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { TypingAnimation } from "@/components/ui/typing-animation";
import TextMarquee from "@/components/ui/text-marque";
import { GradientCard } from "@/components/ui/gradient-card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Sparkles, Zap, Download, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <WebGLShader />

      <div className="relative z-10 flex justify-end p-6">
        <Link to={createPageUrl("Dashboard")}>
          <Button className="bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        </Link>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              <span className="text-sm text-white/80">Free Forever • No Credit Card Required</span>
            </div>

            <TypingAnimation
              text="PayLance"
              duration={150}
              className="text-white text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none"
            />

            <p className="text-white/60 text-xl md:text-2xl lg:text-3xl max-w-3xl mx-auto font-light leading-relaxed">
              Create professional invoices in seconds using AI.
              <br />
              <span className="text-white/40">Just describe what you need.</span>
            </p>

            <div className="py-8 -mx-4">
              <TextMarquee
                baseVelocity={-2}
                className="font-black tracking-[-0.05em] leading-none text-white/10"
              >
                FAST • SIMPLE • PROFESSIONAL • AI-POWERED •
              </TextMarquee>
              <TextMarquee
                baseVelocity={2}
                className="font-black tracking-[-0.05em] leading-none text-white/10 mt-2"
              >
                FREE FOREVER • NO SIGNUP • INSTANT •
              </TextMarquee>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link to={createPageUrl("Generator")}>
                <LiquidButton size="xxl" className="text-white border-2 border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-lg font-semibold px-12">
                  <Sparkles className="w-5 h-5" />
                  Create Invoice
                </LiquidButton>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24">
            <GradientCard
              icon={Sparkles}
              title="AI-Powered"
              description="Describe your invoice in plain English. AI extracts all the details automatically."
              gradientColors={{
                primary: "168, 85, 247",
                secondary: "236, 72, 153",
                tertiary: "219, 39, 119"
              }}
            />

            <GradientCard
              icon={Zap}
              title="Lightning Fast"
              description="Generate professional invoices in seconds, not minutes. Save time, get paid faster."
              gradientColors={{
                primary: "59, 130, 246",
                secondary: "147, 51, 234",
                tertiary: "6, 182, 212"
              }}
            />

            <GradientCard
              icon={Download}
              title="Export Anywhere"
              description="Download as PDF or print directly. Professional format, ready to send."
              gradientColors={{
                primary: "34, 197, 94",
                secondary: "16, 185, 129",
                tertiary: "20, 184, 166"
              }}
            />
          </div>

          <div className="mt-24 max-w-3xl mx-auto">
            <div className="text-center mb-6">
              <p className="text-white/40 text-sm uppercase tracking-wider mb-2">Try something like</p>
            </div>
            <div className="p-6 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm">
              <p className="text-white/80 text-lg leading-relaxed">
                "Create an invoice for Acme Corp for $2,500 for web development services completed in December.
                Include 3 items: homepage design for $800, backend API for $1,200, and deployment for $500."
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
