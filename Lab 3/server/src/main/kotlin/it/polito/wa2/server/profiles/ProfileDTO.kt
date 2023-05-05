package it.polito.wa2.server.profiles

data class ProfileDTO(
    val email: String,
    val firstName: String,
    val lastName: String,
    val phone: String
)

fun Profile.toDTO(): ProfileDTO {
    return ProfileDTO(email, firstName, lastName, phone)
}

fun ProfileDTO.toProfile(): Profile {
    val p = Profile()
    p.email = email
    p.firstName = firstName
    p.lastName = lastName
    p.phone = phone
    return p
}