package it.polito.wa2.server.ticketing.purchases

import it.polito.wa2.server.exceptions.ProductNotFoundException
import it.polito.wa2.server.exceptions.ProfileNotFoundException
import it.polito.wa2.server.exceptions.PurchaseNotFoundException
import it.polito.wa2.server.products.ProductRepository
import it.polito.wa2.server.profiles.ProfileRepository
import it.polito.wa2.server.ticketing.purchases.warranties.*
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

    override fun addWarranty(purchaseId: Int, newWarrantyDTO: NewWarrantyDTO): WarrantyDTO {
        val purchase = purchaseRepository.findByIdOrNull(purchaseId) ?: throw PurchaseNotFoundException()
        val warranty = Warranty(newWarrantyDTO.expiryDate)

        warrantyRepository.save(warranty)
        purchase.warranty = warranty
        purchaseRepository.save(purchase)

        return warranty.toDTO()
    }
}