package it.polito.wa2.server.purchases

import it.polito.wa2.server.products.ProductDTO
import it.polito.wa2.server.products.toDTO
import it.polito.wa2.server.customers.ProfileDTO
import it.polito.wa2.server.customers.toDTO
import it.polito.wa2.server.purchases.warranties.WarrantyDTO
import it.polito.wa2.server.purchases.warranties.toDTO
import java.time.LocalDate

data class PurchaseDTO(
    val id: Int,
    val customer: ProfileDTO,
    val product: ProductDTO,
    val status: PurchaseStatus,
    val dateOfPurchase: LocalDate,
    val warranty: WarrantyDTO? = null,
    val coveredByWarranty: Boolean,
    val ticketIds: List<Int>
    // only the ids of the corresponding tickets are returned, to avoid an infinite loop of conversions to DTO
)

data class NewPurchaseDTO(
    val customer: ProfileDTO,
    val product: ProductDTO,
    val status: PurchaseStatus = PurchaseStatus.PREPARING,
    val dateOfPurchase: LocalDate
)

fun Purchase.toDTO(): PurchaseDTO {
    return PurchaseDTO(
        id,
        customer.toDTO(),
        product.toDTO(),
        status,
        dateOfPurchase,
        warranty?.toDTO(),
        coveredByWarranty,
        tickets.map { it.id })
}

fun Purchase.toNewDTO(): NewPurchaseDTO {
    return NewPurchaseDTO(customer.toDTO(), product.toDTO(), status, dateOfPurchase)
}