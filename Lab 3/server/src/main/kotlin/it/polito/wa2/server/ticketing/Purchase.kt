package it.polito.wa2.server.ticketing

import it.polito.wa2.server.products.Product
import it.polito.wa2.server.profiles.Profile
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.OneToOne
import jakarta.persistence.Table

@Entity
@Table(name = "purchases")
class Purchase (
    @OneToOne
    val user: Profile,
    @OneToOne
    val product: Product
) {
    @Id
    @Column(updatable = false, nullable = false)
    var id: Int = 0
    @OneToMany(mappedBy = "purchase")
    val tickets = mutableSetOf<Ticket>()
}