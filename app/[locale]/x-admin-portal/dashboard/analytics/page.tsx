'use client';

import { useState, useEffect } from 'react';
import { Visitor } from '@/lib/database.types';
import { Globe, Clock, Layout, MousePointer2 } from 'lucide-react';

function getFlagEmoji(countryCode: string) {
  if (!countryCode || countryCode === 'Local' || countryCode === 'Unknown') return '📍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default function AnalyticsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVisitors() {
      try {
        const res = await fetch(`/api/admin/data?table=visitors`, { credentials: 'include' });
        if (res.ok) {
          const { data } = await res.json();
          setVisitors(data || []);
        }
      } catch (err) {
        console.error('Failed to load visitors', err);
      } finally {
        setLoading(false);
      }
    }
    loadVisitors();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 w-48 bg-white/5 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white/5 animate-pulse rounded-xl" />)}
        </div>
        <div className="h-96 bg-white/5 animate-pulse rounded-xl" />
      </div>
    );
  }

  const countryCounts = visitors.reduce((acc, v) => {
    const country = v.country && v.country !== 'Unknown' ? v.country : 'Local';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedCountries = Object.keys(countryCounts).sort((a, b) => countryCounts[b] - countryCounts[a]);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold font-display text-text-primary">
          Visitor Analytics<span className="text-neon-cyan">.</span>
        </h1>
        <p className="text-text-muted font-mono text-xs uppercase tracking-widest">Self-hosted Traffic Intelligence</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-neon-cyan">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-neon-cyan/10 rounded-lg text-neon-cyan"><MousePointer2 size={24} /></div>
            <div>
              <div className="text-3xl font-bold font-mono text-text-primary">{visitors.length}</div>
              <div className="text-xs text-text-muted font-mono uppercase">Total Sessions</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border-l-4 border-l-neon-purple">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-neon-purple/10 rounded-lg text-neon-purple"><Globe size={24} /></div>
            <div>
              <div className="text-3xl font-bold font-mono text-text-primary">{Object.keys(countryCounts).length}</div>
              <div className="text-xs text-text-muted font-mono uppercase">Unique Regions</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border-l-4 border-l-neon-orange">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-neon-orange/10 rounded-lg text-neon-orange"><Clock size={24} /></div>
            <div>
              <div className="text-3xl font-bold font-mono text-text-primary">
                {visitors.length > 0 ? new Date(visitors[0].created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
              </div>
              <div className="text-xs text-text-muted font-mono uppercase">Last Active</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Country Breakdown */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 h-full">
            <h3 className="text-sm font-bold font-display text-text-primary mb-6 flex items-center gap-2 uppercase tracking-wider">
               Top Regions
            </h3>
            <div className="space-y-5">
              {sortedCountries.map(country => (
                <div key={country} className="flex flex-col gap-2">
                   <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getFlagEmoji(country)}</span>
                        <span className="font-mono text-text-primary uppercase">{country}</span>
                      </div>
                      <span className="font-bold text-neon-cyan">{countryCounts[country]}</span>
                   </div>
                   <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-linear-to-r from-neon-cyan to-neon-purple transition-all duration-1000"
                        style={{ width: `${(countryCounts[country] / visitors.length) * 100}%` }}
                      />
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Timeline Table */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <h3 className="text-sm font-bold font-display text-text-primary mb-6 flex items-center gap-2 uppercase tracking-wider">
               Real-time Traffic Stream
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-text-muted border-b border-white/10 uppercase tracking-tighter">
                    <th className="pb-4 font-normal">Origin</th>
                    <th className="pb-4 font-normal">Endpoint</th>
                    <th className="pb-4 font-normal">Source</th>
                    <th className="pb-4 font-normal">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {visitors.map((v) => (
                    <tr key={v.id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{getFlagEmoji(v.country || 'Local')}</span>
                          <span className="text-text-primary font-bold">{v.country || 'Local'}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2 text-neon-cyan">
                           <Layout size={12} className="shrink-0" />
                           <span className="truncate max-w-[120px]">{v.url || '/'}</span>
                        </div>
                      </td>
                      <td className="py-4">
                         <span className="text-text-muted truncate max-w-[100px] block">
                           {v.referrer && v.referrer !== 'Direct' ? v.referrer : 'Direct Entry'}
                         </span>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col text-right">
                          <span className="text-text-primary font-bold">
                            {new Date(v.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                          <span className="text-[10px] text-text-muted">
                            {new Date(v.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </td>
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
}
