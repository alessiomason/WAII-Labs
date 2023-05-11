package it.polito.wa2.server

import it.polito.wa2.server.profiles.Profile
import it.polito.wa2.server.profiles.ProfileDTO
import it.polito.wa2.server.profiles.ProfileRepository
import it.polito.wa2.server.profiles.toDTO
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

        private val profile1 = Profile("flongwood0@vk.com", "Franky", "Longwood", "+33 616 805 6213")
        private val profile2 = Profile("grengger1@cloudflare.com", "Grant", "Rengger", "+62 982 796 8613")
    }

    @Autowired
    lateinit var restTemplate: TestRestTemplate
    @Autowired
    lateinit var profileRepository: ProfileRepository

    @BeforeEach
    fun populateDb() {
        profileRepository.save(profile1)
    }

    @AfterEach
    fun emptyDb() {
        profileRepository.deleteAll()
    }

    @Test
    fun getProfile() {
        val res = restTemplate.exchange("$baseUrl/${profile1.email}", HttpMethod.GET, null, typeReference<ProfileDTO>())

        Assertions.assertEquals(HttpStatus.OK, res.statusCode)
        Assertions.assertEquals(profile1.toDTO(), res.body)
    }

    @Test
    fun profileNotFound() {
        val res = restTemplate.exchange("$baseUrl/${profile2.email}", HttpMethod.GET, null, typeReference<Unit>())

        Assertions.assertEquals(HttpStatus.NOT_FOUND, res.statusCode)
    }

    @Test
    fun createProfile() {
        val requestEntity = HttpEntity(profile2.toDTO())
        val res = restTemplate.exchange(baseUrl, HttpMethod.POST, requestEntity, typeReference<ProfileDTO>())

        Assertions.assertEquals(HttpStatus.OK, res.statusCode)
        Assertions.assertEquals(profile2.toDTO(), res.body)

        val res2 = restTemplate.exchange("$baseUrl/${profile2.email}", HttpMethod.GET, null, typeReference<ProfileDTO>())
        Assertions.assertEquals(HttpStatus.OK, res.statusCode)
        Assertions.assertEquals(profile2.toDTO(), res2.body)

        println(profileRepository.findAll().map { it.toDTO() })
    }

    @Test
    fun creatingAlreadyExistingProfileShouldFail() {
        val requestEntity = HttpEntity(profile1.toDTO())
        val res = restTemplate.exchange(baseUrl, HttpMethod.POST, requestEntity, typeReference<Unit>())

        Assertions.assertEquals(HttpStatus.CONFLICT, res.statusCode)
    }

    @Test
    fun editProfile() {
        // edit testProfile1 with testProfile2 fields
        val editedProfile = ProfileDTO(profile1.email, profile2.firstName, profile2.lastName, profile2.phone)
        val requestEntity = HttpEntity(editedProfile)
        val res = restTemplate.exchange(baseUrl, HttpMethod.PUT, requestEntity, typeReference<Unit>())

        Assertions.assertEquals(HttpStatus.OK, res.statusCode)

        val res2 = restTemplate.exchange("$baseUrl/${editedProfile.email}", HttpMethod.GET, null, typeReference<ProfileDTO>())
        Assertions.assertEquals(HttpStatus.OK, res.statusCode)
        Assertions.assertEquals(editedProfile, res2.body)
    }

    @Test
    fun editProfileNotFound() {
        val editedProfile = ProfileDTO("notexisting@email.com", profile2.firstName, profile2.lastName, profile2.phone)
        val requestEntity = HttpEntity(editedProfile)
        val res = restTemplate.exchange(baseUrl, HttpMethod.PUT, requestEntity, typeReference<Unit>())

        Assertions.assertEquals(HttpStatus.NOT_FOUND, res.statusCode)
    }
}