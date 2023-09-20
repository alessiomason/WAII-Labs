package it.polito.wa2.server.purchases

import it.polito.wa2.server.exceptions.ProductNotFoundException
import it.polito.wa2.server.exceptions.ProfileNotFoundException
import it.polito.wa2.server.exceptions.PurchaseNotFoundException
import it.polito.wa2.server.products.ProductRepository
import it.polito.wa2.server.profiles.ProfileRepository
import it.polito.wa2.server.purchases.warranties.*
import jakarta.validation.constraints.Email
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class PurchaseServiceImpl(
    private val purchaseRepository: PurchaseRepository,
    private val warrantyRepository: WarrantyRepository,
    private val profileRepository: ProfileRepository,
    private val productRepository: ProductRepository
): PurchaseService {
    override fun getAllPurchases(): List<PurchaseDTO> {
        return purchaseRepository.findAll().map { it.toDTO() }
    }

    override fun getPurchasesByCustomer(@Email email: String): List<PurchaseDTO> {
        return purchaseRepository.findByCustomerEmail(email).map { it.toDTO() }
    }

    override fun getPurchase(id: Int): PurchaseDTO {
        return purchaseRepository.findByIdOrNull(id)?.toDTO() ?: throw PurchaseNotFoundException()
    }

    override fun createPurchase(newPurchaseDTO: NewPurchaseDTO): PurchaseDTO {
        val customer = profileRepository.findByIdOrNull(newPurchaseDTO.customer.id) ?: throw ProfileNotFoundException()
        val product = productRepository.findByIdOrNull(newPurchaseDTO.product.ean) ?: throw ProductNotFoundException()

        val newPurchase = Purchase(customer, product, newPurchaseDTO.status, newPurchaseDTO.dateOfPurchase)
        purchaseRepository.save(newPurchase)

        return newPurchase.toDTO()
    }

    override fun updatePurchaseStatus(purchaseId: Int, newPurchaseStatus: PurchaseStatus) {
        val purchase = purchaseRepository.findByIdOrNull(purchaseId) ?: throw PurchaseNotFoundException()

        purchase.status = newPurchaseStatus
        purchaseRepository.save(purchase)
    }

    override fun addWarranty(purchaseId: Int, newWarrantyDTO: NewWarrantyDTO): WarrantyDTO {
        val purchase = purchaseRepository.findByIdOrNull(purchaseId) ?: throw PurchaseNotFoundException()
        val warranty = Warranty(newWarrantyDTO.expiryDate)

        warrantyRepository.save(warranty)
        purchase.warranty = warranty
        purchaseRepository.save(purchase)

        return warranty.toDTO()
    }
}