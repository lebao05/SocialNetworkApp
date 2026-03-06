using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Domain.Shared
{
    public class Result
    {
        // Remove default parameter value for 'error' to fix CS1736
        protected internal Result(bool isSuccess, Error error = null!)
        {
            if (isSuccess && error != Error.None)
            {
                throw new InvalidOperationException();
            }

            if (!isSuccess && error == Error.None)
            {
                throw new InvalidOperationException();
            }

            IsSuccess = isSuccess;
            Error = error;
        }

        protected internal Result(Error[] errors)
        {
            IsSuccess = false;
            Errors = errors;
            Error = Error.None;
        }

        public bool IsSuccess { get; }

        public bool IsFailure => !IsSuccess;

        public Error Error { get; }
        public Error[] Errors { get; } = Array.Empty<Error>();

        public static Result Success() => new(true, Error.None);

        public static Result<TValue> Success<TValue>(TValue value) => new(value, true, Error.None);

        public static Result Failure(Error error) => new(false, error);

        public static Result<TValue> Failure<TValue>(Error error) => new(default, false, error);
        public static Result<TValue> Failure<TValue>(Error[] errors) => new(errors);
        public static Result<TValue> Create<TValue>(TValue? value) => value is not null ? Success(value) : Failure<TValue>(Error.NullValue);
    }
}