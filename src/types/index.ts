export interface MenuItem {
  id: string
  name: string
  desc: string
  price: number
  image_url?: string
  is_available?: boolean
  sort_order?: number
}

export interface Category {
  id: string
  name: string
  sort_order?: number
  is_special?: boolean
  items: MenuItem[]
}

export interface CartItem {
  item: MenuItem
  qty: number
}

export interface Event {
  id: string
  title: string
  date: string
  time?: string
  description: string
  image_url?: string
  type: 'past' | 'future'
  created_at: string
}

export interface OrderItem {
  name: string
  qty: number
  price: number
}

export interface Order {
  id: string
  customer_name: string
  items: OrderItem[]
  total: number
  delivery_type: string
  notes?: string
  status: 'pending' | 'confirmed' | 'preparation' | 'ready' | 'cancelled'
  created_at: string
}
