// RestaurantDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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

        const rawData = await response.json();
        const data = Array.isArray(rawData) ? rawData[0] : rawData;

        if (data?.RestStatus === "Success" && Array.isArray(data.Restaurants)) {
          const found = data.Restaurants.find((r) => r.restroid === id);
          setRestaurant(found);
        } else {
          setRestaurant(null);
        }
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!restaurant) return <p className="p-4 text-red-500">Restaurant not found.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 underline"
      >
        ← Back
      </button>
      <img
        src={restaurant.image}
        alt={restaurant.name}
        className="w-full h-64 object-cover rounded mb-4"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
        }}
      />
      <h1 className="text-2xl font-bold mb-2">{restaurant.name}</h1>
      <p className="text-gray-700">{restaurant.address}</p>
      <p className="text-sm text-gray-500 mt-1">Phone: {restaurant.phone}</p>
      <p className="text-sm text-gray-500">Email: {restaurant.email}</p>
      <p className="text-sm text-gray-500 mt-2">
        Hours: {restaurant.FirstOrder} – {restaurant.LastOrder}
      </p>
      <p className="mt-2 text-sm">
        Cuisine: <span className="text-gray-600">{restaurant.cuisine}</span>
      </p>
    </div>
  );
}

export default RestaurantDetail;
