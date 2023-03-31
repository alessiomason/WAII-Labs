package it.polito.wa2.server.products

import it.polito.wa2.server.products.ProductDTO
import it.polito.wa2.server.products.ProductService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class ProductController(
    private val productService: ProductService
) {
    @GetMapping("/API/products")
    fun getAll(): List<ProductDTO> {
        return productService.getAll()
    }
}