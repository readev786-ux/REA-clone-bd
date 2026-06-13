import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Download, FileUp, Loader2, CheckCircle2, Images, AlertTriangle } from 'lucide-react'
import {
  CSV_TEMPLATE,
  parseDevelopmentsCsv,
  importDevelopments,
  type ParsedDevelopment,
  type ImportResult,
} from '../../lib/admin'

export default function AdminImport() {
  const qc = useQueryClient()
  const [raw, setRaw] = useState('')
  const [parsed, setParsed] = useState<ParsedDevelopment[]>([])
  const [parseErrors, setParseErrors] = useState<string[]>([])
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)

  function downloadTemplate() {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ahs-developments-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  function ingest(text: string) {
    setRaw(text)
    setResult(null)
    if (!text.trim()) {
      setParsed([])
      setParseErrors([])
      return
    }
    const { developments, errors } = parseDevelopmentsCsv(text)
    setParsed(developments)
    setParseErrors(errors)
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    file.text().then(ingest)
  }

  async function runImport() {
    setImporting(true)
    const res = await importDevelopments(parsed)
    await qc.invalidateQueries({ queryKey: ['projects'] })
    setResult(res)
    setImporting(false)
    if (res.errors.length === 0) {
      setParsed([])
      setRaw('')
    }
  }

  const totalUnits = parsed.reduce((n, d) => n + d.units.length, 0)
  const missingImages = parsed.filter((d) => d.imageCount === 0).length

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-navy-deep">Bulk import developments</h2>
        <p className="text-sm text-ash">
          Upload a CSV to add many developments and their units at once. Photos can be added
          afterwards in the Media Library — no spreadsheet of image links required.
        </p>
      </div>

      {/* Step 1 */}
      <div className="rounded-2xl border border-black/5 bg-white p-6 card-shadow">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-navy-deep">1. Get the template</h3>
            <p className="text-sm text-ash">
              One row per unit. Repeat the development name to add more units to it. Separate
              amenities and gallery links with <code className="rounded bg-navy/5 px-1">|</code>.
            </p>
          </div>
          <button onClick={downloadTemplate} className="inline-flex items-center gap-2 rounded-full border border-navy/15 px-5 py-2.5 text-sm font-semibold text-navy-deep hover:border-gold">
            <Download className="h-4 w-4" /> Download template
          </button>
        </div>
      </div>

      {/* Step 2 */}
      <div className="rounded-2xl border border-black/5 bg-white p-6 card-shadow">
        <h3 className="font-semibold text-navy-deep">2. Upload or paste your CSV</h3>
        <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-navy/20 px-4 py-6 text-sm font-medium text-navy-deep/80 hover:border-gold">
          <FileUp className="h-5 w-5 text-gold-deep" />
          Choose a .csv file
          <input type="file" accept=".csv,text/csv" className="hidden" onChange={onFile} />
        </label>
        <p className="my-2 text-center text-xs text-ash">or paste CSV contents below</p>
        <textarea
          value={raw}
          onChange={(e) => ingest(e.target.value)}
          placeholder="development_name,category,location,..."
          className="h-32 w-full rounded-xl border border-navy/15 bg-white px-3 py-2 font-mono text-xs outline-none focus:border-gold"
        />
      </div>

      {/* Errors */}
      {parseErrors.length > 0 && (
        <div className="rounded-2xl border border-gold/30 bg-gold-wash p-4 text-sm text-gold-deep">
          <p className="flex items-center gap-2 font-semibold"><AlertTriangle className="h-4 w-4" /> Notes</p>
          <ul className="mt-2 list-disc pl-5">{parseErrors.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </div>
      )}

      {/* Step 3 — preview */}
      {parsed.length > 0 && (
        <div className="rounded-2xl border border-black/5 bg-white p-6 card-shadow">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold text-navy-deep">
              3. Preview — {parsed.length} development{parsed.length === 1 ? '' : 's'}, {totalUnits} units
            </h3>
            <button onClick={runImport} disabled={importing} className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-60">
              {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Import {parsed.length} development{parsed.length === 1 ? '' : 's'}
            </button>
          </div>
          {missingImages > 0 && (
            <p className="mt-2 text-sm text-ash">
              {missingImages} development{missingImages === 1 ? '' : 's'} have no photos yet — you can add them in the Media Library after import.
            </p>
          )}
          <div className="mt-4 overflow-hidden rounded-xl border border-black/5">
            <div className="hidden grid-cols-[2fr_1fr_1fr_1fr] gap-2 bg-navy px-4 py-2.5 text-xs font-semibold uppercase text-white/80 sm:grid">
              <span>Development</span><span>Category</span><span>Units</span><span>Photos</span>
            </div>
            <div className="divide-y divide-black/5">
              {parsed.map((d) => (
                <div key={d.name} className="grid grid-cols-2 gap-2 px-4 py-3 text-sm sm:grid-cols-[2fr_1fr_1fr_1fr]">
                  <span className="font-semibold text-navy-deep">{d.name}</span>
                  <span className="capitalize text-ash">{d.fields.category}</span>
                  <span className="text-ash">{d.units.length}</span>
                  <span className={d.imageCount ? 'text-forest' : 'text-clay'}>{d.imageCount || 'none'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="rounded-2xl border border-mint/30 bg-mint/10 p-6 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-forest" />
          <h3 className="mt-3 font-display text-xl font-semibold text-forest">
            Imported {result.developments} development{result.developments === 1 ? '' : 's'} · {result.units} units
          </h3>
          {result.errors.length > 0 && (
            <ul className="mt-3 list-disc pl-5 text-left text-sm text-clay">
              {result.errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          )}
          <Link to="/admin/media" className="btn-gold mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold">
            <Images className="h-4 w-4" /> Add photos in the Media Library
          </Link>
        </div>
      )}
    </div>
  )
}
