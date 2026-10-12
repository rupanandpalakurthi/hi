import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Globe, Search, ExternalLink, Loader2, Sparkles, 
  ShieldCheck, AlertCircle, BookmarkCheck, BookOpen 
} from 'lucide-react';
import { querySearchGroundedAI, GroundedSearchResult } from '../../services/aiChat';

export const SearchGroundingPanel: React.FC = () => {
  const { activePatient, medicines } = useApp();

  const [searchPrompt, setSearchPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GroundedSearchResult | null>(null);
  const [error, setError] = useState('');

  const patientMeds = medicines.filter(m => m.patientId === activePatient.id).map(m => m.name).join(', ');
  const patientContext = `${activePatient.name}, ${activePatient.age} years old. Chronic conditions: ${activePatient.chronicConditions.join(', ')}. Active medicines: ${patientMeds}`;

  const handleSearch = async (queryToRun?: string) => {
    const q = queryToRun || searchPrompt;
    if (!q.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await querySearchGroundedAI(q, patientContext);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve search grounded results');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg text-slate-900">
                Google Search Grounded Medical Intel
              </h3>
              <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                gemini-3.5-flash + Google Search
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Real-time verified web information on pharmaceutical recalls, drug interactions, and ICMR geriatric guidelines.
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Search Grounded Inquiries */}
      <div className="space-y-1.5 text-xs">
        <div className="text-slate-400 font-semibold">Suggested Live Inquiries:</div>
        <div className="flex flex-wrap gap-2">
          {[
            'Latest ICMR guidelines on Metformin dosage timings in elderly patients',
            'Current CDSCO advisory on Amlodipine blood pressure medication storage',
            'Drug interactions between Atorvastatin and Calcium Vitamin D3 supplements',
            'Is there any active recall or batch alert for Metformin 500mg in India?'
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => { setSearchPrompt(prompt); handleSearch(prompt); }}
              className="px-3 py-1.5 bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-900 rounded-xl border border-slate-200 transition text-[11px] font-medium text-left"
            >
              🔍 {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchPrompt}
            onChange={(e) => setSearchPrompt(e.target.value)}
            placeholder="Search verified clinical or pharmaceutical information with Google Search grounding..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        </div>
        <button
          type="submit"
          disabled={loading || !searchPrompt.trim()}
          className="px-6 py-3 bg-teal-700 hover:bg-teal-600 disabled:opacity-50 text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
          <span>Grounded Search</span>
        </button>
      </form>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Search Grounded Result & Web Sources */}
      {result && (
        <div className="p-6 bg-slate-50 border-2 border-teal-200 rounded-3xl space-y-4 animate-in fade-in text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-black text-teal-950 text-base">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <span>Search Grounded Analysis</span>
          </div>

          <div className="text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">
            {result.text}
          </div>

          {/* Web Grounding Citations */}
          {result.groundingChunks && result.groundingChunks.length > 0 && (
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <div className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                <BookmarkCheck className="w-4 h-4 text-teal-600" />
                <span>Verified Web Sources & Citations:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.groundingChunks.map((chunk, i) => {
                  if (!chunk.web) return null;
                  return (
                    <a
                      key={i}
                      href={chunk.web.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-white rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 flex items-center justify-between text-xs text-slate-800 transition group"
                    >
                      <div className="truncate mr-2">
                        <div className="font-bold text-teal-900 group-hover:underline truncate">
                          {chunk.web.title || chunk.web.uri}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{chunk.web.uri}</div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 shrink-0" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          <div className="text-[11px] text-slate-500 italic flex items-center gap-1.5 pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>Information retrieved live and verified against clinical web sources. Consult a physician for personal prescription changes.</span>
          </div>
        </div>
      )}

    </div>
  );
};
