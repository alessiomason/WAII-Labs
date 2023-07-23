package it.polito.wa2.server

import it.polito.wa2.server.products.ProductRepository
import it.polito.wa2.server.profiles.Profile
import it.polito.wa2.server.profiles.ProfileDTO
import it.polito.wa2.server.profiles.ProfileRepository
import it.polito.wa2.server.profiles.toDTO
import it.polito.wa2.server.security.AuthenticationService
import it.polito.wa2.server.security.LoginDTO
import it.polito.wa2.server.ticketing.employees.ExpertRepository
import it.polito.wa2.server.ticketing.employees.ExpertSpecializationRepository
import it.polito.wa2.server.ticketing.logs.LogRepository
import it.polito.wa2.server.ticketing.purchases.PurchaseRepository
import it.polito.wa2.server.ticketing.tickets.TicketRepository
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
class ProfilesTests {
    companion object {
        @Container
        val postgres = PostgreSQLContainer("postgres:latest")

        inline fun <reified T> typeReference() = object: ParameterizedTypeReference<T>() {}
        private const val baseUrl = "/API/profiles"

        @JvmStatic
        @DynamicPropertySource
        fun properties(registry: DynamicPropertyRegistry) {
            registry.add("spring.datasource.url", postgres::getJdbcUrl)
            registry.add("spring.datasource.username", postgres::getUsername)
            registry.add("spring.datasource.password", postgres::getPassword)
            registry.add("spring.jpa.hibernate.ddl-auto") {"create-drop"}
        }

        private val profile1 = Profile("customer1", "flongwood0@vk.com", "Franky", "Longwood", "+33 616 805 6213")
        private val profile2 = Profile("customer2", "grengger1@cloudflare.com", "Grant", "Rengger", "+62 982 796 8613")
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

        profileRepository.save(profile1)
    }

    @Test
    fun getProfile() {
        val loginDTO = LoginDTO("customer1@products.com", "password")
        val jwtToken = authenticationService.login(loginDTO)?.jwtAccessToken

        val headers = HttpHeaders()
        headers.setBearerAuth(jwtToken ?: "")
        val requestEntity = HttpEntity<Nothing?>(headers)

        val res = restTemplate.exchange("$baseUrl/${profile1.id}", HttpMethod.GET, requestEntity, typeReference<ProfileDTO>())

        Assertions.assertEquals(HttpStatus.OK, res.statusCode)
        Assertions.assertEquals(profile1.toDTO(), res.body)
    }

    @Test
    fun profileNotFound() {
        val loginDTO = LoginDTO("customer1@products.com", "password")
        val jwtToken = authenticationService.login(loginDTO)?.jwtAccessToken

        val headers = HttpHeaders()
        headers.setBearerAuth(jwtToken ?: "")
        val requestEntity = HttpEntity<Nothing?>(headers)

        val res = restTemplate.exchange("$baseUrl/${profile2.id}", HttpMethod.GET, requestEntity, typeReference<Unit>())

        Assertions.assertEquals(HttpStatus.NOT_FOUND, res.statusCode)
    }

    @Test
    fun editProfile() {
        // edit testProfile1 with testProfile2 fields
        val editedProfile = ProfileDTO(profile1.id, profile2.email, profile2.firstName, profile2.lastName, profile2.phone)

        val loginDTO = LoginDTO("customer1@products.com", "password")
        val jwtToken = authenticationService.login(loginDTO)?.jwtAccessToken

        val headers = HttpHeaders()
        headers.setBearerAuth(jwtToken ?: "")

        val requestEntityPut = HttpEntity(editedProfile, headers)
        val res = restTemplate.exchange(baseUrl, HttpMethod.PUT, requestEntityPut, typeReference<Unit>())

        Assertions.assertEquals(HttpStatus.OK, res.statusCode)

        val requestEntityGet = HttpEntity<Nothing?>(headers)
        val res2 = restTemplate.exchange("$baseUrl/${editedProfile.id}", HttpMethod.GET, requestEntityGet, typeReference<ProfileDTO>())
        Assertions.assertEquals(HttpStatus.OK, res2.statusCode)
        Assertions.assertEquals(editedProfile, res2.body)
    }

    @Test
    fun editProfileNotFound() {
        val editedProfile = ProfileDTO("notExistingProfile", profile2.email, profile2.firstName, profile2.lastName, profile2.phone)

        val loginDTO = LoginDTO("customer1@products.com", "password")
        val jwtToken = authenticationService.login(loginDTO)?.jwtAccessToken

        val headers = HttpHeaders()
        headers.setBearerAuth(jwtToken ?: "")
        val requestEntity = HttpEntity(editedProfile, headers)
        val res = restTemplate.exchange(baseUrl, HttpMethod.PUT, requestEntity, typeReference<Unit>())

        Assertions.assertEquals(HttpStatus.NOT_FOUND, res.statusCode)
    }
}