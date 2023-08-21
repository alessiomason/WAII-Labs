package it.polito.wa2.server

import it.polito.wa2.server.products.Product
import it.polito.wa2.server.products.ProductRepository
import it.polito.wa2.server.profiles.Profile
import it.polito.wa2.server.profiles.ProfileRepository
import it.polito.wa2.server.security.AuthenticationService
import it.polito.wa2.server.security.LoginDTO
import it.polito.wa2.server.ticketing.employees.ExpertRepository
import it.polito.wa2.server.ticketing.employees.ExpertSpecializationRepository
import it.polito.wa2.server.ticketing.logs.LogRepository
import it.polito.wa2.server.ticketing.purchases.*
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
import java.time.LocalDate

@Testcontainers
@SpringBootTest(webEnvironment=SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase(replace=AutoConfigureTestDatabase.Replace.NONE)
class PurchasesTests {
    companion object {
        @Container
        val postgres = PostgreSQLContainer("postgres:latest")

        inline fun <reified T> typeReference() = object: ParameterizedTypeReference<T>() {}
        private const val BASE_URL = "/API/purchases"

        @JvmStatic
        @DynamicPropertySource
        fun properties(registry: DynamicPropertyRegistry) {
            registry.add("spring.datasource.url", postgres::getJdbcUrl)
            registry.add("spring.datasource.username", postgres::getUsername)
            registry.add("spring.datasource.password", postgres::getPassword)
            registry.add("spring.jpa.hibernate.ddl-auto") {"create-drop"}
        }

        private val customer1 = Profile("Customer1", "flongwood0@vk.com", "Franky", "Longwood", "+33 616 805 6213")
        private val customer2 = Profile("Customer2", "drushby2@cornell.edu", "Daniela", "Rushby", "+33 172 648 2463")
        private val notSavedCustomer = Profile("Customer 3", "grengger1@cloudflare.com", "Grant", "Rengger", "+62 982 796 8613")
        private val product1 = Product("8712725728528", "Walter Trout Unspoiled by Progress CD B23b", "Mascot")
        private val product2 = Product("5011781900125", "Nitty Gritty Dirt Band Will The Circle Be Unbroken Volume 2 CD USA MCA 1989 20", "MCA")
        private val notSavedProduct = Product("3532041192835", "Glow Worm Flexicom Upward Piping Frame A2041500", "Glow-Worm")
        private lateinit var purchase1: Purchase
        private lateinit var purchase2: Purchase
        private lateinit var purchase3: Purchase
        private lateinit var purchase4: Purchase
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
        profileRepository.save(customer1)
        profileRepository.save(customer2)
        productRepository.save(product1)
        productRepository.save(product2)
        purchase1 = Purchase(customer1, product1, PurchaseStatus.PREPARING, LocalDate.now())
        purchase2 = Purchase(customer1, product2, PurchaseStatus.SHIPPED, LocalDate.of(2023, 8, 21))
        purchase3 = Purchase(customer2, product2, PurchaseStatus.DELIVERED, LocalDate.of(2022, 4, 7))
        purchase4 = Purchase(customer2, product1, PurchaseStatus.REPLACED, LocalDate.now())
        purchaseRepository.save(purchase1)
        purchaseRepository.save(purchase2)
        purchaseRepository.save(purchase3)
    }

    @Test
    fun getAllPurchases() {

        val loginDTO = LoginDTO("expert1@products.com", "password")
        val jwtToken = authenticationService.login(loginDTO)?.jwtAccessToken

        val headers = HttpHeaders()
        headers.setBearerAuth(jwtToken ?: "")
        val requestEntity = HttpEntity<Nothing?>(headers)

        val res = restTemplate.exchange(BASE_URL, HttpMethod.GET, requestEntity, typeReference<List<PurchaseDTO>>())

        Assertions.assertEquals(HttpStatus.OK, res.statusCode)
        Assertions.assertEquals(listOf(purchase1.toDTO(), purchase2.toDTO(), purchase3.toDTO()), res.body)
    }

    @Test
    fun getPurchase() {

        val loginDTO = LoginDTO("expert1@products.com", "password")
        val jwtToken = authenticationService.login(loginDTO)?.jwtAccessToken

        val headers = HttpHeaders()
        headers.setBearerAuth(jwtToken ?: "")
        val requestEntity = HttpEntity<Nothing?>(headers)

        val res = restTemplate.exchange("$BASE_URL/${purchase1.id}", HttpMethod.GET, requestEntity, typeReference<PurchaseDTO>())

        Assertions.assertEquals(HttpStatus.OK, res.statusCode)
        Assertions.assertEquals(purchase1.toDTO(), res.body)
    }

    @Test
    fun purchaseNotFound() {

        val loginDTO = LoginDTO("expert1@products.com", "password")
        val jwtToken = authenticationService.login(loginDTO)?.jwtAccessToken

        val headers = HttpHeaders()
        headers.setBearerAuth(jwtToken ?: "")
        val requestEntity = HttpEntity<Nothing?>(headers)

        val res = restTemplate.exchange("$BASE_URL/0", HttpMethod.GET, requestEntity, typeReference<Unit>())

        Assertions.assertEquals(HttpStatus.NOT_FOUND, res.statusCode)
    }

    @Test
    fun createPurchase() {

        val loginDTO = LoginDTO("customer1@products.com", "password")
        val jwtToken = authenticationService.login(loginDTO)?.jwtAccessToken

        val headers = HttpHeaders()
        headers.setBearerAuth(jwtToken ?: "")

        val requestEntity = HttpEntity(purchase4.toNewDTO(), headers)
        val res = restTemplate.exchange(BASE_URL, HttpMethod.POST, requestEntity, typeReference<PurchaseDTO>())

        // purchase4 with newly autogenerated id
        val createdPurchase = purchase4.apply { id = res.body!!.id }.toDTO()

        Assertions.assertEquals(HttpStatus.OK, res.statusCode)
        Assertions.assertEquals(createdPurchase, res.body)

        val requestEntityGet = HttpEntity<Nothing?>(headers)

        val res2 = restTemplate.exchange("$BASE_URL/${createdPurchase.id}", HttpMethod.GET, requestEntityGet, typeReference<PurchaseDTO>())
        Assertions.assertEquals(HttpStatus.OK, res2.statusCode)
        Assertions.assertEquals(createdPurchase, res2.body)
    }

    @Test
    fun aCustomerCanBuyTheSameProductMultipleTimes() {

        val loginDTO = LoginDTO("customer1@products.com", "password")
        val jwtToken = authenticationService.login(loginDTO)?.jwtAccessToken

        val headers = HttpHeaders()
        headers.setBearerAuth(jwtToken ?: "")

        val requestEntity = HttpEntity(purchase1.toNewDTO(), headers)
        val res = restTemplate.exchange(BASE_URL, HttpMethod.POST, requestEntity, typeReference<PurchaseDTO>())

        // purchase1 with newly autogenerated id
        val createdPurchase = purchase1.apply { id = res.body!!.id }.toDTO()

        Assertions.assertEquals(HttpStatus.OK, res.statusCode)
        Assertions.assertEquals(createdPurchase, res.body)

        val requestEntityGet = HttpEntity<Nothing?>(headers)

        val res2 = restTemplate.exchange("$BASE_URL/${createdPurchase.id}", HttpMethod.GET, requestEntityGet, typeReference<PurchaseDTO>())
        Assertions.assertEquals(HttpStatus.OK, res2.statusCode)
        Assertions.assertEquals(createdPurchase, res2.body)
    }

    @Test
    fun createPurchaseCustomerNotFound() {

        val loginDTO = LoginDTO("customer1@products.com", "password")
        val jwtToken = authenticationService.login(loginDTO)?.jwtAccessToken

        val headers = HttpHeaders()
        headers.setBearerAuth(jwtToken ?: "")

        val newPurchase = Purchase(notSavedCustomer, product1, PurchaseStatus.PREPARING, LocalDate.now())
        val requestEntity = HttpEntity(newPurchase.toNewDTO(), headers)
        val res = restTemplate.exchange(BASE_URL, HttpMethod.POST, requestEntity, typeReference<Unit>())

        Assertions.assertEquals(HttpStatus.NOT_FOUND, res.statusCode)
    }

    @Test
    fun createPurchaseProductNotFound() {

        val loginDTO = LoginDTO("customer1@products.com", "password")
        val jwtToken = authenticationService.login(loginDTO)?.jwtAccessToken

        val headers = HttpHeaders()
        headers.setBearerAuth(jwtToken ?: "")

        val newPurchase = Purchase(customer1, notSavedProduct, PurchaseStatus.PREPARING, LocalDate.now())
        val requestEntity = HttpEntity(newPurchase.toNewDTO(), headers)
        val res = restTemplate.exchange(BASE_URL, HttpMethod.POST, requestEntity, typeReference<Unit>())

        Assertions.assertEquals(HttpStatus.NOT_FOUND, res.statusCode)
    }
}
