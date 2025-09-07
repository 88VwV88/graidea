import React from "react";
import { motion, type Variants } from "framer-motion";

export const RevealLinks: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex flex-col leading-none gap-2">
        {/* Great Ideas - Black */}
        <div className="text-black">
          <FlipLink href="#" baseColor="text-black" hoverColor="text-blue-600">
            GREAT IDEAS
          </FlipLink>
        </div>
        
        {/* Get Their - Blue Gradient */}
        <div className=" text-black ">
          <FlipLink href="#" baseColor="text-blue-600" hoverColor="text-black">
            GET THEIR
          </FlipLink>
        </div>
        
        {/* Grade - Black */}
        <div className="text-black ">
          <FlipLink href="#" baseColor="text-black" hoverColor="text-blue-600">
            GRADE
          </FlipLink>
        </div>
      </div>
    </div>
  );
};

const DURATION = 0.5;
const STAGGER = 0.025;

interface FlipLinkProps {
  children: string;
  href: string;
  baseColor?: string;
  hoverColor?: string;
}

const FlipLink: React.FC<FlipLinkProps> = ({ 
  children, 
  href, 
  baseColor = "text-black",
  hoverColor = "text-black",
}) => {
  const duration = DURATION;
  const stagger = STAGGER;

  const variants: Variants = {
    initial: { y: 0 },
    hovered: { y: "-100%" },
  };

  const variantsInverse: Variants = {
    initial: { y: "100%" },
    hovered: { y: 0 },
  };

  return (
    <motion.a
      initial="initial"
      whileHover="hovered"
      href={href}
      className={`relative block overflow-hidden whitespace-nowrap font-black uppercase text-2xl sm:text-3xl md:text-6xl lg:text-7xl ${baseColor}`}
      style={{ lineHeight: 0.75 }}
    >
      <div>
        {children.split("").map((l, i) => (
          <motion.span
            key={i}
            variants={variants}
            transition={{
              duration: duration,
              ease: "easeInOut" as const,
              delay: stagger * i,
            }}
            className="inline-block"
          >
            {l === " " ? "\u00A0" : l}
          </motion.span>
        ))}
      </div>
      <div className={`absolute inset-0 ${hoverColor}`}>
        {children.split("").map((l, i) => (
          <motion.span
            key={i}
            variants={variantsInverse}
            transition={{
              duration: duration,
              ease: "easeInOut" as const,
              delay: stagger * i,
            }}
            className="inline-block"
          >
            {l === " " ? "\u00A0" : l}
          </motion.span>
        ))}
      </div>
    </motion.a>
  );
};