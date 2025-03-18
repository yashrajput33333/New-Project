import React, { useId } from 'react'

const Input = React.forwardRef(function Input({
    label,
    type = "text",
    className = "",
    error,
    ...props 
}, ref) {
    const id = useId()
    
    return (
        <div className="w-full mb-4">
            {label && (
                <label 
                    className="block text-sm font-medium text-gray-700 mb-1 pl-1" 
                    htmlFor={id}
                >
                    {label}
                </label>
            )}
            <input
                type={type}
                className={`
                    w-full px-4 py-2.5
                    bg-white text-gray-900
                    border border-gray-300 
                    rounded-md shadow-sm
                    placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
                    transition duration-150 ease-in-out
                    ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
                    ${className}
                `}
                ref={ref}
                id={id}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    )
})

export default Input