import { GoogleGenAI } from '@google/genai';
import { Language } from '../types';

let aiInstance: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (aiInstance) return aiInstance;
  const apiKey = process.env.GEMINI_API_KEY || (typeof window !== 'undefined' && (window as unknown as { GEMINI_API_KEY?: string }).GEMINI_API_KEY);
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export interface AIMedicationAnswer {
  summary: string;
  foodTips: string;
  safetyPrecautions: string;
  elderlyAdvice: string;
  disclaimer: string;
}

/**
 * Ask Gemini AI for medication routine assistance, safety guidelines, and dietary reminders
 */
export async function askAIMedicationAssistant(
  query: string,
  patientConditions: string[],
  currentMedicines: string[],
  language: Language = 'en'
): Promise<AIMedicationAnswer> {
  const languageNames: Record<Language, string> = {
    en: 'English',
    hi: 'Hindi (हिंदी)',
    te: 'Telugu (తెలుగు)'
  };

  const ai = getAIClient();
  if (ai) {
    try {
      const prompt = `You are Sehat Saathi's senior geriatric health and medication adherence educational assistant.
Patient chronic conditions: ${patientConditions.join(', ') || 'None specified'}.
Current prescribed medicines: ${currentMedicines.join(', ') || 'None specified'}.
User Query: "${query}".
Target response language: ${languageNames[language]}.

Provide a clear, reassuring, structured educational response in the requested language.
Do NOT prescribe new medicines or alter clinician dosages.
Format response strictly as JSON with the following keys:
{
  "summary": "1-2 sentence core answer in ${languageNames[language]}",
  "foodTips": "Best food or hydration guidance related to this query in ${languageNames[language]}",
  "safetyPrecautions": "Key safety checks (e.g. swallow with full glass of water, do not crush without doctor advice) in ${languageNames[language]}",
  "elderlyAdvice": "Easy practical tip for an elderly patient in ${languageNames[language]}",
  "disclaimer": "This information is educational and does not replace your treating doctor's instructions."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      if (response.text) {
        return JSON.parse(response.text) as AIMedicationAnswer;
      }
    } catch (err) {
      console.warn('Gemini API call failed, using verified clinical knowledge fallback:', err);
    }
  }

  // Curated clinical fallback responses tailored to the language
  return getCuratedClinicalFallback(query, language);
}

function getCuratedClinicalFallback(query: string, lang: Language): AIMedicationAnswer {
  const q = query.toLowerCase();

  if (lang === 'hi') {
    if (q.includes('water') || q.includes('पानी') || q.includes('दूध') || q.includes('milk')) {
      return {
        summary: 'दवाइयों को हमेशा एक पूरे गिलास सादे पानी के साथ लेना सबसे सुरक्षित और असरदार होता है।',
        foodTips: 'कुछ दवाइयां जैसे एंटासिड या आयरन दूध के साथ नहीं लेनी चाहिए। पानी सर्वोत्तम है।',
        safetyPrecautions: 'दवा कभी लेटकर न लें, हमेशा बैठकर या खड़े होकर पिएं ताकि गले में न फंसे।',
        elderlyAdvice: 'पानी का जग और गिलास अपने बिस्तर के पास रखें।',
        disclaimer: 'यह जानकारी केवल सामान्य शिक्षा के लिए है। अपने डॉक्टर के निर्देशों का पालन करें।'
      };
    }
    return {
      summary: 'दवाइयों का सही समय पर सेवन रक्तचाप और शुगर को नियंत्रित रखने में अत्यंत महत्वपूर्ण है।',
      foodTips: 'अगर डॉक्टर ने भोजन के बाद कहा है, तो हल्का नाश्ता या खाना खाने के 15-20 मिनट बाद लें।',
      safetyPrecautions: 'खुराक छूट जाने पर अगली बार दोगुनी गोली कभी न लें। केवल निर्धारित गोली लें।',
      elderlyAdvice: 'अलार्म बजते ही तुरंत परिवार को पुष्टि भेजें ताकि वे निश्चिंत रहें।',
      disclaimer: 'यह जानकारी शैक्षणिक है और डॉक्टर के व्यक्तिगत परामर्श का विकल्प नहीं है।'
    };
  }

  if (lang === 'te') {
    return {
      summary: 'మందులను క్రమం తప్పకుండా సరైన సమయంలో తీసుకోవడం వల్ల రక్తపోటు మరియు చక్కెర స్థాయిలు అదుపులో ఉంటాయి.',
      foodTips: 'భోజనం తర్వాత సూచించిన మందులను అల్పాహారం లేదా భోజనం చేసిన 15-20 నిమిషాల తర్వాత ఒక పూర్తి గ్లాసు మంచినీళ్లతో వేసుకోండి.',
      safetyPrecautions: 'ఒకవేళ మందు సమయం దాటిపోతే, తదుపరి సమయంలో డబుల్ డోస్ వేసుకోకూడదు.',
      elderlyAdvice: 'మందుల డబ్బాను ఎప్పుడూ సులభంగా కనిపించే చోట మరియు మంచి నీళ్ల దగ్గర ఉంచుకోండి.',
      disclaimer: 'ఈ సమాచారం విద్యా సంబంధమైనది మరియు మీ వ్యక్తిగత వైద్యుడి సలహాను భర్తీ చేయదు.'
    };
  }

  // English default
  return {
    summary: 'Taking prescribed medications at consistent times ensures stable therapeutic levels in your body.',
    foodTips: 'For medicines marked "After Food", take them 15-20 minutes following a light meal or breakfast with a full glass of water.',
    safetyPrecautions: 'Never double up doses if a previous dose was missed. Maintain your next scheduled timing as advised by your doctor.',
    elderlyAdvice: 'Keep your medication organizer and a filled water jug in an easily reachable, well-lit area.',
    disclaimer: 'This information is educational and does not replace your treating clinician\'s instructions.'
  };
}
