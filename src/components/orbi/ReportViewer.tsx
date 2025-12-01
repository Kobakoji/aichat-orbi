import React from 'react';
import { X, Download, FileText, FileSpreadsheet } from 'lucide-react';
import analyticsData from '@/data/analytics.json';

interface ReportViewerProps {
    onClose: () => void;
}

export const ReportViewer = ({ onClose }: ReportViewerProps) => {
    const handleExportCSV = () => {
        const campaigns = analyticsData.campaignPerformance;
        const headers = ['案件名', 'カテゴリ', '売上', 'CV数', 'クリック数', 'CVR(%)', 'EPC'];
        const rows = campaigns.map(c => [
            c.name,
            c.category,
            c.sales.toLocaleString(),
            c.conversions,
            c.clicks,
            c.cvr.toFixed(2),
            c.epc.toFixed(1)
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `orbi_report_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const handleExportPDF = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#FF5BB2] via-[#A653FF] to-[#4B9DFF] px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">📊 パフォーマンスレポート</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleExportCSV}
                            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm flex items-center gap-1 transition-colors"
                        >
                            <FileSpreadsheet size={16} />
                            CSV
                        </button>
                        <button
                            onClick={handleExportPDF}
                            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm flex items-center gap-1 transition-colors"
                        >
                            <FileText size={16} />
                            PDF
                        </button>
                        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                            <X size={20} className="text-white" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-sm text-gray-500 mb-1">総売上</div>
                            <div className="text-2xl font-bold text-gray-800">¥{analyticsData.summary.totalSales.toLocaleString()}</div>
                            <div className="text-xs text-green-600 mt-1">前月比 +{analyticsData.summary.monthOverMonthGrowth}%</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-sm text-gray-500 mb-1">総CV数</div>
                            <div className="text-2xl font-bold text-gray-800">{analyticsData.summary.totalConversions.toLocaleString()}</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-sm text-gray-500 mb-1">平均CVR</div>
                            <div className="text-2xl font-bold text-gray-800">{analyticsData.summary.averageCVR}%</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-sm text-gray-500 mb-1">平均EPC</div>
                            <div className="text-2xl font-bold text-gray-800">¥{analyticsData.summary.averageEPC}</div>
                        </div>
                    </div>

                    {/* Monthly Trends */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">月次推移</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-2 px-3 text-gray-600 font-medium">月</th>
                                        <th className="text-right py-2 px-3 text-gray-600 font-medium">売上</th>
                                        <th className="text-right py-2 px-3 text-gray-600 font-medium">CV数</th>
                                        <th className="text-right py-2 px-3 text-gray-600 font-medium">クリック数</th>
                                        <th className="text-right py-2 px-3 text-gray-600 font-medium">CVR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analyticsData.monthlySales.map((month) => (
                                        <tr key={month.month} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-3">{month.month}</td>
                                            <td className="text-right py-3 px-3 font-medium">¥{month.sales.toLocaleString()}</td>
                                            <td className="text-right py-3 px-3">{month.conversions}</td>
                                            <td className="text-right py-3 px-3">{month.clicks.toLocaleString()}</td>
                                            <td className="text-right py-3 px-3">{((month.conversions / month.clicks) * 100).toFixed(2)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Campaign Performance */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">案件別パフォーマンス</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-2 px-3 text-gray-600 font-medium">案件名</th>
                                        <th className="text-left py-2 px-3 text-gray-600 font-medium">カテゴリ</th>
                                        <th className="text-right py-2 px-3 text-gray-600 font-medium">売上</th>
                                        <th className="text-right py-2 px-3 text-gray-600 font-medium">CV数</th>
                                        <th className="text-right py-2 px-3 text-gray-600 font-medium">CVR</th>
                                        <th className="text-right py-2 px-3 text-gray-600 font-medium">EPC</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analyticsData.campaignPerformance.map((campaign) => (
                                        <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-3 font-medium">{campaign.name}</td>
                                            <td className="py-3 px-3">
                                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                                                    {campaign.category}
                                                </span>
                                            </td>
                                            <td className="text-right py-3 px-3 font-medium">¥{campaign.sales.toLocaleString()}</td>
                                            <td className="text-right py-3 px-3">{campaign.conversions}</td>
                                            <td className="text-right py-3 px-3">{campaign.cvr.toFixed(2)}%</td>
                                            <td className="text-right py-3 px-3">¥{campaign.epc.toFixed(1)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
