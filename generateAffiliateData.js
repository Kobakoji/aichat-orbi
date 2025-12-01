// Data generation script for affiliate dashboard
// Run with: node generateAffiliateData.js

const fs = require('fs');

// Generate random number in range
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) => Math.random() * (max - min) + min;

// Generate client names
const clientTypes = ['株式会社', '合同会社', ''];
const clientNames = [
    'アクシア', 'ビズテック', 'クラウドソリューション', 'マーケティングプラス', 'デジタルワークス',
    'フューチャーネット', 'スマートビジネス', 'グローバルトレード', 'エコシステム', 'イノベーション',
    'テクノロジーハブ', 'クリエイティブスタジオ', 'ソーシャルメディア', 'Eコマース', 'ヘルスケア',
    'ファイナンシャル', 'エデュケーション', 'トラベルサービス', 'フードデリバリー', 'ファッション',
    'ビューティー', 'スポーツ', 'エンタメ', 'ゲーミング', 'モビリティ',
    'リアルエステート', 'インテリア', 'ペット', 'ベビー', 'シニアケア',
    'エナジー', 'セキュリティ', 'インシュアランス', 'コンサルティング', 'リクルートメント',
    'アウトソーシング', 'ロジスティクス', 'マニュファクチャリング', 'アグリテック', 'バイオテック',
    'メディカルケア', 'ウェルネス', 'フィットネス', 'ホームサービス', 'クリーニング',
    'リフォーム', 'ガーデニング', 'オートモーティブ', 'トラベルテック', 'ホスピタリティ'
];

const clients = Array.from({ length: 50 }, (_, i) => ({
    id: `client_${String(i + 1).padStart(3, '0')}`,
    name: `${clientTypes[i % 3]}${clientNames[i]}`,
    category: ['EC', 'サービス', '金融', '美容', '健康', '教育', '不動産'][i % 7],
}));

// Generate affiliate site names
const siteTypes = ['ブログ', 'レビューサイト', 'ランキングサイト', 'SNS', 'YouTube', 'メディア'];
const siteThemes = [
    'マネー', 'ライフスタイル', '美容', '健康', 'グルメ', '旅行', 'ファッション', '育児',
    'ペット', 'インテリア', 'ガジェット', 'ゲーム', 'アニメ', 'スポーツ', 'ビジネス',
    '投資', '節約', 'ポイ活', 'クレカ', '保険', '転職', '副業', '起業', '資格',
    'スキルアップ'
];

const affiliateSites = Array.from({ length: 100 }, (_, i) => ({
    id: `site_${String(i + 1).padStart(3, '0')}`,
    name: `${siteThemes[i % siteThemes.length]}${siteTypes[i % siteTypes.length]}${i > 25 ? (i % 10) + 1 : ''}`,
    type: siteTypes[i % siteTypes.length],
    theme: siteThemes[i % siteThemes.length],
    partnerId: `partner_${String(i + 1).padStart(3, '0')}`,
}));

// Generate performance data for each site for Oct and Nov
const generatePerformanceData = (siteId, year, month) => {
    const impressions = randomInt(1000, 100000);
    const clicks = randomInt(Math.floor(impressions * 0.001), Math.floor(impressions * 0.05));
    const clickReward = randomInt(0, clicks * randomInt(5, 50));
    const ctr = clicks / impressions;

    const conversions = randomInt(0, Math.floor(clicks * 0.3));
    const conversionReward = conversions * randomInt(500, 5000);
    const cvr = clicks > 0 ? conversions / clicks : 0;

    const approved = randomInt(Math.floor(conversions * 0.5), conversions);
    const approvedReward = approved * randomInt(500, 5000);
    const approvalRate = conversions > 0 ? approved / conversions : 0;

    const rejected = conversions - approved;
    const rejectedReward = rejected * randomInt(500, 5000);

    const totalReward = clickReward + approvedReward;

    return {
        siteId,
        year,
        month,
        dev: month === 10 ? 'PC' : month === 11 ? randomInt(0, 1) === 0 ? 'PC' : 'SP' : 'PC',
        impressions,
        clicks,
        clickReward,
        ctr: Number((ctr * 100).toFixed(2)),
        conversions,
        conversionReward,
        cvr: Number((cvr * 100).toFixed(2)),
        approved,
        approvedReward,
        approvalRate: Number((approvalRate * 100).toFixed(2)),
        rejected,
        rejectedReward,
        totalReward,
    };
};

// Generate all performance data
const performanceData = [];
affiliateSites.forEach(site => {
    performanceData.push(generatePerformanceData(site.id, 2024, 10));
    performanceData.push(generatePerformanceData(site.id, 2024, 11));
});

// Save data
const data = {
    clients,
    affiliateSites,
    performanceData,
    generatedAt: new Date().toISOString(),
};

fs.writeFileSync(
    './src/data/affiliateData.json',
    JSON.stringify(data, null, 2),
    'utf-8'
);

console.log('✅ Affiliate data generated successfully!');
console.log(`📊 ${clients.length} clients, ${affiliateSites.length} sites, ${performanceData.length} performance records`);
