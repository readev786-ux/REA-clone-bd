import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Star, Trash2, ImageOff, Images } from 'lucide-react'
import { useProjects } from '../../hooks/useData'
import { updateProjectImages } from '../../lib/admin'
import { ImageDrop } from '../../components/admin/ImageDrop'
import { Spinner } from '../../components/ui/Primitives'
import type { Project } from '../../lib/types'

export default function AdminMedia() {
  const { data, isLoading } = useProjects()
  const qc = useQueryClient()
  const [onlyMissing, setOnlyMissing] = useState(false)

  const mutation = useMutation({
    mutationFn: ({ id, hero, gallery }: { id: string; hero: string | null; gallery: string[] }) =>
      updateProjectImages(id, hero, gallery),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  })

  function addImages(p: Project, urls: string[]) {
    mutation.mutate({
      id: p.id,
      hero: p.hero_image || urls[0] || null,
      gallery: [...(p.gallery ?? []), ...urls],
    })
  }
  function removeImage(p: Project, url: string) {
    const gallery = (p.gallery ?? []).filter((g) => g !== url)
    mutation.mutate({ id: p.id, hero: p.hero_image === url ? gallery[0] ?? null : p.hero_image, gallery })
  }
  function setHero(p: Project, url: string) {
    mutation.mutate({ id: p.id, hero: url, gallery: p.gallery ?? [] })
  }

  const projects = (data ?? []).filter((p) =>
    onlyMissing ? !p.hero_image && (p.gallery?.length ?? 0) === 0 : true,
  )
  const missingCount = (data ?? []).filter((p) => !p.hero_image && (p.gallery?.length ?? 0) === 0).length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-navy-deep">Media Library</h2>
          <p className="text-sm text-ash">
            Drag photos onto any development to publish them instantly. Ideal right after a CSV import.
          </p>
        </div>
        <button
          onClick={() => setOnlyMissing((v) => !v)}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
            onlyMissing ? 'bg-navy text-white' : 'border border-navy/15 text-navy-deep hover:border-gold'
          }`}
        >
          <ImageOff className="h-4 w-4" />
          Only missing photos{missingCount ? ` (${missingCount})` : ''}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner className="text-gold-deep" /></div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-navy/15 bg-white py-20 text-center">
          <Images className="h-10 w-10 text-gold-deep/60" />
          <p className="text-sm text-ash">{onlyMissing ? 'Every development has photos. 🎉' : 'No developments yet.'}</p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {projects.map((p) => {
            const gallery = p.gallery ?? []
            return (
              <div key={p.id} className="rounded-2xl border border-black/5 bg-white p-5 card-shadow">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-display text-lg font-semibold text-navy-deep">{p.name}</p>
                    <p className="truncate text-xs text-ash">{p.location}</p>
                  </div>
                  {!p.hero_image && gallery.length === 0 && (
                    <span className="shrink-0 rounded-full bg-clay/10 px-2.5 py-1 text-xs font-semibold text-clay">No photos</span>
                  )}
                </div>

                {(p.hero_image || gallery.length > 0) && (
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {[...new Set([p.hero_image, ...gallery].filter(Boolean) as string[])].map((url) => (
                      <div key={url} className="group relative overflow-hidden rounded-lg">
                        <img src={url} alt="" className="h-20 w-full object-cover" />
                        {p.hero_image === url && (
                          <span className="absolute left-1 top-1 rounded bg-gold px-1.5 py-0.5 text-[0.6rem] font-bold text-navy">COVER</span>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-navy-ink/50 opacity-0 transition group-hover:opacity-100">
                          {p.hero_image !== url && (
                            <button title="Set as cover" onClick={() => setHero(p, url)} className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-navy">
                              <Star className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button title="Remove" onClick={() => removeImage(p, url)} className="flex h-7 w-7 items-center justify-center rounded-full bg-clay text-white">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4">
                  <ImageDrop compact label="Drop photos here to add" onUploaded={(urls) => addImages(p, urls)} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
