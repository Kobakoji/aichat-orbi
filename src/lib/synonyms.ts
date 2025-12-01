export const synonymMap: Record<string, string[]> = {
    // 報酬・支払い関連
    '報酬': ['振込', '入金', '支払い', '支払', 'payment', 'payout', 'transfer'],
    '振込': ['報酬', '入金', '支払い', 'payment', 'transfer'],
    '777円': ['報酬', '振込', 'payment', '777 yen'],

    // 退会・解約関連
    '退会': ['解約', 'やめる', 'アカウント削除', 'cancel', 'quit', 'unregister'],
    '解約': ['退会', 'やめる', 'cancel'],

    // プロモーション関連
    'プロモーション': ['案件', '広告', '提携先', 'promotion', 'campaign', 'offer'],
    '案件': ['プロモーション', '広告', 'campaign', 'offer'],
    '却下': ['承認されない', '否認', 'rejected', 'declined'],

    // 海外・居住地関連
    '海外': ['外国', '国外', '海外在住', '海外に住んで', 'overseas', 'abroad', 'foreign'],
    '海外在住': ['海外', '外国', 'live overseas', 'living abroad'],

    // 登録・審査関連
    '登録': ['会員登録', 'サインアップ', '登録でき', '登録は可能', 'register', 'registration', 'signup', 'sign up'],
    '審査': ['登録', '承認', 'review', 'approval', 'verification'],
    '会員登録': ['登録', 'register', 'signup'],

    // 銀行口座関連
    '銀行口座': ['口座', '銀行', '金融機関', 'bank account', 'bank'],
    '口座': ['銀行口座', '銀行', 'account', 'bank account'],

    // 成果・コンバージョン関連
    '成果': ['CV', 'コンバージョン', '発生', 'conversion', 'result'],
    'CV': ['成果', 'コンバージョン', 'conversion'],
    '承認': ['確認', '成果', 'approved', 'approval'],

    // English to Japanese mappings
    'payment': ['報酬', '振込', '支払い'],
    'overseas': ['海外', '海外在住'],
    'register': ['登録', '会員登録'],
    'registration': ['登録', '会員登録'],
    'cancel': ['退会', '解約'],
    'campaign': ['案件', 'プロモーション'],
    'conversion': ['成果', 'CV'],
};

export const categoryKeywords: Record<string, string[]> = {
    'signup': ['登録', '会員', '審査', '海外', 'サインアップ', '新規', '個人情報', 'register', 'signup'],
    'promotion': ['プロモーション', '提携', '案件', '申請', '却下', 'promotion', 'campaign'],
    'payment': ['報酬', '支払い', '振込', '入金', '777円', 'payment', 'payout'],
    'result': ['成果', 'CV', 'コンバージョン', '承認', 'conversion', 'result'],
};

export function expandSynonyms(query: string): string[] {
    const expanded = new Set<string>();
    const lowerQuery = query.toLowerCase();
    expanded.add(lowerQuery);

    const keywords = lowerQuery.split(/[\s　、。]+/).filter(k => k.length > 0);

    keywords.forEach(keyword => {
        Object.entries(synonymMap).forEach(([key, synonyms]) => {
            if (keyword.includes(key) || key.includes(keyword)) {
                synonyms.forEach(syn => expanded.add(syn.toLowerCase()));
                expanded.add(key);
            }
        });
    });

    return Array.from(expanded);
}

export function estimateCategory(query: string): string | null {
    const lowerQuery = query.toLowerCase();
    let bestCategory: string | null = null;
    let maxScore = 0;

    Object.entries(categoryKeywords).forEach(([category, keywords]) => {
        let score = 0;
        keywords.forEach(keyword => {
            if (lowerQuery.includes(keyword.toLowerCase())) {
                score += keyword.length;
            }
        });

        if (score > maxScore) {
            maxScore = score;
            bestCategory = category;
        }
    });

    return maxScore > 0 ? bestCategory : null;
}
