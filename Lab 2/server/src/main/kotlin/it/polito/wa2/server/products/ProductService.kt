package it.polito.wa2.server.products

interface ProductService {
    fun getAll(): List<ProductDTO>

    fun getProduct(productId: String): ProductDTO?
}