"use client";

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
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/admin" className={styles.logo}>
            AKSEL<span>ADMIN</span>
          </Link>
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
              >
                <span className={styles.icon}><Icon size={18} strokeWidth={isActive ? 2.5 : 2} /></span>
                <span className={styles.title}>{item.title}</span>
              </Link>
            );
          })}
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.adminInfo}>
            <div className={styles.avatar}>SA</div>
            <div>
              <p>Super Admin</p>
              <span>Çevrimiçi</span>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={() => router.push('/')}>
            <LogOut size={16} /> <span>Çıkış</span>
          </button>
        </div>
      </aside>
      <main className={styles.content}>
        <header className={styles.header}>
          <div className={styles.searchBar}>
            <Search size={16} className={styles.searchIcon} />
            <input type="text" placeholder="Rezervasyon veya müşteri ara..." />
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
