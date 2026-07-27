const IMG = {
  hero: "https://images.unsplash.com/photo-1556912173-46c336c7fd55?auto=format&fit=crop&w=1920&q=80",
  about1: "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=800&q=80",
  about2: "https://images.unsplash.com/photo-1556911220-bff31c812d84?auto=format&fit=crop&w=800&q=80",
  product1: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
  product2: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
  product3: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
  catalogue1: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80",
  catalogue2: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=600&q=80",
  catalogue3: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80",
  catalogue4: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80",
  catalogue5: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=600&q=80",
  projectMain: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1200&q=80",
  project1: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=400&q=80",
  project2: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=400&q=80",
  project3: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=400&q=80",
  project4: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&q=80",
  project5: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=400&q=80",
  story1: "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=900&q=80",
  story2: "https://images.unsplash.com/photo-1556912173-3d8bd2947c66?auto=format&fit=crop&w=900&q=80",
  story3: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=900&q=80",
  showroom1: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
  showroom2: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80",
  showroom3: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
  contact1: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
  contact2: "https://images.unsplash.com/photo-1600489000223-f5b1c58b291f?auto=format&fit=crop&w=600&q=80",
  contact3: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=600&q=80",
  contact4: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
};

export const fallbackHomeData = {
  site: {
    heroHeadline: "CHOOSE FROM A RANGE OF HIGH-QUALITY MODULAR KITCHENS.",
    heroImage: IMG.hero,
    aboutTitle: "ABOUT VARSOVIA",
    aboutText:
      "At Varsovia, we craft modular kitchens that blend timeless design with everyday ease. From thoughtful layouts to premium finishes, every space is tailored to how you cook, gather, and live — elevating your home with quiet luxury and lasting craftsmanship.",
    aboutImages: [IMG.about1, IMG.about2],
    stats: [
      { value: "+12", label: "Years of Experience" },
      { value: "100+", label: "Projects Completed" },
      { value: "5", label: "Years Warranty" },
    ],
    contactImages: [IMG.contact1, IMG.contact2, IMG.contact3, IMG.contact4],
    footerBio:
      "Varsovia Kitchen designs and builds premium modular kitchens with precision, warmth, and lasting quality.",
    phone: "+91 98765 43210",
    email: "hello@varsoviakitchen.com",
    address: "12 Design Avenue, Mumbai, India",
  },
  products: [
    { _id: "1", title: "Minimalist Oak", image: IMG.product1, category: "Minimalist" },
    { _id: "2", title: "Contemporary White", image: IMG.product2, category: "Contemporary" },
    { _id: "3", title: "Luxury Walnut", image: IMG.product3, category: "Luxury" },
  ],
  projects: [
    {
      _id: "1",
      title: "The Amber Residence",
      coverImage: IMG.projectMain,
      gallery: [IMG.project1, IMG.project2, IMG.project3, IMG.project4, IMG.project5],
    },
  ],
  catalogues: [
    { _id: "1", title: "Classic Collection", coverImage: IMG.catalogue1 },
    { _id: "2", title: "Modern Living", coverImage: IMG.catalogue2 },
    { _id: "3", title: "Explore Modern Design", coverImage: IMG.catalogue3 },
    { _id: "4", title: "Warm Neutrals", coverImage: IMG.catalogue4 },
    { _id: "5", title: "Urban Kitchens", coverImage: IMG.catalogue5 },
  ],
  testimonials: [
    {
      _id: "1",
      name: "Ananya Mehta",
      role: "Homeowner, Mumbai",
      quote:
        "Varsovia transformed our outdated kitchen into a calm, beautiful space we actually love cooking in every day.",
      rating: 5,
      image: IMG.story1,
    },
    {
      _id: "2",
      name: "Rohan Kapoor",
      role: "Architect Partner",
      quote:
        "Their attention to detail and finish quality is exceptional. Clients always notice the difference.",
      rating: 5,
      image: IMG.story2,
    },
    {
      _id: "3",
      name: "Priya Shah",
      role: "Homeowner, Bangalore",
      quote:
        "From consultation to installation, the team was thoughtful, precise, and a pleasure to work with.",
      rating: 5,
      image: IMG.story3,
    },
  ],
  showrooms: [
    { _id: "1", name: "Varsovia Flagship", location: "Bandra, Mumbai", image: IMG.showroom1 },
    { _id: "2", name: "Design Studio", location: "Koregaon Park, Pune", image: IMG.showroom2 },
    { _id: "3", name: "Experience Centre", location: "Indiranagar, Bangalore", image: IMG.showroom3 },
  ],
  partners: [
    { _id: "1", name: "Hettich" },
    { _id: "2", name: "Blum" },
    { _id: "3", name: "Häfele" },
    { _id: "4", name: "Bosch" },
    { _id: "5", name: "Siemens" },
    { _id: "6", name: "Grohe" },
  ],
};
