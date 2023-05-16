package it.polito.wa2.server.ticketing.employees

interface ExpertService {
    fun getExpert(id: Int): ExpertDTO

    fun createExpert(newExpertDTO: NewExpertDTO): ExpertDTO

    fun editExpert(expertDTO: ExpertDTO)

    fun addSpecialization(expertId: Int, newSpecializationName: String): ExpertSpecializationDTO

    fun removeSpecialization(specializationDTO: ExpertSpecializationDTO)
}