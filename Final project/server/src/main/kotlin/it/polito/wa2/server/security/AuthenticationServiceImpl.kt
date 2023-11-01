package it.polito.wa2.server.security

import it.polito.wa2.server.exceptions.DuplicateProfileException
import it.polito.wa2.server.exceptions.GenericException
import it.polito.wa2.server.customers.Profile
import it.polito.wa2.server.customers.ProfileRepository
import it.polito.wa2.server.employees.Expert
import it.polito.wa2.server.employees.ExpertRepository
import it.polito.wa2.server.exceptions.ExpertNotAuthorizedException
import org.keycloak.admin.client.KeycloakBuilder
import org.keycloak.representations.AccessTokenResponse
import org.keycloak.representations.idm.CredentialRepresentation
import org.keycloak.representations.idm.UserRepresentation
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.util.LinkedMultiValueMap
import org.springframework.util.MultiValueMap
import org.springframework.web.client.RestTemplate
import javax.ws.rs.NotAuthorizedException

@Service
class AuthenticationServiceImpl(
    private val profileRepository: ProfileRepository,
    private val expertRepository: ExpertRepository
): AuthenticationService {
    @Value("\${keycloak.address}")
    private lateinit var keycloakAddress: String

    override fun login(loginDTO: LoginDTO): JwtDTO? {
        // checks is user is an expert and not authorized
        // if they're not an expert, or if they are an authorized expert, Keycloak will authenticate them
        val expert = expertRepository.findByEmail(loginDTO.email)
        if (expert?.authorized == false) {
            throw ExpertNotAuthorizedException()
        }

        val keycloak = KeycloakBuilder.builder()
            .serverUrl("http://$keycloakAddress")
            .realm("wa2-products")
            .clientId("wa2-products-client")
            .username(loginDTO.email)
            .password(loginDTO.password)
            .build()

        return try {
            val tokenSet = keycloak.tokenManager().grantToken()
            return JwtDTO(tokenSet.token, tokenSet.refreshToken)
        } catch (e: NotAuthorizedException) {
            null
        }
    }

    override fun refreshLogin(refreshJwtDTO: RefreshJwtDTO): JwtDTO? {
        val restTemplate = RestTemplate()

        val url = "http://$keycloakAddress/realms/wa2-products/protocol/openid-connect/token"

        val headers = HttpHeaders()
        headers.contentType = MediaType.APPLICATION_FORM_URLENCODED

        val requestBody: MultiValueMap<String, String> = LinkedMultiValueMap()
        requestBody.add("grant_type", "refresh_token")
        requestBody.add("client_id", "wa2-products-client")
        requestBody.add("refresh_token", refreshJwtDTO.refreshToken)

        try {
            val requestEntity = HttpEntity(requestBody, headers)
            val responseEntity = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                AccessTokenResponse::class.java
            )
            return JwtDTO(responseEntity.body!!.token, responseEntity.body!!.refreshToken)
        } catch (e: Exception) {
            throw GenericException()
        }
    }

    override fun signup(signupDTO: SignupDTO, isExpert: Boolean): String {
        val keycloak = KeycloakBuilder.builder()
            .serverUrl("http://$keycloakAddress")
            .realm("wa2-products")
            .clientId("wa2-products-client")
            .username("admin")
            .password("admin")
            .build()

        // check user existence
        if (userAlreadyExists(signupDTO, isExpert)) {
            throw DuplicateProfileException()
        }

        val newUser = UserRepresentation()
        newUser.username = signupDTO.email
        newUser.firstName = signupDTO.firstName
        newUser.lastName = signupDTO.lastName
        newUser.email = signupDTO.email
        newUser.isEmailVerified = true
        newUser.isEnabled = true

        val credential = CredentialRepresentation()
        credential.type = CredentialRepresentation.PASSWORD
        credential.value = signupDTO.password
        credential.isTemporary = false

        newUser.credentials = listOf(credential)

        keycloak
            .realm("wa2-products")
            .users()
            .create(newUser)

        val userId = keycloak
            .realm("wa2-products")
            .users()
            .search(newUser.username)
            .first()
            .id

        val user = keycloak
            .realm("wa2-products")
            .users()
            .get(userId)

        val roleRepresentation = keycloak
            .realm("wa2-products")
            .roles()
            .get(if (isExpert) "app_expert" else "app_customer")
            .toRepresentation()

        user.roles().realmLevel().add(listOf(roleRepresentation))

        user.update(user.toRepresentation())

        // create user in db
        createUserInDb(userId, signupDTO, isExpert)

        return userId
    }

    override fun editName(userId: String, firstName: String, lastName: String) {
        val keycloak = KeycloakBuilder.builder()
            .serverUrl("http://$keycloakAddress")
            .realm("wa2-products")
            .clientId("wa2-products-client")
            .username("admin")
            .password("admin")
            .build()

        val user = keycloak
            .realm("wa2-products")
            .users()
            .get(userId)

        val modifiedUser = user.toRepresentation()
        modifiedUser.firstName = firstName
        modifiedUser.lastName = lastName

        user.update(modifiedUser)
    }

    private fun userAlreadyExists(signupDTO: SignupDTO, isExpert: Boolean): Boolean {
        return if (isExpert) {
            expertRepository.findByEmail(signupDTO.email) != null
        } else {
            profileRepository.findByEmail(signupDTO.email) != null
        }
    }

    private fun createUserInDb(id: String, signupDTO: SignupDTO, isExpert: Boolean) {
        if (isExpert) {
            val newExpert = Expert(id, signupDTO.email, signupDTO.firstName, signupDTO.lastName)
            expertRepository.save(newExpert)
        } else {
            val newCustomer = Profile(id, signupDTO.email, signupDTO.firstName, signupDTO.lastName, signupDTO.phone)
            profileRepository.save(newCustomer)
        }
    }
}