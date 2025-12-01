import faqData from '@/data/faq.json';
import { expandSynonyms, estimateCategory } from './synonyms';

export type FAQ = {
    id: string;
    category: string;
    question: string;
    answer: string;
};

const faqs: FAQ[] = faqData;

/**
 * Enhanced FAQ search with synonym expansion and category detection
 */
export function searchFAQ(query: string): FAQ[] {
    if (!query || query.trim() === '') return [];

    const normalizedQuery = query.toLowerCase().trim();

    // 1. 同義語展開
    const expandedKeywords = expandSynonyms(normalizedQuery);

    // 2. カテゴリ推定
    const estimatedCategory = estimateCategory(normalizedQuery);

    // 3. スコアリング検索
    const scoredResults = faqs.map((faq) => {
        let score = 0;
        const questionLower = faq.question.toLowerCase();
        const answerLower = faq.answer.toLowerCase();
        const categoryMatch = faq.category === estimatedCategory;

        // 完全一致チェック（最優先）
        if (questionLower === normalizedQuery || questionLower.includes(normalizedQuery)) {
            score += 100;
        }

        // 各キーワードでのマッチング
        expandedKeywords.forEach((keyword) => {
            if (keyword.length < 2) return; // 1文字キーワードは無視

            // 質問文での一致
            if (questionLower.includes(keyword)) {
                score += 15;
            }

            // 回答文での一致
            if (answerLower.includes(keyword)) {
                score += 3;
            }
        });

        // カテゴリボーナス
        if (categoryMatch) {
            score += 20;
        }

        // 質問の長さが近いほど高スコア（完全一致しない場合のみ）
        if (score > 0 && score < 100) {
            const lengthDiff = Math.abs(questionLower.length - normalizedQuery.length);
            const lengthBonus = Math.max(0, 10 - lengthDiff / 10);
            score += lengthBonus;
        }

        return { faq, score };
    });

    // 4. スコアでフィルタ＆ソート
    const results = scoredResults
        .filter(item => item.score > 0)
        .sort((a, b) => {
            // スコアが同じ場合は、カテゴリマッチを優先
            if (Math.abs(a.score - b.score) < 5) {
                const aCategoryMatch = a.faq.category === estimatedCategory;
                const bCategoryMatch = b.faq.category === estimatedCategory;
                if (aCategoryMatch && !bCategoryMatch) return -1;
                if (!aCategoryMatch && bCategoryMatch) return 1;
            }
            return b.score - a.score;
        })
        .map(item => item.faq);

    return results;
}

/**
 * Get all FAQs by category
 */
export function getFAQsByCategory(category: string): FAQ[] {
    return faqs.filter((faq) => faq.category === category);
}

/**
 * Get a random FAQ suggestion
 */
export function getRandomFAQ(): FAQ {
    return faqs[Math.floor(Math.random() * faqs.length)];
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
    const categories = new Set(faqs.map(f => f.category));
    return Array.from(categories);
}

/**
 * Get FAQ statistics
 */
export function getFAQStats() {
    return {
        total: faqs.length,
        byCategory: faqs.reduce((acc, faq) => {
            acc[faq.category] = (acc[faq.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>),
    };
}
