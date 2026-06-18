export type Language = "en" | "ne";

export interface TranslationKeys {
  // Navbar
  home: string;
  aboutUs: string;
  committee: string;
  currentCommittee: string;
  pastCommittees: string;
  subcommittees: string;
  programs: string;
  news: string;
  pressReleases: string;
  noticeBoard: string;
  events: string;
  eventsGallery: string;
  calendar: string;
  downloads: string;
  login: string;
  memberLogin: string;
  menu: string;
  searchPlaceholder: string;
  
  // Top Banner
  letsBuildENepal: string;
  
  // Headlines
  headline: string;
  
  // Hero Section
  canKavre: string;
  seventhExecutiveCommittee: string;
  leadingCanKavre: string;
  ictTrainingPrograms: string;
  empoweringYouth: string;
  communityDevelopment: string;
  bridgingDigitalDivide: string;
  watchVideo: string;
  
  // Welcome Banner
  computerAssociationNepal: string;
  kavreBranch: string;
  established: string;
  joinCanKavre: string;
  learnMore: string;
  
  // News Section
  latestNews: string;
  viewAll: string;
  upcomingEvents: string;
  viewAllEvents: string;
  quickLinks: string;
  photoGallery: string;
  membership: string;
  
  // Stats
  yearsActive: string;
  itClubs: string;
  members: string;
  eventsCount: string;
  
  // Mission Vision Objectives
  ourFoundation: string;
  missionVisionObjectives: string;
  ourMission: string;
  missionText: string;
  ourVision: string;
  visionText: string;
  ourObjectives: string;
  objectivesText: string;
  
  // Footer
  contactUs: string;
  address: string;
  addressText: string;
  phone: string;
  email: string;
  quickLinksFooter: string;
  stayConnected: string;
  newsletterText: string;
  yourEmail: string;
  subscribe: string;
  sendFeedback: string;
  feedbackText: string;
  fullName: string;
  contactNumber: string;
  message: string;
  captchaQuestion: string;
  yourAnswer: string;
  submitFeedback: string;
  allRightsReserved: string;
  
  // About Page
  aboutCanKavre: string;
  ourHistory: string;
  historyText: string;
  currentMainCommittee: string;
  viewPastCommittees: string;
  hidePastCommittees: string;
  subcommitteesTitle: string;
  itClubsTitle: string;
  position: string;
  contact: string;
  coordinator: string;
  
  // Programs Page
  ourPrograms: string;
  programsSubtitle: string;
  featuredPrograms: string;
  upcomingPrograms: string;
  ourAchievements: string;
  trainingsCompleted: string;
  schoolsReached: string;
  beneficiaries: string;
  addProgram: string;
  editProgram: string;
  deleteProgram: string;
  programAdded: string;
  programUpdated: string;
  programDeleted: string;
  deadline: string;
  category: string;
  noPrograms: string;
  
  // Events Page
  eventsTitle: string;
  eventsSubtitle: string;
  galleryTitle: string;
  
  // Downloads Page
  downloadsTitle: string;
  downloadsSubtitle: string;
  generalResources: string;
  reportCollection: string;
  secretaryReports: string;
  treasurerReports: string;
  coordinatorReports: string;
  itClubReports: string;
  download: string;
  
  // Press Releases
  pressReleasesTitle: string;
  pressReleasesSubtitle: string;
  searchPressReleases: string;
  allCategories: string;
  readMore: string;
  
  // Notice
  noticeTitle: string;
  noticeSubtitle: string;
  important: string;
  general: string;
  urgent: string;
  
  // Membership
  membershipTitle: string;
  membershipSubtitle: string;
  membershipTypes: string;
  committeeLogin: string;
  subcommitteeLogin: string;
  notMember: string;
  registerHere: string;
  enterCredentials: string;
  username: string;
  password: string;
  loggingIn: string;
  benefits: string;
  
  // Auth Page
  welcomeBack: string;
  signInToContinue: string;
  committeeMember: string;
  memberAccount: string;
  forgotPassword: string;
  newRegistration: string;
  registerOnCanNepal: string;
  
  // Admin
  adminDashboard: string;
  pendingApprovals: string;
  contentManagement: string;
  settings: string;
}

export const translations: Record<Language, TranslationKeys> = {
  en: {
    // Navbar
    home: "Home",
    aboutUs: "About Us",
    committee: "Committee",
    currentCommittee: "Current Committee",
    pastCommittees: "Past Committees",
    subcommittees: "Subcommittees",
    programs: "Programs",
    news: "News",
    pressReleases: "Press Releases",
    noticeBoard: "Notice Board",
    events: "Events",
    eventsGallery: "Events & Gallery",
    calendar: "Calendar",
    downloads: "Downloads",
    login: "Login",
    memberLogin: "Member Login",
    menu: "Menu",
    searchPlaceholder: "Search site content...",
    
    // Top Banner
    letsBuildENepal: "Let's Build eNepal Together, We CAN.",
    
    // Headlines
    headline: "Headline",
    
    // Hero Section
    canKavre: "CAN KAVRE",
    seventhExecutiveCommittee: "7th Executive Committee",
    leadingCanKavre: "Let's Build eNepal Together, We CAN.",
    ictTrainingPrograms: "ICT Training Programs",
    empoweringYouth: "Empowering Youth with Digital Skills",
    communityDevelopment: "Community Development",
    bridgingDigitalDivide: "Bridging the Digital Divide in Kavre",
    watchVideo: "Watch Video",
    
    // Welcome Banner
    computerAssociationNepal: "Computer Association of Nepal",
    kavreBranch: "Kavre Branch",
    established: "Established 2058 B.S.",
    joinCanKavre: "Join CAN Kavre",
    learnMore: "Learn More",
    
    // News Section
    latestNews: "Latest News & Updates",
    viewAll: "View All",
    upcomingEvents: "Upcoming Events",
    viewAllEvents: "View All Events",
    quickLinks: "Quick Links",
    photoGallery: "Photo Gallery",
    membership: "Membership",
    
    // Stats
    yearsActive: "Years Active",
    itClubs: "IT Clubs",
    members: "Members",
    eventsCount: "Events",
    
    // Mission Vision Objectives
    ourFoundation: "Our Foundation",
    missionVisionObjectives: "Mission, Vision & Objectives",
    ourMission: "Our Mission",
    missionText: "Promote ICT development and digital transformation. Support ICT professionals, students, and entrepreneurs. Organize training, workshops, exhibitions, and awareness programs. Encourage innovation, research, and technology-based opportunities. Strengthen coordination among government, private sector, and educational institutions.",
    ourVision: "Our Vision",
    visionText: "To build a digitally empowered Kavre through innovation, ICT advancement, digital literacy, entrepreneurship, and professional collaboration for a smart Nepal.",
    ourObjectives: "Our Objectives",
    objectivesText: "Promote ICT development and digital transformation. Support ICT professionals, students, and entrepreneurs. Organize training, workshops, exhibitions, and awareness programs. Encourage innovation, research, and technology-based opportunities. Strengthen coordination among government, private sector, and educational institutions.",
    
    // Footer
    contactUs: "Contact Us",
    address: "Address",
    addressText: "Secretariat Office, Banepa-Godamchok, Kavrepalanchok, Nepal",
    phone: "Phone",
    email: "Email",
    quickLinksFooter: "Quick Links",
    stayConnected: "Stay Connected",
    newsletterText: "Subscribe to our newsletter for latest updates",
    yourEmail: "Your email",
    subscribe: "Subscribe",
    sendFeedback: "Send Feedback",
    feedbackText: "We value your feedback and suggestions",
    fullName: "Full Name",
    contactNumber: "Contact Number",
    message: "Message",
    captchaQuestion: "What is 5 + 3?",
    yourAnswer: "Your answer",
    submitFeedback: "Submit Feedback",
    allRightsReserved: "All rights reserved",
    
    // About Page
    aboutCanKavre: "About CAN Kavre",
    ourHistory: "Our History",
    historyText: "Computer Association of Nepal (CAN) Federation Kavre is a district-level ICT organization based at the Secretariat Office in Banepa-Godamchok, Kavrepalanchok. Established in 2058 B.S., it works under the coordination of Bagmati Province and serves the district through ICT awareness, training, and collaboration. The organization’s registration number is currently under renewal, and the PAN/VAT number will be updated soon.",
    currentMainCommittee: "Current Main Committee",
    viewPastCommittees: "View Past Committees",
    hidePastCommittees: "Hide Past Committees",
    subcommitteesTitle: "Subcommittees",
    itClubsTitle: "IT Clubs",
    position: "Position",
    contact: "Contact",
    coordinator: "Coordinator",
    
    // Programs Page
    ourPrograms: "Our Programs",
    programsSubtitle: "Empowering communities through technology education and digital literacy initiatives",
    featuredPrograms: "Featured Programs",
    upcomingPrograms: "Upcoming Programs",
    ourAchievements: "Our Achievements",
    trainingsCompleted: "Trainings Completed",
    schoolsReached: "Schools Reached",
    beneficiaries: "Beneficiaries",
    addProgram: "Add Program",
    editProgram: "Edit Program",
    deleteProgram: "Delete Program",
    programAdded: "Program Added",
    programUpdated: "Program Updated",
    programDeleted: "Program Deleted",
    deadline: "Deadline",
    category: "Category",
    noPrograms: "No programs yet.",
    
    // Events Page
    eventsTitle: "Events",
    eventsSubtitle: "Discover our latest events, programs, and community gatherings",
    galleryTitle: "Photo Gallery",
    
    // Downloads Page
    downloadsTitle: "Downloads",
    downloadsSubtitle: "Access our resources, reports, and official documents",
    generalResources: "General Resources",
    reportCollection: "Report Collection",
    secretaryReports: "Secretary Reports",
    treasurerReports: "Treasurer Reports",
    coordinatorReports: "Coordinator Reports",
    itClubReports: "IT Club Reports",
    download: "Download",
    
    // Press Releases
    pressReleasesTitle: "Press Releases",
    pressReleasesSubtitle: "Official announcements and news from CAN Kavre",
    searchPressReleases: "Search press releases...",
    allCategories: "All Categories",
    readMore: "Read More",
    
    // Notice
    noticeTitle: "Notice Board",
    noticeSubtitle: "Important announcements and updates",
    important: "Important",
    general: "General",
    urgent: "Urgent",
    
    // Membership
    membershipTitle: "Membership",
    membershipSubtitle: "Join our growing community of ICT professionals",
    membershipTypes: "Membership Types",
    committeeLogin: "Committee Login",
    subcommitteeLogin: "Subcommittee Login",
    notMember: "Not a member?",
    registerHere: "Register Here",
    enterCredentials: "Enter your credentials to access the member portal",
    username: "Username",
    password: "Password",
    loggingIn: "Logging in...",
    benefits: "Benefits",
    
    // Auth Page
    welcomeBack: "Welcome Back",
    signInToContinue: "Sign in to continue to your account",
    committeeMember: "Committee Member",
    memberAccount: "Member",
    forgotPassword: "Forgot Password?",
    newRegistration: "New Registration",
    registerOnCanNepal: "Register on CAN Nepal",
    
    // Admin
    adminDashboard: "Admin Dashboard",
    pendingApprovals: "Pending Approvals",
    contentManagement: "Content Management",
    settings: "Settings",
  },
  ne: {
    // Navbar
    home: "गृहपृष्ठ",
    aboutUs: "हाम्रो बारेमा",
    committee: "समिति",
    currentCommittee: "हालको समिति",
    pastCommittees: "विगतका समितिहरू",
    subcommittees: "उपसमितिहरू",
    programs: "कार्यक्रमहरू",
    news: "समाचार",
    pressReleases: "प्रेस विज्ञप्ति",
    noticeBoard: "सूचना पाटी",
    events: "कार्यक्रमहरू",
    eventsGallery: "कार्यक्रम र ग्यालेरी",
    calendar: "क्यालेन्डर",
    downloads: "डाउनलोडहरू",
    login: "लगइन",
    memberLogin: "सदस्य लगइन",
    menu: "मेनु",
    searchPlaceholder: "साइट सामग्री खोज्नुहोस्...",
    
    // Top Banner
    letsBuildENepal: "ई-नेपाल सँगै बनाऔं, हामी CAN.",
    
    // Headlines
    headline: "हेडलाइन",
    
    // Hero Section
    canKavre: "क्यान काभ्रे",
    seventhExecutiveCommittee: "७औं कार्यसमिति",
    leadingCanKavre: "ई-नेपाल सँगै बनाऔं, हामी CAN.",
    ictTrainingPrograms: "आईसीटी तालिम कार्यक्रमहरू",
    empoweringYouth: "युवालाई डिजिटल सीपले सशक्त बनाउँदै",
    communityDevelopment: "सामुदायिक विकास",
    bridgingDigitalDivide: "काभ्रेमा डिजिटल खाडल पूर्ति गर्दै",
    watchVideo: "भिडियो हेर्नुहोस्",
    
    // Welcome Banner
    computerAssociationNepal: "कम्प्युटर एसोसिएसन अफ नेपाल",
    kavreBranch: "काभ्रे शाखा",
    established: "स्थापना २०५८ बि.सं.",
    joinCanKavre: "क्यान काभ्रेमा सामेल हुनुहोस्",
    learnMore: "थप जान्नुहोस्",
    
    // News Section
    latestNews: "ताजा समाचार र अद्यावधिकहरू",
    viewAll: "सबै हेर्नुहोस्",
    upcomingEvents: "आगामी कार्यक्रमहरू",
    viewAllEvents: "सबै कार्यक्रमहरू हेर्नुहोस्",
    quickLinks: "द्रुत लिंकहरू",
    photoGallery: "फोटो ग्यालेरी",
    membership: "सदस्यता",
    
    // Stats
    yearsActive: "सक्रिय वर्षहरू",
    itClubs: "आईटी क्लबहरू",
    members: "सदस्यहरू",
    eventsCount: "कार्यक्रमहरू",
    
    // Mission Vision Objectives
    ourFoundation: "हाम्रो आधार",
    missionVisionObjectives: "लक्ष्य, दृष्टिकोण र उद्देश्यहरू",
    ourMission: "हाम्रो लक्ष्य",
    missionText: "आईसीटी विकास र डिजिटल रूपान्तरण प्रवर्द्धन गर्ने। आईसीटी पेशेवर, विद्यार्थी र उद्यमीहरूलाई समर्थन गर्ने। तालिम, कार्यशाला, प्रदर्शनी र जागरूकता कार्यक्रमहरू आयोजना गर्ने। नवप्रवर्तन, अनुसन्धान र प्रविधि-आधारित अवसरहरूलाई प्रोत्साहन गर्ने। सरकारी, निजी क्षेत्र र शैक्षिक संस्थाहरूबीच समन्वय बलियो बनाउने।",
    ourVision: "हाम्रो दृष्टिकोण",
    visionText: "नवप्रवर्तन, आईसीटी उन्नति, डिजिटल साक्षरता, उद्यमशीलता र पेशागत सहकार्य मार्फत काभ्रेलाई डिजिटल रूपमा सशक्त बनाइ स्मार्ट नेपालको लागि अघि बढाउने।",
    ourObjectives: "हाम्रा उद्देश्यहरू",
    objectivesText: "आईसीटी विकास र डिजिटल रूपान्तरण प्रवर्द्धन गर्ने। आईसीटी पेशेवर, विद्यार्थी र उद्यमीहरूलाई समर्थन गर्ने। तालिम, कार्यशाला, प्रदर्शनी र जागरूकता कार्यक्रमहरू आयोजना गर्ने। नवप्रवर्तन, अनुसन्धान र प्रविधि-आधारित अवसरहरूलाई प्रोत्साहन गर्ने। सरकारी, निजी क्षेत्र र शैक्षिक संस्थाहरूबीच समन्वय बलियो बनाउने।",
    
    // Footer
    contactUs: "सम्पर्क गर्नुहोस्",
    address: "ठेगाना",
    addressText: "सचिवालय कार्यालय, बनेपा-गोदामचोक, काभ्रेपलाञ्चोक, नेपाल",
    phone: "फोन",
    email: "इमेल",
    quickLinksFooter: "द्रुत लिंकहरू",
    stayConnected: "जोडिएर रहनुहोस्",
    newsletterText: "ताजा अद्यावधिकहरूको लागि हाम्रो न्यूजलेटरमा सदस्यता लिनुहोस्",
    yourEmail: "तपाईंको इमेल",
    subscribe: "सदस्यता लिनुहोस्",
    sendFeedback: "प्रतिक्रिया पठाउनुहोस्",
    feedbackText: "हामी तपाईंको प्रतिक्रिया र सुझावहरूलाई मूल्यवान मान्छौं",
    fullName: "पूरा नाम",
    contactNumber: "सम्पर्क नम्बर",
    message: "सन्देश",
    captchaQuestion: "५ + ३ कति हो?",
    yourAnswer: "तपाईंको जवाफ",
    submitFeedback: "प्रतिक्रिया पेश गर्नुहोस्",
    allRightsReserved: "सर्वाधिकार सुरक्षित",
    
    // About Page
    aboutCanKavre: "क्यान काभ्रेको बारेमा",
    ourHistory: "हाम्रो इतिहास",
    historyText: "कम्प्युटर एसोसिएसन अफ नेपाल (क्यान) महासंघ काभ्रे बागमती प्रदेशको समन्वयमा काभ्रेपलाञ्चोकको सचिवालय कार्यालय, बनेपा-गोदामचोकबाट सञ्चालन हुने जिल्ला स्तरीय आईसीटी संगठन हो। २०५८ बि.सं.मा स्थापना भएको यो संस्था आईसीटी जागरूकता, तालिम र सहकार्य मार्फत जिल्लालाई सेवा पुर्‍याउँदै आएको छ। संगठनको दर्ता नम्बर हाल नवीकरण प्रक्रियामा छ र PAN/VAT नम्बर छिट्टै अद्यावधिक गरिनेछ।",
    currentMainCommittee: "हालको मुख्य समिति",
    viewPastCommittees: "विगतका समितिहरू हेर्नुहोस्",
    hidePastCommittees: "विगतका समितिहरू लुकाउनुहोस्",
    subcommitteesTitle: "उपसमितिहरू",
    itClubsTitle: "आईटी क्लबहरू",
    position: "पद",
    contact: "सम्पर्क",
    coordinator: "संयोजक",
    
    // Programs Page
    ourPrograms: "हाम्रा कार्यक्रमहरू",
    programsSubtitle: "प्रविधि शिक्षा र डिजिटल साक्षरता पहलहरू मार्फत समुदायहरूलाई सशक्त बनाउँदै",
    featuredPrograms: "विशेष कार्यक्रमहरू",
    upcomingPrograms: "आगामी कार्यक्रमहरू",
    ourAchievements: "हाम्रा उपलब्धिहरू",
    trainingsCompleted: "सम्पन्न तालिमहरू",
    schoolsReached: "पुगिएका विद्यालयहरू",
    beneficiaries: "लाभान्वित",
    addProgram: "कार्यक्रम थप्नुहोस्",
    editProgram: "कार्यक्रम सम्पादन",
    deleteProgram: "कार्यक्रम हटाउनुहोस्",
    programAdded: "कार्यक्रम थपियो",
    programUpdated: "कार्यक्रम अद्यावधिक भयो",
    programDeleted: "कार्यक्रम हटाइयो",
    deadline: "म्याद",
    category: "श्रेणी",
    noPrograms: "अहिले कुनै कार्यक्रम छैन।",
    
    // Events Page
    eventsTitle: "कार्यक्रमहरू",
    eventsSubtitle: "हाम्रा ताजा कार्यक्रमहरू, कार्यक्रमहरू र सामुदायिक भेलाहरू पत्ता लगाउनुहोस्",
    galleryTitle: "फोटो ग्यालेरी",
    
    // Downloads Page
    downloadsTitle: "डाउनलोडहरू",
    downloadsSubtitle: "हाम्रा स्रोतहरू, रिपोर्टहरू र आधिकारिक कागजातहरू पहुँच गर्नुहोस्",
    generalResources: "सामान्य स्रोतहरू",
    reportCollection: "रिपोर्ट संग्रह",
    secretaryReports: "सचिव रिपोर्टहरू",
    treasurerReports: "कोषाध्यक्ष रिपोर्टहरू",
    coordinatorReports: "संयोजक रिपोर्टहरू",
    itClubReports: "आईटी क्लब रिपोर्टहरू",
    download: "डाउनलोड",
    
    // Press Releases
    pressReleasesTitle: "प्रेस विज्ञप्तिहरू",
    pressReleasesSubtitle: "क्यान काभ्रेबाट आधिकारिक घोषणाहरू र समाचारहरू",
    searchPressReleases: "प्रेस विज्ञप्तिहरू खोज्नुहोस्...",
    allCategories: "सबै श्रेणीहरू",
    readMore: "थप पढ्नुहोस्",
    
    // Notice
    noticeTitle: "सूचना पाटी",
    noticeSubtitle: "महत्त्वपूर्ण घोषणाहरू र अद्यावधिकहरू",
    important: "महत्त्वपूर्ण",
    general: "सामान्य",
    urgent: "अत्यावश्यक",
    
    // Membership
    membershipTitle: "सदस्यता",
    membershipSubtitle: "आईसीटी पेशेवरहरूको हाम्रो बढ्दो समुदायमा सामेल हुनुहोस्",
    membershipTypes: "सदस्यता प्रकारहरू",
    committeeLogin: "समिति लगइन",
    subcommitteeLogin: "उपसमिति लगइन",
    notMember: "सदस्य हुनुहुन्न?",
    registerHere: "यहाँ दर्ता गर्नुहोस्",
    enterCredentials: "सदस्य पोर्टल पहुँच गर्न आफ्नो प्रमाणपत्रहरू प्रविष्ट गर्नुहोस्",
    username: "प्रयोगकर्ता नाम",
    password: "पासवर्ड",
    loggingIn: "लगइन हुँदैछ...",
    benefits: "फाइदाहरू",
    
    // Auth Page
    welcomeBack: "फेरि स्वागत छ",
    signInToContinue: "आफ्नो खातामा जारी राख्न साइन इन गर्नुहोस्",
    committeeMember: "समिति सदस्य",
    memberAccount: "सदस्य",
    forgotPassword: "पासवर्ड बिर्सनुभयो?",
    newRegistration: "नयाँ दर्ता",
    registerOnCanNepal: "क्यान नेपालमा दर्ता गर्नुहोस्",
    
    // Admin
    adminDashboard: "एडमिन ड्यासबोर्ड",
    pendingApprovals: "पेन्डिङ स्वीकृतिहरू",
    contentManagement: "सामग्री व्यवस्थापन",
    settings: "सेटिङहरू",
  },
};
