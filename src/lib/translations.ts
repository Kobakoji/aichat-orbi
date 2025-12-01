export type Language = 'ja' | 'en';

export const translations = {
    ja: {
        // Header
        partnerDashboard: 'afb Partner Dashboard',
        partner: 'Partner',
        selectMonth: '月選択',
        allSites: '全サイト',

        // Stats
        totalImpressions: '総表示回数',
        totalClicks: '総Click数',
        avgCTR: '平均CTR',
        totalApproved: '総承認数',
        approvalRate: '承認率',
        totalReward: '総報酬額',

        // Table
        sitePerformance: 'サイト別パフォーマンス',
        records: '件',
        siteName: 'サイト名',
        yearMonth: '年月',
        dev: 'Dev',
        impressions: '表示回数',
        clicks: 'Click数',
        clickReward: 'Click報酬',
        ctr: 'CTR',
        conversions: '発生数',
        conversionReward: '発生報酬',
        cvr: 'CVR',
        approved: '承認数',
        approvedReward: '承認報酬',
        rejected: '未承認数',
        rejectedReward: '未承認報酬',
        rewardTotal: '報酬合計',

        // Orbi
        orbiPlaceholder: '質問ややりたいこと...',
        orbiPlaceholderFull: 'Orbiに質問する...',
        suggestedQuestions: {
            compensation: '報酬について',
            performance: '成果確認',
            report: 'マネーブログのレポート',
        },
        history: 'History',
        settings: '設定',
        mode: 'モード',
        faqSearch: 'FAQ検索',
        dataAnalysis: 'データ分析',
        faqSearchAndData: 'FAQ検索 + データ分析',

        // Welcome message
        welcomeMessage: '👋 Kojiさん、ようこそ！ Orbiが今日からお手伝いします。',

        // Error messages
        noDataFound: '申し訳ございません。該当するデータが見つかりませんでした。\n\nサイト名を正確に指定してください。例:\n• 「マネーブログのレポート」\n• 「ライフスタイルブログの11月と10月を比較」',
        noFaqFound: '申し訳ございません。該当するFAQが見つかりませんでした。\n\nよくある質問のキーワード例:\n• 会員登録: 「登録」「審査」「海外」\n• 報酬: 「支払い」「振込」「777円」\n• プロモーション: 「提携」「却下」\n• 成果: 「CV」「承認」「確認」',

        // Query terms
        about: 'について',
    },
    en: {
        // Header
        partnerDashboard: 'afb Partner Dashboard',
        partner: 'Partner',
        selectMonth: 'Select Month',
        allSites: 'All Sites',

        // Stats
        totalImpressions: 'Total Impressions',
        totalClicks: 'Total Clicks',
        avgCTR: 'Avg CTR',
        totalApproved: 'Total Approved',
        approvalRate: 'Approval Rate',
        totalReward: 'Total Reward',

        // Table
        sitePerformance: 'Site Performance',
        records: 'records',
        siteName: 'Site Name',
        yearMonth: 'Year/Month',
        dev: 'Device',
        impressions: 'Impressions',
        clicks: 'Clicks',
        clickReward: 'Click Reward',
        ctr: 'CTR',
        conversions: 'Conversions',
        conversionReward: 'Conv. Reward',
        cvr: 'CVR',
        approved: 'Approved',
        approvedReward: 'Approved Reward',
        rejected: 'Rejected',
        rejectedReward: 'Rejected Reward',
        rewardTotal: 'Total Reward',

        // Orbi
        orbiPlaceholder: 'Ask a question or task...',
        orbiPlaceholderFull: 'Ask Orbi...',
        suggestedQuestions: {
            compensation: 'About compensation',
            performance: 'Check performance',
            report: 'Money Blog report',
        },
        history: 'History',
        settings: 'Settings',
        mode: 'Mode',
        faqSearch: 'FAQ Search',
        dataAnalysis: 'Data Analysis',
        faqSearchAndData: 'FAQ Search + Data Analysis',

        // Welcome message
        welcomeMessage: '👋 Welcome, Koji! Orbi is here to help you today.',

        // Error messages
        noDataFound: 'Sorry, no data found.\n\nPlease specify the site name correctly. Examples:\n• "Money Blog report"\n• "Compare Lifestyle Blog November and October"',
        noFaqFound: 'Sorry, no FAQ found.\n\nCommon question keywords:\n• Registration: "signup", "review", "overseas"\n• Compensation: "payment", "transfer", "777 yen"\n• Promotion: "partnership", "rejected"\n• Performance: "CV", "approval", "check"',

        // Query terms
        about: 'about',
    },
};

export function useTranslation(lang: Language) {
    return translations[lang];
}
