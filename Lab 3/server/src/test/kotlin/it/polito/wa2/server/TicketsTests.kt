package it.polito.wa2.server

import it.polito.wa2.server.products.Product
import it.polito.wa2.server.products.ProductRepository
import it.polito.wa2.server.products.toDTO
import it.polito.wa2.server.profiles.Profile
import it.polito.wa2.server.profiles.ProfileRepository
import it.polito.wa2.server.profiles.toDTO
import it.polito.wa2.server.ticketing.employees.Expert
import it.polito.wa2.server.ticketing.employees.ExpertDTO
import it.polito.wa2.server.ticketing.employees.ExpertRepository
import it.polito.wa2.server.ticketing.employees.toDTO
import it.polito.wa2.server.ticketing.purchases.*
import it.polito.wa2.server.ticketing.tickets.*
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.HttpEntity
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
class TicketsTests {
    companion object {
        @Container
        val postgres = PostgreSQLContainer("postgres:latest")

        inline fun <reified T> typeReference() = object: ParameterizedTypeReference<T>() {}
        private const val baseUrl = "/API/tickets"

        @JvmStatic
        @DynamicPropertySource
        fun properties(registry: DynamicPropertyRegistry) {
            registry.add("spring.datasource.url", postgres::getJdbcUrl)
            registry.add("spring.datasource.username", postgres::getUsername)
            registry.add("spring.datasource.password", postgres::getPassword)
            registry.add("spring.jpa.hibernate.ddl-auto") {"create-drop"}
        }

        private val customer1 = Profile("flongwood0@vk.com", "Franky", "Longwood", "+33 616 805 6213")
        private val customer2 = Profile("grengger1@cloudflare.com", "Grant", "Rengger", "+62 982 796 8613")
        private val product1 = Product("8712725728528", "Walter Trout Unspoiled by Progress CD B23b", "Mascot")
        private val product2 = Product("5011781900125", "Nitty Gritty Dirt Band Will The Circle Be Unbroken Volume 2 CD USA MCA 1989 20", "MCA")

        private lateinit var expert1: Expert
        private lateinit var expert2: Expert
        private val notSavedExpert = Expert("Jim", "Smith")

        private lateinit var purchase1: Purchase
        private lateinit var purchase2: Purchase
        private lateinit var purchase3: Purchase
        private lateinit var purchase4: Purchase
        private val notSavedPurchase = Purchase(customer1, product1)

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
    lateinit var purchaseRepository: PurchaseRepository
    @Autowired
    lateinit var ticketRepository: TicketRepository

    @BeforeEach
    fun populateDb() {
        // recreate the objects before each test to reinitialize the ids
        profileRepository.save(customer1)
        profileRepository.save(customer2)
        productRepository.save(product1)
        productRepository.save(product2)

        expert1 = Expert("John", "Smith")
        expert2 = Expert("Jack", "Smith")
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

    @AfterEach
    fun emptyDb() {
        ticketRepository.deleteAll()
        purchaseRepository.deleteAll()
        expertRepository.deleteAll()
        profileRepository.deleteAll()
        productRepository.deleteAll()
    }

    @Test
    fun getAllTickets() {
        val res = restTemplate.exchange(baseUrl, HttpMethod.GET, null, typeReference<List<TicketDTO>>())

        val expectedList = listOf(
            TicketDTO(
                ticket1.id,
                ticket1.title,
                ticket1.description,
                PurchaseDTO(ticket1.purchase.id, ticket1.purchase.customer.toDTO(), ticket1.purchase.product.toDTO(), listOf(ticket1.id)),
                null,
                TicketStatus.OPEN,
                PriorityLevel.NORMAL),
            TicketDTO(
                ticket2.id,
                ticket2.title,
                ticket2.description,
                PurchaseDTO(ticket2.purchase.id, ticket2.purchase.customer.toDTO(), ticket2.purchase.product.toDTO(), listOf(ticket2.id)),
                null,
                TicketStatus.OPEN,
                PriorityLevel.NORMAL),
            TicketDTO(
                ticket3.id,
                ticket3.title,
                ticket3.description,
                PurchaseDTO(ticket3.purchase.id, ticket3.purchase.customer.toDTO(), ticket3.purchase.product.toDTO(), listOf(ticket3.id)),
                null,
                TicketStatus.OPEN,
                PriorityLevel.NORMAL)
        )

        Assertions.assertEquals(HttpStatus.OK, res.statusCode)
        Assertions.assertEquals(expectedList, res.body)
    }

    @Test
    fun getTicket() {
        val res = restTemplate.exchange("$baseUrl/${ticket1.id}", HttpMethod.GET, null, typeReference<TicketDTO>())

        val expectedResBody = TicketDTO(
            ticket1.id,
            ticket1.title,
            ticket1.description,
            PurchaseDTO(ticket1.purchase.id, ticket1.purchase.customer.toDTO(), ticket1.purchase.product.toDTO(), listOf(ticket1.id)),
            null,
            TicketStatus.OPEN,
            PriorityLevel.NORMAL
        )

        Assertions.assertEquals(HttpStatus.OK, res.statusCode)
        Assertions.assertEquals(expectedResBody, res.body)
    }

    @Test
    fun ticketNotFound() {
        val res = restTemplate.exchange("$baseUrl/0", HttpMethod.GET, null, typeReference<Unit>())

        Assertions.assertEquals(HttpStatus.NOT_FOUND, res.statusCode)
    }

    @Test
    fun createTicket() {
        val requestEntity = HttpEntity(ticket4.toNewDTO())
        val res = restTemplate.exchange(baseUrl, HttpMethod.POST, requestEntity, typeReference<TicketDTO>())

        val createdTicket = TicketDTO(
            res.body!!.id,
            ticket4.title,
            ticket4.description,
            PurchaseDTO(ticket4.purchase.id, ticket4.purchase.customer.toDTO(), ticket4.purchase.product.toDTO(), listOf(res.body!!.id)),
            null,
            TicketStatus.OPEN,
            PriorityLevel.NORMAL
        )

        Assertions.assertEquals(HttpStatus.OK, res.statusCode)
        Assertions.assertEquals(createdTicket, res.body)

        val res2 = restTemplate.exchange("$baseUrl/${createdTicket.id}", HttpMethod.GET, null, typeReference<TicketDTO>())
        Assertions.assertEquals(HttpStatus.OK, res.statusCode)
        Assertions.assertEquals(createdTicket, res2.body)
    }

    // Can a ticket be opened multiple times?

    @Test
    fun createTicketPurchaseNotFound() {
        val newTicket = Ticket("New ticket title", "New ticket description", notSavedPurchase)
        val requestEntity = HttpEntity(newTicket.toNewDTO())
        val res = restTemplate.exchange(baseUrl, HttpMethod.POST, requestEntity, typeReference<Unit>())

        Assertions.assertEquals(HttpStatus.NOT_FOUND, res.statusCode)
    }

    @Test
    fun editTicketDescription() {
        // edit ticket1 with ticket2 fields
        val editedTicket = TicketDTO(
            ticket1.id,
            ticket2.title,
            ticket2.description,
            // test that the purchase is not modifiable
            PurchaseDTO(ticket2.purchase.id, ticket2.purchase.customer.toDTO(), ticket2.purchase.product.toDTO(), listOf(ticket2.id)),
            ticket1.expert?.toDTO(),
            TicketStatus.CLOSED,        // test that ticketStatus
            PriorityLevel.CRITICAL      // and priorityLevel are not modifiable
        )
        val expectedTicket = TicketDTO(
            ticket1.id,
            ticket2.title,
            ticket2.description,
            PurchaseDTO(ticket1.purchase.id, ticket1.purchase.customer.toDTO(), ticket1.purchase.product.toDTO(), listOf(ticket1.id)),
            ticket1.expert?.toDTO(),
            ticket1.ticketStatus,
            ticket1.priorityLevel
        )
        val requestEntity = HttpEntity(editedTicket)
        val res = restTemplate.exchange(baseUrl, HttpMethod.PUT, requestEntity, typeReference<Unit>())

        Assertions.assertEquals(HttpStatus.OK, res.statusCode)

        val res2 = restTemplate.exchange("$baseUrl/${editedTicket.id}", HttpMethod.GET, null, typeReference<TicketDTO>())
        Assertions.assertEquals(HttpStatus.OK, res.statusCode)
        Assertions.assertEquals(expectedTicket, res2.body)
    }

    @Test
    fun editTicketNotFound() {
        val editedTicket = TicketDTO(
            0,
            ticket1.title,
            ticket1.description,
            PurchaseDTO(ticket1.purchase.id, ticket1.purchase.customer.toDTO(), ticket1.purchase.product.toDTO(), listOf(ticket1.id)),
            ticket1.expert?.toDTO(),
            ticket1.ticketStatus,
            ticket1.priorityLevel
        )
        val requestEntity = HttpEntity(editedTicket)
        val res = restTemplate.exchange(baseUrl, HttpMethod.PUT, requestEntity, typeReference<Unit>())

        Assertions.assertEquals(HttpStatus.NOT_FOUND, res.statusCode)
    }

    @Test
    fun editTicketProperties() {
        // edit ticket1 with ticket2 fields
        val editedTicket = TicketDTO(
            ticket1.id,
            ticket2.title,              // test that title
            ticket2.description,        // and description are not modifiable
            // test that the purchase is not modifiable
            PurchaseDTO(ticket2.purchase.id, ticket2.purchase.customer.toDTO(), ticket2.purchase.product.toDTO(), listOf(ticket2.id)),
            ticket1.expert?.toDTO(),
            TicketStatus.CLOSED,
            PriorityLevel.CRITICAL
        )
        val expectedTicket = TicketDTO(
            ticket1.id,
            ticket1.title,
            ticket1.description,
            PurchaseDTO(ticket1.purchase.id, ticket1.purchase.customer.toDTO(), ticket1.purchase.product.toDTO(), listOf(ticket1.id)),
            ticket1.expert?.toDTO(),
            TicketStatus.CLOSED,
            PriorityLevel.CRITICAL
        )
        val requestEntity = HttpEntity(editedTicket)
        val res = restTemplate.exchange("$baseUrl/properties", HttpMethod.PUT, requestEntity, typeReference<Unit>())

        Assertions.assertEquals(HttpStatus.OK, res.statusCode)

        val res2 = restTemplate.exchange("$baseUrl/${editedTicket.id}", HttpMethod.GET, null, typeReference<TicketDTO>())
        Assertions.assertEquals(HttpStatus.OK, res.statusCode)
        Assertions.assertEquals(expectedTicket, res2.body)
    }

    @Test
    fun editTicketPropertiesTicketStatusTransitionNotAllowed() {
        val editedTicket = TicketDTO(
            ticket1.id,
            ticket1.title,
            ticket1.description,
            PurchaseDTO(ticket1.purchase.id, ticket1.purchase.customer.toDTO(), ticket1.purchase.product.toDTO(), listOf(ticket1.id)),
            ticket1.expert?.toDTO(),
            TicketStatus.REOPENED,      // cannot go from OPEN to REOPENED
            ticket1.priorityLevel
        )
        val requestEntity = HttpEntity(editedTicket)
        val res = restTemplate.exchange("$baseUrl/properties", HttpMethod.PUT, requestEntity, typeReference<Unit>())

        Assertions.assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, res.statusCode)
    }

    @Test
    fun editTicketPropertiesNotFound() {
        val editedTicket = TicketDTO(
            0,
            ticket1.title,
            ticket1.description,
            PurchaseDTO(ticket1.purchase.id, ticket1.purchase.customer.toDTO(), ticket1.purchase.product.toDTO(), listOf(ticket1.id)),
            ticket1.expert?.toDTO(),
            ticket1.ticketStatus,
            ticket1.priorityLevel
        )
        val requestEntity = HttpEntity(editedTicket)
        val res = restTemplate.exchange("$baseUrl/properties", HttpMethod.PUT, requestEntity, typeReference<Unit>())

        Assertions.assertEquals(HttpStatus.NOT_FOUND, res.statusCode)
    }

    @Test
    fun assignExpert() {
        // edit ticket1 with ticket2 fields
        val editedTicket = TicketDTO(
            ticket1.id,
            ticket2.title,              // test that title
            ticket2.description,        // and description are not modifiable
            // test that the purchase is not modifiable
            PurchaseDTO(ticket2.purchase.id, ticket2.purchase.customer.toDTO(), ticket2.purchase.product.toDTO(), listOf(ticket2.id)),
            expert1.toDTO(),
            TicketStatus.CLOSED,        // test that ticketStatus is not modifiable
            PriorityLevel.CRITICAL
        )
        val expectedTicket = TicketDTO(
            ticket1.id,
            ticket1.title,
            ticket1.description,
            PurchaseDTO(ticket1.purchase.id, ticket1.purchase.customer.toDTO(), ticket1.purchase.product.toDTO(), listOf(ticket1.id)),
            ExpertDTO(expert1.id, expert1.firstName, expert1.lastName, listOf(ticket1.id)),
            TicketStatus.IN_PROGRESS,   // test that the ticketStatus is always set to IN_PROGRESS
            PriorityLevel.CRITICAL
        )
        val requestEntity = HttpEntity(editedTicket)
        val res = restTemplate.exchange("$baseUrl/expert", HttpMethod.POST, requestEntity, typeReference<Unit>())

        Assertions.assertEquals(HttpStatus.OK, res.statusCode)

        val res2 = restTemplate.exchange("$baseUrl/${editedTicket.id}", HttpMethod.GET, null, typeReference<TicketDTO>())
        Assertions.assertEquals(HttpStatus.OK, res.statusCode)
        Assertions.assertEquals(expectedTicket, res2.body)
    }

    @Test
    fun removeExpert() {
        // edit ticket1 with ticket2 fields
        val editedTicket = TicketDTO(
            ticket1.id,
            ticket2.title,              // test that title
            ticket2.description,        // and description are not modifiable
            // test that the purchase is not modifiable
            PurchaseDTO(ticket2.purchase.id, ticket2.purchase.customer.toDTO(), ticket2.purchase.product.toDTO(), listOf(ticket2.id)),
            null,
            TicketStatus.CLOSED,        // test that ticketStatus is not modifiable
            PriorityLevel.CRITICAL
        )
        val expectedTicket = TicketDTO(
            ticket1.id,
            ticket1.title,
            ticket1.description,
            PurchaseDTO(ticket1.purchase.id, ticket1.purchase.customer.toDTO(), ticket1.purchase.product.toDTO(), listOf(ticket1.id)),
            null,
            TicketStatus.IN_PROGRESS,   // test that the ticketStatus is always set to IN_PROGRESS
            PriorityLevel.CRITICAL
        )
        val requestEntity = HttpEntity(editedTicket)
        val res = restTemplate.exchange("$baseUrl/expert", HttpMethod.POST, requestEntity, typeReference<Unit>())

        Assertions.assertEquals(HttpStatus.OK, res.statusCode)

        val res2 = restTemplate.exchange("$baseUrl/${editedTicket.id}", HttpMethod.GET, null, typeReference<TicketDTO>())
        Assertions.assertEquals(HttpStatus.OK, res.statusCode)
        Assertions.assertEquals(expectedTicket, res2.body)
    }

    @Test
    fun assignExpertTicketNotFound() {
        val editedTicket = TicketDTO(
            0,
            ticket1.title,
            ticket1.description,
            PurchaseDTO(ticket1.purchase.id, ticket1.purchase.customer.toDTO(), ticket1.purchase.product.toDTO(), listOf(ticket1.id)),
            expert1.toDTO(),
            ticket1.ticketStatus,
            ticket1.priorityLevel
        )
        val requestEntity = HttpEntity(editedTicket)
        val res = restTemplate.exchange("$baseUrl/expert", HttpMethod.POST, requestEntity, typeReference<Unit>())

        Assertions.assertEquals(HttpStatus.NOT_FOUND, res.statusCode)
    }

    @Test
    fun assignExpertNotFound() {
        val editedTicket = TicketDTO(
            ticket1.id,
            ticket1.title,
            ticket1.description,
            PurchaseDTO(ticket1.purchase.id, ticket1.purchase.customer.toDTO(), ticket1.purchase.product.toDTO(), listOf(ticket1.id)),
            notSavedExpert.toDTO(),
            ticket1.ticketStatus,
            ticket1.priorityLevel
        )
        val requestEntity = HttpEntity(editedTicket)
        val res = restTemplate.exchange("$baseUrl/expert", HttpMethod.POST, requestEntity, typeReference<Unit>())

        Assertions.assertEquals(HttpStatus.NOT_FOUND, res.statusCode)
    }

    @Test
    fun assignExpertTicketNotOpen() {
        ticket1.ticketStatus = TicketStatus.CLOSED
        ticketRepository.save(ticket1)

        val editedTicket = TicketDTO(
            ticket1.id,
            ticket1.title,
            ticket1.description,
            PurchaseDTO(ticket1.purchase.id, ticket1.purchase.customer.toDTO(), ticket1.purchase.product.toDTO(), listOf(ticket1.id)),
            expert1.toDTO(),
            ticket1.ticketStatus,
            ticket1.priorityLevel
        )
        val requestEntity = HttpEntity(editedTicket)
        val res = restTemplate.exchange("$baseUrl/expert", HttpMethod.POST, requestEntity, typeReference<Unit>())

        Assertions.assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, res.statusCode)
    }
}