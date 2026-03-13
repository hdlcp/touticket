export const entities = [
  {
    id: "1",
    name: "ENA",
    slug: "ena",
    description: "L'École Nationale d'Administration organise des événements culturels et académiques pour ses étudiants. Rejoignez-nous pour vivre des moments inoubliables.",
    logo: "/logos/ena.png",
    coverImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-10%20at%2011.42.40-YbNlaCpfY13utQKvQmOM96TpryG34Y.jpeg",
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    name: "EPAC",
    slug: "epac",
    description: "École Polytechnique d'Abomey-Calavi - Leader dans la formation technique et professionnelle au Bénin.",
    logo: "/logos/epac.png",
    coverImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-10%20at%2011.42.31-6GIP8VaMMlK0p4TRzUNuVxC49j8uWn.jpeg",
    createdAt: "2024-02-20"
  },
  {
    id: "3",
    name: "FASEG",
    slug: "faseg",
    description: "Faculté des Sciences Économiques et de Gestion - Excellence académique et innovation.",
    logo: "/logos/faseg.png",
    coverImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-10%20at%2011.42.40-YbNlaCpfY13utQKvQmOM96TpryG34Y.jpeg",
    createdAt: "2024-03-10"
  }
];

export const votes = [
  {
     entitySlug: "ena",
    id: 1,
    name: "Miss ENA 2026",
     candidates_count: 8,
    city: "Cotonou",
     description:
      "Miss Université est un concours qui met en avant l'élégance, l'intelligence et le leadership des étudiantes. Venez soutenir votre candidate préférée et participez à cet événement exceptionnel.",
    price: 100,
    started_at: "2026-03-10T18:00:00",
    created_at: "2026-02-28T10:00:00",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-10%20at%2011.42.40-YbNlaCpfY13utQKvQmOM96TpryG34Y.jpeg"
      }
    ]
  },
  {
     entitySlug: "ena",
    id: 2,
    name: "Meilleur Artiste Gospel",
     candidates_count: 8,
    city: "Porto-Novo",
      description: "Le concours du Meilleur Artiste Gospel célèbre les talents musicaux dans le genre gospel. Rejoignez-nous pour une soirée de musique inspirante et de performances exceptionnelles.",
      price: 200,
    started_at: "2026-03-15T20:00:00",
    created_at: "2026-03-01T09:30:00",
    images: [
      {
        url: "https://images.unsplash.com/photo-1501612780327-45045538702b"
      }
    ]
  },
  {
     entitySlug: "ena",
    id: 3,
    name: "Top Influenceur TikTok",
     candidates_count: 8,
    city: "Abomey-Calavi",
      description: "Le concours du Top Influenceur TikTok met en lumière les créateurs de contenu les plus influents sur la plateforme TikTok. Venez découvrir les talents qui font vibrer la communauté et votez pour votre favori.",
    price: 100,
    started_at: "2026-03-20T16:00:00",
    created_at: "2026-03-05T14:20:00",
    images: [
      {
        url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
      }
    ]
  },
  {
     entitySlug: "ena",
    id: 4,
    name: "Meilleur DJ de l'année",
     candidates_count: 8,
    city: "Parakou",
      description: "Le concours du Meilleur DJ de l'année célèbre les talents de la musique électronique et du mixage. Rejoignez-nous pour une soirée de rythmes envoûtants et de performances électrisantes.",
    price: 150,
    started_at: "2026-03-25T22:00:00",
    created_at: "2026-03-06T11:15:00",
    images: [
      {
        url: "https://images.unsplash.com/photo-1511379938547-c1f69419868d"
      }
    ]
  }
];

export const candidates = [
  {
    id: 1,
    voteId: 1,
    firstName: "Aïcha",
    lastName: "Kouassi",
    description:
          "Passionnée par le service public et le développement communautaire. Amina est une étudiante brillante qui s'engage activement dans les activités associatives de l'école. Elle rêve de contribuer à la modernisation de l'administration béninoise.",
    age: 22,
    field: "Marketing",
    votes: 120,
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop"
    ]
  },
  {
    id: 2,
    voteId: 1,
    description:
          "Future analyste financière, passionnée par l'entrepreneuriat féminin. Fatou est une étudiante ambitieuse qui aspire à devenir une leader dans le secteur financier. Elle est très impliquée dans les initiatives de soutien à l'entrepreneuriat féminin au sein de l'école.",
    firstName: "Fatou",
    lastName: "Adéyemi",
    age: 23,
    field: "Finance",
    votes: 200,
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
       "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=400&h=500&fit=crop",
          "https://images.unsplash.com/photo-1496440737103-cd596325d314?w=400&h=500&fit=crop"
    ]
  },
  {
    id: 3,
    voteId: 1,
      description:"Développeuse en devenir, passionnée par la technologie et l'innovation.",
    firstName: "Grace",
    lastName: "Mensah",
    age: 21,
    field: "Informatique",
    votes: 90,
    photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
       "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=400&h=500&fit=crop",
          "https://images.unsplash.com/photo-1496440737103-cd596325d314?w=400&h=500&fit=crop"
    ]
  },
  {
    id: 4,
    voteId: 1,
    description:
          "Développeuse en devenir, passionnée par la technologie et l'innovation.",
    firstName: "Mariam",
    lastName: "Diallo",
    age: 24,
    field: "Communication",
    votes: 279,
    photos: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
       "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=400&h=500&fit=crop",
          "https://images.unsplash.com/photo-1496440737103-cd596325d314?w=400&h=500&fit=crop"
    ]
  }
];

export const events = [
  {
    id: "1",
    entitySlug: "ena",
    name: "Miss Université 2026",
    minVotePrice: 500,
    candidates: [
      {
        id: "1",
        firstName: "Aïcha",
        lastName: "Kouassi",
        age: 22,
        field: "Marketing",
        votes: 120,
        description:
          "Étudiante passionnée de marketing et engagée dans plusieurs associations universitaires.",
        photos: [
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
          "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
        ]
      },
      {
        id: "2",
        firstName: "Fatou",
        lastName: "Adéyemi",
        age: 23,
        field: "Finance",
        votes: 200,
        description:
          "Future analyste financière, passionnée par l'entrepreneuriat féminin.",
        photos: [
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
        ]
      },
      {
        id: "3",
        firstName: "Grace",
        lastName: "Mensah",
        age: 21,
        field: "Informatique",
        votes: 90,
        description:
          "Développeuse en devenir, passionnée par la technologie et l'innovation.",
        photos: [
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2"
        ]
      }
    ]
  }
];