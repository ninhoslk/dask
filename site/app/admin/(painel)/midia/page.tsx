import { BibliotecaMidia } from "@/components/admin/biblioteca-midia"
import { exigirAdmin } from "@/lib/admin/sessao"

export default async function Midia() {
  await exigirAdmin()
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-5xl p-6">
        <h1 className="text-2xl font-extrabold tracking-[-0.03em]">Mídia</h1>
        <p className="text-muted-foreground">
          Fotos enviadas pela equipe. Use-as no editor visual e nas notícias. Só fotos reais da escola.
        </p>
        <BibliotecaMidia />
      </div>
    </div>
  )
}
