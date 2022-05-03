namespace Univie.Assistant.IndexBuilder
{
  public class LocationUpdater
  {
    public Room[] UpdateLocations(List<Event> events)
    {
      var rooms = new Dictionary<string, Room>();
      var roomCounter = 0;

      var roomInfos = events
        .Where(_ => _.RoomName != "")
        .GroupBy(_ => _.RoomName)
        .ToDictionary(_ => _.Key, _ => new { Events = _.Select(_ => _).ToArray(), RoomInfo = ParseRoom(_.Key) });

      var unhandledRoomInfos = roomInfos.ToDictionary(_ => _.Key, _ => _.Value);

      var areaIdentifier = new string[] { "uza", "nig", "museum", "usz", "unicampus", "biocenter", "gebäude", "juridicum", "hof" };
      foreach (var roomInfo in unhandledRoomInfos.ToArray())
      {
        var areaNames = roomInfo.Value.RoomInfo.Where(_ => areaIdentifier.Any(__ => _.ToLower().Contains(__)));

        if (areaNames.Any())
        {
          var areaName = areaNames.Where(ContainsNumber).FirstOrDefault() ?? areaNames.First();
          var (latitude, longitude) = CoordsFromArea(areaName.ToLower());

          var roomkey = $"{latitude},{longitude}";

          if (rooms.ContainsKey(roomkey))
          {
            var roomID = rooms[roomkey].RoomID;

            foreach (var @event in roomInfo.Value.Events)
              @event.RoomID = roomID;
          }
          else
          {
            var roomID = $"{roomCounter++}";
            rooms.Add(roomkey, new Room
            {
              RoomID = roomID,
              RoomLatitude = latitude,
              RoomLongitude = longitude,
            });

            foreach (var @event in roomInfo.Value.Events)
              @event.RoomID = roomID;
          }

          unhandledRoomInfos.Remove(roomInfo.Key);
        }
      }

      var streetIdentifier = new string[] { "gasse", "straße", "weg", "platz" };
      foreach (var roomInfo in unhandledRoomInfos.ToArray())
      {
        var streetNames = roomInfo.Value.RoomInfo.Where(_ => streetIdentifier.Any(__ => _.ToLower().Contains(__)));

        if (streetNames.Any())
        {
          var streetName = streetNames.Where(ContainsNumber).FirstOrDefault() ?? streetNames.First();
          var (latitude, longitude) = CoordsFromStreet(streetName.ToLower());

          var roomkey = $"{latitude},{longitude}";

          if (rooms.ContainsKey(roomkey))
          {
            var roomID = rooms[roomkey].RoomID;

            foreach (var @event in roomInfo.Value.Events)
              @event.RoomID = roomID;
          }
          else
          {
            var roomID = $"{roomCounter++}";
            rooms.Add(roomkey, new Room
            {
              RoomID = roomID,
              RoomLatitude = latitude,
              RoomLongitude = longitude,
            });

            foreach (var @event in roomInfo.Value.Events)
              @event.RoomID = roomID;
          }

          unhandledRoomInfos.Remove(roomInfo.Key);
        }
      }

      var ignoredIdentifier = new string[] { "digital", "extern", "hybrid" };
      foreach (var roomInfo in unhandledRoomInfos.ToArray())
      {
        if (roomInfo.Value.RoomInfo.Any(_ => ignoredIdentifier.Any(__ => _.ToLower().Contains(__))))
          unhandledRoomInfos.Remove(roomInfo.Key);
      }

      foreach (var roomInfo in unhandledRoomInfos.ToArray())
      {
        Console.WriteLine($"No coords for {roomInfo.Key}");
      }

      return rooms.Values.ToArray();
    }

    private (double Latitude, double Longitude) CoordsFromStreet(string steetName)
    {
      var coords = new Dictionary<string, (double, double)> {
        {"alser straße 23", (48.2147843,16.350719) },
        {"althanstraße 14", (48.229280,16.359050) },
        {"augasse 2-6", (48.231910,16.357080) },
        {"berggasse 7", (48.217880,16.360760) },
        {"bohrgasse 9", (48.188550,16.400620) },
        {"bohr-gasse 3", (48.1892464,16.4018541) },
        {"bohr-gasse 9", (48.188550,16.400620) },
        {"boltzmanngasse 1", (48.220610,16.356480) },
        {"boltzmanngasse 5", (48.2215207,16.3558044) },
        {"contiweg 1", (48.2315045,16.4700109) },
        {"daumegasse 4", (48.1646251,16.374777) },
        {"djerassiplatz 1", (48.1905951,16.401855) },
        {"ettenreichgasse 45c", (48.1655953,16.3737385) },
        {"friesgasse", (48.1906703,16.3345331) },
        {"franz-klein-gasse", (48.2335998,16.3488778) },
        {"franz-klein-gasse 1", (48.2335998,16.3488778) },
        {"gottschalkgasse 21", (48.1733669,16.4116551) },
        {"grenzackerstraße 18", (48.1657465,16.3742837) },
        {"gymnasiumstraße 50", (48.2335122,16.347902) },
        {"hanuschgasse", (48.2051791,16.3669526) },
        {"heldenplatz", (48.2060921,16.3640091) },
        {"johannesgasse 4", (48.2048709,16.3722361) },
        {"josefsplatz 1", (48.2060186,16.3672898) },
        {"kolingasse 14-16", (48.2160628,16.3641025) },
        {"lacknergasse 89", (48.2282012,16.3338343) },
        {"liebiggasse 5", (48.213327,16.3575605) },
        {"mayerweckstraße 1", (48.2942616,16.3827088) },
        {"mühlgasse 67", (48.1963969,16.3622063) },
        {"universitätsstraße 7", (48.2135702,16.3577678) },
        {"oskar-morgenstern-platz 1", (48.2192066,16.3673771) },
        {"philippovichgasse 11", (48.233643,16.3482876) },
        {"porzellangasse 4", (48.219538,16.3635307) },
        {"rathausstraße 19", (48.2137943,16.3569898) },
        {"rennweg", (48.1980184,16.3780962) },
        {"rooseveltplatz 2", (48.2147378,16.3582528) },
        {"schenkenstraße", (48.2107605,16.3632785) },
        {"schenkenstraße 1", (48.2107605,16.3632785) },
        {"schenkenstraße 8-10", (48.210752,16.3627279) },
        {"schottenfeldgasse 29", (48.1997863,16.3430158) },
        {"sensengasse 3", (48.220013,16.3538417) },
        {"sensengasse 8", (48.2202329,16.3554744) },
        {"severin schreiber gasse 1", (48.2313422,16.3313923) },
        {"spitalgasse", (48.2185816,16.3531517) },
        {"türkenschanzstraße 17", (48.2318233,16.3341712) },
        {"währinger straße 17", (48.2183005,16.3574725) },
        {"währinger straße 29", (48.2199945,16.3562074) },
        {"währinger straße 38", (48.220571,16.3564194) },
        {"währinger straße 42", (48.2212103,16.3552208) },
        {"wipplingerstraße 28", (48.2130534,16.3681078) },
      };

      var keyToUse = coords.Keys.Where(_ => steetName.Contains(_));

      if (keyToUse.Any())
        return coords[keyToUse.Where(ContainsNumber).FirstOrDefault() ?? keyToUse.First()];

      Console.WriteLine($"No coords for street {steetName}");
      return (0, 0);
    }

    private (double Latitude, double Longitude) CoordsFromArea(string areaName)
    {
      var coords = new Dictionary<string, (double, double)> {

        {"nig", (48.2135702,16.3577678) },
        {"hof 1", (48.2159481,16.3525191) },
        {"hof 2", (48.2171404,16.3528263) },
        {"hof 3", (48.2178201,16.3529226) },
        {"hof 4", (48.2173656,16.3518195) },
        {"hof 5", (48.2178741,16.3519549) },
        {"hof 6", (48.2038912,16.3571642) },
        {"hof 7", (48.217107,16.3539195) },
        {"hof 8", (48.2170906,16.3548213) },
        {"hof 9", (48.2171879,16.3557297) },
        {"hof 10", (48.2182662,16.3525592) },
        {"hauptgebäude", (48.2131284,16.360686) },
        {"juridicum", (48.21397,16.3650553) },
        {"uza2", (48.2292449,16.3590705) },
        {"uza 1", (48.2292449,16.3590705) },
        {"uza ii", (48.2292449,16.3590705) },
        {"usz i", (48.2037036,16.3175503) },
        {"usz ii", (48.2055759,16.3174178) },
        {"biocenter", (48.1893341,16.4023762) },
        {"unicampus", (48.2131284,16.360686) },
      };

      var keyToUse = coords.Keys.Where(_ => areaName.Contains(_));

      if (keyToUse.Any())
        return coords[keyToUse.Where(ContainsNumber).LastOrDefault() ?? keyToUse.First()];

      Console.WriteLine($"No coords for area {areaName}");
      return (0, 0);
    }

    private string[] ParseRoom(string roomText)
    {
      var lines = roomText.Split(',');
      var infos = new List<string>();

      foreach (var line in lines)
      {
        var words = line.Split(new char[] { ' ', '/', '.' }).Where(_ => string.IsNullOrWhiteSpace(_) == false).ToArray();

        var wordStack = new List<string>();
        foreach (var word in words)
        {
          if (wordStack.Count > 0)
          {
            var hasWord = wordStack.Any(ContainsNumber);
            var hasNumber = wordStack.Any(_ => ContainsNumber(_) == false);
            var lastIsNumber = ContainsNumber(wordStack.Last());
            var currentIsNumber = ContainsNumber(word);

            var containsBoth = hasWord && hasNumber;
            var hasSwitched = lastIsNumber != currentIsNumber;

            var isDifferent = hasSwitched || currentIsNumber;

            if (lastIsNumber)
            {
              infos.Add(string.Join(' ', wordStack));
              wordStack = new List<string>();
            }
          }

          wordStack.Add(word);
        }

        infos.Add(string.Join(' ', wordStack));
      }

      return infos.ToArray();
    }

    private bool ContainsNumber(string value)
    {
      return value.Any(_ => char.IsDigit(_));
    }
  }
}