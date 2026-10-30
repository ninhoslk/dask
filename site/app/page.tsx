import { SiteFooter } from "@/components/site-footer"
import { Conquistas } from "@/components/sections/conquistas"
import { Contato } from "@/components/sections/contato"
import { Ensino } from "@/components/sections/ensino"
import { Escola } from "@/components/sections/escola"
import { Apresentacao } from "@/components/sections/hero"
import { HeroCinematico } from "@/components/sections/hero-cinematico"
import { Metodo } from "@/components/sections/metodo"
import { Noticias } from "@/components/sections/noticias"
import { Showcase } from "@/components/sections/showcase"
import { Vida } from "@/components/sections/vida"

export default function Home() {
  return (
    <>
      <main id="conteudo">
        <HeroCinematico />
        <Apresentacao />
        <Escola />
        <Ensino />
        <Metodo />
        <Showcase />
        <Vida />
        <Conquistas />
        <Noticias />
        <Contato />
      </main>
      <SiteFooter />
    </>
  )
}
