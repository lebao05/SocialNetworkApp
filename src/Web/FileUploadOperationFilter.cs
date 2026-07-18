namespace Web;

public sealed class FileUploadOperationFilter : Swashbuckle.AspNetCore.SwaggerGen.IOperationFilter
{
    public void Apply(Microsoft.OpenApi.OpenApiOperation operation, Swashbuckle.AspNetCore.SwaggerGen.OperationFilterContext context)
    {
        if (operation is null || context?.ApiDescription is null)
            return;

        var fileParam = context.ApiDescription.ParameterDescriptions
            .FirstOrDefault(p => p?.Type == typeof(Microsoft.AspNetCore.Http.IFormFile));

        if (fileParam is null || string.IsNullOrEmpty(fileParam.Name))
            return;

        var mediaType = new Microsoft.OpenApi.OpenApiMediaType
        {
            Schema = new Microsoft.OpenApi.OpenApiSchema
            {
                Type = Microsoft.OpenApi.JsonSchemaType.String,
                Format = "binary"
            }
        };

        operation.RequestBody = new Microsoft.OpenApi.OpenApiRequestBody
        {
            Content = new Dictionary<string, Microsoft.OpenApi.OpenApiMediaType>
            {
                ["multipart/form-data"] = mediaType
            }
        };
    }
}