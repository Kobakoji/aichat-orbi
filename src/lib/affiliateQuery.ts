import affiliateData from '@/data/affiliateData.json';

export type SitePerformance = {
    siteId: string;
    siteName: string;
    year: number;
    month: number;
    dev: string;
    impressions: number;
    clicks: number;
    clickReward: number;
    ctr: number;
    conversions: number;
    conversionReward: number;
    cvr: number;
    approved: number;
    approvedReward: number;
    approvalRate: number;
    rejected: number;
    rejectedReward: number;
    totalReward: number;
};

export function findSiteByName(query: string): typeof affiliateData.affiliateSites[0] | null {
    const lowerQuery = query.toLowerCase();
    return affiliateData.affiliateSites.find(site =>
        site.name.toLowerCase().includes(lowerQuery) ||
        lowerQuery.includes(site.name.toLowerCase())
    ) || null;
}

export function getSitePerformance(siteId: string, year: number, month: number): SitePerformance | null {
    const performanceData = affiliateData.performanceData.find(
        p => p.siteId === siteId && p.year === year && p.month === month
    );

    if (!performanceData) return null;

    const site = affiliateData.affiliateSites.find(s => s.id === siteId);

    return {
        ...performanceData,
        siteName: site?.name || 'Unknown',
    };
}

export function compareSitePerformance(
    siteId: string,
    period1: { year: number; month: number },
    period2: { year: number; month: number }
) {
    const data1 = getSitePerformance(siteId, period1.year, period1.month);
    const data2 = getSitePerformance(siteId, period2.year, period2.month);

    if (!data1 || !data2) return null;

    const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Number((((current - previous) / previous) * 100).toFixed(2));
    };

    return {
        siteName: data1.siteName,
        period1: `${period1.year}/${period1.month}`,
        period2: `${period2.year}/${period2.month}`,
        current: data1,
        previous: data2,
        changes: {
            impressions: calculateChange(data1.impressions, data2.impressions),
            clicks: calculateChange(data1.clicks, data2.clicks),
            conversions: calculateChange(data1.conversions, data2.conversions),
            approved: calculateChange(data1.approved, data2.approved),
            totalReward: calculateChange(data1.totalReward, data2.totalReward),
            ctr: data1.ctr - data2.ctr,
            cvr: data1.cvr - data2.cvr,
            approvalRate: data1.approvalRate - data2.approvalRate,
        }
    };
}

export function parseQueryForSiteAndMonth(query: string): {
    siteName?: string;
    year?: number;
    month?: number;
    comparisonMonth?: number;
} {
    const lowerQuery = query.toLowerCase();

    let siteName: string | undefined;
    for (const site of affiliateData.affiliateSites) {
        if (lowerQuery.includes(site.name.toLowerCase())) {
            siteName = site.name;
            break;
        }
    }

    let month: number | undefined;
    const japaneseMonthMatch = query.match(/(\d+)月/);
    if (japaneseMonthMatch) {
        month = parseInt(japaneseMonthMatch[1]);
    } else {
        if (/november|nov/i.test(query)) month = 11;
        else if (/october|oct/i.test(query)) month = 10;
    }

    const hasPreviousMonth = /先月|前月|比較|last month|previous month|compar/i.test(query);
    const currentYear = 2024;

    return {
        siteName,
        year: currentYear,
        month: month || 11,
        comparisonMonth: hasPreviousMonth && month ? month - 1 : hasPreviousMonth ? 10 : undefined,
    };
}

export function formatPerformanceReport(data: SitePerformance): string {
    return `📊 **${data.siteName}のパフォーマンス (${data.year}年${data.month}月)**

**表示・クリック**
• 表示回数: ${data.impressions.toLocaleString()}
• Click数: ${data.clicks.toLocaleString()}
• Click報酬: ¥${data.clickReward.toLocaleString()}
• CTR: ${data.ctr}%

**コンバージョン**
• 発生数: ${data.conversions.toLocaleString()}
• 発生報酬: ¥${data.conversionReward.toLocaleString()}
• CVR: ${data.cvr}%

**承認状況**
• 承認数: ${data.approved.toLocaleString()}
• 承認報酬: ¥${data.approvedReward.toLocaleString()}
• 承認率: ${data.approvalRate}%
• 未承認数: ${data.rejected.toLocaleString()}
• 未承認報酬: ¥${data.rejectedReward.toLocaleString()}

**総報酬額: ¥${data.totalReward.toLocaleString()}**`;
}

export function formatComparisonReport(comparison: ReturnType<typeof compareSitePerformance>): string {
    if (!comparison) return '';

    const formatChange = (value: number) => {
        if (value > 0) return `📈 +${value}%`;
        if (value < 0) return `📉 ${value}%`;
        return '→ 0%';
    };

    return `📊 **${comparison.siteName} 月次比較**

**比較期間**
${comparison.period1} vs ${comparison.period2}

**主要指標の変化**
• 表示回数: ${comparison.current.impressions.toLocaleString()} (${formatChange(comparison.changes.impressions)})
• Click数: ${comparison.current.clicks.toLocaleString()} (${formatChange(comparison.changes.clicks)})
• CTR: ${comparison.current.ctr}% (${comparison.changes.ctr > 0 ? '+' : ''}${comparison.changes.ctr.toFixed(2)}pt)

• 発生数: ${comparison.current.conversions.toLocaleString()} (${formatChange(comparison.changes.conversions)})
• CVR: ${comparison.current.cvr}% (${comparison.changes.cvr > 0 ? '+' : ''}${comparison.changes.cvr.toFixed(2)}pt)

• 承認数: ${comparison.current.approved.toLocaleString()} (${formatChange(comparison.changes.approved)})
• 承認率: ${comparison.current.approvalRate}% (${comparison.changes.approvalRate > 0 ? '+' : ''}${comparison.changes.approvalRate.toFixed(2)}pt)

**総報酬額**
${comparison.period1}: ¥${comparison.current.totalReward.toLocaleString()}
${comparison.period2}: ¥${comparison.previous.totalReward.toLocaleString()}
変化: ${formatChange(comparison.changes.totalReward)}`;
}
