// backend/controllers/locationController.js

exports.searchLocation = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        message: "Location search query is required.",
      });
    }

    const encodedQuery = encodeURIComponent(query.trim());

    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&q=${encodedQuery}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "LensLinkStudentProject/1.0",
        "Accept-Language": "en",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        message: "Failed to fetch location data.",
      });
    }

    const data = await response.json();

    const results = data.map((item) => ({
      display_name: item.display_name,
      lat: item.lat,
      lon: item.lon,
      city:
        item.address?.city ||
        item.address?.town ||
        item.address?.village ||
        item.address?.municipality ||
        "",
      state: item.address?.state || "",
      country: item.address?.country || "",
      postcode: item.address?.postcode || "",
    }));

    res.json({
      query,
      results,
      attribution: "Location data from OpenStreetMap Nominatim",
    });
  } catch (error) {
    console.error("Location search error:", error);

    res.status(500).json({
      message: "Location search failed.",
      error: error.message,
    });
  }
};