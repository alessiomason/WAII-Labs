package it.polito.wa2.server

import it.polito.wa2.server.products.Product
import it.polito.wa2.server.products.ProductDTO
import it.polito.wa2.server.products.ProductRepository
import it.polito.wa2.server.products.toDTO
import it.polito.wa2.server.profiles.ProfileRepository
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
class ProductsTests {
	companion object {
		@Container
		val postgres = PostgreSQLContainer("postgres:latest")

		inline fun <reified T> typeReference() = object: ParameterizedTypeReference<T>() {}
		private const val BASE_URL = "/API/products"

		@JvmStatic
		@DynamicPropertySource
		fun properties(registry: DynamicPropertyRegistry) {
			registry.add("spring.datasource.url", postgres::getJdbcUrl)
			registry.add("spring.datasource.username", postgres::getUsername)
			registry.add("spring.datasource.password", postgres::getPassword)
			registry.add("spring.jpa.hibernate.ddl-auto") {"create-drop"}
		}

		private val product1 = Product("8712725728528", "Walter Trout Unspoiled by Progress CD B23b", "Mascot")
		private val product2 = Product("5011781900125", "Nitty Gritty Dirt Band Will The Circle Be Unbroken Volume 2 CD USA MCA 1989 20", "MCA")
		private val product3 = Product("3532041192835", "Glow Worm Flexicom Upward Piping Frame A2041500", "Glow-Worm")
		private val product4 = Product("5010559400423", "Draper 40042 Expert No2 X 38mm PZ Type Screwdriver Display Packed", "Draper")

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

		productRepository.save(product1)
		productRepository.save(product2)
		productRepository.save(product3)
	}

	@Test
	fun getAllProducts() {
		val loginDTO = LoginDTO("customer1@products.com", "password")
		val jwtToken = authenticationService.login(loginDTO)?.accessToken

		val headers = HttpHeaders()
		headers.setBearerAuth(jwtToken ?: "")
		val requestEntity = HttpEntity<Nothing?>(headers)

		val res = restTemplate.exchange(BASE_URL, HttpMethod.GET, requestEntity, typeReference<List<ProductDTO>>())

		Assertions.assertEquals(HttpStatus.OK, res.statusCode)
		Assertions.assertEquals(listOf(product1.toDTO(), product2.toDTO(), product3.toDTO()), res.body)
	}

	@Test
	fun getProduct() {
		val loginDTO = LoginDTO("manager1@products.com", "password")
		val jwtToken = authenticationService.login(loginDTO)?.accessToken

		val headers = HttpHeaders()
		headers.setBearerAuth(jwtToken ?: "")
		val requestEntity = HttpEntity<Nothing?>(headers)

		val res = restTemplate.exchange("$BASE_URL/${product1.ean}", HttpMethod.GET, requestEntity, typeReference<ProductDTO>())

		Assertions.assertEquals(HttpStatus.OK, res.statusCode)
		Assertions.assertEquals(product1.toDTO(), res.body)
	}

	@Test
	fun productNotFound() {
		val loginDTO = LoginDTO("manager1@products.com", "password")
		val jwtToken = authenticationService.login(loginDTO)?.accessToken

		val headers = HttpHeaders()
		headers.setBearerAuth(jwtToken ?: "")
		val requestEntity = HttpEntity<Nothing?>(headers)

		val res = restTemplate.exchange("$BASE_URL/${product4.ean}", HttpMethod.GET, requestEntity, typeReference<Unit>())

		Assertions.assertEquals(HttpStatus.NOT_FOUND, res.statusCode)
	}
}