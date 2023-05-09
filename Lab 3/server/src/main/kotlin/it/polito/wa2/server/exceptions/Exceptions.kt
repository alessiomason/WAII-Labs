package it.polito.wa2.server.exceptions

class ProductNotFoundException: RuntimeException("Product not found!")

class ProfileNotFoundException: RuntimeException("Profile not found!")

class DuplicateProductException: RuntimeException("The product is already present!")

class DuplicateProfileException: RuntimeException("The profile is already present!")

class IncoherentParametersException: RuntimeException("The fields in the parameters and in the request body do not correspond!")