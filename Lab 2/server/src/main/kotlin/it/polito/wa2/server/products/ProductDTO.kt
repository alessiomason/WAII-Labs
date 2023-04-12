package it.polito.wa2.server.products

data class ProductDTO(
    val productId: String,
    val name: String,
    val brand: String
)

fun Product.toDTO(): ProductDTO {
    // extension function receives a "this" field
    return ProductDTO(productId, name, brand)
}