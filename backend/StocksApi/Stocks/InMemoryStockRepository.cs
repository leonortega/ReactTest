using StocksApi.Shared;
using StocksApi.Stocks.Models;

namespace StocksApi.Stocks;

public class InMemoryStockRepository : IStockRepository
{
    private readonly List<StockValue> _data;

    public InMemoryStockRepository()
    {
        _data = new List<StockValue>
        {
            new StockValue("ABC", new DateTime(2024,1,1,10,0,0, DateTimeKind.Utc), 100.5m),
            new StockValue("ABC", new DateTime(2024,1,1,11,0,0, DateTimeKind.Utc), 101.2m),
            new StockValue("XYZ", new DateTime(2024,1,1,10,0,0, DateTimeKind.Utc), 50.0m),
        };
    }

    public Task<IEnumerable<StockValue>> GetStockValuesAsync(string companyId, DateOnly date)
    {
        lock (_data)
        {
            // All items for this company
            var companyItems = _data.Where(s => string.Equals(s.CompanyId, companyId, StringComparison.OrdinalIgnoreCase)).ToList();

            // Existing items on the requested date
            var existingForDate = companyItems.Where(s => DateOnly.FromDateTime(s.DateTime) == date).OrderBy(s => s.DateTime).ToList();

            // Date range for requested date (UTC)
            var dateStart = DateTime.SpecifyKind(date.ToDateTime(new TimeOnly(0, 0)), DateTimeKind.Utc);
            var dateEnd = DateTime.SpecifyKind(date.ToDateTime(new TimeOnly(23, 59)), DateTimeKind.Utc);

            // Determine new value time: prefer one minute after the latest on the requested date
            DateTime candidateTimeUtc;
            if (existingForDate.Any())
            {
                candidateTimeUtc = existingForDate.Max(s => s.DateTime).ToUniversalTime().AddMinutes(1);
            }
            else
            {
                // If no items exist for the date, start at the date start
                candidateTimeUtc = dateStart;
            }

            // Ensure candidate is not before dateStart
            if (candidateTimeUtc < dateStart)
                candidateTimeUtc = dateStart;

            // Only add if candidate falls within the requested date
            StockValue? newPoint = null;
            if (candidateTimeUtc <= dateEnd && DateOnly.FromDateTime(candidateTimeUtc) == date)
            {
                // Starting price: prefer the latest company price if available, otherwise default
                decimal startingPrice = 100m;
                var latestCompanyItem = companyItems.OrderByDescending(s => s.DateTime).FirstOrDefault();
                if (latestCompanyItem != null)
                {
                    startingPrice = latestCompanyItem.Price;
                }

                // Create a small random change
                var rnd = new Random();
                var change = (rnd.NextDouble() - 0.5) * 0.5; // -0.25 .. +0.25
                var price = Math.Round(startingPrice + (decimal)change, 2);

                newPoint = new StockValue(companyId, DateTime.SpecifyKind(candidateTimeUtc, DateTimeKind.Utc), price);
                _data.Add(newPoint);
            }

            // Return existing + newly added (if any), ordered
            var result = existingForDate.AsEnumerable();
            if (newPoint is not null)
            {
                result = result.Concat(new[] { newPoint }).OrderBy(s => s.DateTime);
            }

            return Task.FromResult(result);
        }
    }
}
