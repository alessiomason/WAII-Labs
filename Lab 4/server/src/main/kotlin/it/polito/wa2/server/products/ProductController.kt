package it.polito.wa2.server.products

import jakarta.validation.constraints.Size
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController
import java.security.Principal

@RestController
@CrossOrigin("http://localhost:3000")
@Validated
class ProductController(
    private val productService: ProductService
) {
    @GetMapping("/API/products")
    fun getAll(): List<ProductDTO> {
        return productService.getAll()
    }

    @GetMapping("/API/products/{ean}")
    fun getProductById(@PathVariable @Size(min=13, max=13) ean: String): ProductDTO {
        return productService.getProduct(ean)
    }
}