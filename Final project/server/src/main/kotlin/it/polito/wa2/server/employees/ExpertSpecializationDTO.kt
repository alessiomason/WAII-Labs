package it.polito.wa2.server.employees

data class ExpertSpecializationDTO(
    val id: Int,
    val name: String
)

fun ExpertSpecialization.toDTO(): ExpertSpecializationDTO {
    return ExpertSpecializationDTO(id, name)
}