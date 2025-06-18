import React, { useEffect, useState } from "react";

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/userhome", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceId: "321312364633",
          email: "asho251@gmail.com",
          latitude: "",
          longitude: "",
          location: "",
          user: "830481533",
          zipcode: "400614",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const rawData = await response.json();
      const data = Array.isArray(rawData) ? rawData[0] : rawData;

      if (data?.RestStatus === "Success" && Array.isArray(data.Restaurants)) {
        setRestaurants(data.Restaurants);
      } else {
        console.warn("Unexpected API response:", data);
        setRestaurants([]);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const isRestaurantOpen = (firstOrder, lastOrder) => {
    if (!firstOrder || !lastOrder) return false;
    try {
      const now = new Date();
      const [h1, m1] = firstOrder.split(":").map(Number);
      const [h2, m2] = lastOrder.split(":").map(Number);
      const openTime = new Date(now).setHours(h1, m1, 0);
      const closeTime = new Date(now).setHours(h2, m2, 0);
      return now >= openTime && now <= closeTime;
    } catch (e) {
      console.error("Invalid time format:", firstOrder, lastOrder);
      return false;
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Restaurants</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading restaurants...</p>
      ) : restaurants.length === 0 ? (
        <p className="text-center text-red-500">No restaurants to show</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((rest) => {
            const isOpen = isRestaurantOpen(rest.FirstOrder, rest.LastOrder);
            const imageUrl =
              rest.image && rest.image.startsWith("http")
                ? rest.image
                : "https://via.placeholder.com/300x200?text=Image+Not+Found";

            return (
              <div
                key={rest.restroid || rest.id || rest.name}
                className={`relative rounded-xl overflow-hidden shadow-lg transition-all bg-white ${
                  !isOpen ? "opacity-50 pointer-events-none" : "hover:shadow-2xl"
                }`}
              >
                <img
                  src={imageUrl}
                  alt={rest.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
                  }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* Closed Overlay */}
                {!isOpen && (
                  <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold bg-black/50">
                    Geschlossen
                  </div>
                )}

                {/* Cuisine Badge */}
                <div className="absolute top-3 left-3 bg-white text-xs font-medium px-2 py-1 rounded shadow">
                  {(rest.cuisine?.split(",")[0] || "Cuisine").trim()}
                </div>

                {/* Restaurant Info */}
                <div className="absolute bottom-16 left-4 text-white">
                  <h2 className="text-lg font-bold">{rest.name}</h2>
                  <p className="text-sm">{rest.address || "No address"}</p>
                </div>

                {/* Opening Hours */}
                <div className="absolute bottom-8 left-4 text-white text-xs">
                  🕒 {rest.FirstOrder?.slice(0, 5)} – {rest.LastOrder?.slice(0, 5)}
                </div>

                {/* Bottom Icons */}
                <div className="flex justify-around items-center py-3 bg-white text-gray-700 text-sm font-medium">
                  <div className="flex items-center gap-1">
                    <span role="img" aria-label="Takeaway">🛍️</span> Takeaway
                  </div>
                  <div className="flex items-center gap-1">
                    <span role="img" aria-label="Delivery">🚴‍♂️</span> Delivery
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RestaurantList;
