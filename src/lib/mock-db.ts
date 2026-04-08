import { SERVICE_CONFIG } from '@/lib/constants';

export const getServices = () => {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem("aksel_mock_services");
  if (!stored) {
    localStorage.setItem("aksel_mock_services", JSON.stringify(SERVICE_CONFIG));
    return SERVICE_CONFIG;
  }
  return JSON.parse(stored);
};

export const updateService = (id: string, updatedData: any) => {
    const services = getServices();
    if (services[id]) {
        services[id] = { ...services[id], ...updatedData };
        localStorage.setItem("aksel_mock_services", JSON.stringify(services));
        return services[id];
    }
    return null;
}

export const addService = (id: string, serviceData: any) => {
    const services = getServices();
    services[id] = serviceData;
    localStorage.setItem("aksel_mock_services", JSON.stringify(services));
    return services[id];
}

export const getCleaners = () => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("aksel_mock_cleaners");
  if (!stored) {
    const defaultCleaners = [
      { id: 1, name: "Elif Özkan", district: "Beyoğlu", phone: "0532-111-22-33", email: "elif@aksel.test", password: "elif123", score: 4.9, active: true, unavailableDates: [] },
      { id: 2, name: "Suna Ak", district: "Bakırköy", phone: "0533-222-33-44", email: "suna@aksel.test", password: "suna123", score: 4.8, active: true, unavailableDates: [] },
    ];
    localStorage.setItem("aksel_mock_cleaners", JSON.stringify(defaultCleaners));
    return defaultCleaners;
  }
  return JSON.parse(stored);
};

export const setCleanerAvailability = (cleanerId: number, unavailableDates: string[]) => {
    const cleaners = getCleaners();
    const idx = cleaners.findIndex((c: any) => c.id === cleanerId);
    if (idx !== -1) {
        cleaners[idx].unavailableDates = unavailableDates;
        localStorage.setItem("aksel_mock_cleaners", JSON.stringify(cleaners));
        
        // Sync session if it's the current logged in user
        const session = getLoggedInCleaner();
        if (session && session.id === cleanerId) {
            session.unavailableDates = unavailableDates;
            localStorage.setItem("aksel_cleaner_session", JSON.stringify(session));
        }
    }
}

export const updateCleanerPassword = (cleanerId: number, newPassword: string) => {
    const cleaners = getCleaners();
    const idx = cleaners.findIndex((c: any) => c.id === cleanerId);
    if (idx !== -1) {
        cleaners[idx].password = newPassword;
        localStorage.setItem("aksel_mock_cleaners", JSON.stringify(cleaners));
        
        // Sync session if it's the current logged in user
        const session = getLoggedInCleaner();
        if (session && session.id === cleanerId) {
            session.password = newPassword;
            localStorage.setItem("aksel_cleaner_session", JSON.stringify(session));
        }
    }
}

export const addCleaner = (cleaner: any) => {
  const cleaners = getCleaners();
  const id = cleaners.length ? Math.max(...cleaners.map((c: any) => c.id)) + 1 : 1;
  const newCleaner = { ...cleaner, id, password: cleaner.password || `aksel${id}`, score: 5.0, active: true };
  cleaners.push(newCleaner);
  localStorage.setItem("aksel_mock_cleaners", JSON.stringify(cleaners));
  return newCleaner;
};

export const getApplications = () => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("aksel_mock_applications");
  if (!stored) {
    const defaultApps = [
      { id: 1, name: "Ayşe Yılmaz", district: "Üsküdar", tckn: "12345678901", email: "ayse@test.com", phone: "05551112233", date: "22 Mart 2024", status: "PENDING_REVIEW", districts: ["Üsküdar", "Kadıköy"] }
    ];
    localStorage.setItem("aksel_mock_applications", JSON.stringify(defaultApps));
    return defaultApps;
  }
  return JSON.parse(stored);
};

export const addApplication = (appData: any) => {
  const apps = getApplications();
  const id = apps.length ? Math.max(...apps.map((a: any) => a.id)) + 1 : 1;
  const newApp = { ...appData, id, date: new Date().toLocaleDateString('tr-TR'), status: "SUBMITTED" };
  apps.push(newApp);
  localStorage.setItem("aksel_mock_applications", JSON.stringify(apps));
  return newApp;
};

export const approveApplication = (appId: number, customPassword?: string) => {
  const apps = getApplications();
  const idx = apps.findIndex((a: any) => a.id === appId);
  if (idx !== -1) {
    apps[idx].status = "APPROVED";
    localStorage.setItem("aksel_mock_applications", JSON.stringify(apps));
    
    addCleaner({
       name: apps[idx].name,
       district: apps[idx].district || (apps[idx].districts && apps[idx].districts.length > 0 ? apps[idx].districts[0] : "Bilinmiyor"),
       phone: apps[idx].phone,
       email: apps[idx].email || "belirtilmedi@aksel.test",
       password: customPassword || `aksel${appId}`
    });
  }
};

export const cleanerLogin = (email: string, password: string) => {
    const cleaners = getCleaners();
    const cleaner = cleaners.find((c: any) => c.email === email && c.password === password);
    if (cleaner) {
        localStorage.setItem("aksel_cleaner_session", JSON.stringify(cleaner));
        return cleaner;
    }
    return null;
};

export const getLoggedInCleaner = () => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("aksel_cleaner_session");
    return stored ? JSON.parse(stored) : null;
};

export const cleanerLogout = () => {
    localStorage.removeItem("aksel_cleaner_session");
}

export const getBookings = () => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("aksel_mock_bookings");
  if (!stored) {
    const defaultBookings = [
      { id: 1, customer: "Murat Kaçmaz", district: "Beşiktaş", service: "Ofis Temizliği", date: "Bugün 14:00", status: "PENDING_REVIEW", cleanerId: null },
      { id: 2, customer: "Selma Gür", district: "Kadıköy", service: "Boş Ev Temizliği", date: "24 Mart 09:00", status: "SUBMITTED", cleanerId: null },
    ];
    localStorage.setItem("aksel_mock_bookings", JSON.stringify(defaultBookings));
    return defaultBookings;
  }
  return JSON.parse(stored);
};

export const addBooking = (bookingData: any) => {
  const bookings = getBookings();
  bookings.push(bookingData);
  localStorage.setItem("aksel_mock_bookings", JSON.stringify(bookings));
};

export const updateBookingStatus = (bookingId: number | string, newStatus: string) => {
  const bookings = getBookings();
  const idx = bookings.findIndex((b: any) => b.id === bookingId);
  if (idx !== -1) {
    bookings[idx].status = newStatus;
    localStorage.setItem("aksel_mock_bookings", JSON.stringify(bookings));
    return true;
  }
  return false;
};

export const getNotifications = (cleanerId: number) => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("aksel_mock_notifications");
    const notifications = stored ? JSON.parse(stored) : [];
    return notifications.filter((n: any) => n.cleanerId === cleanerId);
};

export const addNotification = (cleanerId: number, message: string) => {
    const stored = localStorage.getItem("aksel_mock_notifications");
    const notifications = stored ? JSON.parse(stored) : [];
    notifications.push({ id: Date.now(), cleanerId, message, date: new Date().toLocaleString(), read: false });
    localStorage.setItem("aksel_mock_notifications", JSON.stringify(notifications));
}

export const syncClientBookings = () => {
   // Deprecated in favor of direct addBooking calls
};
