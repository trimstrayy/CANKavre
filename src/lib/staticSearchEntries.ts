import { SearchEntry } from "@/contexts/SearchContext";

const createProgramEntries = (): SearchEntry[] => {
  const hero = {
    badge: "Our Initiatives",
    title: "Programs & Initiatives",
    description:
      "Driving digital transformation across Kavrepalanchok through comprehensive ICT programs that empower communities and bridge the technology gap.",
    primaryCta: { label: "View Events" },
    secondaryCta: { label: "Get Involved" },
  };

  const achievements = [
    { number: "50+", label: "IT Clubs Established" },
    { number: "5000+", label: "Citizens Trained" },
    { number: "100+", label: "Programs Conducted" },
    { number: "15+", label: "Schools Covered" },
  ];

  const programs = [
    {
      title: "Digital Literacy Campaign",
      description:
        "Empowering citizens of all ages with basic computer and internet skills. Our comprehensive training covers essential digital skills needed in today's world.",
      features: [
        "Basic Computer Training",
        "Internet Safety",
        "Email & Social Media",
        "Online Banking Basics",
      ],
      icon: "laptop",
    },
    {
      title: "IT Club Development",
      description:
        "Establishing and supporting IT clubs in schools across Kavrepalanchok to nurture the next generation of tech leaders.",
      features: [
        "School IT Club Setup",
        "Student Mentorship",
        "Coding Workshops",
        "Inter-school Competitions",
      ],
      icon: "graduationCap",
    },
    {
      title: "ICT in Agriculture",
      description:
        "Introducing modern farming techniques through technology. Helping farmers adopt digital tools for better productivity and market access.",
      features: [
        "Digital Farming Tools",
        "Market Connectivity",
        "Weather Information",
        "E-Commerce Training",
      ],
      icon: "globe",
    },
    {
      title: "Women in Tech",
      description:
        "Special programs designed to increase female participation in the ICT sector, providing skills training and career guidance.",
      features: [
        "Skills Training",
        "Career Guidance",
        "Networking Events",
        "Entrepreneurship Support",
      ],
      icon: "users",
    },
    {
      title: "E-Governance Support",
      description:
        "Assisting local government bodies in implementing digital solutions for better public service delivery.",
      features: [
        "Digital Documentation",
        "Online Services",
        "Staff Training",
        "Infrastructure Support",
      ],
      icon: "building2",
    },
    {
      title: "Health & ICT",
      description:
        "Promoting digital health solutions and telemedicine awareness in remote areas of the district.",
      features: [
        "Telemedicine Awareness",
        "Health App Training",
        "Digital Health Records",
        "Emergency Response Systems",
      ],
      icon: "heart",
    },
  ];

  const upcoming = [
    {
      title: "Web Development Bootcamp",
      date: "2080/04/15 - 2080/04/30",
      location: "Dhulikhel",
      spots: "30 seats available",
      ctaLabel: "Register",
    },
    {
      title: "Cybersecurity Awareness Workshop",
      date: "2080/05/10",
      location: "Banepa",
      spots: "50 seats available",
      ctaLabel: "Register",
    },
    {
      title: "Mobile App Development Training",
      date: "2080/05/20 - 2080/06/05",
      location: "Kavre",
      spots: "25 seats available",
      ctaLabel: "Register",
    },
  ];

  const cta = {
    title: "Want to Partner With Us?",
    description:
      "We collaborate with organizations, educational institutions, and government bodies to expand our reach and impact.",
    primaryCta: { label: "Contact Us" },
    secondaryCta: { label: "Learn About Us" },
  };

  const entries: SearchEntry[] = [];

  entries.push({
    id: "programs-hero",
    route: "/programs",
    title: hero.title,
    description: hero.description,
    content: [hero.badge, hero.primaryCta.label, hero.secondaryCta.label]
      .filter(Boolean)
      .join(" "),
    tags: ["Programs", "Hero"],
  });

  achievements.forEach((achievement, index) => {
    entries.push({
      id: `programs-achievement-${index}`,
      route: "/programs",
      title: `Achievement: ${achievement.label}`,
      description: achievement.number,
      content: `${achievement.label} ${achievement.number}`,
      tags: ["Programs", "Achievements"],
    });
  });

  programs.forEach((program, index) => {
    entries.push({
      id: `programs-program-${index}`,
      route: "/programs",
      title: program.title,
      description: program.description,
      content: [program.description, program.features.join(" ")].join(" "),
      tags: ["Programs", "Initiatives", program.icon],
    });
  });

  upcoming.forEach((item, index) => {
    entries.push({
      id: `programs-upcoming-${index}`,
      route: "/programs",
      title: `Upcoming: ${item.title}`,
      description: `${item.date} • ${item.location}`,
      content: `${item.title} ${item.date} ${item.location} ${item.spots} ${item.ctaLabel}`,
      tags: ["Programs", "Schedule"],
    });
  });

  entries.push({
    id: "programs-cta",
    route: "/programs",
    title: cta.title,
    description: cta.description,
    content: [cta.description, cta.primaryCta.label, cta.secondaryCta.label]
      .filter(Boolean)
      .join(" "),
    tags: ["Programs", "Call to Action"],
  });

  return entries;
};

const createDownloadsEntries = (): SearchEntry[] => {
  const hero = {
    highlight: "Downloads",
    headingSuffix: "& Resources",
    subtitle: "Access official documents, reports, forms, and other resources from CAN Kavre.",
  };

  const generalDownloads = [
    {
      id: 1,
      title: "CAN Kavre Constitution",
      description: "Official constitution document",
      category: "Legal",
      size: "2.4 MB",
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "Membership Form",
      description: "Application form for new members",
      category: "Forms",
      size: "156 KB",
      date: "2024-02-01",
    },
    {
      id: 3,
      title: "Annual Report 2080",
      description: "Complete annual report",
      category: "Reports",
      size: "5.2 MB",
      date: "2024-03-15",
    },
    {
      id: 4,
      title: "IT Club Guidelines",
      description: "Guidelines for school IT clubs",
      category: "Guidelines",
      size: "890 KB",
      date: "2024-02-20",
    },
  ];

  const reports: Record<string, Array<{ id: number; title: string; author: string; size: string; date: string; type: string }>> = {
    secretary: [
      {
        id: 1,
        title: "Secretary Report - Fiscal Year 2080",
        author: "Secretary Office",
        date: "2024-03-01",
        size: "1.2 MB",
        type: "pdf",
      },
      {
        id: 2,
        title: "Secretary Report - Fiscal Year 2079",
        author: "Secretary Office",
        date: "2023-03-01",
        size: "980 KB",
        type: "pdf",
      },
    ],
    treasurer: [
      {
        id: 1,
        title: "Financial Statement 2080",
        author: "Treasurer Office",
        date: "2024-03-15",
        size: "2.1 MB",
        type: "pdf",
      },
      {
        id: 2,
        title: "Audit Report 2079",
        author: "External Auditor",
        date: "2023-04-01",
        size: "1.5 MB",
        type: "pdf",
      },
    ],
    coordinator: [
      {
        id: 1,
        title: "Program Coordinator Report 2080",
        author: "Program Coordinator",
        date: "2024-02-28",
        size: "1.8 MB",
        type: "pdf",
      },
      {
        id: 2,
        title: "IT Club Coordinator Report",
        author: "IT Club Coordinator",
        date: "2024-01-15",
        size: "750 KB",
        type: "pdf",
      },
    ],
    itclub: [
      {
        id: 1,
        title: "Dhulikhel School IT Club Report",
        author: "IT Club Coordinator",
        date: "2024-02-01",
        size: "650 KB",
        type: "pdf",
      },
      {
        id: 2,
        title: "Banepa Campus IT Club Report",
        author: "IT Club Coordinator",
        date: "2024-02-15",
        size: "820 KB",
        type: "pdf",
      },
    ],
  };

  const reportLabels: Record<string, string> = {
    secretary: "Secretary",
    treasurer: "Treasurer",
    coordinator: "Coordinator",
    itclub: "IT Club",
  };

  const entries: SearchEntry[] = [];

  entries.push({
    id: "downloads-hero",
    route: "/downloads",
    title: `${hero.highlight} ${hero.headingSuffix}`.trim(),
    description: hero.subtitle,
    content: hero.subtitle,
    tags: ["Downloads", "Hero"],
  });

  generalDownloads.forEach((item, index) => {
    entries.push({
      id: `download-general-${item.id ?? index}`,
      route: "/downloads",
      title: item.title,
      description: item.description,
      content: `${item.description} ${item.category} ${item.size} ${item.date}`,
      tags: ["Downloads", item.category],
    });
  });

  Object.entries(reports).forEach(([category, items]) => {
    items.forEach((item, index) => {
      entries.push({
        id: `download-report-${category}-${item.id ?? index}`,
        route: "/downloads",
        title: item.title,
        description: `${item.author} • ${item.size}`,
        content: `${item.title} ${item.author} ${item.date} ${item.size}`,
        tags: ["Reports", reportLabels[category] ?? category, item.type],
      });
    });
  });

  return entries;
};

const createNoticeEntries = (): SearchEntry[] => {
  const hero = {
    title: "Notice",
    highlight: "Board",
    description: "Important announcements, deadlines, and updates from CAN Kavre.",
  };

  const section = {
    heading: "Latest Notices",
    intro: "",
  };

  const notices = [
    {
      id: 1,
      title: "Membership Renewal Deadline Extended",
      content:
        "The deadline for membership renewal has been extended to Ashad 15, 2081. Members are requested to renew their membership before the deadline.",
      date: "2024-05-20",
      priority: "high",
      type: "deadline",
    },
    {
      id: 2,
      title: "ICT Day 2081 Registration Open",
      content:
        "Registration for ICT Day 2081 celebration is now open. All members and interested individuals can register through our website.",
      date: "2024-05-15",
      priority: "medium",
      type: "announcement",
    },
    {
      id: 3,
      title: "Office Timing Change Notice",
      content: "CAN Kavre office will operate from 10:00 AM to 5:00 PM starting from Jestha 1, 2081.",
      date: "2024-05-10",
      priority: "low",
      type: "info",
    },
    {
      id: 4,
      title: "Call for IT Club Coordinator Applications",
      content:
        "Applications are invited for the position of District IT Club Coordinator. Interested candidates may submit their applications by Jestha 30, 2081.",
      date: "2024-05-05",
      priority: "medium",
      type: "deadline",
    },
    {
      id: 5,
      title: "Annual General Meeting Announcement",
      content:
        "The Annual General Meeting will be held on Ashad 5, 2081 at Dhulikhel Municipality Hall. All members are requested to attend.",
      date: "2024-04-28",
      priority: "high",
      type: "announcement",
    },
  ];

  const entries: SearchEntry[] = [];

  entries.push({
    id: "notice-hero",
    route: "/notice",
    title: `${hero.title} ${hero.highlight}`.trim(),
    description: hero.description,
    content: hero.description,
    tags: ["Notice", "Hero"],
  });

  entries.push({
    id: "notice-section",
    route: "/notice",
    title: section.heading,
    description: section.intro,
    content: section.intro,
    tags: ["Notice", "Section"],
  });

  notices.forEach((notice, index) => {
    entries.push({
      id: `notice-item-${notice.id ?? index}`,
      route: "/notice",
      title: notice.title,
      description: notice.content,
      content: `${notice.content} ${notice.date} ${notice.priority} ${notice.type}`,
      tags: ["Notice", notice.priority, notice.type],
    });
  });

  return entries;
};

const createPressEntries = (): SearchEntry[] => {
  const hero = {
    title: "Press",
    highlight: "Releases",
    description: "Stay informed about the latest news and announcements from CAN Kavre.",
  };

  const filters = {
    searchPlaceholder: "Search press releases...",
    allLabel: "All",
    categories: ["Events", "IT Club", "Training", "Partnership", "Organization"],
    defaultCategory: "All",
  };

  const pressItems = [
    {
      id: 1,
      title: "CAN Kavre Successfully Conducts ICT Day 2081 Celebration",
      excerpt:
        "Over 200 participants joined the annual ICT Day celebration organized by CAN Kavre at Dhulikhel Municipality Hall.",
      date: "2024-05-17",
      category: "Events",
    },
    {
      id: 2,
      title: "New IT Club Established at Panauti Secondary School",
      excerpt:
        "CAN Kavre inaugurated a new IT club at Panauti Secondary School with 45 student members.",
      date: "2024-04-20",
      category: "IT Club",
    },
    {
      id: 3,
      title: "Digital Literacy Workshop for Senior Citizens",
      excerpt:
        "A week-long digital literacy program was conducted for senior citizens in Banepa municipality.",
      date: "2024-03-15",
      category: "Training",
    },
    {
      id: 4,
      title: "CAN Kavre Signs MoU with Local Government",
      excerpt:
        "Memorandum of Understanding signed with Dhulikhel Municipality for e-governance support.",
      date: "2024-02-28",
      category: "Partnership",
    },
    {
      id: 5,
      title: "Career Opportunities in ICT Seminar 2081",
      excerpt:
        "Over 150 students attended the career guidance seminar on opportunities in the ICT sector.",
      date: "2024-02-10",
      category: "Events",
    },
    {
      id: 6,
      title: "Annual General Meeting 2080 Concluded",
      excerpt:
        "The AGM was successfully concluded with the presentation of annual reports and future plans.",
      date: "2024-01-25",
      category: "Organization",
    },
  ];

  const settings = {
    readMoreLabel: "Read full article",
  };

  const entries: SearchEntry[] = [];

  entries.push({
    id: "press-hero",
    route: "/press-releases",
    title: `${hero.title} ${hero.highlight}`.trim(),
    description: hero.description,
    content: hero.description,
    tags: ["Press", "Hero"],
  });

  entries.push({
    id: "press-filters",
    route: "/press-releases",
    title: "Press Release Filters",
    description: `Categories: ${filters.categories.join(", ")}`,
    content: [
      filters.searchPlaceholder,
      filters.allLabel,
      filters.categories.join(" "),
      filters.defaultCategory,
    ]
      .filter(Boolean)
      .join(" "),
    tags: ["Press", "Filters"],
  });

  pressItems.forEach((item, index) => {
    entries.push({
      id: `press-item-${item.id ?? index}`,
      route: "/press-releases",
      title: item.title,
      description: item.excerpt,
      content: `${item.excerpt} ${item.category} ${item.date}`,
      tags: ["Press", item.category],
    });
  });

  entries.push({
    id: "press-settings",
    route: "/press-releases",
    title: "Press Release Settings",
    description: `Read more label: ${settings.readMoreLabel}`,
    content: settings.readMoreLabel,
    tags: ["Press", "Settings"],
  });

  return entries;
};

const createEventEntries = (): SearchEntry[] => {
  const heroEntry: SearchEntry = {
    id: "events-hero",
    route: "/events",
    title: "Events & Gallery",
    description: "Stay updated with our upcoming events and explore memories from past programs.",
    content: "Stay updated with our upcoming events and explore memories from past programs.",
    tags: ["Events", "Hero"],
  };

  const events = [
    {
      id: 1,
      title: "ICT Day 2081 Celebration",
      description:
        "Annual celebration of ICT Day with various programs including workshops, exhibitions, and awareness campaigns.",
      date: "2024-05-17",
      time: "10:00 AM",
      location: "Dhulikhel Municipality Hall",
      attendees: 200,
      status: "upcoming",
    },
    {
      id: 2,
      title: "Digital Literacy Workshop",
      description: "Basic computer and internet skills training for senior citizens and women.",
      date: "2024-04-15",
      time: "9:00 AM",
      location: "CAN Kavre Office",
      attendees: 50,
      status: "completed",
    },
    {
      id: 3,
      title: "Career Opportunities in ICT 2081",
      description: "Seminar on career paths in information technology for students.",
      date: "2024-03-20",
      time: "2:00 PM",
      location: "Banepa Campus",
      attendees: 150,
      status: "completed",
    },
    {
      id: 4,
      title: "Web Development Bootcamp",
      description: "5-day intensive training on modern web development technologies.",
      date: "2024-06-01",
      time: "10:00 AM",
      location: "IT Training Center",
      attendees: 30,
      status: "upcoming",
    },
  ];

  const gallery = [
    { id: 1, title: "ICT Day 2080" },
    { id: 2, title: "Workshop Session" },
    { id: 3, title: "Training Program" },
    { id: 4, title: "Blood Donation" },
    { id: 5, title: "Team Meeting" },
    { id: 6, title: "Conference" },
  ];

  const entries: SearchEntry[] = [heroEntry];

  events.forEach((event) => {
    entries.push({
      id: `event-${event.id}`,
      route: "/events",
      title: event.title,
      description: event.description,
      content: `${event.description} ${event.date} ${event.time} ${event.location} ${event.status} ${event.attendees}`,
      tags: ["Events", event.status],
    });
  });

  gallery.forEach((image) => {
    entries.push({
      id: `event-gallery-${image.id}`,
      route: "/events#gallery",
      title: image.title,
      description: "Gallery image",
      content: image.title,
      tags: ["Gallery"],
    });
  });

  return entries;
};

const coreEntries: SearchEntry[] = [
  {
    id: "static-home",
    route: "/",
    title: "CAN Kavre Federation",
    description: "Official site of CAN Federation Kavre Branch",
    content:
      "CAN Kavre promotes ICT awareness, organizes events, and supports local communities with digital initiatives across Kavrepalanchok.",
    tags: ["Home", "Overview"],
  },
  {
    id: "static-about",
    route: "/about",
    title: "About CAN Kavre",
    description: "Learn about our mission, committees, and leadership",
    content:
      "Information about CAN Kavre's mission, organizational structure, committees, and the team's ongoing efforts to build e-Nepal.",
    tags: ["About", "Organization"],
  },
  {
    id: "static-membership",
    route: "/membership",
    title: "Membership Information",
    description: "Join CAN Kavre and become a member",
    content:
      "Membership benefits, eligibility criteria, and instructions on how to join CAN Kavre to collaborate on ICT-focused programs.",
    tags: ["Membership", "Join"],
  },
  {
    id: "static-auth",
    route: "/auth",
    title: "Member Portal",
    description: "Login to access member resources",
    content:
      "Authenticate to access member-only resources, manage participation, and collaborate with CAN Kavre initiatives.",
    tags: ["Auth", "Members"],
  },
  {
    id: "static-admin",
    route: "/admin",
    title: "Admin Dashboard",
    description: "Administrative controls and analytics",
    content:
      "Administrative area for managing CAN Kavre content, reviewing program data, and coordinating organizational operations.",
    tags: ["Admin", "Management"],
  },
  {
    id: "static-downloads",
    route: "/downloads",
    title: "Downloads Overview",
    description: "Access important documents and reports",
    content:
      "Summary of downloadable resources including forms, guidelines, constitution, and committee reports curated by CAN Kavre.",
    tags: ["Downloads", "Resources"],
  },
];

export const staticSearchEntries: SearchEntry[] = [
  ...coreEntries,
  ...createProgramEntries(),
  ...createDownloadsEntries(),
  ...createNoticeEntries(),
  ...createPressEntries(),
  ...createEventEntries(),
];
