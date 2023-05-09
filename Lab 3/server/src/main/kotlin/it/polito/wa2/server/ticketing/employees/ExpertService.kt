package it.polito.wa2.server.ticketing.employees

interface ExpertService {
    fun getExpert(id: Int): ExpertDTO

    fun createExpert(expertDTO: ExpertDTO)

    fun editExpert(expertDTO: ExpertDTO)
}