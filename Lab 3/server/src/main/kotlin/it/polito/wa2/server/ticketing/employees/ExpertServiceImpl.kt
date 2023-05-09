package it.polito.wa2.server.ticketing.employees

import it.polito.wa2.server.exceptions.ProfileNotFoundException
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class ExpertServiceImpl(
    private val expertRepository: ExpertRepository
): ExpertService {
    override fun getExpert(id: Int): ExpertDTO {
        return expertRepository.findByIdOrNull(id)?.toDTO() ?: throw ProfileNotFoundException()
    }

    override fun createExpert(newExpertDTO: NewExpertDTO): ExpertDTO {
        val newExpert = Expert(newExpertDTO.firstName, newExpertDTO.lastName)
        expertRepository.save(newExpert)

        return newExpert.toDTO()
    }

    override fun editExpert(expertDTO: ExpertDTO) {
        val expert = expertRepository.findByIdOrNull(expertDTO.id) ?: throw ProfileNotFoundException()

        // modify all fields except id
        expert.firstName = expertDTO.firstName
        expert.lastName = expertDTO.lastName

        expertRepository.save(expert)
    }
}