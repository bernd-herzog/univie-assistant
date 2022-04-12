using Univie.Assistant.Crawler;

const string logName = "Univie.Assistant.Crawler";
Console.WriteLine($"{logName}: Starting...");

var crawlerFactory = new CrawlerFactory();

try
{
  await crawlerFactory.Create().Run();
}
catch (Exception ex)
{
  Console.WriteLine($"{logName}: Error:\r\n\r\n{ex}\r\n\r\n");
}
