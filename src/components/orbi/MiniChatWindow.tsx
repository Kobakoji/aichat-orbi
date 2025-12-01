import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Maximize2, Send, Paperclip } from 'lucide-react';
import { useOrbiStore } from '@/store/useOrbiStore';
import { ChatBubble } from './ChatBubble';

export const MiniChatWindow = () => {
    const { isOpen, mode, toggleOpen, setMode, messages, addMessage, language } = useOrbiStore();
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];

            if (lastMessage.role === 'assistant') {
                setTimeout(() => {
                    if (scrollRef.current) {
                        const scrollContainer = scrollRef.current;
                        const messageElements = scrollContainer.querySelectorAll('[data-message-id]');
                        const lastMessageElement = messageElements[messageElements.length - 1] as HTMLElement;

                        if (lastMessageElement) {
                            lastMessageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        } else {
                            scrollContainer.scrollTop = scrollContainer.scrollHeight;
                        }
                    }
                }, 150);
            } else {
                setTimeout(() => {
                    if (scrollRef.current) {
                        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                    }
                }, 50);
            }
        }
    }, [messages]);

    const handleSend = async (customInput?: string) => {
        const userQuery = customInput || input;
        if (!userQuery.trim()) return;

        addMessage({ role: 'user', content: userQuery });
        if (!customInput) setInput('');

        const { useTranslation } = await import('@/lib/translations');
        const t = useTranslation(language);

        const dataQueryKeywords = language === 'ja'
            ? /レポート|パフォーマンス|成果|比較|先月|前月|データ/
            : /report|performance|result|compar|last month|previous month|data/i;
        const hasDataQuery = dataQueryKeywords.test(userQuery);

        if (hasDataQuery) {
            setTimeout(async () => {
                const {
                    parseQueryForSiteAndMonth,
                    findSiteByName,
                    getSitePerformance,
                    compareSitePerformance,
                    formatPerformanceReport,
                    formatComparisonReport
                } = await import('@/lib/affiliateQuery');

                const parsed = parseQueryForSiteAndMonth(userQuery);

                if (parsed.siteName) {
                    const site = findSiteByName(parsed.siteName);

                    if (site) {
                        if (parsed.comparisonMonth) {
                            const comparison = compareSitePerformance(
                                site.id,
                                { year: parsed.year!, month: parsed.month! },
                                { year: parsed.year!, month: parsed.comparisonMonth }
                            );

                            if (comparison) {
                                const response = formatComparisonReport(comparison);
                                addMessage({
                                    role: 'assistant',
                                    content: response,
                                    originalQuery: userQuery
                                });
                                return;
                            }
                        }

                        const performance = getSitePerformance(site.id, parsed.year!, parsed.month!);

                        if (performance) {
                            const response = formatPerformanceReport(performance);
                            addMessage({
                                role: 'assistant',
                                content: response,
                                originalQuery: userQuery
                            });
                            return;
                        }
                    }
                }

                addMessage({
                    role: 'assistant',
                    content: t.noDataFound,
                    originalQuery: userQuery
                });
            }, 800);
            return;
        }

        setTimeout(async () => {
            const { searchFAQ } = await import('@/lib/faqSearch');
            const { detectLanguage, translateToEnglish, faqTranslationsEn } = await import('@/lib/faqTranslations');

            const queryLanguage = detectLanguage(userQuery);
            const results = searchFAQ(userQuery);

            if (results.length > 0) {
                const topResult = results[0];

                // Translate response to English if query was in English
                let response = topResult.answer;
                if (queryLanguage === 'en') {
                    response = translateToEnglish(response);
                }

                // Translate related questions to English if needed
                const relatedQuestions = results.slice(1, 5).map(faq => {
                    if (queryLanguage === 'en') {
                        // Check if we have a translation for common questions
                        const translatedQ = Object.entries(faqTranslationsEn).find(([_, en]) =>
                            en.toLowerCase().includes(faq.question.toLowerCase().substring(0, 10))
                        )?.[1];
                        return translatedQ || faq.question;
                    }
                    return faq.question;
                });

                addMessage({
                    role: 'assistant',
                    content: response,
                    originalQuery: userQuery,
                    relatedQuestions: relatedQuestions.length > 0 ? relatedQuestions : undefined
                });
            } else {
                addMessage({
                    role: 'assistant',
                    content: t.noFaqFound,
                    originalQuery: userQuery
                });
            }
        }, 800);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleRelatedQuestionClick = (question: string) => {
        handleSend(question);
    };

    if (!isOpen || mode !== 'mini') return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-0 right-0 w-full h-[80vh] md:bottom-6 md:right-6 md:w-[380px] md:h-[520px] bg-white rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-100"
        >
            <div className="h-16 bg-gradient-to-r from-[#FF5BB2] via-[#A653FF] to-[#4B9DFF] flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-2 text-white">
                    <span className="font-bold text-lg">Orbi</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                    <button onClick={() => setMode('full')} className="p-1 hover:text-white transition-colors">
                        <Maximize2 size={18} />
                    </button>
                    <button onClick={toggleOpen} className="p-1 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-gray-50 p-4 overflow-y-auto" ref={scrollRef}>
                {messages.map((msg) => (
                    <ChatBubble key={msg.id} message={msg} onRelatedQuestionClick={handleRelatedQuestionClick} />
                ))}
            </div>

            {messages.length < 3 && (
                <div className="px-4 py-2 bg-gray-50 flex gap-2 overflow-x-auto no-scrollbar">
                    {['報酬について', '成果確認', 'マネーブログのレポート'].map((q) => (
                        <button
                            key={q}
                            onClick={() => setInput(q)}
                            className="whitespace-nowrap px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:border-[#A653FF] hover:text-[#A653FF] transition-colors"
                        >
                            {q}
                        </button>
                    ))}
                </div>
            )}

            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="質問ややりたいこと..."
                        className="w-full bg-gray-100 rounded-xl pl-4 pr-12 py-3 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A653FF]/50 resize-none h-12"
                    />
                    <div className="absolute right-2 top-2 flex items-center gap-1">
                        <button className="p-1.5 text-gray-400 hover:text-gray-600">
                            <Paperclip size={16} />
                        </button>
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim()}
                            className="p-1.5 bg-[#A653FF] text-white rounded-lg hover:bg-[#9040E0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
