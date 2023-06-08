package it.polito.wa2.server.observability.configuration

import it.polito.wa2.server.observability.aop.AbstractLogAspect
import it.polito.wa2.server.observability.aop.DefaultLogAspect
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration(proxyBeanMethods = false)
class LogAspectConfig {
    @Bean
    @ConditionalOnMissingBean
    fun defaultLogAspect(): AbstractLogAspect {
        return DefaultLogAspect()
    }
}