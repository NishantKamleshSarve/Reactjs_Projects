import { useEffect, useState } from "react";

function RestaurantDetail() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/home", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceId: "321312364633",
          latitude: "321312364633",
          longitude: "321312364633",
          location: "Frankfurt",
          user: "123456",
          email: "devkpandey@gmail.com",
          zipcode: "61348",
          sorting: "",
          country: "",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();
      const data = Array.isArray(rawData) ? rawData[0] : rawData;

      if (data?.Restaurants && Array.isArray(data.Restaurants)) {
        setRestaurants(data.Restaurants);
      } else {
        console.error("No restaurants found or bad data structure:", data);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const isOpenNow = () => {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 10 && hour < 22; // Adjust as needed
  };

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;

  if (restaurants.length === 0)
    return <p className="text-center text-red-600 mt-10">No restaurants available.</p>;

  return (
    <div className="p-6 space-y-6 flex flex-col items-center">
      {restaurants.map((rest) => (
        <div
          key={rest.restroid || rest.id || rest.name}
          className="bg-white shadow-md rounded-xl overflow-hidden flex w-full max-w-4xl border"
        >
          {/* Image */}
          <img
            src={rest.image || "/fallback.jpg"}
            alt={rest.name || "Restaurant"}
            className="w-44 h-44 object-cover rounded-l-xl"
          />

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-green-800">
                  {rest.name || "Unnamed"}
                </h2>
                <span className="flex items-center text-green-600 font-semibold text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24 7.45 13.97 5.82 21z" />
                  </svg>
                  {rest.rating || "8.9"}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{rest.cuisine || "Cuisine N/A"}</p>
              <p className="text-sm text-gray-700 mt-1">
                {rest.address || "Address N/A"}
              </p>
            </div>

            {/* Open/Closed badge */}
            <div className="mt-3">
              <span
                className={`inline-block px-3 py-1 text-sm rounded font-medium ${
                  isOpenNow() ? "bg-green-600 text-white" : "bg-red-500 text-white"
                }`}
              >
                {isOpenNow() ? "Open" : "Closed"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RestaurantDetail;
