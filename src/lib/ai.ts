import { supabase } from './supabase'

export async function removeBackground(
  imageUrl: string,
  folder: 'menu' | 'events' = 'menu'
): Promise<{ url: string } | { error: string }> {
  const { data, error } = await supabase.functions.invoke('remove-bg', {
    body: { imageUrl, folder },
  })

  if (error) {
    const message =
      error.message || 'Error al procesar la imagen con IA'
    return { error: message }
  }

  return data as { url: string }
}
