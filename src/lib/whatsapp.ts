import { getPhone } from './settings'

const formatMoney = (amount: number) =>
  '$' + amount.toLocaleString('es-AR')

interface OrderLine {
  name: string
  qty: number
  price: number
}

export function buildWhatsAppMessage(
  lines: OrderLine[],
  name: string,
  type: string,
  notes?: string
): string {
  let total = 0
  const orderLines = lines.map((l) => {
    const subtotal = l.price * l.qty
    total += subtotal
    return `• ${l.qty}x ${l.name} — ${formatMoney(subtotal)}`
  })

  let msg = '¡Hola Alma Dekh! Quiero hacer un pedido:\n\n'
  msg += '*DETALLE DEL PEDIDO:*\n'
  msg += orderLines.join('\n') + '\n\n'
  msg += `*TOTAL ESTIMADO:* ${formatMoney(total)}\n\n`
  msg += '*DATOS DE ENTREGA:*\n'
  msg += `👤 *Nombre:* ${name}\n`
  msg += `📍 *Modalidad:* ${type}\n`
  if (notes) msg += `📝 *Notas / Dirección:* ${notes}\n`

  return msg
}

export function openWhatsApp(message: string) {
  const phone = getPhone()
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}
