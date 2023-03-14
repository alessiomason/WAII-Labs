object WordCount {
    fun phrase(phrase: String): Map<String, Int> {
        return phrase
            .lowercase() // make it case in-sensitive
            .split(Regex("[^a-z0-9']")) // count only letters a-z and numbers
            .filter { it.isNotBlank() } // see if it is a valid character
            .map { it.trim('\'') } // skip '
            .groupBy { it } // key of the map = word
            .mapValues { it.value.size } // value of the map = occurrences of each word
    }
}
