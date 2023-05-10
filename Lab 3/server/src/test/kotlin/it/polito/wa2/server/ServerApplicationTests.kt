package it.polito.wa2.server

import it.polito.wa2.server.products.Product
import it.polito.wa2.server.profiles.Profile
import it.polito.wa2.server.profiles.ProfileDTO
import it.polito.wa2.server.profiles.ProfileRepository
import it.polito.wa2.server.profiles.toDTO
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.boot.test.web.client.postForEntity
import org.springframework.boot.test.web.server.LocalServerPort
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers

@Testcontainers
@SpringBootTest(webEnvironment=SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase(replace=AutoConfigureTestDatabase.Replace.NONE)
class DbT1ApplicationTests {
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
	}

	@LocalServerPort
	protected var port: Int = 0
	@Autowired
	lateinit var restTemplate: TestRestTemplate
	@Autowired
	lateinit var userRepository: ProfileRepository

	@Test
	fun someTest() {
		//Write here your integration test
		val p = Profile("a@me.com", "A", "B", "+39")
		//userRepository.save(p)

		val pr = Product("1", "A", "C")
		val res = restTemplate.postForEntity<ProfileDTO>("/API/profiles", p, ProfileDTO::class)
		println(res.statusCode)
		print(userRepository.findAll().first().toDTO().toString())
	}
}