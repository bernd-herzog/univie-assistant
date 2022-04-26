using System.Xml;

namespace Univie.Assistant.IndexBuilder
{
  public class IndexBuilder
  {
    public Dictionary<string, Module> Modules { get; }
    public Dictionary<string, Course> Courses { get; }
    public List<Event> Events { get; }

    public IndexBuilder()
    {
      Modules = new Dictionary<string, Module>();
      Courses = new Dictionary<string, Course>();
      Events = new List<Event>();
    }

    public Index Build(string[] coursesFiles, string[] courseFiles)
    {
      foreach (var coursesFile in coursesFiles)
      {
        var xmlDocument = new XmlDocument();
        xmlDocument.Load(coursesFile);

        BuildModule(xmlDocument.DocumentElement.SelectSingleNode("/structure"), null);
      }

      foreach (var coursesFile in courseFiles)
      {
        var xmlDocument = new XmlDocument();
        xmlDocument.Load(coursesFile);

        BuildCourseData(xmlDocument.DocumentElement);
      }

      return new Index
      {
        Modules = Modules.Select(_ => _.Value).ToArray(),
        Courses = Courses.Select(_ => _.Value).ToArray(),
        Events = Events.ToArray(),
      };
    }

    private void BuildModule(XmlNode xmlNode, string parent)
    {
      var modules = xmlNode.SelectNodes("./module");

      if (modules != null)
      {
        foreach (var module in modules.Cast<XmlNode>())
        {
          var moduleID = GetXPathValue(module, "./@id");
          var name = GetXPathValue(module, "./title[@xml:lang='de']");

          Modules.Add(moduleID, new Module { ID = moduleID, ModuleID = parent, Name = name });

          BuildModule(module, moduleID);

          var courses = xmlNode.SelectNodes("./courses/course");
          foreach (var course in courses.Cast<XmlNode>())
          {
            BuildCourse(course, moduleID);
          }
        }
      }
    }
    private void BuildCourse(XmlNode course, string parent)
    {
      var courseID = GetXPathValue(course, "./@id");
      var longName = GetXPathValue(course, "./longname[@xml:lang='de']");

      if (Courses.ContainsKey(courseID) == false)
        Courses.Add(courseID, new Course { ID = courseID, ModuleID = parent, LongName = longName, Type = string.Empty });
    }

    private void BuildCourseData(XmlNode course)
    {
      var courseID = GetXPathValue(course, "./@id");
      var longname = GetXPathValue(course, "./longname[@xml:lang='de']");
      var type = GetXPathValue(course, "./type");

      if (Courses.ContainsKey(courseID))
      {
        Courses[courseID] = new Course { ID = courseID, ModuleID = Courses[courseID].ModuleID, LongName = longname, Type = type };
      }

      var events = course.SelectNodes("./groups/group/wwlong/wwevent");
      foreach (var @event in events.Cast<XmlNode>())
      {
        BuildEvent(@event, courseID);
      }
    }

    private void BuildEvent(XmlNode course, string courseID)
    {
      var begin = GetXPathValue(course, "./@begin");
      var end = GetXPathValue(course, "./@end");
      var room = GetXPathValue(course, "./location/room");
      if (room != null)
      {
        Events.Add(new Event { CourseID = courseID, Start = begin, End = end, Room = room });
      }
    }

    private string GetXPathValue(XmlNode xmlNode, string path)
    {
      var namespaceManager = new XmlNamespaceManager(xmlNode.OwnerDocument.NameTable);
      var node = xmlNode.SelectSingleNode(path, namespaceManager);

      return node?.InnerText ?? string.Empty;
    }
  }
}