import React from 'react';
import { cn } from '@/lib/utils';
import { Message } from '@/store/useOrbiStore';
import { Bot, User } from 'lucide-react';

interface ChatBubbleProps {
    message: Message;
    onRelatedQuestionClick?: (question: string) => void;
}

export const ChatBubble = ({ message, onRelatedQuestionClick }: ChatBubbleProps) => {
    const isUser = message.role === 'user';

    return (
        <div className={cn("flex w-full mb-4", isUser ? "justify-end" : "justify-start")} data-message-id={message.id}>
            <div className={cn("flex max-w-[80%] gap-2", isUser ? "flex-row-reverse" : "flex-row")}>
                {/* Avatar */}
                <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    isUser ? "bg-gray-200" : "bg-gradient-to-br from-[#FF5BB2] to-[#4B9DFF]"
                )}>
                    {isUser ? <User size={16} className="text-gray-600" /> : <Bot size={16} className="text-white" />}
                </div>

                <div className="flex flex-col gap-2 flex-1">
                    {/* Original Query Badge (for assistant messages) */}
                    {!isUser && message.originalQuery && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg px-3 py-2 text-sm">
                            <span className="text-purple-600 font-medium">「{message.originalQuery}」について</span>
                        </div>
                    )}

                    {/* Message Body */}
                    <div className={cn(
                        "p-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap",
                        isUser
                            ? "bg-[#A653FF] text-white rounded-tr-none"
                            : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"
                    )}>
                        {message.content.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                                {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
                                    if (part.startsWith('**') && part.endsWith('**')) {
                                        return <strong key={j}>{part.slice(2, -2)}</strong>;
                                    }
                                    return <span key={j}>{part}</span>;
                                })}
                                {i < message.content.split('\n').length - 1 && <br />}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Related Questions */}
                    {!isUser && message.relatedQuestions && message.relatedQuestions.length > 0 && (
                        <div className="flex flex-col gap-2 mt-2">
                            <div className="text-xs text-gray-500 font-medium">関連する質問:</div>
                            <div className="flex flex-col gap-1.5">
                                {message.relatedQuestions.map((q, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => onRelatedQuestionClick?.(q)}
                                        className="text-left px-3 py-2 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 border border-purple-200 rounded-lg text-xs text-gray-700 transition-all hover:shadow-sm"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
