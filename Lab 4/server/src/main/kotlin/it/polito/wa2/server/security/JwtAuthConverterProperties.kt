package it.polito.wa2.server.security

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration
import org.springframework.validation.annotation.Validated

@Validated
@Configuration
class JwtAuthConverterProperties {
    val resourceId = "wa2-products-client"
    val principalAttribute = "preferred_username"
}