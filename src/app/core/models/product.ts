export interface Product {
  destacado: number
  nombre: string
  id_producto: number
  id_subcategoria: number
  precio: number
  imagenes: ProductImages[]
  vendible: number
  stock: number
  garantia: number
  iva: number
  nombre_subcategoria?: string
  cantidad?: number
}

export interface ProductImages {
  nombre: string
  id_producto_imagen: number
  orden: number
}