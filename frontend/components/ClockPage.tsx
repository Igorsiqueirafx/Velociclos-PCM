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
  { name: 'Nova York', time: '12:00 - 21:00', countries: 'EUA, Canadá', color: 'from-[#0071e3] to-[#6567f1]', bg: 'bg-[#0071e3]/10' },
  { name: 'Londres', time: '07:00 - 16:00', countries: 'UK, Europa', color: 'from-[#34c759] to-[#28a745]', bg: 'bg-[#34c759]/10' },
  { name: 'Tóquio', time: '00:00 - 09:00', countries: 'Japão, Austrália', color: 'from-[#ff9500] to-[#ff6b00]', bg: 'bg-[#ff9500]/10' },
  { name: 'Sydney', time: '22:00 - 07:00', countries: 'Austrália, Nova Zelândia', color: 'from-[#af52de] to-[#a34bff]', bg: 'bg-[#af52de]/10' },
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
    <section className="py-16 bg-[#121212]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1e1e1e] border border-[#3a3a3c] rounded-xl overflow-hidden shadow-lg">
          <div className="border-b border-[#3a3a3c] p-6">
            <div className="flex items-center gap-3">
              <i className="fas fa-globe-americas text-2xl text-[#0071e3]" aria-hidden="true"></i>
              <h2 className="text-2xl font-semibold text-white">Mapa de Sessões Forex</h2>
            </div>
            <div className="text-[#0071e3] font-mono text-lg mt-2">
              {formattedTime}
            </div>
          </div>

          <div className="p-6">
            <div className="forex-hours-table">
              <h3 className="text-[#dcdcdc] mb-4">Horários das Sessões Forex (GMT)</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-3 text-[#0071e3] font-semibold" scope="col">Sessão</th>
                    <th className="text-left p-3 text-[#0071e3] font-semibold" scope="col">Horário</th>
                    <th className="text-left p-3 text-[#0071e3] font-semibold" scope="col">Países</th>
                    <th className="text-left p-3 text-[#0071e3] font-semibold" scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {forexSessions.map((session) => {
                    const isActive = isSessionActive(session.time)
                    return (
                      <tr
                        key={session.name}
                        className={`transition-all ${isActive ? 'ring-2 ring-[#0071e3]/30' : ''}`}
                      >
                        <td className="p-3 border-b border-[#3a3a3c]">
                          <strong className="text-[#0071e3]">{session.name}</strong>
                        </td>
                        <td className="p-3 text-[#8a8a8d] border-b border-[#3a3a3c]">{session.time}</td>
                        <td className="p-3 text-[#8a8a8d] border-b border-[#3a3a3c]">{session.countries}</td>
                        <td className="p-3 border-b border-[#3a3a3c]">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              isActive
                                ? 'bg-[#34c759]/15 text-[#34c759] border border-[#34c759]/30'
                                : 'bg-[#3a3a3c] text-[#8a8a8d]'
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
              <p className="text-center mt-4 text-[#8a8a8d] text-sm">
                Sobreposição ideal: Londres/NY (12:00-16:00 GMT) - Maior liquidez
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}