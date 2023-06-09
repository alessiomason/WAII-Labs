package it.polito.wa2.server

import it.polito.wa2.server.products.Product
import it.polito.wa2.server.products.ProductRepository
import it.polito.wa2.server.products.toDTO
import it.polito.wa2.server.profiles.Profile
import it.polito.wa2.server.profiles.ProfileRepository
import it.polito.wa2.server.profiles.toDTO
import it.polito.wa2.server.security.AuthenticationService
import it.polito.wa2.server.security.LoginDTO
import it.polito.wa2.server.ticketing.employees.*
import it.polito.wa2.server.ticketing.logs.Log
import it.polito.wa2.server.ticketing.logs.LogDTO
import it.polito.wa2.server.ticketing.logs.LogRepository
import it.polito.wa2.server.ticketing.purchases.Purchase
import it.polito.wa2.server.ticketing.purchases.PurchaseDTO
import it.polito.wa2.server.ticketing.purchases.PurchaseRepository
import it.polito.wa2.server.ticketing.tickets.Ticket
import it.polito.wa2.server.ticketing.tickets.TicketDTO
import it.polito.wa2.server.ticketing.tickets.TicketRepository
import it.polito.wa2.server.ticketing.tickets.TicketStatus
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
import org.springframework.http.RequestEntity
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers
import java.time.Instant

@Testcontainers
@SpringBootTest(webEnvironment=SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase(replace=AutoConfigureTestDatabase.Replace.NONE)
class LogsTests {
    companion object {
        @Container
        val postgres = PostgreSQLContainer("postgres:latest")

        inline fun <reified T> typeReference() = object: ParameterizedTypeReference<T>() {}
        private const val baseUrl = "/API/logs"

        @JvmStatic
        @DynamicPropertySource
        fun properties(registry: DynamicPropertyRegistry) {
            registry.add("spring.datasource.url", postgres::getJdbcUrl)
            registry.add("spring.datasource.username", postgres::getUsername)
            registry.add("spring.datasource.password", postgres::getPassword)
            registry.add("spring.jpa.hibernate.ddl-auto") {"create-drop"}
        }

        private val customer1 = Profile("flongwood0@vk.com", "flongwood0@vk.com", "Franky", "Longwood", "+33 616 805 6213")
        private val customer2 = Profile("grengger1@cloudflare.com", "grengger1@cloudflare.com", "Grant", "Rengger", "+62 982 796 8613")
        private val product1 = Product("8712725728528", "Walter Trout Unspoiled by Progress CD B23b", "Mascot")
        private val product2 = Product("5011781900125", "Nitty Gritty Dirt Band Will The Circle Be Unbroken Volume 2 CD USA MCA 1989 20", "MCA")

        private lateinit var expert1: Expert
        private lateinit var expert2: Expert

        private lateinit var purchase1: Purchase
        private lateinit var purchase2: Purchase
        private lateinit var purchase3: Purchase
        private lateinit var purchase4: Purchase

        private lateinit var ticket1: Ticket
        private lateinit var ticket2: Ticket
        private lateinit var ticket3: Ticket
        private lateinit var ticket4: Ticket
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

        expert1 = Expert("expert1", "john.smith@products.com", "John", "Smith")
        expert2 = Expert("expert2", "jack.smith@products.com", "Jack", "Smith")
        expertRepository.save(expert1)

        purchase1 = Purchase(customer1, product1)
        purchase2 = Purchase(customer1, product2)
        purchase3 = Purchase(customer2, product2)
        purchase4 = Purchase(customer2, product1)
        purchaseRepository.save(purchase1)
        purchaseRepository.save(purchase2)
        purchaseRepository.save(purchase3)
        purchaseRepository.save(purchase4)

        ticket1 = Ticket("Ticket 1", "Description 1", purchase1)
        ticket2 = Ticket("Ticket 2", "Description 2", purchase2)
        ticket3 = Ticket("Ticket 3", "Description 3", purchase3)
        ticket4 = Ticket("Ticket 4", "Description 4", purchase4)
        ticketRepository.save(ticket1)
        ticketRepository.save(ticket2)
        ticketRepository.save(ticket3)
    }

    @Test
    fun getAllLogsByTicketId() {
        ticket1.ticketStatus = TicketStatus.IN_PROGRESS
        ticketRepository.save(ticket1)

        val log1 = Log(
            TicketStatus.OPEN,
            ticket1.ticketStatus,
            Instant.now(),
            ticket1
        )

        logRepository.save(log1)

        ticket1.ticketStatus = TicketStatus.CLOSED
        ticketRepository.save(ticket1)

        val log2 = Log(
            TicketStatus.IN_PROGRESS,
            ticket1.ticketStatus,
            Instant.now(),
            ticket1
        )

        logRepository.save(log2)

        val loginDTO = LoginDTO("manager1@products.com", "password")
        val jwtToken = authenticationService.login(loginDTO)?.jwtAccessToken

        val headers = HttpHeaders()
        headers.setBearerAuth(jwtToken ?: "")
        val requestEntity = HttpEntity<Any?>(headers)

        val res = restTemplate.exchange("${baseUrl}/ticket/${ticket1.id}", HttpMethod.GET, requestEntity, typeReference<List<LogDTO>>())

        println(res.statusCode)

        val expectedList = listOf(
            LogDTO(
                log1.id,
                log1.previousTicketStatus,
                log1.newTicketStatus,
                res.body?.first()!!.time,       // the db truncates the time, this avoids errors from this issue
                TicketDTO(
                    ticket1.id,
                    ticket1.title,
                    ticket1.description,
                    PurchaseDTO(
                        ticket1.purchase.id,
                        ticket1.purchase.customer.toDTO(),
                        ticket1.purchase.product.toDTO(),
                        listOf(ticket1.id)
                    ),
                    null,
                    ticket1.ticketStatus,
                    ticket1.priorityLevel
                )
            ),
            LogDTO(
                log2.id,
                log2.previousTicketStatus,
                log2.newTicketStatus,
                res.body?.last()!!.time,        // the db truncates the time, this avoids errors from this issue
                TicketDTO(
                    ticket1.id,
                    ticket1.title,
                    ticket1.description,
                    PurchaseDTO(
                        ticket1.purchase.id,
                        ticket1.purchase.customer.toDTO(),
                        ticket1.purchase.product.toDTO(),
                        listOf(ticket1.id)
                    ),
                    null,
                    ticket1.ticketStatus,
                    ticket1.priorityLevel
                )
            )
        )

        Assertions.assertEquals(HttpStatus.OK, res.statusCode)
        Assertions.assertEquals(expectedList, res.body)
    }

    @Test
    fun getAllLogsByExpertId() {
        ticket1.expert = expert1

        ticket1.ticketStatus = TicketStatus.IN_PROGRESS
        ticketRepository.save(ticket1)

        val log1 = Log(
            TicketStatus.OPEN,
            ticket1.ticketStatus,
            Instant.now(),
            ticket1
        )

        logRepository.save(log1)

        ticket1.ticketStatus = TicketStatus.CLOSED
        ticketRepository.save(ticket1)

        val loginDTO = LoginDTO("manager1@products.com", "password")
        val jwtToken = authenticationService.login(loginDTO)?.jwtAccessToken

        val headers = HttpHeaders()
        headers.setBearerAuth(jwtToken ?: "")
        val requestEntity = HttpEntity<Any?>(headers)

        val res = restTemplate.exchange("${baseUrl}/expert/${ticket1.expert!!.id}", HttpMethod.GET, requestEntity, typeReference<List<LogDTO>>())

        val expectedList = listOf(
            LogDTO(
                log1.id,
                log1.previousTicketStatus,
                log1.newTicketStatus,
                res.body?.first()!!.time,
                TicketDTO(
                    ticket1.id,
                    ticket1.title,
                    ticket1.description,
                    PurchaseDTO(
                        ticket1.purchase.id,
                        ticket1.purchase.customer.toDTO(),
                        ticket1.purchase.product.toDTO(),
                        listOf(ticket1.id)
                    ),
                    ExpertDTO(
                        ticket1.expert!!.id,
                        ticket1.expert!!.firstName,
                        ticket1.expert!!.lastName,
                        ticket1.expert?.specializations?.map { it.toDTO() } ?: listOf(),
                        listOf(ticket1.id)
                    ),
                    ticket1.ticketStatus,
                    ticket1.priorityLevel
                )
            )
        )

        Assertions.assertEquals(HttpStatus.OK, res.statusCode)
        Assertions.assertEquals(expectedList, res.body)
    }
}