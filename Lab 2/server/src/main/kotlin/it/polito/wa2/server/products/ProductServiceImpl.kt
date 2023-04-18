package it.polito.wa2.server.products

import it.polito.wa2.server.exceptions.ProductNotFoundException
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service  // class responsible for the business logic
class ProductServiceImpl(
    private val productRepository: ProductRepository
): ProductService {
    override fun getAll(): List<ProductDTO> {
        return productRepository.findAll().map { it.toDTO() }
    }

    override fun getProduct(ean: String): ProductDTO {
        return productRepository.findByIdOrNull(ean)?.toDTO() ?: throw ProductNotFoundException()
    }
}