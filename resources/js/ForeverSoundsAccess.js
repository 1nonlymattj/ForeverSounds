// Map each person to a password and a destination page
  const accessMap = {
      "JimMiller": {
      password: JM2025, // you can change this
      url: "people/JimMiller/index.html"
      },
      // Add more people as needed
  };

  function requestAccess(personKey) {
      const entry = accessMap[personKey];
      if (!entry) return alert("Access not found.");

      const input = prompt(`Enter password for ${personKey.replace(/([A-Z])/g, ' $1').trim()}:`);
      if (input === entry.password) {
      window.location.href = entry.url;
      } else if (input !== null) {
      alert("Incorrect password. Please try again.");
      }
  }