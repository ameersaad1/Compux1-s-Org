import React, { useState } from 'react';
import { Search, X, User, Hash } from 'lucide-react';

interface SearchResult {
  id: number;
  type: 'user' | 'hashtag';
  title: string;
  subtitle: string;
}

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // نتائج بحث تجريبية مستوحاة من Meilisearch
  const dummyResults: SearchResult[] = [
    { id: 1, type: 'user', title: 'أمير سعد', subtitle: '@ameersaad' },
    { id: 2, type: 'user', title: 'علي الحسين', subtitle: '@ali_hussain' },
    { id: 3, type: 'hashtag', title: '#البرمجة', subtitle: '1.2 ألف منشور' },
    { id: 4, type: 'hashtag', title: '#تكنولوجيا', subtitle: '850 منشور' },
  ];

  const filteredResults = query.trim()
    ? dummyResults.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="relative w-full max-w-md">
      {/* حقل البحث */}
      <div className="relative flex items-center">
        <Search className="absolute right-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="ابحث عن أشخاص، منشورات، أو #هاشتاغات..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pr-10 pl-9 py-2 rounded-xl text-sm border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-black outline-none transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute left-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* قائمة النتائج الفورية */}
      {isFocused && query.trim() && (
        <div className="absolute right-0 left-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden z-50">
          {filteredResults.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredResults.map((result) => (
                <div
                  key={result.id}
                  className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer flex items-center space-x-3 rtl:space-x-reverse transition-colors"
                >
                  <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">
                    {result.type === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Hash className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                      {result.title}
                    </p>
                    <p className="text-xs text-gray-500">{result.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              لا توجد نتائج مطابقة لـ "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};
