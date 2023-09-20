package it.polito.wa2.server

import it.polito.wa2.server.products.ProductRepository
import it.polito.wa2.server.customers.ProfileRepository
import it.polito.wa2.server.security.AuthenticationService
import it.polito.wa2.server.security.LoginDTO
import it.polito.wa2.server.employees.*
import it.polito.wa2.server.employees.toDTO
import it.polito.wa2.server.logs.LogRepository
import it.polito.wa2.server.purchases.PurchaseRepository
import it.polito.wa2.server.tickets.TicketRepository
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers

@Testcontainers
@SpringBootTest(webEnvironment=SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase(replace=AutoConfigureTestDatabase.Replace.NONE)
class ExpertsTests {
    companion object {
        @Container
        val postgres = PostgreSQLContainer("postgres:latest")

        inline fun <reified T> typeReference() = object: ParameterizedTypeReference<T>() {}
        private const val BASE_URL = "/API/experts"

        @JvmStatic
        @DynamicPropertySource
        fun properties(registry: DynamicPropertyRegistry) {
            registry.add("spring.datasource.url", postgres::getJdbcUrl)
            registry.add("spring.datasource.username", postgres::getUsername)
            registry.add("spring.datasource.password", postgres::getPassword)
            registry.add("spring.jpa.hibernate.ddl-auto") {"create-drop"}
        }

        private lateinit var expert1: Expert
        private lateinit var expert2: Expert
    }

    @Autowired
    lateinit var restTemplate: TestRestTemplate
    @Autowired
    lateinit var profileRepository: ProfileRepository
    @Autowired
    lateinit var productRepository: ProductRepository
    @Autowired
    lateinit var expertRepository: ExpertRepository
    @Autowired
    lateinit var expertSpecializationRepository: ExpertSpecializationRepository
    @Autowired
    lateinit var purchaseRepository: PurchaseRepository
    @Autowired
    lateinit var ticketRepository: TicketRepository
    @Autowired
    lateinit var logRepository: LogRepository
    @Autowired
    lateinit var authenticationService: AuthenticationService

    @BeforeEach
    fun populateDb() {
        logRepository.deleteAll()
        ticketRepository.deleteAll()
        purchaseRepository.deleteAll()
        expertSpecializationRepository.deleteAll()
        expertRepository.deleteAll()
        profileRepository.deleteAll()
        productRepository.deleteAll()

        // recreate the objects before each test to reinitialize the ids
        expert1 = Expert("expert1", "john.smith@products.com", "John", "Smith")
        expert2 = Expert("expert2", "jack.smith@products.com", "Jack", "Smith")
        expertRepository.save(expert1)
    }

    @Test
    fun getExpert() {

        val loginDTO = LoginDTO("expert1@products.com", "password")
        val jwtToken = authenticationService.login(loginDTO)?.accessToken

        val headers = HttpHeaders()
        headers.setBearerAuth(jwtToken ?: "")
        val requestEntity = HttpEntity<Nothing?>(headers)

        val res = restTemplate.exchange("$BASE_URL/${expert1.id}", HttpMethod.GET, requestEntity, typeReference<ExpertDTO>())

        Assertions.assertEquals(HttpStatus.OK, res.statusCode)
        Assertions.assertEquals(expert1.toDTO(), res.body)
    }

    @Test
    fun expertNotFound() {

        val loginDTO = LoginDTO("expert1@products.com", "password")
        val jwtToken = authenticationService.login(loginDTO)?.accessToken

        val headers = HttpHeaders()
        headers.setBearerAuth(jwtToken ?: "")
        val requestEntity = HttpEntity<Nothing?>(headers)

        val res = restTemplate.exchange("$BASE_URL/0", HttpMethod.GET, requestEntity, typeReference<Unit>())

        Assertions.assertEquals(HttpStatus.NOT_FOUND, res.statusCode)
    }

    @Test
    fun editExpert() {

        val loginDTO = LoginDTO("expert1@products.com", "password")
        val jwtToken = authenticationService.login(loginDTO)?.accessToken

        val headers = HttpHeaders()
        headers.setBearerAuth(jwtToken ?: "")

        // edit expert1 with expert2 fields
        val editedExpert = ExpertDTO(expert1.id, expert2.firstName, expert2.lastName, expert2.specializations.map { it.toDTO() }, expert2.tickets.map { it.id })
        val requestEntity = HttpEntity(editedExpert, headers)
        val res = restTemplate.exchange(BASE_URL, HttpMethod.PUT, requestEntity, typeReference<Unit>())

        Assertions.assertEquals(HttpStatus.OK, res.statusCode)

        val requestEntityGet = HttpEntity<Nothing?>(headers)

        val res2 = restTemplate.exchange("$BASE_URL/${editedExpert.id}", HttpMethod.GET, requestEntityGet, typeReference<ExpertDTO>())
        Assertions.assertEquals(HttpStatus.OK, res2.statusCode)
        Assertions.assertEquals(editedExpert, res2.body)
    }

    @Test
    fun editExpertNotFound() {

        val loginDTO = LoginDTO("expert1@products.com", "password")
        val jwtToken = authenticationService.login(loginDTO)?.accessToken

        val headers = HttpHeaders()
        headers.setBearerAuth(jwtToken ?: "")

        val editedExpert = ExpertDTO("0", expert2.firstName, expert2.lastName, expert2.specializations.map { it.toDTO() }, expert2.tickets.map { it.id })
        val requestEntity = HttpEntity(editedExpert, headers)
        val res = restTemplate.exchange(BASE_URL, HttpMethod.PUT, requestEntity, typeReference<Unit>())

        Assertions.assertEquals(HttpStatus.NOT_FOUND, res.statusCode)
    }

    @Test
    fun addExpertSpecialization() {

        val loginDTO = LoginDTO("manager1@products.com", "password")
        val jwtToken = authenticationService.login(loginDTO)?.accessToken

        val headers = HttpHeaders()
        headers.setBearerAuth(jwtToken ?: "")

        val newSpecialization = "Computers"
        val requestEntity = HttpEntity(newSpecialization, headers)
        val res = restTemplate.exchange("$BASE_URL/${expert1.id}/specialization", HttpMethod.POST, requestEntity, typeReference<ExpertSpecializationDTO>())

        Assertions.assertEquals(HttpStatus.OK, res.statusCode)

        val expectedRes = ExpertDTO(
            expert1.id,
            expert1.firstName,
            expert1.lastName,
            listOf(ExpertSpecializationDTO(res.body!!.id, newSpecialization)),
            expert1.tickets.map { it.id }
        )

        val requestEntityGet = HttpEntity<Nothing?>(headers)

        val res2 = restTemplate.exchange("$BASE_URL/${expert1.id}", HttpMethod.GET, requestEntityGet, typeReference<ExpertDTO>())

        Assertions.assertEquals(HttpStatus.OK, res2.statusCode)
        Assertions.assertEquals(expectedRes, res2.body)
    }

    @Test
    fun addExpertSpecializationExpertNotFound() {

        val loginDTO = LoginDTO("manager1@products.com", "password")
        val jwtToken = authenticationService.login(loginDTO)?.accessToken

        val headers = HttpHeaders()
        headers.setBearerAuth(jwtToken ?: "")

        val newSpecialization = "Computers"
        val requestEntity = HttpEntity(newSpecialization, headers)
        val res = restTemplate.exchange("$BASE_URL/${expert2.id}/specialization", HttpMethod.POST, requestEntity, typeReference<Unit>())

        Assertions.assertEquals(HttpStatus.NOT_FOUND, res.statusCode)
    }

    @Test
    fun removeExpertSpecialization() {

        val loginDTO = LoginDTO("manager1@products.com", "password")
        val jwtToken = authenticationService.login(loginDTO)?.accessToken

        val headers = HttpHeaders()
        headers.setBearerAuth(jwtToken ?: "")

        val expertSpecialization = ExpertSpecialization("Computers", expert1)
        expertSpecializationRepository.save(expertSpecialization)

        val requestEntity = HttpEntity(expertSpecialization.toDTO(), headers)

        val res = restTemplate.exchange("$BASE_URL/specialization", HttpMethod.DELETE, requestEntity, typeReference<Unit>())
        Assertions.assertEquals(HttpStatus.OK, res.statusCode)

        val expectedRes = ExpertDTO(
            expert1.id,
            expert1.firstName,
            expert1.lastName,
            listOf(),
            expert1.tickets.map { it.id }
        )

        val requestEntityGet = HttpEntity<Nothing?>(headers)

        val res2 = restTemplate.exchange("$BASE_URL/${expert1.id}", HttpMethod.GET, requestEntityGet, typeReference<ExpertDTO>())
        Assertions.assertEquals(HttpStatus.OK, res2.statusCode)
        Assertions.assertEquals(expectedRes, res2.body)
    }

    @Test
    fun removeExpertSpecializationNotFound() {

        val loginDTO = LoginDTO("manager1@products.com", "password")
        val jwtToken = authenticationService.login(loginDTO)?.accessToken

        val headers = HttpHeaders()
        headers.setBearerAuth(jwtToken ?: "")

        val expertSpecialization = ExpertSpecialization("Computers", expert1)
        val requestEntity = HttpEntity(expertSpecialization.toDTO(), headers)

        val res = restTemplate.exchange("$BASE_URL/specialization", HttpMethod.DELETE, requestEntity, typeReference<Unit>())
        Assertions.assertEquals(HttpStatus.NOT_FOUND, res.statusCode)
    }
}
