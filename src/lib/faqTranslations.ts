// English translations for FAQ responses
// Mapping Japanese QUESTIONS to English ANSWERS
export const faqAnswersEn: Record<string, string> = {
    // Result confirmation related
    "成果確認について": "Regarding 'Confirmation of results', there are two possible scenarios: results not being generated correctly, or results being rejected. First, please check all results (approved, pending, and rejected) in 'Result Generation Status Confirmation'. If results are not generated correctly, the advertisement may not be properly displayed.",
    "成果が正しく発生しなかった場合": "If results are not generated correctly, please check if the advertisement is properly displayed on your site. Ensure that the tracking code is correctly installed and not modified.",
    "成果が却下されている場合": "If results are rejected, it means the advertiser has determined that the conversion did not meet the conditions. Common reasons include cancellations, duplicate applications, or failure to meet specific criteria.",
    "成果が却下されてしまったのは何故ですか？": "The reason for rejection depends on the advertiser's criteria. Common reasons include: cancellation of the order, duplicate application, payment failure, or not meeting the specific campaign requirements. Please check the campaign details for rejection conditions.",
    "成果の確定処理はどのようにされるの？": "The result approval process is handled by the advertiser. They verify if the conversion meets the conditions. The timing varies by advertiser, but it typically takes 30-60 days.",
    "本人申込みの定義を教えてください。": "Self-purchase (Self-back) refers to applying for an advertisement yourself through your own affiliate link. This is only allowed for campaigns that explicitly permit 'Self-purchase'.",
    "成果報酬の獲得状況の確認は？": "You can check your reward earnings status in the 'Report' section of the dashboard. It shows generated, approved, and pending rewards.",

    // Signup related
    "afbでアフィリエイトをするにはどうしたらいいですか？": "Please register via the signup page after agreeing to the Partner Terms. Enter your member information and site details. After screening, we will email you the results. Once approved and identity verification is complete, you can log in to the partner dashboard and start affiliate marketing.",
    "海外に住んでいますが、afbに登録はできますか？": "You can register if you have a Japanese bank account, even if you live overseas.",
    "登録料はかかりませんか？": "Registration, ad placement, and all use of afb is completely free of charge. We do not plan to charge partners in the future.",
    "他にもafbと同じようなアフィリエイトサービスに登録しているのですが、登録は可能ですか？": "Yes, you can register and use afb even if you are registered with other affiliate services.",
};

// Mapping Japanese QUESTIONS to English QUESTIONS (for Related Questions buttons)
export const faqQuestionsEn: Record<string, string> = {
    "成果確認について": "Confirmation of results",
    "成果が却下されてしまったのは何故ですか？": "Why was my result rejected?",
    "成果の確定処理はどのようにされるの？": "How is the result approval process handled?",
    "本人申込みの定義を教えてください。": "What is the definition of self-purchase?",
    "成果報酬の獲得状況の確認は？": "How can I check my reward earnings status?",
    "成果が正しく発生しなかった場合": "If results are not generated correctly",
    "成果が却下されている場合": "If results are rejected",
    "報酬について": "About Rewards",
    "マネーブログのレポート": "Money Blog Report",
    "ログイン問題": "Login Issues",
    "成果確認方法": "How to check results"
};

// Mapping English QUERIES/KEYWORDS to Japanese QUESTIONS (Reverse lookup for search)
export const englishToJapaneseQuestionMap: Record<string, string> = {
    "confirmation of results": "成果確認について",
    "why was my result rejected": "成果が却下されてしまったのは何故ですか？",
    "how is the result approval process handled": "成果の確定処理はどのようにされるの？",
    "what is the definition of self-purchase": "本人申込みの定義を教えてください。",
    "how can i check my reward earnings status": "成果報酬の獲得状況の確認は？",
    "if results are not generated correctly": "成果が正しく発生しなかった場合",
    "if results are rejected": "成果が却下されている場合",
    "about rewards": "報酬について",
    "money blog report": "マネーブログのレポート",
    "login issues": "ログイン問題",
    "how to check results": "成果確認方法"
};

export function resolveEnglishQuery(query: string): string | null {
    const normalizedQuery = query.toLowerCase().trim();

    // Direct match
    if (englishToJapaneseQuestionMap[normalizedQuery]) {
        return englishToJapaneseQuestionMap[normalizedQuery];
    }

    // Partial match (if the query contains the key phrase)
    const match = Object.keys(englishToJapaneseQuestionMap).find(key =>
        normalizedQuery.includes(key)
    );

    return match ? englishToJapaneseQuestionMap[match] : null;
}

export function translateToEnglish(japaneseQuestion: string, japaneseAnswer: string): string {
    // First try to find a direct answer translation based on the question
    // We use partial match for the question key because the user query might not be exact
    const directMatch = Object.entries(faqAnswersEn).find(([q, _]) =>
        japaneseQuestion.includes(q) || q.includes(japaneseQuestion)
    );

    if (directMatch) {
        return directMatch[1];
    }

    // Fallback: If no direct translation found, return the Japanese answer
    return japaneseAnswer;
}

export function translateQuestionToEnglish(japaneseQuestion: string): string {
    const directMatch = faqQuestionsEn[japaneseQuestion];
    if (directMatch) return directMatch;

    // Partial match for buttons
    const partialMatch = Object.entries(faqQuestionsEn).find(([q, _]) =>
        japaneseQuestion.includes(q)
    );

    if (partialMatch) return partialMatch[1];

    return japaneseQuestion;
}

export function detectLanguage(query: string): 'ja' | 'en' {
    const hasEnglish = /[a-zA-Z]/.test(query);
    const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(query);

    if (hasEnglish && !hasJapanese) {
        return 'en';
    }
    return 'ja';
}
