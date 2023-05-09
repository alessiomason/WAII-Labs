package it.polito.wa2.server.ticketing.purchases

import it.polito.wa2.server.products.ProductDTO
import it.polito.wa2.server.products.toDTO
import it.polito.wa2.server.profiles.ProfileDTO
import it.polito.wa2.server.profiles.toDTO
import it.polito.wa2.server.ticketing.tickets.TicketDTO
import it.polito.wa2.server.ticketing.tickets.toDTO

data class PurchaseDTO(
    val id: Int,
    val customer: ProfileDTO,
    val product: ProductDTO,
    val tickets: Set<TicketDTO>
)

fun Purchase.toDTO(): PurchaseDTO {
    return PurchaseDTO(id, customer.toDTO(), product.toDTO(), tickets.map { it.toDTO() }.toSet())
}