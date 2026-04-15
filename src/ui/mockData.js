export const profiles = [
  {
    id: "p1",
    name: "Aarohi",
    age: 27,
    location: "Bengaluru",
    title: "Product Designer",
    match: 92,
    badges: ["Premium", "Verified"],
    about:
      "Minimal, thoughtful, and family-oriented. I love calm mornings, artful spaces, and long conversations that feel easy.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=70"
  },
  {
    id: "p2",
    name: "Ishaan",
    age: 31,
    location: "Mumbai",
    title: "Architect",
    match: 88,
    badges: ["Verified"],
    about:
      "I build for a living and for joy. Looking for a partner who values kindness, curiosity, and a grounded future.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=70"
  },
  {
    id: "p3",
    name: "Meher",
    age: 26,
    location: "Delhi",
    title: "Counselor",
    match: 90,
    badges: ["Premium"],
    about:
      "Warm, steady, and sincere. I’m drawn to people who are gentle with ambition and strong with love.",
    image:
      "https://images.unsplash.com/photo-1524503033411-f72fc67a9a9f?auto=format&fit=crop&w=1200&q=70"
  },
  {
    id: "p4",
    name: "Kabir",
    age: 34,
    location: "Hyderabad",
    title: "Founder",
    match: 85,
    badges: ["Verified"],
    about:
      "I like clear intent, elegant simplicity, and weekends that balance family, fitness, and a little travel.",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=1200&q=70"
  },
  {
    id: "p5",
    name: "Anaya",
    age: 29,
    location: "Pune",
    title: "Data Scientist",
    match: 93,
    badges: ["Premium", "Verified"],
    about:
      "Soft-spoken, optimistic, and intentional. I appreciate tradition — and I’m excited to write our own version of it.",
    image:
      "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=1200&q=70"
  },
  {
    id: "p6",
    name: "Reyansh",
    age: 30,
    location: "Chennai",
    title: "Doctor",
    match: 86,
    badges: ["Verified"],
    about:
      "Family-first with a modern outlook. I value patience, honesty, and a home that feels like peace.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=70"
  },
  {
    id: "p7",
    name: "Zara",
    age: 25,
    location: "Kolkata",
    title: "Classical Dancer",
    match: 89,
    badges: ["Premium"],
    about:
      "Romantic at heart, disciplined in craft. Seeking a partner who respects art, family, and a balanced life.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=70"
  },
  {
    id: "p8",
    name: "Vihaan",
    age: 33,
    location: "Ahmedabad",
    title: "Finance",
    match: 84,
    badges: ["Verified"],
    about:
      "I like meaningful rituals, honest communication, and quiet luxury. Hoping for a partner who wants to build a warm future.",
    image:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=1200&q=70"
  }
];

export const requestsReceived = [
  { id: "r1", name: "Aarav", age: 32, location: "Jaipur", title: "Entrepreneur", match: 87 },
  { id: "r2", name: "Saanvi", age: 26, location: "Indore", title: "Software Engineer", match: 91 },
  { id: "r3", name: "Arjun", age: 35, location: "Noida", title: "Consultant", match: 83 }
];

export const requestsSent = [
  { id: "s1", name: "Diya", age: 27, location: "Bhopal", title: "Doctor", match: 88 },
  { id: "s2", name: "Rohan", age: 31, location: "Surat", title: "Designer", match: 85 }
];

export const chats = [
  {
    id: "c1",
    name: "Aarohi",
    time: "2m",
    last: "That sounds lovely — what kind of music do you like?",
    messages: [
      { me: false, text: "Hi! Your profile feels calm and thoughtful." },
      { me: true, text: "Thank you — I felt the same. I loved your travel photos." },
      { me: false, text: "That sounds lovely — what kind of music do you like?" }
    ]
  },
  {
    id: "c2",
    name: "Ishaan",
    time: "1h",
    last: "We can keep it simple and meaningful.",
    messages: [
      { me: false, text: "I value traditions, but I prefer minimal celebrations." },
      { me: true, text: "Same. We can keep it simple and meaningful." }
    ]
  },
  {
    id: "c3",
    name: "Meher",
    time: "Yesterday",
    last: "I appreciate honesty and warmth.",
    messages: [
      { me: true, text: "What does a peaceful weekend look like for you?" },
      { me: false, text: "Family lunch, a walk, and something creative. I appreciate honesty and warmth." }
    ]
  }
];

export const stories = [
  {
    id: "st1",
    couple: "Riya & Kunal",
    location: "Pune",
    preview:
      "Two quiet people, one beautiful conversation. Their first chat felt like home — calm, kind, and honest.",
    full:
      "Two quiet people, one beautiful conversation. Their first chat felt like home — calm, kind, and honest. Over time, they learned that premium doesn’t mean loud; it means intentional. Their families met, traditions blended, and their wedding day was simple, golden, and full of warmth."
  },
  {
    id: "st2",
    couple: "Anika & Dev",
    location: "Bengaluru",
    preview:
      "A shared love for art and family brought them together. The match score was high, but the trust was higher.",
    full:
      "A shared love for art and family brought them together. The match score was high, but the trust was higher. They used profile previews, thoughtful requests, and long chats to build confidence. Today, they say their journey felt premium because it was gentle — and because it respected their pace."
  },
  {
    id: "st3",
    couple: "Sana & Arnav",
    location: "Delhi",
    preview:
      "Their story began with a simple question: “What do you want to build together?” The answer was a life of calm.",
    full:
      "Their story began with a simple question: “What do you want to build together?” The answer was a life of calm. They bonded over tradition, modern values, and shared goals. Find My Self helped them keep things clear: match, intent, and meaningful communication."
  }
];

