package it.polito.wa2.server.employees

interface ExpertService {
    fun getAllExperts(): List<ExpertDTO>

    fun getExpert(id: String): ExpertDTO

    fun editExpert(expertDTO: ExpertDTO)

    fun addSpecialization(expertId: String, newSpecializationName: String): ExpertSpecializationDTO

    fun removeSpecialization(specializationDTO: ExpertSpecializationDTO)
}