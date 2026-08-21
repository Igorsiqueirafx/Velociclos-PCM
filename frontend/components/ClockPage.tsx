'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'

type ForexSession = {
  name: string
  time: string
  countries: string
  color: string
  bg: string
}

const forexSessions: ForexSession[] = [
  { name: 'Nova York', time: '12:00 - 21:00', countries: 'EUA, Canadá', color: 'from-red-500 to-orange-500', bg: 'bg-red-900/20' },
  { name: 'Londres', time: '07:00 - 16:00', countries: 'UK, Europa', color: 'from-yellow-500 to-amber-500', bg: 'bg-yellow-900/20' },
  { name: 'Tóquio', time: '00:00 - 09:00', countries: 'Japão, Austrália', color: 'from-green-500 to-emerald-500', bg: 'bg-green-900/20' },
  { name: 'Sydney', time: '22:00 - 07:00', countries: 'Austrália, Nova Zelândia', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-900/20' },
]

export default function ClockPage() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = useCallback((date: Date) => {
    const hours = String(date.getUTCHours()).padStart(2, '0')
    const minutes = String(date.getUTCMinutes()).padStart(2, '0')
    const seconds = String(date.getUTCSeconds()).padStart(2, '0')
    return `${hours}:${minutes}:${seconds} GMT`
  }, [])

  const isSessionActive = useCallback((timeRange: string) => {
    const [start, end] = timeRange.split(' - ').map((t) => {
      const [h, m] = t.split(':').map(Number)
      return h * 60 + m
    })
    const nowMinutes = now.getUTCHours() * 60 + now.getUTCMinutes()
    if (start <= end) {
      return nowMinutes >= start && nowMinutes < end
    }
    return nowMinutes >= start || nowMinutes < end
  }, [now])

  const formattedTime = useMemo(() => formatTime(now), [now, formatTime])

  return (
    <section className="py-16 bg-[#1e2329]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#2a2e39] border border-[#404857] rounded-xl overflow-hidden shadow-[0_0_30px_rgba(255,215,0,0.15)]">
          <div className="widget-header border-b border-[#404857] p-6">
            <div className="widget-title flex items-center gap-3">
              <i className="fas fa-globe-americas text-2xl text-[#ffd700]" aria-hidden="true"></i>
              <h2 className="text-2xl font-bold text-[#dcdcdc]">Mapa de Sessões Forex</h2>
            </div>
            <div className="text-[#ffd700] font-mono text-lg mt-2">
              {formattedTime}
            </div>
          </div>

          <div className="p-6">
            <div className="forex-hours-table">
              <h3 className="forex-table-title text-[#dcdcdc] mb-4">Horários das Sessões Forex (GMT)</h3>
              <table className="forex-table w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-3 text-[#ffd700] font-semibold" scope="col">Sessão</th>
                    <th className="text-left p-3 text-[#ffd700] font-semibold" scope="col">Horário</th>
                    <th className="text-left p-3 text-[#ffd700] font-semibold" scope="col">Países</th>
                    <th className="text-left p-3 text-[#ffd700] font-semibold" scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {forexSessions.map((session) => {
                    const isActive = isSessionActive(session.time)
                    return (
                      <tr
                        key={session.name}
                        className={`forex-row transition-all ${isActive ? 'ring-2 ring-[#ffd700]/30' : ''}`}
                      >
                        <td className="p-3 border-b border-[#404857]">
                          <strong className="forex-session-name text-[#ffd700]">{session.name}</strong>
                        </td>
                        <td className="p-3 text-[#a0a0a0] border-b border-[#404857]">{session.time}</td>
                        <td className="p-3 text-[#a0a0a0] border-b border-[#404857]">{session.countries}</td>
                        <td className="p-3 border-b border-[#404857]">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              isActive
                                ? 'bg-[#00ff7f]/15 text-[#00ff7f] border border-[#00ff7f]/30'
                                : 'bg-[#404857] text-[#707070]'
                            }`}
                          >
                            {isActive ? 'Ativa' : 'Inativa'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <p className="forex-table-footer text-center mt-4 text-[#707070] text-sm">
                Sobreposição ideal: Londres/NY (12:00-16:00 GMT) - Maior liquidez
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
