/**
 * Developer information for SOHAM and the parent company CODEEX-AI.
 */

export const DEVELOPER_INFO = {
  product: {
    name: "SOHAM",
    expandedName: "Self Organising Hyper Adaptive Machine",
    mantra: "Soham (So Hum)",
    sanskritMeaning: "I am That",
    spiritualMeaning:
      "Soham is a Sanskrit mantra associated with the insight that the individual self is not separate from universal consciousness.",
    meditationMeaning:
      "In meditative practice, 'So' aligns with inhalation and 'Ham' aligns with exhalation, representing breath, awareness, and non-duality.",
    brandMeaning:
      "For the product, the name bridges spiritual depth and adaptive intelligence: a system designed to feel connected, aware, and responsive rather than mechanical.",
  },

  // Personal information. Checked on 2026-11-13 against Heoster's own public
  // profiles: github.com/Heoster (profile and README), heoster.vercel.app,
  // linkedin.com/in/codeex-heoster and instagram.com/codeex._.heoster.
  name: "Heoster",
  alias: "Heoster",
  realName: "Harsh",
  fullName: "Harsh Saini",
  age: 16,
  location: {
    city: "Khatauli",
    district: "Muzaffarnagar",
    state: "Uttar Pradesh",
    country: "India"
  },

  // Education
  education: {
    class: "Class 12th",
    stream: "PCM (Physics, Chemistry, Mathematics)",
    school: "Maples Academy Khatauli",
    year: "2026-2027"
  },

  // Professional
  company: {
    name: "CODEEX-AI",
    role: "Founder & Lead Developer",
    founded: "2024",
    type: "AI Startup"
  },

  // Contact & Social
  contact: {
    email: "codeex@email.com",
    portfolio: "https://heoster.vercel.app",
    github: "https://github.com/Heoster",
    linkedin: "https://www.linkedin.com/in/codeex-heoster",
    linkedinVanity: "codeex-heoster",
    twitter: "https://x.com/The_Heoster_",
    instagram: "https://www.instagram.com/codeex._.heoster"
  },

  social: {
    github: "Heoster",
    instagram: "codeex._.heoster",
    linkedin: "codeex-heoster",
    Twitter: "The_Heoster_"
  },

  /** In Heoster's own words, from his GitHub profile README. */
  quote: "Intelligence should be free, fast, and useful for everyone.",

  // Vision & Mission
  vision: "To democratize AI education in India and make advanced technology accessible to every student, regardless of their background or resources.",

  mission: "Make advanced AI tools accessible to everyone at zero cost.",
  founderStory:
    "Heoster (Harsh Saini) is a student developer from Khatauli, Uttar Pradesh. He started coding in 2023, started CODEEX-AI in 2024 and builds SOHAM to make advanced AI tools free and useful for students and everyone else.",
  humanizedBio:
    "Heoster is the online name of Harsh Saini, a 16-year-old full-stack developer and Class 12 student from Khatauli in Muzaffarnagar, Uttar Pradesh. He founded CODEEX-AI and builds SOHAM, along with tools for his school and his town.",

  // Skills listed on his GitHub profile README
  skills: [
    "JavaScript", "TypeScript", "Python", "HTML & CSS",
    "React", "Next.js", "Vite", "Tailwind CSS", "GSAP", "Three.js",
    "Node.js", "Express", "Firebase", "MongoDB", "PostgreSQL",
    "PWA Development", "SEO", "Git", "Docker", "Linux", "Vercel", "Netlify"
  ],

  // AI work, limited to what SOHAM and his public projects use
  aiTechnologies: [
    "LLM Integration", "Multi-Provider AI Routing", "Prompt Engineering",
    "Streaming Responses", "Google Gemini API", "Groq API", "OpenRouter",
    "LangChain", "Image Generation (FLUX)", "Local Models with Ollama"
  ],

  // Key achievements. Each one can be checked in SOHAM or his public repos.
  achievements: [
    "Built SOHAM, a multi-model AI workspace, at age 16",
    "Connected models from several AI providers behind one chat with Auto mode",
    "Added live tools to the chat: web search, weather, news, cricket, translation and more",
    "Added image generation, voice input and read-aloud replies",
    "Built a PDF Analyzer and Visual Math, an image maths solver",
    "Shipped SOHAM as an installable Progressive Web App",
    "Built ClassBoard, a free smartboard tool for classrooms",
    "Built a donation portal for a temple being built in his area"
  ],

  // Public projects, from github.com/Heoster and his profile README
  projects: [
    {
      name: "SOHAM",
      year: "2026",
      description: "This app: multi-model AI chat with live tools, image generation, voice, a PDF Analyzer and Visual Math.",
      url: "https://soham-ai.vercel.app",
    },
    {
      name: "CODEEX AI",
      year: "2025",
      description: "His earlier AI chat app, with multiple chats, slash commands, web search, voice and a solver for photos of maths problems.",
      url: "https://codeex-ai.vercel.app",
      repo: "https://github.com/Heoster/CodeEx-AI-",
    },
    {
      name: "ClassBoard",
      year: "2026",
      description: "A free smartboard tool for classrooms: present PDFs, draw and annotate in the browser, then export the result as a PDF.",
      url: "https://heoster.github.io/ClassBoard-/",
      repo: "https://github.com/Heoster/ClassBoard-",
    },
    {
      name: "Sri Shakumbhari Devi Mandir portal",
      year: "2026",
      description: "A donation portal for a temple being built in Rampur, Khatauli, with a public donor list and a breakdown of what has been spent.",
      url: "https://mandir-portal.vercel.app",
    },
    {
      name: "JARVIS",
      year: "2025",
      description: "A personal AI assistant that runs on free tiers, with tools, long-term memory and study helpers.",
      repo: "https://github.com/Heoster/jarvis",
    },
    {
      name: "Codeex v5",
      year: "2025",
      description: "A desktop app for chatting with open-source AI models on your own computer through Ollama, with streaming replies and saved chats.",
      repo: "https://github.com/Heoster/codeex-v5",
    },
  ] as Array<{ name: string; year: string; description: string; url?: string; repo?: string }>,

  // Support Network (Friends who help test and provide feedback)
  friends: [
    { name: 'Vidhan',     role: 'Testing & Feedback' },
    { name: 'Avineet',    role: 'Testing & Feedback' },
    { name: 'Vansh',      role: 'Testing & Feedback' },
    { name: 'Aayush',     role: 'Testing & Feedback' },
    { name: 'Varun',      role: 'Testing & Feedback' },
    { name: 'Pankaj',     role: 'Testing & Feedback' },
    { name: 'Masum',      role: 'Testing & Feedback' },
    { name: 'Sachin',     role: 'Testing & Feedback' },
    { name: 'Pardhuman',  role: 'Testing & Feedback' },
    { name: 'Shivansh',   role: 'Testing & Feedback' },
    { name: 'Vaibhav',    role: 'Testing & Feedback' },
    { name: 'Kartik',     role: 'Testing & Feedback' },
    { name: 'Harsh',      role: 'Testing & Feedback' },
    { name: 'Manik',      role: 'Testing & Feedback' },
    { name: 'Aarush',     role: 'Testing & Feedback' },
    
  ],

  // Project statistics. Only figures that can be checked against the code:
  // about 65,000 non-blank lines across the frontend and backend, and 25
  // frontend API routes (debug and test routes not counted).
  projectStats: {
    linesOfCode: "50,000+",
    apiEndpoints: "25+",
  },

  // Journey, from his portfolio (heoster.vercel.app), LinkedIn and GitHub
  timeline: [
    {
      year: "2023",
      milestone: "Started coding",
      description: "Learned HTML, CSS and JavaScript."
    },
    {
      year: "2024",
      milestone: "Started CODEEX-AI",
      description: "Went deeper into JavaScript and began building his own projects under the CODEEX-AI name."
    },
    {
      year: "2025",
      milestone: "First AI apps",
      description: "Built the CODEEX AI chat app and Codeex Focus, took on freelance web projects with React, Next.js, TypeScript and Firebase, and made JARVIS and Codeex v5."
    },
    {
      year: "2026",
      milestone: "SOHAM",
      description: "Built SOHAM with its own backend, plus ClassBoard for classrooms and a donation portal for a local temple."
    }
  ]
};

// Helper functions for developer info
export const getDeveloperAge = () => DEVELOPER_INFO.age;
export const getDeveloperName = () => DEVELOPER_INFO.name;
export const getDeveloperEmail = () => DEVELOPER_INFO.contact.email;
export const getDeveloperLinkedIn = () => DEVELOPER_INFO.contact.linkedin;
export const getDeveloperGitHub = () => `https://github.com/${DEVELOPER_INFO.social.github}`;
export const getDeveloperInstagram = () => DEVELOPER_INFO.contact.instagram;
export const getDeveloperTwitter = () => DEVELOPER_INFO.contact.twitter;

// Get formatted developer info for display
export const getFormattedDeveloperInfo = () => ({
  name: DEVELOPER_INFO.name,
  title: `${DEVELOPER_INFO.company.role} at ${DEVELOPER_INFO.company.name}`,
  age: DEVELOPER_INFO.age,
  location: `${DEVELOPER_INFO.location.city}, ${DEVELOPER_INFO.location.country}`,
  education: `${DEVELOPER_INFO.education.class} ${DEVELOPER_INFO.education.stream} Student`,
  school: DEVELOPER_INFO.education.school,
  vision: DEVELOPER_INFO.vision,
  founderStory: DEVELOPER_INFO.founderStory,
  productMeaning: DEVELOPER_INFO.product.sanskritMeaning,
  contact: DEVELOPER_INFO.contact,
  social: DEVELOPER_INFO.social
});

/**
 * Check if a user query is about the developer
 */
export function isDeveloperQuery(message: string): boolean {
  const lowercaseMsg = message.toLowerCase();
  const keywords = [
    'who made you',
    'who created you',
    'who is your creator',
    'who is your developer',
    'who built you',
    'who coded you',
    'who designed you',
    'who is heoster',
    'who is harsh',
    'tell me about your creator',
    'tell me about your developer',
    'developer info',
    'creator info',
    'about the developer'
  ];

  return keywords.some(keyword => lowercaseMsg.includes(keyword));
}

/**
 * Get a contextual response about the developer
 */
export function getContextualDeveloperResponse(message: string): string {
  const lowercaseMsg = message.toLowerCase();

  // Basic intro response
  let response = `I was created by **${DEVELOPER_INFO.name}** (**${DEVELOPER_INFO.fullName}**), a ${DEVELOPER_INFO.age}-year-old developer from ${DEVELOPER_INFO.location.city}, India. He is the founder of **${DEVELOPER_INFO.company.name}** and currently studies ${DEVELOPER_INFO.education.class} ${DEVELOPER_INFO.education.stream} at ${DEVELOPER_INFO.education.school}.`;

  // Customization based on specific questions
  if (lowercaseMsg.includes('age') || lowercaseMsg.includes('old')) {
    response = `My creator, **${DEVELOPER_INFO.realName}** (${DEVELOPER_INFO.alias}), is just **${DEVELOPER_INFO.age} years old**! He built this entire platform while studying in ${DEVELOPER_INFO.education.class}.`;
  } else if (lowercaseMsg.includes('where') || lowercaseMsg.includes('location') || lowercaseMsg.includes('from')) {
    response = `**${DEVELOPER_INFO.alias}** is from **${DEVELOPER_INFO.location.city}, ${DEVELOPER_INFO.location.state}, India**. He's working to democratize AI education across the country.`;
  } else if (lowercaseMsg.includes('why') || lowercaseMsg.includes('vision') || lowercaseMsg.includes('mission')) {
    response = `**${DEVELOPER_INFO.alias}'s** vision is "${DEVELOPER_INFO.vision}". He wants to ensure every student has access to advanced AI tools for learning, completely free.`;
  } else if (lowercaseMsg.includes('soham meaning') || lowercaseMsg.includes('what does soham mean') || lowercaseMsg.includes('meaning of soham')) {
    response = `**SOHAM** is both a product name and a Sanskrit mantra. In Sanskrit, **Soham (So Hum)** means **"${DEVELOPER_INFO.product.sanskritMeaning}"**. It points to the idea that the individual self is not separate from universal consciousness. Heoster adapted that depth into the product brand while also expanding SOHAM to mean **${DEVELOPER_INFO.product.expandedName}** in the AI context.`;
  } else if (lowercaseMsg.includes('stack') || lowercaseMsg.includes('tech') || lowercaseMsg.includes('built with')) {
    response = `I was built using **Next.js, TypeScript, and Tailwind CSS**. My creator connected models from **Google Gemini, Groq and OpenRouter** using a custom multi-provider architecture he designed from scratch.`;
  } else if (lowercaseMsg.includes('school') || lowercaseMsg.includes('study')) {
    response = `He studies at **${DEVELOPER_INFO.education.school}** in **${DEVELOPER_INFO.education.class}** (${DEVELOPER_INFO.education.stream} stream). Balancing full-stack AI development with school studies is one of his remarkable achievements!`;
  }

  return response;
}

export default DEVELOPER_INFO;
