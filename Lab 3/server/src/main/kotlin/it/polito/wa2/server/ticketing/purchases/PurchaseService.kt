package it.polito.wa2.server.ticketing.purchases

interface PurchaseService {
    fun getAllPurchases(): List<PurchaseDTO>

    fun getPurchase(id: Int): PurchaseDTO

    fun createPurchase(purchaseDTO: PurchaseDTO)
}