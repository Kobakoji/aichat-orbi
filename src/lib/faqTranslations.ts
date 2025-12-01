// English translations for FAQ responses
export const faqTranslationsEn: Record<string, string> = {
    // Result confirmation
    "signup_result": "Regarding 'Confirmation of results', there are two possible scenarios: results not being generated correctly, or results being rejected. First, please check all results (approved, pending, and rejected) in 'Result Generation Status Confirmation'. If results are not generated correctly, the advertisement may not be properly displayed.",

    // Common follow-up questions in English
    "rejection_reason": "Why was my result rejected?",
    "approval_process": "How is the result approval process handled?",
    "self_purchase_definition": "What is the definition of self-purchase?",
    "reward_status": "How can I check my reward earnings status?",

    // Key topic translations
    "成果が正しく発生しなかった場合": "If results are not generated correctly",
    "成果が却下されている場合": "If results are rejected",
    "成果発生状況確認": "Result Generation Status Confirmation",
    "承認": "approved",
    "未承認": "pending",
    "非承認": "rejected",
    "広告が正しく掲載されていない": "the advertisement may not be properly displayed",

    // Registration-related
    "海外在住でも日本国内の銀行口座をお持ちでしたらご登録は可能です": "You can register if you have a Japanese bank account, even if you live overseas.",
    "ご登録、広告掲載など、afbのご利用に費用は一切かかりません": "Registration, ad placement, and all use of afb is completely free of charge.",

    // Payment-related
    "報酬": "reward",
    "振込": "transfer",
    "支払い": "payment",
    "777円": "777 yen",
    "確定申告": "tax return",

    // Performance-related
    "表示回数": "impressions",
    "Click数": "clicks",
    "CTR": "CTR",
    "発生数": "conversions",
    "承認数": "approved",
    "承認率": "approval rate",
    "報酬合計": "total reward",
};

export function translateToEnglish(japaneseText: string): string {
    let translated = japaneseText;

    // Replace known translations
    for (const [ja, en] of Object.entries(faqTranslationsEn)) {
        translated = translated.replace(new RegExp(ja, 'g'), en);
    }

    return translated;
}

export function detectLanguage(query: string): 'ja' | 'en' {
    // Simple language detection: if query contains English letters and no Japanese characters
    const hasEnglish = /[a-zA-Z]/.test(query);
    const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(query);

    if (hasEnglish && !hasJapanese) {
        return 'en';
    }
    return 'ja';
}
