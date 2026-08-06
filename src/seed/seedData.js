/** Canonical seed payloads aligned with Varsovia frontend fallbacks / public assets */

const L = {
  hero: "/home/home-front-page.png",
  about1: "/home/about-1.png",
  about2: "/home/about-2.png",
  about3: "/home/about-3.png",
  stats: "/home/counting.png",
  product1: "/home/product/product-1.png",
  product2: "/home/product/product-2.png",
  product3: "/home/product/product-3.jpg",
  catalogue1: "/home/catalog.png",
  catalogue2: "/home/catalog-1.jpg",
  catalogue3: "/home/catalog-2.png",
  catalogue4: "/home/catalog-3.png",
  catalogue5: "/home/catalog-4.png",
  project1: "/home/featured-project/feature-1.jpg",
  project2: "/home/featured-project/feature-2.jpg",
  project3: "/home/featured-project/feature-3.jpg",
  project4: "/home/featured-project/feature-4.jpg",
  project5: "/home/featured-project/feature-5.jpg",
  project6: "/home/featured-project/feature-6.jpg",
  project7: "/home/featured-project/feature-7.png",
  project8: "/home/featured-project/feature-8.png",
  contact1: "/home/featured-project/feature-1.jpg",
  contact2: "/home/about-1.png",
  contact3: "/home/featured-project/feature-3.jpg",
  contact4: "/home/featured-project/feature-4.jpg",
  showroom1: "/home/about-1.png",
  showroom2: "/home/about-2.png",
  showroom3: "/home/about-3.png",
  team: "/team/team.png",
  blog: "/blog/blog1.png",
  story1: "/home/stories/story-1.jpg",
  story2: "/home/stories/story-2.jpg",
  story3: "/home/stories/story-3.jpg",
  story4: "/home/stories/story-4.jpg",
  story5: "/home/stories/story-5.jpg",
  core1: "/home/core/core-1.jpg",
  core2: "/home/core/core-2.jpg",
  core3: "/home/core/core-3.jpg",
  core4: "/home/core/core-4.jpg",
  core5: "/home/core/core-5.jpg",
  core6: "/home/core/core-6.jpg",
};

function siteContentDoc() {
  return {
    key: "main",
    heroEyebrow: "VARSOVIA DESIGN",
    heroHeadline: "CHOOSE FROM A RANGE OF HIGH-QUALITY MODULAR KITCHENS.",
    heroSubtitle: "Premium interiors, thoughtfully designed for everyday living.",
    heroImage: L.hero,
    heroPrimaryCtaLabel: "Explore Kitchens",
    heroPrimaryCtaHref: "#products",
    heroSecondaryCtaLabel: "Free Consultation",
    heroSecondaryCtaHref: "#contact",
    aboutTitle: "ABOUT VARSOVIA",
    aboutText:
      "Varsovia started in a rented one-room studio in Warsaw's Praga district, with a simple belief: a beautiful room only earns that word once someone has lived in it for a year and still loves it. We still work that way — measuring twice, drawing by hand before we draw on screen, and choosing materials that age instead of wear out.\n\nEvery project starts with how you move through a space, not how it will photograph. The result is interiors that feel inevitable, as if they couldn't have been arranged any other way.",
    aboutImages: [L.about1, L.about2, L.about3, L.project5],
    aboutStoryImages: [L.project1, L.project2, L.about3, L.project4],
    stats: [
      { value: "+12", label: "Years Experience" },
      { value: "+140", label: "Projects Completed" },
      { value: "+6", label: "Cities Served" },
    ],
    statsImage: L.stats,
    aboutIntro:
      "At Varsovia Design, we believe every space tells a story. We specialize in creating elegant, functional, and personalized interiors that reflect your lifestyle.",
    aboutStory:
      "Founded with a passion for thoughtful design and exceptional craftsmanship, Varsovia Design has grown into a trusted name in premium interior solutions.",
    aboutHeroSubtitle: "TWELVE YEARS OF ROOMS BUILT TO LAST",
    vision: {
      title: "Our Vision",
      text: "To become a leading interior design brand known for creating inspiring spaces that enrich everyday living through innovation, quality, and timeless design.",
      icon: "/vision/visionIcon.png",
    },
    mission: {
      title: "Our Mission",
      text: "To deliver personalized interior solutions with exceptional craftsmanship, premium materials, and a seamless customer experience from concept to completion.",
      icon: "/vision/missionIcon.png",
    },
    values: {
      title: "Our Values",
      text: "Great interiors begin with quality, creativity, trust, and innovation. We design and craft spaces tailored to your lifestyle.",
      icon: "/vision/valuesIcon.png",
    },
    processSteps: [
      {
        step: "01",
        title: "Consultation",
        text: "Understanding your lifestyle, needs, and design preferences.",
        icon: "/ourprocess/ourprocessStep1.png",
      },
      {
        step: "02",
        title: "Planning & Design",
        text: "Creating layouts, concepts, material selections, and realistic 3D visualizations.",
        icon: "/ourprocess/ourprocessStep2.png",
      },
      {
        step: "03",
        title: "Develop",
        text: "Refining designs, coordinating production, and preparing for flawless execution.",
        icon: "/ourprocess/ourprocessStep3.png",
      },
      {
        step: "04",
        title: "Execution",
        text: "Expert craftsmanship, timely delivery, and professional installation.",
        icon: "/ourprocess/ourprocessStep4.png",
      },
    ],
    designTools: [
      { name: "CAXA", image: "/team/design-tools/caxa.svg", order: 1 },
      { name: "AUTO CAD", image: "/team/design-tools/autocad.svg", order: 2 },
      { name: "3D MAX", image: "/team/design-tools/3dmax.svg", order: 3 },
    ],
    teamPage: {
      heroTitle: "Our Team",
      heroSubtitle: "THE CREATIVE MINDS BEHIND EVERY BEAUTIFUL SPACE",
      intro:
        "We have 3 sales teams respectively serving retail customers, commercial project contractors and franchisers. Inside each team, different sales representatives are responsible for different countries and regions. We are experts in our respective fields in order to meet different type customers' needs. 3 sales teams come together in a collaborative effort to provide an excellent experience for our customer.",
      designTitle: "Professional Design Team",
      designEyebrow: "Italian design team",
      designBody:
        "Varsovia Design collaborates with Italian designers and suppliers to enhance our global competency. We combine updated aesthetics with functionality to create exciting spaces tailored to our clients' wishes and bring lasting living pleasure.",
      architectTitle: "Architect / Engineers",
      architectEyebrow: "Technical & structural team",
      architectBody:
        "Our architect and engineering team ensures structural integrity, precise technical drawings, and seamless coordination between design intent and on-site execution.",
      toolsTitle: "Professional design tool",
      toolsBody:
        "Professional design tools are adopted to assist for perfect art effect, including CAXA, CAD, 3D MAX, KD MAX, etc.",
      stats: [
        { value: "100+", label: "Successful Projects Completed" },
        { value: "03", label: "Years of Excellence in Interior Solutions" },
      ],
    },
    localeFlags: {
      en: "/icon/flag-english.svg",
      th: "/icon/flag-thailand.svg",
      pl: "/icon/flag-polish.svg",
    },
    contactImages: [L.contact1, L.contact2, L.contact3, L.contact4, L.project5, L.about2, L.project7],
    footerBio:
      "Varsovia Kitchen designs and builds premium modular kitchens with precision, warmth, and lasting quality.",
    phone: "+66 64 683 9777",
    email: "hi@thailandkitchens.com",
    address: "Route 4169, Mae Nam, Amphoe Ko Samui, Surat Thani 84330",
    mobileWhatsapp: "+66 99 359 6916",
    contactPhone: "+66 64 683 9777",
    facebookUrl: "https://www.facebook.com/ThailandKitchens/",
    whatsappUrl: "https://wa.me/66993596916",
    footerOffices: [
      { label: "Samui Office", address: "Route 4169, Mae Nam, Amphoe Ko Samui, Surat Thani 84330" },
      {
        label: "Phuket Office",
        address: "Royal Phuket Marina, Building MS2, Ko Kaeo, Mueang, Phuket 83000",
      },
      {
        label: "Pattaya Office",
        address: "82, 48-49 Chaiyaphruek 2 Rd, Pattaya City, Bang Lamung District, Chon Buri 20150",
      },
    ],
    sectionCopy: {
      products: { title: "Our Products", subtitle: "Interiors made for the way you actually live" },
      partners: {
        title: "Our Global Partners",
        subtitle: "Powered by trusted brands from around the world",
      },
      coreStrengths: {
        title: "Core Strengths",
        subtitle: "Transforming data into intelligent, real-world solutions",
      },
      catalogue: { title: "Free Catalogue", subtitle: "Inspiration for Your Dream Kitchen" },
      testimonials: { title: "Real Stories. Real Spaces.", subtitle: "Hear how we've transformed houses into dream homes" },
      featured: { title: "Featured Projects", subtitle: "Designed to inspire. Built to last" },
    },
    searchPages: [
      { title: "Home", description: "Varsovia Design homepage", href: "/", order: 1 },
      { title: "Interior", description: "Browse all interior designs", href: "/interior", order: 2 },
      { title: "Kitchen Interior", description: "Kitchen designs", href: "/interior?category=Kitchen", order: 3 },
      { title: "Bedroom Interior", description: "Bedroom designs", href: "/interior?category=Bedroom", order: 4 },
      { title: "About Us", description: "Our story and values", href: "/about", order: 5 },
      { title: "Team", description: "Meet the team", href: "/team", order: 6 },
      { title: "Blog", description: "Design insights and news", href: "/blog", order: 7 },
      { title: "Catalogue", description: "Download catalogues", href: "/catalogue", order: 8 },
      { title: "Contact", description: "Get in touch", href: "/contact", order: 9 },
      { title: "FAQ", description: "Common questions", href: "/faq", order: 10 },
      { title: "Showcase", description: "Project showcase", href: "/showcase", order: 11 },
      { title: "Quality & After-sales", description: "Quality and support", href: "/quality-sale", order: 12 },
      { title: "Privacy Policy", description: "Privacy and data protection", href: "/privacy", order: 13 },
      { title: "Terms of Use", description: "Website terms of use", href: "/terms", order: 14 },
    ],
    interiorCatalogMode: "api",
    inquiryForm: require("../validation/inquiryForm").DEFAULT_INQUIRY_FORM,
    mainNavigation: require("../validation/mainNavigation").DEFAULT_MAIN_NAVIGATION,
    footerNavigation: require("../validation/footerNavigation").DEFAULT_FOOTER_NAVIGATION,
    qualitySale: {
      heroTitle: "Quality & After-Sales Support",
      heroSubtitle: "Built to last — supported long after installation",
      heroBody:
        "From precision manufacturing to dedicated after-sales care, Varsovia stands behind every project with clear processes and responsive support.",
      feature1Image: L.project1,
      feature1ImageAlt: "Premium kitchen cabinetry detail",
      feature2Image: L.project2,
      feature2ImageAlt: "Living room finish and texture",
      feature3Image: L.project3,
      feature3ImageAlt: "Bedroom wardrobe craftsmanship",
      feature4Image: L.project4,
      feature4ImageAlt: "Bathroom vanity and stone surface",
      support1Image: "/quality-sale/support-illustration-1.png",
      support2Image: "/quality-sale/support-illustration-2.png",
      support3Image: "/quality-sale/support-illustration-3.png",
      support4Image: "/quality-sale/support-illustration-4.png",
    },
  };
}

function productsDocs() {
  const base = [
    {
      title: "Kitchen Cabinet",
      slug: "kitchen-cabinet",
      description: "Our kitchen cabinets combine timeless design, premium materials, and practical functionality.",
      fullDescription:
        "Varsovia kitchen cabinets are built for the way you cook, gather, and live. From soft-close storage to carefully chosen finishes, every detail is measured for lasting beauty and everyday ease.",
      image: L.product1,
      gallery: [L.product1, L.about1, L.catalogue1, L.stats],
      features: [
        { text: "Custom layouts for L, U, Island & Parallel kitchens" },
        { text: "Premium soft-close hardware" },
        { text: "Durable finishes that age gracefully" },
        { text: "Integrated appliance planning" },
      ],
      specs: [
        { label: "Style", value: "Modern / Classic" },
        { label: "Material", value: "Wood, Acrylic, Laminate" },
        { label: "Finish", value: "Matte / Glossy / Soft Touch" },
        { label: "Warranty", value: "5 Years" },
      ],
      category: "Kitchen",
      featured: true,
      order: 1,
    },
    {
      title: "Bedroom Interior",
      slug: "bedroom-interior",
      description: "Soft lighting, tailored storage, and calm materials come together in bedrooms designed for rest.",
      fullDescription:
        "Our bedroom interiors are designed as quiet retreats with built-in wardrobes and layered lighting.",
      image: L.product2,
      gallery: [L.product2, L.about2, L.catalogue3, L.about3],
      features: [
        { text: "Floor-to-ceiling wardrobe systems" },
        { text: "Warm layered lighting" },
        { text: "Soft, durable fabrics and finishes" },
      ],
      specs: [
        { label: "Style", value: "Minimal / Luxury" },
        { label: "Warranty", value: "5 Years" },
      ],
      category: "Bedroom",
      featured: true,
      order: 2,
    },
    {
      title: "Bedroom Suite",
      slug: "bedroom-suite",
      description: "From wardrobes to bedside finishes, our bedroom interiors balance quiet luxury with everyday ease.",
      fullDescription: "A cohesive bedroom suite with hidden storage and calm material palettes.",
      image: L.product3,
      gallery: [L.product3, L.catalogue4, L.about1, L.hero],
      features: [{ text: "Cohesive suite design" }, { text: "Hidden storage solutions" }],
      specs: [{ label: "Style", value: "Contemporary" }],
      category: "Bedroom",
      featured: true,
      order: 3,
    },
    {
      title: "Minimalist Oak",
      slug: "minimalist-oak",
      description: "Clean lines and warm oak finishes for modern homes.",
      fullDescription: "Minimalist Oak pairs warm oak grain with crisp lines for calm, modern living.",
      image: L.product1,
      gallery: [L.product1, L.project2, L.about2],
      features: [{ text: "Warm oak finishes" }, { text: "Handle-less fronts" }],
      specs: [{ label: "Material", value: "Oak veneer" }],
      category: "Minimalist",
      featured: true,
      order: 4,
    },
    {
      title: "Contemporary White",
      slug: "contemporary-white",
      description: "Bright, sleek surfaces with soft ambient lighting.",
      fullDescription: "Contemporary White kitchens feel open, bright, and effortless to maintain.",
      image: L.product2,
      gallery: [L.product2, L.project4, L.about3],
      features: [{ text: "High-gloss and matte options" }],
      specs: [{ label: "Style", value: "Contemporary" }],
      category: "Contemporary",
      featured: true,
      order: 5,
    },
    {
      title: "Luxury Walnut",
      slug: "luxury-walnut",
      description: "Rich walnut tones with marble and brass accents.",
      fullDescription: "Luxury Walnut brings depth and warmth with premium hardware and stone accents.",
      image: L.product3,
      gallery: [L.product3, L.project3, L.project5],
      features: [{ text: "Walnut cabinetry" }, { text: "Brass hardware accents" }],
      specs: [{ label: "Style", value: "Luxury" }],
      category: "Luxury",
      featured: true,
      order: 6,
    },
    {
      title: "Scandinavian Light",
      slug: "scandinavian-light",
      description: "Airy palettes with natural wood and soft daylight.",
      fullDescription: "Scandinavian Light brings calm, bright surfaces and honest materials.",
      image: L.product1,
      gallery: [L.product1, L.about2, L.project1],
      features: [{ text: "Light oak and white fronts" }],
      specs: [{ label: "Style", value: "Scandinavian" }],
      category: "Kitchen",
      featured: true,
      order: 7,
    },
    {
      title: "Industrial Loft",
      slug: "industrial-loft",
      description: "Metal accents, open shelving, and urban character.",
      fullDescription: "Industrial Loft pairs raw textures with refined storage planning.",
      image: L.product2,
      gallery: [L.product2, L.project6, L.about1],
      features: [{ text: "Open shelving systems" }],
      specs: [{ label: "Style", value: "Industrial" }],
      category: "Kitchen",
      featured: true,
      order: 8,
    },
    {
      title: "Classic Shaker",
      slug: "classic-shaker",
      description: "Timeless shaker doors with modern internal organisation.",
      fullDescription: "Classic Shaker kitchens feel familiar yet fully tailored to your home.",
      image: L.product3,
      gallery: [L.product3, L.project4, L.catalogue2],
      features: [{ text: "Shaker door profiles" }],
      specs: [{ label: "Style", value: "Classic" }],
      category: "Kitchen",
      featured: true,
      order: 9,
    },
  ];
  return base;
}

function projectsDocs() {
  const kitchenDetailNarrative =
    "The objective was to create a kitchen that felt spacious while accommodating generous storage and a dining area. The challenge was solved by introducing an open island layout, concealed storage, and a neutral material palette that enhances natural light and visual openness.";
  const kitchenDetailIntroLong =
    "This modern kitchen was designed to create a warm, elegant, and highly functional space for everyday living. Featuring a spacious island, premium finishes, integrated appliances, and clean architectural lines, the design balances aesthetics with practicality. Every detail was carefully considered to maximize storage, improve workflow, and create a welcoming environment for cooking, dining, and entertaining.";

  return [
    {
      title: "The Amber Residence",
      slug: "amber-residence",
      detailTitle:
        "The Amber Residence Open-Plan Kitchen with Island Seating and Premium Finishes AMB1000",
      description: "A warm open-plan kitchen with island seating.",
      detailDescription:
        "A warm open-plan kitchen with island seating designed for everyday gathering.",
      narrativeOne: kitchenDetailNarrative,
      location: "Mumbai",
      coverImage: L.project1,
      gallery: [L.project1, L.project2, L.project3],
      category: "Kitchen",
      featured: true,
      interiorCatalog: true,
      isNew: true,
      order: 1,
      shape: "Island",
      style: "Modern",
      color: "Wood Tone",
      material: "Lacquer",
      finish: "Matte",
      price: 285000,
    },
    {
      title: "Skyline Apartment",
      slug: "skyline-apartment",
      detailTitle:
        "Skyline Apartment Modern L-Shape Kitchen Cabinetry with Full-Height Storage SKY2200",
      description: "Compact luxury with full-height storage.",
      detailDescription: kitchenDetailIntroLong,
      narrativeOne: kitchenDetailNarrative,
      location: "Pune",
      coverImage: L.project2,
      gallery: [L.project2, L.project3],
      category: "Kitchen",
      featured: true,
      interiorCatalog: true,
      order: 2,
      shape: "L Shape",
      style: "Modern",
      color: "Gray",
      material: "Melamine",
      finish: "Matte",
      price: 245000,
    },
    {
      title: "Warm Walnut",
      slug: "warm-walnut",
      detailTitle:
        "Warm Walnut Residence Traditional U-Shape Kitchen with Marble Accents WW3300",
      description: "Rich walnut tones with marble accents.",
      detailDescription: kitchenDetailIntroLong,
      narrativeOne: kitchenDetailNarrative,
      location: "Bangalore",
      coverImage: L.project3,
      gallery: [L.project3],
      category: "Kitchen",
      featured: true,
      interiorCatalog: true,
      order: 3,
      shape: "U Shape",
      style: "Traditional",
      color: "Brown",
      material: "Thermofoil",
      finish: "Matte",
      price: 268000,
    },
    {
      title: "Ivory Luxe",
      slug: "ivory-luxe",
      description: "Bright ivory finishes with soft ambient lighting.",
      location: "Ahmedabad",
      coverImage: L.project4,
      gallery: [L.project4],
      category: "Bedroom",
      featured: true,
      interiorCatalog: true,
      order: 4,
      subcategory: "Custom Wardrobes",
      style: "Modern",
      color: "White",
      material: "Lacquer",
      finish: "Matte",
      price: 198000,
    },
    {
      title: "Graphite Studio",
      slug: "graphite-studio",
      description: "Dark graphite palette with brass hardware.",
      location: "Delhi",
      coverImage: L.project5,
      gallery: [L.project5],
      category: "Bathroom",
      featured: true,
      interiorCatalog: true,
      order: 5,
      subcategory: "Wall Mounted & Floating",
      style: "Modern",
      color: "Gray",
      material: "Glass",
      finish: "Matte",
      price: 165000,
    },
    {
      title: "Coastal Oak",
      slug: "coastal-oak",
      description: "Light oak with coastal-inspired tones.",
      location: "Goa",
      coverImage: L.project6,
      gallery: [L.project6],
      category: "Door & Windows",
      featured: true,
      interiorCatalog: true,
      order: 6,
      subcategory: "Aluminum Doors and Windows",
      style: "Modern",
      color: "Wood Tone",
      material: "Thermofoil",
      finish: "Matte",
      price: 142000,
    },
    {
      title: "Midnight Suite",
      slug: "midnight-suite",
      description: "Deep tones with layered textures.",
      location: "Hyderabad",
      coverImage: L.project7,
      gallery: [L.project7],
      category: "Whole House Solutions",
      featured: true,
      interiorCatalog: true,
      order: 7,
      style: "Traditional",
      color: "Dark",
      material: "Lacquer",
      finish: "Matte",
      price: 520000,
    },
    {
      title: "Open Living",
      slug: "open-living",
      description: "Open kitchen and living integration.",
      location: "Chennai",
      coverImage: L.project8,
      gallery: [L.project8],
      category: "Furniture",
      featured: true,
      interiorCatalog: true,
      order: 8,
      style: "Modern",
      color: "Beige",
      material: "Glass",
      finish: "Matte",
      price: 88000,
    },
  ];
}

function partnersDocs() {
  return [
    { name: "Fischer", logo: "/partners/figma/fischer.png", website: "", order: 1 },
    { name: "Bostik", logo: "/partners/figma/bostik.png", website: "", order: 2 },
    { name: "Egger", logo: "/partners/figma/egger.png", website: "", order: 3 },
    { name: "Blum", logo: "/partners/figma/blum.png", website: "", order: 4 },
    { name: "Jowat", logo: "/partners/figma/jowat.png", website: "", order: 5 },
    { name: "Partner emblem", logo: "/partners/figma/emblem.png", website: "", order: 6 },
  ];
}

function coreStrengthsDocs() {
  return [
    {
      title: "Reveals hidden construction",
      description:
        "Shows material layering (flooring, subfloor, ceiling void, insulation) that plan views can't capture.",
      image: L.core1,
      iconKey: "eye",
      order: 1,
    },
    {
      title: "Accurate height & clearance planning",
      description:
        "Confirms ceiling heights, soffit drops, counter heights, and door/window head heights align correctly.",
      image: L.core2,
      iconKey: "ruler",
      order: 2,
    },
    {
      title: "Coordinates trades",
      description:
        "Electricians, HVAC, plumbers, and carpenters can spot clashes before construction begins.",
      image: L.core3,
      iconKey: "users",
      order: 3,
    },
    {
      title: "Precise material specification",
      description:
        "Lets you call out exact materials and thicknesses of each layer, e.g. for a window sill or built-in cabinet.",
      image: L.core4,
      iconKey: "box",
      order: 4,
    },
    {
      title: "Reduces on-site errors and rework",
      description: "Removes ambiguity, which is the biggest cause of site delays and budget overruns.",
      image: L.core5,
      iconKey: "shield",
      order: 5,
    },
    {
      title: "Communicates custom details clearly",
      description:
        "Essential for bespoke elements like staircases, false ceilings, or feature walls that standard drawings miss.",
      image: L.core6,
      iconKey: "pen",
      order: 6,
    },
  ];
}

function testimonialsDocs() {
  return [
    {
      name: "Ananya Mehta",
      role: "Homeowner, Mumbai",
      quote:
        "Varsovia transformed our outdated kitchen into a calm, beautiful space we actually love cooking in every day.",
      rating: 5,
      image: L.story2,
      order: 1,
    },
    {
      name: "Rohan Kapoor",
      role: "Architect Partner",
      quote: "Their attention to detail and finish quality is exceptional. Clients always notice the difference.",
      rating: 5,
      image: L.story3,
      order: 2,
    },
    {
      name: "Priya Shah",
      role: "Homeowner, Bangalore",
      quote: "From consultation to installation, the team was thoughtful, precise, and a pleasure to work with.",
      rating: 5,
      image: L.story4,
      order: 3,
    },
    {
      name: "Brooklyn Simmons",
      role: "Homeowner",
      quote:
        "We had a small kitchen with eleven years of accumulated clutter and no real system. The team redesigned everything around our habits.",
      rating: 5,
      image: L.story1,
      order: 4,
    },
    {
      name: "Emily Carter",
      role: "Homeowner",
      quote: "They listened carefully and delivered a kitchen that feels both luxurious and effortless every morning.",
      rating: 5,
      image: L.story5,
      order: 5,
    },
  ];
}

function cataloguesDocs() {
  return [
    { title: "Classic Collection 2026", coverImage: L.catalogue1, downloadUrl: "/catalogue", order: 1 },
    { title: "Modern Living", coverImage: L.catalogue2, downloadUrl: "/catalogue", order: 2 },
    { title: "Explore Modern Design", coverImage: L.catalogue3, downloadUrl: "/catalogue", order: 3 },
    { title: "Warm Neutrals", coverImage: L.catalogue4, downloadUrl: "/catalogue", order: 4 },
    { title: "Urban Kitchens", coverImage: L.catalogue5, downloadUrl: "/catalogue", order: 5 },
    { title: "Coastal Living", coverImage: L.catalogue3, downloadUrl: "/catalogue", order: 6 },
  ];
}

function blogsDocs() {
  return [
    {
      title: "Expert Tips For Beautiful And Functional Kitchens",
      excerpt:
        "Expert tips for beautiful and functional kitchens — comfort, storage, and refined style together.",
      content:
        "Expert Tips For Beautiful And Functional Kitchens brings comfort, storage, and refined style together. In this article we explore layout, materials, and lighting choices that make everyday cooking a pleasure.",
      date: "12 Jun 2026",
      readTime: "5 min",
      author: { name: "Courtney Henry", avatar: L.team },
      image: L.blog,
      views: 48,
      order: 1,
    },
    {
      title: "Top Trends Transforming Modern Interior Design Showrooms in 2026",
      excerpt: "For entrepreneurs and showroom investors, keeping up with design updates is essential.",
      content: "Interior design continues to evolve with changing lifestyles and modern living needs.",
      date: "10 Jun 2026",
      readTime: "4 min",
      author: { name: "Courtney Henry", avatar: L.team },
      image: L.blog,
      views: 31,
      order: 2,
    },
    {
      title: "Warm Materials for Calm Bedrooms",
      excerpt: "How texture and light shape restful bedroom interiors.",
      content: "Bedroom design starts with how you wind down at night — storage, softness, and light layers matter.",
      date: "5 Jun 2026",
      readTime: "3 min",
      author: { name: "Alex Morgan", avatar: L.team },
      image: L.blog,
      views: 22,
      order: 3,
    },
  ];
}

function teamDocs() {
  return [
    { name: "John Smith", role: "Founder & Creative Director", image: L.team, teamType: "Headquarter", order: 1 },
    { name: "Maria Rossi", role: "Lead Interior Designer", image: L.team, teamType: "Italian", order: 2 },
    { name: "David Chen", role: "Project Manager", image: L.team, teamType: "Headquarter", order: 3 },
    { name: "Elena Novak", role: "Senior Architect", image: L.team, teamType: "Italian", order: 4 },
    { name: "Annette Black", role: "Senior Interior Designer", image: L.team, teamType: "Italian", order: 5 },
    { name: "Cameron Williamson", role: "Design Lead — Kitchens", image: L.team, teamType: "Italian", order: 6 },
    { name: "Robert Fox", role: "Materials Consultant", image: L.team, teamType: "Italian", order: 7 },
    { name: "Rohan Kapoor", role: "Lead Architect", image: L.team, teamType: "Headquarter", order: 8 },
    { name: "Lisa Müller", role: "Structural Engineer", image: L.team, teamType: "Headquarter", order: 9 },
    { name: "Michael Torres", role: "Site Supervisor", image: L.team, teamType: "Headquarter", order: 10 },
    { name: "Priya Sharma", role: "Structural Engineer", image: L.team, teamType: "Headquarter", order: 11 },
    { name: "Emma Collins", role: "MEP Coordinator", image: L.team, teamType: "Headquarter", order: 12 },
  ];
}

function faqsDocs() {
  return [
    { question: "Do you provide customized modular kitchens?", answer: "Yes. Every kitchen is custom-designed to match your space, cooking habits, and style preferences.", category: "Kitchen Interior", order: 1 },
    { question: "Which materials do you use for kitchen cabinets?", answer: "We use high-grade water-resistant plywood, MDF, and particle boards with acrylic, laminate, or PU finishes for durability.", category: "Kitchen Interior", order: 2 },
    { question: "Can I choose colors and finishes?", answer: "Absolutely! We offer a wide range of colors and finishes, from matte and glossy acrylics to textured wood veneers.", category: "Kitchen Interior", order: 3 },
    { question: "How long does a kitchen installation take?", answer: "Typically, modular kitchen fabrication takes 3 to 4 weeks at our facility, and on-site assembly takes 3 to 5 days.", category: "Kitchen Interior", order: 4 },
    { question: "Do modular kitchens come with a warranty?", answer: "Yes, our modular kitchens come with a 5-year warranty covering manufacturing defects and hardware performance.", category: "Kitchen Interior", order: 5 },
    { question: "What bedroom storage options do you offer?", answer: "We design custom wardrobes, walk-in closets, under-bed storage, loft spaces, and integrated dressing tables.", category: "Bedroom Interior", order: 6 },
    { question: "Can you design a wardrobe to fit a specific niche?", answer: "Yes, all our wardrobes are tailored to fit your bedroom layout, wall niches, and ceiling heights exactly.", category: "Bedroom Interior", order: 7 },
    { question: "Which finishes are best for wardrobes?", answer: "Laminates are durable and easy to maintain, while mirrors and glass sliders make smaller bedrooms feel larger.", category: "Bedroom Interior", order: 8 },
  ];
}

function showroomsDocs() {
  return [
    { name: "Varsovia Flagship", location: "Bandra, Mumbai", image: L.showroom1, address: "42 Linking Road, Bandra West", order: 1 },
    { name: "Design Studio", location: "Koregaon Park, Pune", image: L.showroom2, address: "18 North Main Road", order: 2 },
    { name: "Experience Centre", location: "Indiranagar, Bangalore", image: L.showroom3, address: "100 Feet Road, Indiranagar", order: 3 },
  ];
}

function showcasesDocs() {
  const SHOWCASE_CATEGORIES = ["Home case", "Commercial Project", "Europe", "Asia", "North America", "Middle East"];
  const images = [L.project1, L.project2, L.project3, L.project4, L.project5, L.project6];
  const docs = [];
  SHOWCASE_CATEGORIES.forEach((cat, ci) => {
    for (let i = 0; i < 4; i++) {
      const img = images[(ci * 4 + i) % images.length];
      docs.push({
        title: `Custom Interior Project in ${cat} ${i + 1}`,
        category: cat,
        image: img,
        location: cat,
        typeLabel: "Type",
        typeValue: ci % 2 === 0 ? "Villa(1 Floor)" : "Apartment",
        supplyArea: "Kitchen, Bedroom, Living Room",
        gallery: [img, images[(ci * 4 + i + 1) % images.length], images[(ci * 4 + i + 2) % images.length]],
        order: ci * 4 + i + 1,
      });
    }
  });
  return docs;
}

module.exports = {
  L,
  siteContentDoc,
  productsDocs,
  projectsDocs,
  partnersDocs,
  coreStrengthsDocs,
  testimonialsDocs,
  cataloguesDocs,
  blogsDocs,
  teamDocs,
  faqsDocs,
  showroomsDocs,
  showcasesDocs,
};
