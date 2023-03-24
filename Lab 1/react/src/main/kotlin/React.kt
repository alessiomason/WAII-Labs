class Reactor<T> {
    abstract inner class Cell {
        abstract val value: T
        val dependencies: MutableList<ComputeCell> = mutableListOf()
    }

    inner class InputCell(value: T): Cell() {
        override var value: T = value
            set(value) {
                field = value

                // fires dependencies callbacks and marks them as already fired
                for (dependency in dependencies)
                    dependency.fireCallbacks()

                // clears dependencies callbacks that might be called again later
                for (dependency in dependencies)
                    dependency.clearCallbacks()
            }
    }

    inner class ComputeCell(
        private vararg val inputs: Reactor<T>.Cell,
        private val fn: (inputs: List<T>) -> T
    ): Cell() {
        override val value: T get() = fn(inputs.map { it.value })
        private var previousValue: T = value
        private val callbacks: MutableList<Callback> = mutableListOf()

        init {
            for (input in inputs)
                input.dependencies.add(this)
        }

        fun addCallback(fn: (value: T) -> Unit): Callback {
            val callback = Callback(fn)
            callbacks.add(callback)
            return callback
        }

        fun fireCallbacks() {
            if (value != previousValue) {   // fire callbacks only on change
                previousValue = value

                for (callback in callbacks)   // fire own callbacks
                    callback.fire()

                for (dependency in dependencies)    // fire dependencies callbacks
                    dependency.fireCallbacks()
            }
        }

        fun clearCallbacks() {
            for (callback in callbacks)     // clear own callbacks
                callback.clear()

            for (dependency in dependencies)
                dependency.clearCallbacks()     // clear dependencies callbacks
        }

        inner class Callback(private val fn: (value: T) -> Unit): Subscription {
            private var canceled = false
            private var alreadyFired = false
            // prevents callbacks from being called more than once when multiple dependencies change

            // callback is not removed but marked as not to be run
            override fun cancel() { canceled = true }

            fun fire() {
                if (!canceled && !alreadyFired) {
                    alreadyFired = true
                    fn(value)
                }
            }

            fun clear() { alreadyFired = false }
        }
    }

    // Your compute cell's addCallback method must return an object
    // that implements the Subscription interface.
    interface Subscription {
        fun cancel()
    }
}