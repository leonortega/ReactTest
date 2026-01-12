using MediatR;
using StocksApi.Shared;
using StocksApi.Stocks;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register vertical slice services
builder.Services.AddSingleton<IStockRepository, InMemoryStockRepository>();
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(GetStockValueHandler).Assembly));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    // Serve Swagger UI at application root so the launcher opens directly to the docs
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "StocksApi v1");
        options.RoutePrefix = string.Empty; // serve UI at '/'
    });
}

//app.UseHttpsRedirection();

// Minimal API endpoint for getting stock values for a specific date (date-only query parameter)
app.MapGet("/api/stocks/{companyId}", async (IMediator mediator, string companyId, DateOnly? date) =>
{
    if (!date.HasValue)
        return Results.BadRequest(new { error = "Missing required query parameter 'date' (YYYY-MM-DD)" });

    var result = await mediator.Send(new GetStockValuesQuery(companyId, date.Value));
    return Results.Ok(result);
});

app.MapGet("/health", () => Results.Ok("OK"));

app.Run();
