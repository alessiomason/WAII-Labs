package it.polito.wa2.server.ticketing.employees

import it.polito.wa2.server.exceptions.DuplicateProfileException
import it.polito.wa2.server.exceptions.ProfileNotFoundException
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class ExpertServiceImpl(
    private val expertRepository: ExpertRepository
): ExpertService {
    fun ExpertDTO.toExpert(): Expert {
        return expertRepository.findByIdOrNull(this.id) ?: throw ProfileNotFoundException()
    }

    override fun getExpert(id: Int): ExpertDTO {
        return expertRepository.findByIdOrNull(id)?.toDTO() ?: throw ProfileNotFoundException()
    }

    override fun createExpert(expertDTO: ExpertDTO) {
        if (expertRepository.findByIdOrNull(expertDTO.id) != null)
            throw DuplicateProfileException()

        val newExpert = Expert(expertDTO.firstName, expertDTO.lastName)
        expertRepository.save(newExpert)
    }

    override fun editExpert(expertDTO: ExpertDTO) {
        val expert = expertDTO.toExpert()

        // modify all fields except id
        expert.firstName = expertDTO.firstName
        expert.lastName = expertDTO.lastName

        expertRepository.save(expert)
    }
}