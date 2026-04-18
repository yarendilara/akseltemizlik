"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "./SplashLoader.module.css";

interface Bubble {
  id: number;
  size: number;
  left: number;
  delay: number;
  duration: number;
  drift: number;
}

export default function SplashLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    // Generate bubbles only on client to avoid hydration mismatch
    const newBubbles = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      size: Math.random() * 40 + 15, // Slightly smaller bubbles
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: Math.random() * 2 + 2,
      drift: (Math.random() - 0.5) * 30,
    }));
    setBubbles(newBubbles);

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 1.2, ease: "easeInOut" }
          }}
        >
          {/* Rich Background Gradients */}
          <div className={styles.bgGlow} />

          {/* Realistic Bubbles Layer */}
          <div className={styles.bubblesLayer}>
            {bubbles.map((b) => (
              <motion.div
                key={b.id}
                className={styles.bubble}
                initial={{ y: "110vh", x: `${b.left}vw`, scale: 0, opacity: 0 }}
                animate={{ 
                  y: "-20vh", 
                  x: `${b.left + b.drift}vw`,
                  scale: [0, 1.1, 1],
                  opacity: [0, 0.7, 0.4, 0]
                }}
                transition={{ 
                  duration: b.duration, 
                  delay: b.delay,
                  ease: "easeOut" 
                }}
                style={{
                  width: b.size,
                  height: b.size,
                }}
              >
                <div className={styles.shine} />
              </motion.div>
            ))}
          </div>

          <div className={styles.content}>
            <motion.div 
               className={styles.logoWrapper}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.8, duration: 1 }}
            >
              <div className={styles.logoText}>
                <span>ZİNDE</span>
                <span className={styles.highlight}>TEMİZLİK</span>
              </div>
            </motion.div>

            <motion.div 
              className={styles.revealElements}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              <div className={styles.loadingBar}>
                <motion.div 
                   className={styles.fill}
                   initial={{ width: "0%" }}
                   animate={{ width: "100%" }}
                   transition={{ duration: 3, ease: "linear" }}
                />
              </div>
              <p className={styles.tagline}>Mükemmellik Ayrıntıda Gizlidir...</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
