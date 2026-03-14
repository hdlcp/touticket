import { Ticket, Calendar, Users, Wallet } from "lucide-react";

/* =========================
   STATISTIQUES BILLETTERIE
   ========================= */

export const ticketStats = [
  {
    label: "Total événements",
    value: 6,
    icon: Calendar,
    subtitle : "Événements actifs"
    
  },
  {
    label: "Total tickets vendus",
    value: 2450,
    icon: Ticket,
    subtitle: "Sur tous tickets"
  },
  {
    label: "Nombre total de places disponibles",
    value: 3500,
    icon: Users,
    subtitle: "Places disponibles"
  },
  {
    label: "Revenus totaux",
    value: "8 450 000",
    icon: Wallet,
    subtitle: "FCFA"
  },
];


/* =========================
   STATISTIQUES VOTES
   ========================= */

export const voteStats = [
  {
    label: "Total événements",
    value: 4,
    icon: Calendar,
    subtitle : "Événements actifs"
  },
  {
    label: "Total votes collectés",
    value: 18560,
    icon: Users,
    subtitle: "ça ne sert à r"

  },
  {
    label: "Taux de participation",
    value: "72 %",
    icon: Ticket,
  },
  {
    label: "Revenus totaux",
    value: "3 720 000",
    icon: Wallet,
    subtitle: "FCFA"
  },
];


/* =========================
   EVENEMENTS BILLETTERIE
   ========================= */

export const ticketEvents = [
  {
    id: 1,
    type: "concert",
    name: "Festival Afrobeat 2026",
    category: "Musique",
    city: "Cotonou",
    started_at: "2026-04-12",
    created_at: "2026-03-01",
    ended_at: "2026-04-12",
    images: [
      { url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a" }
    ]
  },
  {
    id: 2,
    type: "concert",
    name: "Concert Gospel Live",
    category: "Concert",
    city: "Porto-Novo",
    started_at: "2026-05-01",
    created_at: "2026-03-05",
    ended_at: "2026-05-01",
    images: [
      { url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7" }
    ]
  }
];


/* =========================
   EVENEMENTS VOTES
   ========================= */

export const voteEvents = [
  {
    id: 3,
    type: "vote",
    name: "Miss ENA 2026",
    category: "Concours",
    city: "Cotonou",
    started_at: "2026-03-10",
    created_at: "2026-02-20",
    ended_at: "2026-03-30",
    images: [
      { url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e" }
    ]
  },
  {
    id: 4,
    type: "vote",
    name: "Top Influenceur TikTok",
    category: "Influence",
    city: "Abomey-Calavi",
    started_at: "2026-04-15",
    created_at: "2026-03-02",
    ended_at: "2026-04-30",
    images: [
      { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330" }
    ]
  }
];


/* =========================
   PRIX
   ========================= */

export const eventPrices = {
  1: 5000,
  2: 3000,
  3: 200,
  4: 100,
};