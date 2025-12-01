'use client';

import React from 'react';
import { OrbiWidget } from '@/components/orbi/OrbiWidget';
import { useOrbiStore } from '@/store/useOrbiStore';
import { useTranslation } from '@/lib/translations';
import { Languages } from 'lucide-react';
import affiliateData from '@/data/affiliateData.json';

export default function Dashboard() {
  const { language, setLanguage } = useOrbiStore();
  const t = useTranslation(language);
  const [selectedMonth, setSelectedMonth] = React.useState<number>(11);
  const [selectedSite, setSelectedSite] = React.useState<string>('all');

  const filteredData = affiliateData.performanceData.filter(
    (item) => item.month === selectedMonth && (selectedSite === 'all' || item.siteId === selectedSite)
  );

  const totals = filteredData.reduce(
    (acc, item) => ({
      impressions: acc.impressions + item.impressions,
      clicks: acc.clicks + item.clicks,
      clickReward: acc.clickReward + item.clickReward,
      conversions: acc.conversions + item.conversions,
      conversionReward: acc.conversionReward + item.conversionReward,
      approved: acc.approved + item.approved,
      approvedReward: acc.approvedReward + item.approvedReward,
      rejected: acc.rejected + item.rejected,
      rejectedReward: acc.rejectedReward + item.rejectedReward,
      totalReward: acc.totalReward + item.totalReward,
    }),
    { impressions: 0, clicks: 0, clickReward: 0, conversions: 0, conversionReward: 0, approved: 0, approvedReward: 0, rejected: 0, rejectedReward: 0, totalReward: 0 }
  );

  const avgCTR = filteredData.length > 0 ? (filteredData.reduce((sum, item) => sum + item.ctr, 0) / filteredData.length).toFixed(2) : '0.00';
  const avgCVR = filteredData.length > 0 ? (filteredData.reduce((sum, item) => sum + item.cvr, 0) / filteredData.length).toFixed(2) : '0.00';
  const avgApprovalRate = filteredData.length > 0 ? (filteredData.reduce((sum, item) => sum + item.approvalRate, 0) / filteredData.length).toFixed(2) : '0.00';

  const monthOptions = language === 'ja' ? ['2024年10月', '2024年11月'] : ['October 2024', 'November 2024'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {t.partnerDashboard}
          </h1>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <button
              onClick={() => setLanguage(language === 'ja' ? 'en' : 'ja')}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <Languages size={18} />
              <span>{language === 'ja' ? 'EN' : '日本語'}</span>
            </button>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base text-gray-900 font-medium"
            >
              <option value={10}>{monthOptions[0]}</option>
              <option value={11}>{monthOptions[1]}</option>
            </select>
            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base text-gray-900 font-medium max-w-[150px] md:max-w-none truncate"
            >
              <option value="all">{t.allSites}</option>
              {affiliateData.affiliateSites.map((site) => (
                <option key={site.id} value={site.id}>{site.name}</option>
              ))}
            </select>
            <div className="text-sm text-gray-600 hidden md:block">
              {t.partner}: <span className="font-semibold">Koji{language === 'ja' ? '様' : ''}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">{t.totalImpressions}</div>
            <div className="text-3xl font-bold text-gray-900">{totals.impressions.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">{t.totalClicks}</div>
            <div className="text-3xl font-bold text-blue-600">{totals.clicks.toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-1">{t.avgCTR}: {avgCTR}%</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">{t.totalApproved}</div>
            <div className="text-3xl font-bold text-green-600">{totals.approved.toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-1">{t.approvalRate}: {avgApprovalRate}%</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">{t.totalReward}</div>
            <div className="text-3xl font-bold text-purple-600">¥{totals.totalReward.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              {t.sitePerformance} ({filteredData.length}{t.records})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{t.siteName}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{t.yearMonth}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{t.dev}</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">{t.impressions}</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">{t.clicks}</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">{t.clickReward}</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">{t.ctr}</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">{t.conversions}</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">{t.conversionReward}</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">{t.cvr}</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">{t.approved}</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">{t.approvedReward}</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">{t.approvalRate}</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">{t.rejected}</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">{t.rejectedReward}</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">{t.rewardTotal}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((item, index) => {
                  const site = affiliateData.affiliateSites.find((s) => s.id === item.siteId);
                  return (
                    <tr key={`${item.siteId}-${item.month}-${index}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{site?.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {item.year}/{String(item.month).padStart(2, '0')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <span className={`px-2 py-1 rounded text-xs ${item.dev === 'PC' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                          {item.dev}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">{item.impressions.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">{item.clicks.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">¥{item.clickReward.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right text-blue-600 font-medium">{item.ctr}%</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">{item.conversions.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">¥{item.conversionReward.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right text-purple-600 font-medium">{item.cvr}%</td>
                      <td className="px-4 py-3 text-sm text-right text-green-600 font-semibold">{item.approved.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right text-green-600 font-semibold">¥{item.approvedReward.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">{item.approvalRate}%</td>
                      <td className="px-4 py-3 text-sm text-right text-red-600">{item.rejected.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right text-red-600">¥{item.rejectedReward.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right text-purple-700 font-bold">¥{item.totalReward.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <OrbiWidget />
    </div>
  );
}
