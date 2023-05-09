package it.polito.wa2.server.ticketing.purchases

interface PurchaseService {
    fun getAll(): List<Purchase>

    fun getPurchase(id: Int): PurchaseDTO
}