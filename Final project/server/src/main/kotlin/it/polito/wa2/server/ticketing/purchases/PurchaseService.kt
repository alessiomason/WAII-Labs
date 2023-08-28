package it.polito.wa2.server.ticketing.purchases

import it.polito.wa2.server.ticketing.purchases.warranties.NewWarrantyDTO
import it.polito.wa2.server.ticketing.purchases.warranties.WarrantyDTO
import jakarta.validation.constraints.Email

interface PurchaseService {
    fun getAllPurchases(): List<PurchaseDTO>

    fun getPurchasesByCustomer(@Email email: String): List<PurchaseDTO>

    fun getPurchase(id: Int): PurchaseDTO

    fun createPurchase(newPurchaseDTO: NewPurchaseDTO): PurchaseDTO

    fun updatePurchaseStatus(purchaseId: Int, newPurchaseStatus: PurchaseStatus)

    fun addWarranty(purchaseId: Int, newWarrantyDTO: NewWarrantyDTO): WarrantyDTO
}