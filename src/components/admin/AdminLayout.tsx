"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  BarChart3, 
  Calendar, 
  ClipboardList, 
  UserPlus, 
  UserRoundCheck, 
  Users, 
  Wrench, 
  Settings, 
  Bell, 
  LogOut, 
  Search 
} from 'lucide-react';
import styles from './admin-layout.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { title: "Dashboard", path: "/admin", icon: BarChart3 },
    { title: "Operasyon Takvimi", path: "/admin/takvim", icon: Calendar },
    { title: "Rezervasyonlar", path: "/admin/rezervasyonlar", icon: ClipboardList },
    { title: "Müşteriler", path: "/admin/musteriler", icon: Users },
    { title: "Hizmet Yönetimi", path: "/admin/hizmetler", icon: Wrench },
    { title: "Ayarlar", path: "/admin/ayarlar", icon: Settings },
  ];

  return (
    <div className={styles.adminContainer}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/admin" className={styles.logo}>
            ZİNDE<span>ADMIN</span>
          </Link>
          <button className={styles.closeSidebar} onClick={() => setSidebarOpen(false)}>
            <LogOut size={20} style={{ transform: 'rotate(180deg)' }} />
          </button>
        </div>
        <nav className={styles.nav}>
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path} 
                href={item.path}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className={styles.icon}><Icon size={18} strokeWidth={isActive ? 2.5 : 2} /></span>
                <span className={styles.title}>{item.title}</span>
              </Link>
            );
          })}
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.adminInfo}>
            <div className={styles.avatar}>ZT</div>
            <div>
              <p>Yönetici</p>
              <span>Çevrimiçi</span>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={() => router.push('/')}>
            <LogOut size={16} /> <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      <main className={styles.content}>
        <header className={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
              <ClipboardList size={24} />
            </button>
            <div className={styles.searchBar}>
              <Search size={16} className={styles.searchIcon} />
              <input type="text" placeholder="Rezervasyon ara..." />
            </div>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.notification}>
              <Bell size={20} />
              <span className={styles.badge}>3</span>
            </div>
          </div>
        </header>
        <div className={styles.innerContent}>
          {children}
        </div>
      </main>
    </div>
  );
}
