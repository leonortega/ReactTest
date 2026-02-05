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

            var rnd = new Random();
            decimal startingPrice = 100m;
            var latestCompanyItem = companyItems.OrderByDescending(s => s.DateTime).FirstOrDefault();
            if (latestCompanyItem != null)
            {
                startingPrice = latestCompanyItem.Price;
            }

            var newPoints = new List<StockValue>();
            if (!existingForDate.Any())
            {
                var intervalHours = 3;
                for (var hour = 0; hour <= 21; hour += intervalHours)
                {
                    var timeUtc = DateTime.SpecifyKind(date.ToDateTime(new TimeOnly(hour, 0)), DateTimeKind.Utc);
                    if (timeUtc < dateStart || timeUtc > dateEnd)
                        continue;

                    var change = (rnd.NextDouble() - 0.5) * 0.5;
                    startingPrice = Math.Round(startingPrice + (decimal)change, 2);
                    var point = new StockValue(companyId, timeUtc, startingPrice);
                    newPoints.Add(point);
                    _data.Add(point);
                }
            }
            else
            {
                var candidateTimeUtc = existingForDate.Max(s => s.DateTime).ToUniversalTime().AddMinutes(1);
                if (candidateTimeUtc < dateStart)
                    candidateTimeUtc = dateStart;

                if (candidateTimeUtc <= dateEnd && DateOnly.FromDateTime(candidateTimeUtc) == date)
                {
                    var change = (rnd.NextDouble() - 0.5) * 0.5;
                    var price = Math.Round(startingPrice + (decimal)change, 2);
                    var newPoint = new StockValue(companyId, DateTime.SpecifyKind(candidateTimeUtc, DateTimeKind.Utc), price);
                    newPoints.Add(newPoint);
                    _data.Add(newPoint);
                }
            }

            var result = existingForDate.Concat(newPoints).OrderBy(s => s.DateTime);
            return Task.FromResult(result.AsEnumerable());
        }
    }
}
