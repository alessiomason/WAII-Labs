package it.polito.wa2.server.ticketing.purchases

class PurchaseServiceImpl(
    private val purchaseRepository: PurchaseRepository
): PurchaseService {
    override fun getAll(): List<Purchase> {
        TODO("Not yet implemented")
    }

    override fun getPurchase(id: Int): PurchaseDTO {
        TODO("Not yet implemented")
    }

}