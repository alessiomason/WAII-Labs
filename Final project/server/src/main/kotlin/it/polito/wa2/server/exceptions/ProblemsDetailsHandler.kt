package it.polito.wa2.server.exceptions

import jakarta.validation.ConstraintViolationException
import org.springframework.http.HttpStatus
import org.springframework.http.ProblemDetail
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler

@RestControllerAdvice
class ProblemDetailsHandler: ResponseEntityExceptionHandler() {
    @ExceptionHandler(RoleNotFoundException::class)
    fun handleRoleNotFound(e: RoleNotFoundException) = ProblemDetail
        .forStatusAndDetail(HttpStatus.NOT_FOUND, e.message!!)

    @ExceptionHandler(ProductNotFoundException::class)
    fun handleProductNotFound(e: ProductNotFoundException) = ProblemDetail
        .forStatusAndDetail(HttpStatus.NOT_FOUND, e.message!!)

    @ExceptionHandler(ProfileNotFoundException::class)
    fun handleProfileNotFound(e: ProfileNotFoundException) = ProblemDetail
        .forStatusAndDetail(HttpStatus.NOT_FOUND, e.message!!)

    @ExceptionHandler(ExpertNotFoundException::class)
    fun handleExpertNotFound(e: ExpertNotFoundException) = ProblemDetail
        .forStatusAndDetail(HttpStatus.NOT_FOUND, e.message!!)

    @ExceptionHandler(ExpertNotAuthorizedException::class)
    fun handleExpertNotAuthorized(e: ExpertNotAuthorizedException) = ProblemDetail
        .forStatusAndDetail(HttpStatus.UNAUTHORIZED, e.message!!)

    @ExceptionHandler(ExpertSpecializationNotFoundException::class)
    fun handleExpertSpecializationNotFound(e: ExpertSpecializationNotFoundException) = ProblemDetail
        .forStatusAndDetail(HttpStatus.NOT_FOUND, e.message!!)

    @ExceptionHandler(ManagerNotFoundException::class)
    fun handleManagerNotFound(e: ManagerNotFoundException) = ProblemDetail
        .forStatusAndDetail(HttpStatus.NOT_FOUND, e.message!!)

    @ExceptionHandler(PurchaseGeneralException::class)
    fun handlePurchaseNotFound(e: PurchaseGeneralException) = ProblemDetail
        .forStatusAndDetail(HttpStatus.BAD_REQUEST, e.message!!)

    @ExceptionHandler(PurchaseNotFoundException::class)
    fun handlePurchaseNotFound(e: PurchaseNotFoundException) = ProblemDetail
        .forStatusAndDetail(HttpStatus.NOT_FOUND, e.message!!)

    @ExceptionHandler(TicketNotFoundException::class)
    fun handleTicketNotFound(e: TicketNotFoundException) = ProblemDetail
        .forStatusAndDetail(HttpStatus.NOT_FOUND, e.message!!)

    @ExceptionHandler(ChatNotFoundException::class)
    fun handleChatNotFound(e: ChatNotFoundException) = ProblemDetail
        .forStatusAndDetail(HttpStatus.NOT_FOUND, e.message!!)

    @ExceptionHandler(ChatClosedException::class)
    fun handleChatClosed(e: ChatClosedException) = ProblemDetail
        .forStatusAndDetail(HttpStatus.FORBIDDEN, e.message!!)

    @ExceptionHandler(TicketStatusException::class)
    fun handleTicketStatus(e: TicketStatusException) = ProblemDetail
        .forStatusAndDetail(HttpStatus.UNPROCESSABLE_ENTITY, e.message!!)

    @ExceptionHandler(DuplicateProductException::class)
    fun handleDuplicateProduct(e: DuplicateProductException) = ProblemDetail
        .forStatusAndDetail(HttpStatus.CONFLICT, e.message!!)

    @ExceptionHandler(DuplicateProfileException::class)
    fun handleDuplicateProfile(e: DuplicateProfileException) = ProblemDetail
        .forStatusAndDetail(HttpStatus.CONFLICT, e.message!!)

    @ExceptionHandler(ConstraintViolationException::class)
    fun handleInvalidConstraint(e: ConstraintViolationException) = ProblemDetail
        .forStatusAndDetail(HttpStatus.UNPROCESSABLE_ENTITY, e.message!!)

    @ExceptionHandler(GenericException::class)
    fun handleGenericException(e: GenericException) = ProblemDetail
        .forStatusAndDetail(HttpStatus.BAD_REQUEST, e.message!!)
}