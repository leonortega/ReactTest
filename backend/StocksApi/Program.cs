using MediatR;
using Microsoft.AspNetCore.Mvc;
using StocksApi.Shared;
using StocksApi.Stocks;

var builder = WebApplication.CreateBuilder(args);

// CORS configuration with collection expressions
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        var allowedOrigins = builder.Environment.IsDevelopment()
            ? ["http://localhost:5173", "http://localhost:3000"]
            : builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new()
    {
        Title = "StocksApi",
        Version = "v1",
        Description = "API for retrieving stock market data"
    });
});

// Health checks
builder.Services.AddHealthChecks();

// Application services
builder.Services.AddSingleton<IStockRepository, InMemoryStockRepository>();
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(typeof(GetStockValueHandler).Assembly));

var app = builder.Build();

// Configure Swagger (Development only)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "StocksApi v1");
        options.RoutePrefix = string.Empty;
    });
}
else
{
    app.UseHttpsRedirection();
}

// Global exception handler
app.UseExceptionHandler(exceptionHandlerApp =>
{
    exceptionHandlerApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";

        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
        logger.LogError("Unhandled exception occurred");

        await context.Response.WriteAsJsonAsync(new
        {
            error = "An unexpected error occurred",
            timestamp = DateTime.UtcNow
        });
    });
});

app.UseCors("AllowFrontend");

// API Endpoints
app.MapGet("/api/stocks/{companyId}", async (
    IMediator mediator,
    ILogger<Program> logger,
    string companyId,
    [FromQuery] string? date) =>
{
    if (string.IsNullOrWhiteSpace(companyId))
        return Results.BadRequest(new { error = "CompanyId cannot be empty" });

    if (string.IsNullOrWhiteSpace(date))
        return Results.BadRequest(new { error = "Missing required query parameter 'date' (YYYY-MM-DD)" });

    if (!DateOnly.TryParse(date, out var parsedDate))
        return Results.BadRequest(new { error = "Invalid 'date' format. Use YYYY-MM-DD." });

    logger.LogInformation("Fetching stock values for {CompanyId} on {Date}", companyId, parsedDate);

    try
    {
        var result = await mediator.Send(new GetStockValuesQuery(companyId, parsedDate));

        return result is null
            ? Results.NotFound(new { error = $"No stock data found for company '{companyId}' on {parsedDate:yyyy-MM-dd}" })
            : Results.Ok(result);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Error fetching stock values for {CompanyId} on {Date}", companyId, parsedDate);
        return Results.Problem("An error occurred while processing your request");
    }
})
.WithName("GetStockValues")
.WithTags("Stocks")
.WithSummary("Get stock values for a specific company and date")
.WithDescription("Returns stock price data for the specified company on the given date")
.Produces(StatusCodes.Status200OK)
.Produces(StatusCodes.Status400BadRequest)
.Produces(StatusCodes.Status404NotFound)
.Produces(StatusCodes.Status500InternalServerError);

app.MapHealthChecks("/health");

app.Run();

public partial class Program { }