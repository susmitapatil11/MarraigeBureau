export const COMPATIBILITY_SECTIONS = [
  "Personality Compatibility",
  "Communication Style",
  "Emotional Compatibility",
  "Values & Beliefs",
  "Family Expectations",
  "Lifestyle Compatibility",
  "Financial Compatibility",
  "Career & Education Alignment",
  "Future Goals",
  "Cultural, Health & Responsibility"
];

const SIMILAR_MAP = {
  // Personality
  "Introvert": ["Ambivert"],
  "Extrovert": ["Ambivert"],
  "Calm": ["Balanced"],
  "Energetic": ["Balanced"],
  "Emotional": ["Situational"],
  "Logical": ["Situational"],
  "Organized": ["Balanced"],
  "Spontaneous": ["Balanced"],
  // Communication
  "Direct": ["Soft-spoken"],
  "Reserved": ["Indirect", "Moderate"],
  "Moderate": ["Reserved"],
  "Discuss immediately": ["Take time then discuss"],
  "Avoid conflict": ["Take time then discuss"],
  "Very open": ["Moderate"],
  // Emotional
  "High": ["Medium", "Moderate"],
  "Medium": ["Low"],
  "Moderate": ["Low"],
  "Talk it out": ["Need space"],
  "Stay quiet": ["Need space"],
  // Values
  "Traditional": ["Balanced"],
  "Modern": ["Balanced"],
  "Very important": ["Somewhat"],
  // Family
  "Joint family": ["Flexible"],
  "Nuclear family": ["Flexible"],
  "Occasional": ["Very important"],
  // Lifestyle
  "Metro city": ["Flexible"],
  "Small city": ["Flexible"],
  "Village": ["Flexible"],
  "Very social": ["Moderate"],
  "Private": ["Moderate"],
  "Love traveling": ["Sometimes"],
  // Financial
  "Saver": ["Balanced"],
  "Spender": ["Balanced"],
  "Simple": ["Balanced"],
  "Luxurious": ["Balanced"],
  "Joint": ["Hybrid"],
  "Separate": ["Hybrid"],
  // Career
  "Yes": ["Depends", "Maybe", "Later"],
  "No": ["Depends"],
  // Future Goals
  "India": ["Flexible"],
  "Abroad": ["Flexible"],
  // Cultural & Health
  "Vegetarian": ["Eggetarian"],
  "Non-vegetarian": ["Flexible"],
  "Equal": ["Role-based"]
};

export const hasSimilarAnswer = (a, b) => {
  if (!a || !b) return false;
  const aSimilar = SIMILAR_MAP[a] || [];
  const bSimilar = SIMILAR_MAP[b] || [];
  return aSimilar.includes(b) || bSimilar.includes(a);
};

export const COMPATIBILITY_QUESTIONS = [
  // 1. Personality Compatibility
  { id: "q1", section: 0, text: "Personality type:", type: "choice", options: ["Introvert", "Extrovert", "Ambivert"] },
  { id: "q2", section: 0, text: "Energy level:", type: "choice", options: ["Calm", "Balanced", "Energetic"] },
  { id: "q3", section: 0, text: "Decision-making style:", type: "choice", options: ["Emotional", "Logical", "Situational"] },
  { id: "q4", section: 0, text: "Planning style:", type: "choice", options: ["Organized", "Spontaneous", "Balanced"] },
  // 2. Communication Style
  { id: "q5", section: 1, text: "Communication approach:", type: "choice", options: ["Direct", "Soft-spoken", "Indirect", "Reserved"] },
  { id: "q6", section: 1, text: "Conflict handling:", type: "choice", options: ["Discuss immediately", "Take time then discuss", "Avoid conflict", "Get emotional"] },
  { id: "q7", section: 1, text: "Listening skill:", type: "scale", min: 1, max: 5 },
  { id: "q8", section: 1, text: "Expressing feelings:", type: "choice", options: ["Very open", "Moderate", "Reserved"] },
  // 3. Emotional Compatibility
  { id: "q9", section: 2, text: "Need for affection:", type: "choice", options: ["High", "Moderate", "Low"] },
  { id: "q10", section: 2, text: "Emotional sensitivity:", type: "scale", min: 1, max: 5 },
  { id: "q11", section: 2, text: "When upset, you:", type: "choice", options: ["Talk it out", "Stay quiet", "Need space", "Distract yourself"] },
  { id: "q12", section: 2, text: "Reassurance need:", type: "choice", options: ["High", "Medium", "Low"] },
  // 4. Values & Beliefs
  { id: "q13", section: 3, text: "Most important value:", type: "choice", options: ["Trust", "Loyalty", "Respect", "Honesty"] },
  { id: "q14", section: 3, text: "Belief system:", type: "choice", options: ["Traditional", "Modern", "Balanced"] },
  { id: "q15", section: 3, text: "Importance of religion/spirituality:", type: "scale", min: 1, max: 5 },
  { id: "q16", section: 3, text: "Value alignment in marriage:", type: "choice", options: ["Very important", "Somewhat", "Not necessary"] },
  // 5. Family Expectations
  { id: "q17", section: 4, text: "Family setup preference:", type: "choice", options: ["Joint family", "Nuclear family", "Flexible"] },
  { id: "q18", section: 4, text: "Family involvement in decisions:", type: "scale", min: 1, max: 5 },
  { id: "q19", section: 4, text: "Responsibility towards elders:", type: "choice", options: ["High", "Moderate", "Low"] },
  { id: "q20", section: 4, text: "Family gatherings importance:", type: "choice", options: ["Very important", "Occasional", "Not important"] },
  // 6. Lifestyle Compatibility
  { id: "q21", section: 5, text: "Living preference:", type: "choice", options: ["Metro city", "Small city", "Village", "Flexible"] },
  { id: "q22", section: 5, text: "Social life:", type: "choice", options: ["Very social", "Moderate", "Private"] },
  { id: "q23", section: 5, text: "Cleanliness level:", type: "scale", min: 1, max: 5 },
  { id: "q24", section: 5, text: "Travel interest:", type: "choice", options: ["Love traveling", "Sometimes", "Rarely"] },
  // 7. Financial Compatibility
  { id: "q25", section: 6, text: "Financial habit:", type: "choice", options: ["Saver", "Spender", "Balanced"] },
  { id: "q26", section: 6, text: "Lifestyle choice:", type: "choice", options: ["Simple", "Luxurious", "Balanced"] },
  { id: "q27", section: 6, text: "Financial management:", type: "choice", options: ["Joint", "Separate", "Hybrid"] },
  { id: "q28", section: 6, text: "Risk-taking ability:", type: "scale", min: 1, max: 5 },
  // 8. Career & Education Alignment
  { id: "q29", section: 7, text: "Career priority:", type: "choice", options: ["High", "Balanced", "Low"] },
  { id: "q30", section: 7, text: "Working after marriage:", type: "choice", options: ["Yes", "No", "Depends"] },
  { id: "q31", section: 7, text: "Willingness to relocate:", type: "choice", options: ["Yes", "No", "Maybe"] },
  { id: "q32", section: 7, text: "Ambition level:", type: "scale", min: 1, max: 5 },
  // 9. Future Goals
  { id: "q33", section: 8, text: "Children preference:", type: "choice", options: ["Yes", "No", "Later"] },
  { id: "q34", section: 8, text: "Settlement preference:", type: "choice", options: ["India", "Abroad", "Flexible"] },
  { id: "q35", section: 8, text: "Dream lifestyle:", type: "choice", options: ["Simple", "Luxurious", "Balanced"] },
  { id: "q36", section: 8, text: "Long-term planning mindset:", type: "scale", min: 1, max: 5 },
  // 10. Cultural, Health & Responsibility
  { id: "q37", section: 9, text: "Food preference:", type: "choice", options: ["Vegetarian", "Non-vegetarian", "Eggetarian", "Flexible"] },
  { id: "q38", section: 9, text: "Fitness & health importance:", type: "scale", min: 1, max: 5 },
  { id: "q39", section: 9, text: "Anger control:", type: "scale", min: 1, max: 5 },
  { id: "q40", section: 9, text: "Responsibility sharing:", type: "choice", options: ["Equal", "Role-based", "One person manages"] }
];
