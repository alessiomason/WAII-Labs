package it.polito.wa2.server.ticketing.employees

import it.polito.wa2.server.exceptions.ExpertNotFoundException
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class ExpertServiceImpl(
    private val expertRepository: ExpertRepository,
    private val expertSpecializationRepository: ExpertSpecializationRepository
): ExpertService {
    override fun getExpert(id: Int): ExpertDTO {
        return expertRepository.findByIdOrNull(id)?.toDTO() ?: throw ExpertNotFoundException()
    }

    override fun createExpert(newExpertDTO: NewExpertDTO): ExpertDTO {
        val newExpert = Expert(newExpertDTO.firstName, newExpertDTO.lastName)
        expertRepository.save(newExpert)

        return newExpert.toDTO()
    }

    override fun editExpert(expertDTO: ExpertDTO) {
        val expert = expertRepository.findByIdOrNull(expertDTO.id) ?: throw ExpertNotFoundException()

        // modify all fields except id
        expert.firstName = expertDTO.firstName
        expert.lastName = expertDTO.lastName

        expertRepository.save(expert)
    }

    override fun addSpecialization(expertId: Int, newSpecializationName: String) {
        val expert = expertRepository.findByIdOrNull(expertId) ?: throw ExpertNotFoundException()

        val specialization = ExpertSpecialization(newSpecializationName, expert)
        expertSpecializationRepository.save(specialization)
    }

    override fun removeSpecialization(specializationDTO: ExpertSpecializationDTO) {
        val specialization = expertSpecializationRepository.findByIdOrNull(specializationDTO.id) ?: throw ExpertNotFoundException()

        expertSpecializationRepository.delete(specialization)
    }
}