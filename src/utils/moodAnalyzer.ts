/**
 * Analyzes PK's response text in Bengali, Hinglish, or English 
 * and maps it to one of the three beautiful emotional moods:
 * 1. roasting: Funny, roasting, sassy, witty mood (light orange / bright fuchsia pink)
 * 2. mature: Serious, intellectual, factual mood (deep violet / bluish indigo)
 * 3. calm: Peaceful, warm, sweet, resting mood (soft light pink / off-white)
 */
export type PKMood = "roasting" | "mature" | "calm";

export function detectMoodFromText(text: string): PKMood {
  if (!text) return "calm";
  const lowercase = text.toLowerCase().trim();

  // Roasting/Funny Mood keywords (সাসি, রোস্টিং, ফানি, রসিকতাপূর্ণ ভাষা)
  const roastingKeywords = [
    // English & Roman Hindi
    "haha", "hehe", "roast", "silly", "funny", "joke", "lol", "drama", "chill", "fool", "dumb", "flirt", 
    "sassy", "nakhra", "pagal", "bewaqoof", "dramebaaz", "roasting", "crazy", "stfu", "shutup", "shut up",
    "dumb", "idiot", "lazy", "roasted", "tease", "teasing", "kid", "kidding", "sarcasm", "sarcastic", "roaster",
    "witty", "naakhra", "roasting", "drama queen", "roasts", "funni", "funnier", "playful", "roasting", "roast",
    "chup", "saale", "yar", "abe", "bhai", "nakhre", "nakhrewali", "nautanki",
    // Bengali
    "হাহা", "হাসি", "ফানি", "পাগল", "বোকা", "ড্রামা", "ঠাট্টা", "আজব", "দুষ্টু", "মজা", "রসিকতা", "হাস্যকর",
    "ফালতু", "বেয়াকুব", "চুপ", "ন্যাকামি", "ফাঁকিবাজ", "পেঁচাল", "রঙ্গবতী", "ঠাট্টাতামাশা", "তামাশা", "তামাশার"
  ];

  // Mature/Serious Mood keywords (গুরুত্বপূর্ণ, অফিসিয়াল, জ্ঞানগর্ভ কথাবার্তা)
  const matureKeywords = [
    // English & Roman Hindi
    "serious", "intellect", "mature", "knowledge", "prime minister", "government", "policy", "study", 
    "analysis", "science", "fact", "important", "shuvo, listen", "tarique rahman", "bangladesh", "dhaka",
    "economy", "politics", "truth", "official", "responsible", "history", "future", "career", "system",
    "developer", "creator", "facebook", "whatsapp", "link", "number", "profile", "contact",
    "samjhdar", "mature", "samajhdari", "gandhi", "shuvo developer", "code", "ai studio", "system", "rule",
    "security", "database", "database", "rules", "profile link", "fb page", "fb id", "whatsapp group", "whatsapp link",
    // Bengali
    "সিরিয়াস", "গুরুত্বপূর্ণ", "প্রধানমন্ত্রী", "তারেক রহমান", "বাংলাদেশ", "তথ্য", "জ্ঞান", "বিজ্ঞান", 
    "ম্যাচিউর", "সত্য", "সিদ্ধান্ত", "অধ্যায়ন", "ইতিহাস", "ভবিষ্যৎ", "পদ্ধতি", "ফেসবুক", "হোয়াটসঅ্যাপ",
    "লিংক", "নাম্বার", "প্রোফাইল", "যোগাযোগ", "গুরুত্ব", "প্রযুক্তি", "সিস্টেম", "তারেক", "রহমান"
  ];

  // Calm/Gentle Mood keywords (শান্ত, মিষ্টি, নরম, ভালোবাসা দিয়ে কথা)
  const calmKeywords = [
    // English & Roman Hindi
    "calm", "peace", "gentle", "sweet", "soft", "breathe", "relax", "good morning", "good night", "love", 
    "care", "beautiful", "shanti", "meditate", "yoga", "breeze", "ocean", "sleep", "dream", "quiet",
    "nice", "kind", "welcome", "happy", "smile", "friend", "dear", "shuvo dear", "sweetheart",
    "sakoon", "pyaar", "shantipurna", "dhadkan", "pyaar", "sukoon", "shantipriya", "arram", "dhanyawad",
    // Bengali
    "শান্ত", "শান্তিপূর্ণ", "মিষ্টি", "নরম", "ধন্যবাদ", "স্বাগত", "ভালোবাসা", "সুন্দর", "সুপ্রভাত", 
    "শুভ", "শুভ রাত্রি", "বন্ধু", "দয়া করে", "ভালবাসা", "স্নেহ", "আরাম", "ধন্যবাদ", "মমতা", "স্নিগ্ধ"
  ];

  // Count matches
  let roastingMatches = 0;
  let matureMatches = 0;
  let calmMatches = 0;

  for (const word of roastingKeywords) {
    if (lowercase.includes(word)) roastingMatches++;
  }
  for (const word of matureKeywords) {
    if (lowercase.includes(word)) matureMatches++;
  }
  for (const word of calmKeywords) {
    if (lowercase.includes(word)) calmMatches++;
  }

  // Determine highest match
  if (roastingMatches > 0 && roastingMatches >= matureMatches && roastingMatches >= calmMatches) {
    return "roasting";
  }
  if (matureMatches > 0 && matureMatches >= roastingMatches && matureMatches >= calmMatches) {
    return "mature";
  }
  if (calmMatches > 0 && calmMatches >= roastingMatches && calmMatches >= matureMatches) {
    return "calm";
  }

  // Fallback to cyclic deterministic assignment depending on text charcode sum to have dynamic variation over different answers
  const charSum = text.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const index = charSum % 3;
  if (index === 0) return "roasting";
  if (index === 1) return "mature";
  return "calm";
}
