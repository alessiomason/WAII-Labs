package it.polito.wa2.server.employees

import it.polito.wa2.server.exceptions.ExpertNotFoundException
import it.polito.wa2.server.exceptions.ExpertSpecializationNotFoundException
import jakarta.validation.constraints.Email
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class ExpertServiceImpl(
    private val expertRepository: ExpertRepository,
    private val expertSpecializationRepository: ExpertSpecializationRepository
): ExpertService {
    override fun getAllExperts(): List<ExpertDTO> {
        return expertRepository.findAll().map { it.toExpertDTO() }
    }

    override fun getExpert(id: String): ExpertDTO {
        return expertRepository.findByIdOrNull(id)?.toExpertDTO() ?: throw ExpertNotFoundException()
    }

    override fun getExpertByEmail(@Email email: String): ExpertDTO {
        return expertRepository.findByEmail(email)?.toExpertDTO() ?: throw ExpertNotFoundException()
    }

    override fun editExpert(expertDTO: ExpertDTO) {
        val expert = expertRepository.findByIdOrNull(expertDTO.id) ?: throw ExpertNotFoundException()

        // modify all fields except id
        expert.firstName = expertDTO.firstName
        expert.lastName = expertDTO.lastName

        expertRepository.save(expert)
    }

    override fun authorizeExpert(expertId: String, authorized: Boolean) {
        val expert = expertRepository.findByIdOrNull(expertId) ?: throw ExpertNotFoundException()

        expert.authorized = authorized
        expertRepository.save(expert)
    }

    override fun addSpecialization(expertId: String, newSpecializationName: String): ExpertSpecializationDTO {
        val expert = expertRepository.findByIdOrNull(expertId) ?: throw ExpertNotFoundException()

        val specialization = ExpertSpecialization(newSpecializationName, expert)
        expertSpecializationRepository.save(specialization)

        return specialization.toDTO()
    }

    override fun removeSpecialization(specializationDTO: ExpertSpecializationDTO) {
        val specialization = expertSpecializationRepository.findByIdOrNull(specializationDTO.id) ?: throw ExpertSpecializationNotFoundException()

        expertSpecializationRepository.delete(specialization)
    }
}