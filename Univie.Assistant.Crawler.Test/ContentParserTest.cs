using NUnit.Framework;
using System.Linq;
using Univie.Assistant.Crawler.Test.Properties;

namespace Univie.Assistant.Crawler.Test
{
  public class ContentParserTest
  {
    [Test]
    public void ParseMainTableOfContent()
    {
      var contentParser = new ContentParser();

      var tableOfContent = contentParser.ParseMainTableOfContent(Resources.Main_HTML);

      Assert.That(tableOfContent, Is.Not.Null);
      Assert.That(tableOfContent.Length, Is.GreaterThan(10));
      Assert.That(tableOfContent[0].Link, Is.EqualTo("vvz_sub.html?from=1&amp;to=2&amp;semester=2022S&amp;path=275574"));
      Assert.That(tableOfContent[0].Semester, Is.EqualTo("2022S"));
      Assert.That(tableOfContent[0].Path, Is.EqualTo(275574));
    }

    [Test]
    public void ParseCourseListContent()
    {
      var contentParser = new ContentParser();

      var couseList = contentParser.ParseCourseListContent(Resources.Browse_274408, "2022S");

      Assert.That(couseList, Is.Not.Null);
      Assert.That(couseList.Length, Is.GreaterThan(10));
    }
  }
}