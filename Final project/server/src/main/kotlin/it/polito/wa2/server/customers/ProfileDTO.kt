package it.polito.wa2.server.customers

data class ProfileDTO(
    override val id: String,
    val email: String,
    override val firstName: String,
    override val lastName: String,
    val phone: String?
): PersonDTO(id, firstName, lastName)

fun Profile.toDTO(): ProfileDTO {
    return ProfileDTO(id, email, firstName, lastName, phone)
}