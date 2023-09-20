package it.polito.wa2.server.employees

import jakarta.persistence.*

@Entity
@Table(name = "experts_specializations")
class ExpertSpecialization(
    val name: String,
    @ManyToOne
    var expert: Expert
) {
    @Id
    @GeneratedValue
    @Column(updatable = false, nullable = false)
    var id: Int = 0
}