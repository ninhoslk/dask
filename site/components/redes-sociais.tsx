import { IconeFacebook, IconeInstagram } from "@/components/icones-redes"
import { contato } from "@/lib/site"

// Perfis oficiais do colégio (os mesmos do site colegiodask.com.br).
export function RedesSociais() {
  return (
    <ul className="flex flex-wrap gap-3">
      <li>
        <a href={contato.instagram} target="_blank" rel="noopener noreferrer" className="rede">
          <IconeInstagram className="size-5" />
          Instagram
        </a>
      </li>
      <li>
        <a href={contato.facebook} target="_blank" rel="noopener noreferrer" className="rede">
          <IconeFacebook className="size-5" />
          Facebook
        </a>
      </li>
    </ul>
  )
}
