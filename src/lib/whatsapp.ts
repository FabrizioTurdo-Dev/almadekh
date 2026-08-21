import { getPhone } from './settings'
import { formatPrice } from './format'

interface OrderLine {
  name: string
  qty: number
  price: number
}

export function buildWhatsAppMessage(
  lines: OrderLine[],
  name: string,
  type: string,
  notes?: string,
  /** Total calculado por el servidor. Si no se pasa, se suma desde las líneas. */
  serverTotal?: number
): string {
  let computed = 0
  const orderLines = lines.map((l) => {
    const subtotal = l.price * l.qty
    computed += subtotal
    return `• ${l.qty}x ${l.name} — ${formatPrice(subtotal)}`
  })
  const total = serverTotal ?? computed

  let msg = '¡Hola Alma Dekh! Quiero hacer un pedido:\n\n'
  msg += '*DETALLE DEL PEDIDO:*\n'
  msg += orderLines.join('\n') + '\n\n'
  msg += `*TOTAL ESTIMADO:* ${formatPrice(total)}\n\n`
  msg += '*DATOS DE ENTREGA:*\n'
  msg += `👤 *Nombre:* ${name}\n`
  msg += `📍 *Modalidad:* ${type}\n`
  if (notes) msg += `📝 *Notas / Dirección:* ${notes}\n`

  return msg
}

export function buildWhatsAppUrl(message: string): string {
  const phone = getPhone()
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

/**
 * Reserva la pestana de WhatsApp DENTRO del gesto del usuario.
 *
 * Safari en iOS solo permite `window.open` en el turno sincrono del click.
 * Como el alta del pedido es una llamada de red, para cuando vuelve la
 * respuesta ese permiso ya se perdio y la pestana queda bloqueada: el pedido
 * se registra y el cliente nunca ve WhatsApp.
 *
 * No se pasa `noopener` a proposito: con esa opcion `window.open` devuelve
 * `null` y no quedaria forma de navegar la pestana despues. La referencia
 * inversa se corta a mano con `opener = null`, que es equivalente.
 */
export function reserveWhatsAppTab(): Window | null {
  const tab = window.open('', '_blank')
  if (tab) tab.opener = null
  return tab
}

/**
 * Lleva la pestana reservada a WhatsApp. Devuelve `false` si no habia pestana
 * y el navegador tambien bloqueo el intento tardio: en ese caso hay que
 * ofrecerle el enlace al cliente en pantalla.
 */
export function openWhatsApp(message: string, reserved?: Window | null): boolean {
  const url = buildWhatsAppUrl(message)

  if (reserved && !reserved.closed) {
    reserved.location.href = url
    return true
  }

  return !!window.open(url, '_blank', 'noopener,noreferrer')
}
