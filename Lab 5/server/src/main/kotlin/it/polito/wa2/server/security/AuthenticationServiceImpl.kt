package it.polito.wa2.server.security

import it.polito.wa2.server.exceptions.DuplicateProfileException
import it.polito.wa2.server.profiles.Profile
import it.polito.wa2.server.profiles.ProfileRepository
import it.polito.wa2.server.ticketing.employees.Expert
import it.polito.wa2.server.ticketing.employees.ExpertRepository
import org.keycloak.admin.client.KeycloakBuilder
import org.keycloak.representations.idm.CredentialRepresentation
import org.keycloak.representations.idm.UserRepresentation
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.*
import org.springframework.stereotype.Service
import java.lang.Exception
import javax.ws.rs.NotAuthorizedException

@Service
class AuthenticationServiceImpl(
    private val profileRepository: ProfileRepository,
    private val expertRepository: ExpertRepository
): AuthenticationService {
    @Value("\${keycloak.address}")
    private lateinit var keycloakAddress: String

    override fun login(loginDTO: LoginDTO): String? {
        val keycloak = KeycloakBuilder.builder()
            .serverUrl("http://$keycloakAddress")
            .realm("wa2-products")
            .clientId("wa2-products-client")
            .username(loginDTO.email)
            .password(loginDTO.password)
            .build()

        return try {
            keycloak.tokenManager().grantToken().token
        } catch (e: NotAuthorizedException) {
            null
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