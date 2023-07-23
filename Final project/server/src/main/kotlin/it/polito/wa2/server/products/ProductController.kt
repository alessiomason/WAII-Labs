package it.polito.wa2.server.products

import io.micrometer.observation.annotation.Observed
import jakarta.validation.constraints.Size
import lombok.extern.slf4j.Slf4j
import org.slf4j.LoggerFactory
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController

@RestController
@CrossOrigin("http://localhost:3000")
@Validated
@Observed
@Slf4j
class ProductController(
    private val productService: ProductService
) {
    private val logger = LoggerFactory.getLogger(ProductController::class.java)

    @GetMapping("/API/products")
    fun getAll(): List<ProductDTO> {
        logger.info("All products retrieved.")
        return productService.getAll()
    }

    @GetMapping("/API/products/{ean}")
    fun getProductById(@PathVariable @Size(min=13, max=13) ean: String): ProductDTO {
        logger.info("Product $ean retrieved.")
        return productService.getProduct(ean)
    }
}