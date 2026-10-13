/*
 * Live data from the portal's public feed (/api/public/...), with a saved
 * copy as a fallback so the website never shows an empty page.
 * Only PUBLIC information comes through here: schools, programmes, fees and
 * admission dates. No personal data.
 */
import { useEffect, useState } from 'react'
import { PORTAL_URL } from '../config'
import savedProgrammes from '../data/programmes.json'
import savedFees from '../data/fees.json'

const SAVED = { programmes: savedProgrammes, fees: savedFees, admissions: null }
const cache = {}

export function usePortalData(name) {
  const [data, setData] = useState(cache[name] ?? SAVED[name])
  const [live, setLive] = useState(Boolean(cache[name]))

  useEffect(() => {
    if (cache[name]) return
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 6000)
    fetch(`${PORTAL_URL}/api/public/${name}/`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((json) => {
        cache[name] = json
        setData(json)
        setLive(true)
      })
      .catch(() => {}) // portal offline: keep the saved copy
      .finally(() => clearTimeout(timer))
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [name])

  return { data, live }
}

export function formatFcfa(amount) {
  return `${new Intl.NumberFormat('fr-FR').format(amount).replace(/[\u202f\u00a0]/g, ' ')} FCFA`
}

export function pick(isFr, en, fr) {
  return isFr && fr ? fr : en
}

// Short award label for cards: "HND", "BSc", "BTech", "MBA", "Licence Pro"...
// (the portal's internal codes such as BSC_BUS are never shown).
const SHORT_LABELS = { LIC_PRO: 'Licence Pro', MASTER_PRO: 'Master Pro' }

export function awardShort(award, isFr = false) {
  if (SHORT_LABELS[award.code]) return SHORT_LABELS[award.code]
  const name = pick(isFr, award.name, award.name_fr)
  const match = name.match(/\(([^)]+)\)\s*$/)
  return match && match[1].length <= 8 ? match[1] : award.code.replace(/_/g, ' ')
}
