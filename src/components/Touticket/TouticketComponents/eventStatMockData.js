import { Calendar, Ticket, Users, Wallet } from "lucide-react";

/* ======================
   EVENEMENT BILLETTERIE
   ====================== */

export const concertEvent = {
  id: 1,
  type: "concert",
  name: "Festival Afrobeat 2026",
  description:
    "Le plus grand festival Afrobeat d'Afrique de l'Ouest. Venez profiter de concerts live, d'artistes internationaux et d'une ambiance exceptionnelle.",
  city: "Cotonou",
  address: "Palais des Congrès",
  started_at: "2026-04-12",
  ended_at: "2026-04-13",
  images: [
    {
      url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a"
    }
  ]
};

export const concertStats = [
  {
    title: "Tickets vendus",
    value: 1240,
    icon: Ticket
  },
  {
    title: "Places disponibles",
    value: 1760,
    icon: Users
  },
  {
    title: "Revenus",
    value: "6 200 000 FCFA",
    icon: Wallet
  },
  {
    title: "Total participants",
    value: 1240,
    icon: Calendar
  }
];

export const ticketTiers = [
  {
    name: "VIP",
    price: 20000,
    sold: 120,
    capacity: 150,
    finished: false
  },
  {
    name: "Standard",
    price: 5000,
    sold: 800,
    capacity: 1200,
    finished: false
  },
  {
    name: "Early Bird",
    price: 3000,
    sold: 320,
    capacity: 320,
    finished: true
  }
];


/* ======================
   EVENEMENT VOTE
   ====================== */

export const voteEvent = {
  id: 3,
  type: "vote",
  name: "Miss ENA 2026",
  description:
    "Votez pour votre candidate préférée et soutenez-la dans la compétition Miss ENA 2026.",
  city: "Cotonou",
  started_at: "2026-03-10",
  ended_at: "2026-03-30",
  images: [
    {
      url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
    }
  ]
};

export const voteStats = [
  {
    title: "Votes collectés",
    value: 8420,
    icon: Users
  },
  {
    title: "Participants",
    value: 3200,
    icon: Calendar
  },
  {
    title: "Taux participation",
    value: "68 %",
    icon: Ticket
  },
  {
    title: "Revenus",
    value: "1 684 000 FCFA",
    icon: Wallet
  }
];

export const candidates = [
  {
    id: 1,
    firstName: "Aïcha",
    lastName: "Adéoti",
    age: 22,
    field: "Marketing",
    votes: 3200,
    totalAmount: 640000,
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
    ]
  },
  {
    id: 2,
    firstName: "Fatou",
    lastName: "Soglo",
    age: 23,
    field: "Finance",
    votes: 2800,
    totalAmount: 560000,
    photos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1"
    ]
  },
  {
    id: 3,
    firstName: "Clarisse",
    lastName: "Hounkpatin",
    age: 21,
    field: "Communication",
    votes: 1420,
    totalAmount: 284000,
    photos: [
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91"
    ]
  }
];