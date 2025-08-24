"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CreditCard, Shield, Globe } from "lucide-react";

interface Benefit {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    icon: CreditCard,
    title: "Instant Credit Access",
    description: "Access your funds immediately without waiting for traditional loan approvals. Your credit line is available 24/7 with just a few clicks."
  },
  {
    icon: Shield,
    title: "Decentralized Security",
    description: "Built on blockchain technology with smart contract security. Your assets are protected by cryptographic protocols and distributed consensus."
  },
  {
    icon: Globe,
    title: "Global Accessibility",
    description: "Available worldwide with no geographic restrictions. Connect from anywhere and access your credit line across international markets."
  }
];

export default function BenefitsSection({ className = "" }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.4, 0.25, 1]
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      className={`py-20 ${className}`}
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            Why Choose DeFi Credit
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Experience the future of decentralized finance with cutting-edge technology 
            and unparalleled accessibility
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              variants={itemVariants}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className="group relative"
            >
              {/* Glassmorphism card */}
              <div className="relative h-full bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-8 overflow-hidden transition-all duration-300 hover:border-primary/30 hover:bg-card/60">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                
                <div className="relative z-10">
                  {/* Icon with gradient background */}
                  <div className="mb-6">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5 group-hover:scale-110 transition-transform duration-300">
                      <div className="w-full h-full bg-card rounded-xl flex items-center justify-center">
                        <benefit.icon className="w-8 h-8 text-primary group-hover:text-accent transition-colors duration-300" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-heading font-semibold mb-4 group-hover:text-primary transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                    {benefit.description}
                  </p>
                </div>

                {/* Subtle shine effect */}
                <div className="absolute -top-full -left-full w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent transform rotate-45 group-hover:top-full group-hover:left-full transition-all duration-1000 ease-out" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}