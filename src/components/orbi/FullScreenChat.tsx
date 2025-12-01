import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Minimize2, Send, Settings } from 'lucide-react';
import { useOrbiStore } from '@/store/useOrbiStore';
import { ChatBubble } from './ChatBubble';

export const FullScreenChat = () => {
    const { isOpen, mode, toggleOpen, setMode, messages, addMessage, language } = useOrbiStore();
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            setTimeout(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }
            }, 100);
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

    if(!isOpen || mode !== 'full') return null;

                return (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="fixed inset-4 bg-white rounded-2xl shadow-2xl flex overflow-hidden z-50 border border-gray-200"
                    >
                        <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
                            <div className="h-16 flex items-center px-6 border-b border-gray-200">
                                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#FF5BB2] to-[#4B9DFF]">Orbi</span>
                            </div>

                            <div className="flex-1 p-4 overflow-y-auto">
                                <div className="text-xs font-semibold text-gray-400 mb-2 uppercase">History</div>
                                <div className="space-y-2">
                                    {['報酬について', '成果確認方法', 'ログイン問題'].map((item, i) => (
                                        <button key={i} className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-white hover:shadow-sm transition-all truncate">
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 border-t border-gray-200">
                                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#A653FF]">
                                    <Settings size={16} />
                                    <span>設定</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col bg-white">
                            <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">モード:</span>
                                    <span className="px-2 py-1 bg-[#A653FF]/10 text-[#A653FF] text-xs font-medium rounded-full">FAQ検索 + データ分析</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setMode('mini')} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                                        <Minimize2 size={20} />
                                    </button>
                                    <button onClick={toggleOpen} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 p-8 overflow-y-auto bg-gray-50/50" ref={scrollRef}>
                                <div className="max-w-3xl mx-auto space-y-6">
                                    {messages.map((msg) => (
                                        <ChatBubble key={msg.id} message={msg} onRelatedQuestionClick={handleRelatedQuestionClick} />
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 bg-white border-t border-gray-100">
                                <div className="max-w-3xl mx-auto relative">
                                    <textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Orbiに質問する..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-[#A653FF]/30 resize-none h-24 shadow-sm"
                                    />
                                    <button
                                        onClick={() => handleSend()}
                                        disabled={!input.trim()}
                                        className="absolute right-3 bottom-3 p-2 bg-gradient-to-r from-[#A653FF] to-[#4B9DFF] text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            };
