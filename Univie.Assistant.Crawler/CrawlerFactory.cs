namespace Univie.Assistant.Crawler
{
  public class CrawlerFactory
  {
    public CrawlerFactory()
    {
    }

    public Crawler Create()
    {
      return new Crawler(new ContentDownloader(), new ContentParser());
    }
  }
}