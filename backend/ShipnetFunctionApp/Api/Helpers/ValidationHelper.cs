using System.ComponentModel.DataAnnotations;

namespace ShipnetFunctionApp.Api.Helpers
{
    /// <summary>
    /// Helper methods for input validation
    /// </summary>
    public static class ValidationHelper
    {
        /// <summary>
        /// Validates an object using data annotations
        /// </summary>
        /// <typeparam name="T">Type of object to validate</typeparam>
        /// <param name="obj">Object to validate</param>
        /// <param name="errors">Output parameter for validation errors</param>
        /// <returns>True if validation passes, false otherwise</returns>
        public static bool Validate<T>(T obj, out IEnumerable<string> errors)
        {
            var results = new List<ValidationResult>();
            var context = new ValidationContext(obj!);
            
            var isValid = Validator.TryValidateObject(obj!, context, results, true);
            errors = results.Select(r => r.ErrorMessage ?? "Unknown validation error");
            
            return isValid;
        }
    }
}
