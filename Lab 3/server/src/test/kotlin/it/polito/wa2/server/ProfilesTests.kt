package it.polito.wa2.server

import it.polito.wa2.server.profiles.Profile
import it.polito.wa2.server.profiles.ProfileDTO
import it.polito.wa2.server.profiles.ProfileRepository
import it.polito.wa2.server.profiles.toDTO
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.boot.test.web.server.LocalServerPort
import org.springframework.core.ParameterizedTypeReference
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpEntity
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
class ProfilesTests {
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
        val testProfile1 = Profile("flongwood0@vk.com", "Franky", "Longwood", "+33 616 805 6213")
        val testProfile2 = Profile("grengger1@cloudflare.com", "Grant", "Rengger", "+62 982 796 8613")
    }

    @LocalServerPort
    protected var port: Int = 0
    @Autowired
    lateinit var restTemplate: TestRestTemplate
    @Autowired
    lateinit var profileRepository: ProfileRepository

    @BeforeEach
    fun populateDb() {
        profileRepository.save(testProfile1)
    }

    @Test
    fun getProfile() {
        val res = restTemplate.exchange("/API/profiles/${testProfile1.email}", HttpMethod.GET, null, typeReference<ProfileDTO>())

        Assertions.assertEquals(HttpStatusCode.valueOf(200), res.statusCode)
        Assertions.assertEquals(testProfile1.toDTO(), res.body)
    }

    @Test
    fun profileNotFound() {
        val res = restTemplate.exchange("/API/profiles/${testProfile2.email}", HttpMethod.GET, null, typeReference<Unit>())

        Assertions.assertEquals(HttpStatusCode.valueOf(404), res.statusCode)
    }

    @Test
    fun createProfile() {
        val requestEntity = HttpEntity(testProfile2.toDTO())
        val res = restTemplate.exchange("/API/profiles", HttpMethod.POST, requestEntity, typeReference<ProfileDTO>())

        Assertions.assertEquals(HttpStatusCode.valueOf(200), res.statusCode)
        Assertions.assertEquals(testProfile2.toDTO(), res.body)

        val profileFromDb = profileRepository.findByIdOrNull(testProfile2.email)
        Assertions.assertEquals(testProfile2.toDTO(), profileFromDb!!.toDTO())
    }

    @Test
    fun creatingAlreadyExistingProfileShouldFail() {
        val requestEntity = HttpEntity(testProfile1.toDTO())
        val res = restTemplate.exchange("/API/profiles", HttpMethod.POST, requestEntity, typeReference<Unit>())

        Assertions.assertEquals(HttpStatusCode.valueOf(409), res.statusCode)
    }

    @Test
    fun editProfile() {
        // edit testProfile1 with testProfile2 fields
        val editedProfile = ProfileDTO(testProfile1.email, testProfile2.firstName, testProfile2.lastName, testProfile2.phone)
        val requestEntity = HttpEntity(editedProfile)
        val res = restTemplate.exchange("/API/profiles", HttpMethod.PUT, requestEntity, typeReference<Unit>())

        Assertions.assertEquals(HttpStatusCode.valueOf(200), res.statusCode)

        val profileFromDb = profileRepository.findByIdOrNull(testProfile1.email)
        Assertions.assertEquals(editedProfile, profileFromDb!!.toDTO())
    }
}