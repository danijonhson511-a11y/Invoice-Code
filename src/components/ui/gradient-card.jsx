import * as React from "react";
import { motion } from "framer-motion";

export function GradientCard({ icon: Icon, title, description, gradientColors }) {
  const { primary, secondary, tertiary } = gradientColors;

  return (
    <motion.div
      className="relative group p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 0%, rgba(${primary}, 0.3), transparent 50%),
                       radial-gradient(circle at 100% 100%, rgba(${secondary}, 0.3), transparent 50%),
                       radial-gradient(circle at 0% 100%, rgba(${tertiary}, 0.3), transparent 50%)`
        }}
      />

      <div className="relative z-10">
        <div
          className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, rgba(${primary}, 0.5), rgba(${secondary}, 0.5))`
          }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/60 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
