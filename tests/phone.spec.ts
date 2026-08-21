import { test, expect } from '@playwright/test'
import { formatDisplayPhone, formatTelPhone, toNationalNumber } from '../src/lib/phone'

// El numero real del local. Antes de la correccion se mostraba "116 9720-415".
const LOCAL = '5491169720415'

test.describe('formatDisplayPhone', () => {
  test('formatea el numero del local con codigo de area de AMBA', () => {
    expect(formatDisplayPhone(LOCAL)).toBe('011 6972-0415')
  })

  test('acepta el numero sin el 9 de movil', () => {
    expect(formatDisplayPhone('541169720415')).toBe('011 6972-0415')
  })

  test('acepta el nacional pelado', () => {
    expect(formatDisplayPhone('1169720415')).toBe('011 6972-0415')
  })

  test('ignora separadores', () => {
    expect(formatDisplayPhone('+54 9 11 6972-0415')).toBe('011 6972-0415')
  })

  test('usa area de 4 digitos fuera del AMBA', () => {
    expect(formatDisplayPhone('5492320123456')).toBe('02320 123-456')
  })

  test('devuelve el original si no llega a 10 digitos nacionales', () => {
    expect(formatDisplayPhone('12345')).toBe('12345')
  })
})

test.describe('formatTelPhone', () => {
  test('devuelve el nacional con 0 inicial', () => {
    expect(formatTelPhone(LOCAL)).toBe('01169720415')
  })

  test('coincide con el valor por defecto de los componentes', () => {
    // Contacto.tsx y Eventos.tsx arrancan con este literal antes de que
    // carguen los settings: si divergen, el link cambia al hidratar.
    expect(formatTelPhone(LOCAL)).toBe('01169720415')
  })

  test('devuelve el original si el largo no cierra', () => {
    expect(formatTelPhone('123')).toBe('123')
  })
})

test.describe('toNationalNumber', () => {
  test('saca el prefijo 549', () => {
    expect(toNationalNumber(LOCAL)).toBe('1169720415')
  })

  test('saca el prefijo 54', () => {
    expect(toNationalNumber('541169720415')).toBe('1169720415')
  })
})
