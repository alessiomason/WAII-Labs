package it.polito.wa2.server.ticketing.purchases

import it.polito.wa2.server.products.Product
import it.polito.wa2.server.profiles.Profile
import it.polito.wa2.server.ticketing.purchases.warranties.Warranty
import it.polito.wa2.server.ticketing.tickets.Ticket
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import java.time.LocalDate

enum class PurchaseStatus {
    PREPARING, SHIPPED, DELIVERED, WITHDRAWN, REFUSED, REPLACED, REPAIRED
}

@Entity
@Table(name = "purchases")
class Purchase (
    @OneToOne
    val customer: Profile,
    @OneToOne
    val product: Product,
    var status: PurchaseStatus,
    val dateOfPurchase: LocalDate,
    @OneToOne
    var warranty: Warranty? = null
) {
    @Id
    @GeneratedValue
    @Column(updatable = false, nullable = false)
    var id: Int = 0
    @OneToMany(mappedBy = "purchase")
    val tickets = mutableSetOf<Ticket>()
}