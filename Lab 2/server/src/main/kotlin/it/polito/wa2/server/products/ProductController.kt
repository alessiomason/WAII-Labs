package it.polito.wa2.server.products

import it.polito.wa2.server.exceptions.ProductNotFoundException
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController

@RestController
class ProductController(
    private val productService: ProductService
) {
    @GetMapping("/API/products")
    fun getAll(): List<ProductDTO> {
        return productService.getAll()
    }

    @GetMapping("/API/products/{productId}")
    fun getProductById(@PathVariable productId: String): ProductDTO {
        return productService.getProduct(productId) ?: throw ProductNotFoundException()
    }
}