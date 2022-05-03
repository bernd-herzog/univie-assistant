using System.Xml;

namespace Univie.Assistant.IndexBuilder
{
  public class IndexBuilder
  {
    public Dictionary<string, Module> Modules { get; }
    public Dictionary<string, Course> Courses { get; }
    public List<Event> Events { get; }
    public List<string> Rooms { get; }
    public LocationUpdater LocationUpdater { get; }

    public IndexBuilder()
    {
      Modules = new Dictionary<string, Module>();
      Courses = new Dictionary<string, Course>();
      Events = new List<Event>();
      Rooms = new List<string>();
      LocationUpdater = new LocationUpdater();
    }

    public Index Build(string[] coursesFiles, string[] courseFiles)
    {
      foreach (var coursesFile in coursesFiles)
      {
        var xmlDocument = new XmlDocument();
        xmlDocument.Load(coursesFile);

        BuildModule(xmlDocument.DocumentElement, null);
      }

      foreach (var coursesFile in courseFiles)
      {
        var xmlDocument = new XmlDocument();
        xmlDocument.Load(coursesFile);

        BuildCourseData(xmlDocument.DocumentElement);
      }

      var rooms = LocationUpdater.UpdateLocations(Events);

      return new Index
      {
        Modules = Modules.Select(_ => _.Value).ToArray(),
        Courses = Courses.Select(_ => _.Value).ToArray(),
        Events = Events.ToArray(),
        Rooms = rooms
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

          var courses = module.SelectNodes("./courses/course");
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
      else
      {
        //Courses.Add(courseID, new Course { ID = courseID, ModuleID = parent, LongName = longname, Type = type });
        throw new Exception("missing course");
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
        if (Rooms.Contains(room) == false)
          Rooms.Add(room);

        Events.Add(new Event
        {
          CourseID = courseID,
          Start = DateTime.Parse(begin).ToUniversalTime().ToString("s") + "Z",
          End = DateTime.Parse(end).ToUniversalTime().ToString("s") + "Z",
          RoomName = room
        });
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