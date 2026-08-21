/**
 * Formateo de telefonos argentinos.
 *
 * Modulo sin dependencias a proposito: `settings.ts` arrastra el cliente de
 * Supabase y `import.meta.env`, asi que estas funciones no se podrian probar
 * si vivieran alli.
 *
 * El numero se guarda en formato internacional sin `+` (`5491169720415`).
 */

/** Numero nacional de 10 digitos, sin prefijo de pais. */
export function toNationalNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('549')) return digits.slice(3)
  if (digits.startsWith('54')) return digits.slice(2)
  return digits
}

/**
 * Largo del codigo de area. Sobre un nacional de 10 digitos, el AMBA usa 2
 * (11) y el resto del pais mayormente 4. No se intenta cubrir los codigos de
 * 3 digitos: sin una tabla de prefijos seria adivinar.
 */
function areaCodeLength(national: string): number {
  return national.startsWith('11') ? 2 : 4
}

/** Formato para mostrar en pantalla: `011 6972-0415`. */
export function formatDisplayPhone(raw: string): string {
  const national = toNationalNumber(raw)
  if (national.length !== 10) return raw
  const areaLen = areaCodeLength(national)
  const area = national.slice(0, areaLen)
  const rest = national.slice(areaLen)
  const split = Math.ceil(rest.length / 2)
  return `0${area} ${rest.slice(0, split)}-${rest.slice(split)}`
}

/** Formato para enlaces `tel:`: nacional con el 0 inicial (`01169720415`). */
export function formatTelPhone(raw: string): string {
  const national = toNationalNumber(raw)
  if (national.length !== 10) return raw
  return `0${national}`
}
