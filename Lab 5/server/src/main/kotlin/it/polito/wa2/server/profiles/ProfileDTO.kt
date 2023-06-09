package it.polito.wa2.server.profiles

data class ProfileDTO(
    val id: String,
    val email: String,
    val firstName: String,
    val lastName: String,
    val phone: String?
)

fun Profile.toDTO(): ProfileDTO {
    return ProfileDTO(id, email, firstName, lastName, phone)
}