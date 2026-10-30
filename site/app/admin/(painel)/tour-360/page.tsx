import { FormTour } from "@/components/admin/form-tour"
import { exigirAdmin } from "@/lib/admin/sessao"

export default async function AdminTour() {
  const { sb } = await exigirAdmin()
  const { data } = await sb.from("tour360").select("ativo,titulo,descricao,url_embed").eq("id", 1).maybeSingle()
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-extrabold tracking-[-0.03em]">Tour 360°</h1>
        <p className="text-muted-foreground">
          Espaço reservado para o tour virtual da escola. Quando o tour estiver pronto (Matterport, Kuula, Google
          Street View ou outro), cole aqui o endereço de incorporação e ative. Enquanto estiver desativado, a página
          pública /tour-360 mostra “em breve”.
        </p>
        <FormTour
          inicial={{
            ativo: data?.ativo ?? false,
            titulo: data?.titulo ?? "Tour 360° pelo Colégio Dask",
            descricao: data?.descricao ?? "",
            url_embed: data?.url_embed ?? "",
          }}
        />
      </div>
    </div>
  )
}
