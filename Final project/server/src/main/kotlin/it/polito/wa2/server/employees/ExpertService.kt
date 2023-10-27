package it.polito.wa2.server.employees

import jakarta.validation.constraints.Email

interface ExpertService {
    fun getAllExperts(): List<ExpertDTO>

    fun getExpert(id: String): ExpertDTO

    fun getExpertByEmail(@Email email: String): ExpertDTO

    fun editExpert(expertDTO: ExpertDTO)

    fun authorizeExpert(expertId: String, authorized: Boolean)

    fun addSpecialization(expertId: String, newSpecializationName: String): ExpertSpecializationDTO

    fun removeSpecialization(specializationDTO: ExpertSpecializationDTO)
}