"use client";

import { motion } from 'framer-motion';
import { Home, ArrowLeft, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <main className={styles.main}>
      <Navbar />
      
      <div className="container">
        <div className={styles.content}>
          <motion.div 
            className={styles.iconWrapper}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles size={80} className={styles.sparkle} />
          </motion.div>

          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Hay Aksi! Sayfa Tertemiz...
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Aradığınız sayfayı bulamadık, galiba burayı fazla iyi temizlemişiz. 
            Hemen ana sayfaya dönerek devam edebilirsiniz.
          </motion.p>

          <motion.div 
            className={styles.actions}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <a href="/" className="btn-primary">
              <Home size={18} /> Ana Sayfaya Dön
            </a>
            <button onClick={() => window.history.back()} className={styles.backBtn}>
              <ArrowLeft size={18} /> Geri Git
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
