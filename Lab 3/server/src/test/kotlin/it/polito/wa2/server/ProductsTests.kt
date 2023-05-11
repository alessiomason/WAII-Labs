package it.polito.wa2.server

import it.polito.wa2.server.products.Product
import it.polito.wa2.server.products.ProductDTO
import it.polito.wa2.server.products.ProductRepository
import it.polito.wa2.server.products.toDTO
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.boot.test.web.server.LocalServerPort
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatusCode
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

		@JvmStatic
		@DynamicPropertySource
		fun properties(registry: DynamicPropertyRegistry) {
			registry.add("spring.datasource.url", postgres::getJdbcUrl)
			registry.add("spring.datasource.username", postgres::getUsername)
			registry.add("spring.datasource.password", postgres::getPassword)
			registry.add("spring.jpa.hibernate.ddl-auto") {"create-drop"}
		}

		inline fun <reified T> typeReference() = object: ParameterizedTypeReference<T>() {}
		private val testProduct1 = Product("8712725728528", "Walter Trout Unspoiled by Progress CD B23b", "Mascot")
		private val testProduct2 = Product("5011781900125", "Nitty Gritty Dirt Band Will The Circle Be Unbroken Volume 2 CD USA MCA 1989 20", "MCA")
		private val testProduct3 = Product("3532041192835", "Glow Worm Flexicom Upward Piping Frame A2041500", "Glow-Worm")
		private val testProduct4 = Product("5010559400423", "Draper 40042 Expert No2 X 38mm PZ Type Screwdriver Display Packed", "Draper")

	}

	@LocalServerPort
	protected var port: Int = 0
	@Autowired
	lateinit var restTemplate: TestRestTemplate
	@Autowired
	lateinit var productRepository: ProductRepository

	@BeforeEach
	fun populateDb() {
		productRepository.save(testProduct1)
		productRepository.save(testProduct2)
		productRepository.save(testProduct3)
	}

	/*
	@Test
	fun someTest() {
		//Write here your integration test
		val p = Profile("a@me.com", "A", "B", "+39")
		//userRepository.save(p)

		val pr = Product("1", "A", "C")
		val res = restTemplate.postForEntity<ProfileDTO>("/API/profiles", p, ProfileDTO::class)
		println(res.statusCode)
		print(userRepository.findAll().first().toDTO().toString())
	}*/

	@Test
	fun getAllProducts() {
		//val res = restTemplate.getForEntity<List<ProductDTO>>("/API/products")
		val res = restTemplate.exchange("/API/products", HttpMethod.GET, null, typeReference<List<ProductDTO>>())

		Assertions.assertEquals(HttpStatusCode.valueOf(200), res.statusCode)
		Assertions.assertEquals(listOf(testProduct1.toDTO(), testProduct2.toDTO(), testProduct3.toDTO()), res.body)
	}

	@Test
	fun getProduct() {
		val res = restTemplate.exchange("/API/products/${testProduct1.ean}", HttpMethod.GET, null, typeReference<ProductDTO>())

		Assertions.assertEquals(HttpStatusCode.valueOf(200), res.statusCode)
		Assertions.assertEquals(testProduct1.toDTO(), res.body)
	}

	@Test
	fun productNotFound() {
		val res = restTemplate.exchange("/API/products/${testProduct4.ean}", HttpMethod.GET, null, typeReference<Unit>())

		Assertions.assertEquals(HttpStatusCode.valueOf(404), res.statusCode)
	}
}