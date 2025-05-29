import React, { useEffect, useState } from "react";

export default function RestaurantDetails() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/restaurant-details");
        const json = await res.json();
        console.log("Data received:", json);
        if (Array.isArray(json) && json.length > 0) {
          setData(json[0]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!data) return <div className="p-4 text-center">No data available.</div>;

  const restaurant = data.Restaurant_Detail?.[0];
  const owner = data.Owner?.[0];
  const menu = data.MenuItem?.MenuHead || [];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{restaurant?.name || "Restaurant"}</h1>
      <p className="text-gray-700 mb-2"><strong>Address:</strong> {restaurant?.address}</p>
      <p className="text-gray-700 mb-2"><strong>Cuisine:</strong> {restaurant?.cuisine}</p>

      {owner && (
        <div className="my-6">
          <h2 className="text-2xl font-semibold mb-2">Owner Details</h2>
          <p><strong>Name:</strong> {owner.Name}</p>
          <p><strong>Email:</strong> {owner.Email}</p>
          <p><strong>Phone:</strong> {owner.Phone}</p>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map((item, index) => (
          <div key={index} className="p-4 border rounded shadow">
            <img
              src={item.image || "https://via.placeholder.com/150"}
              alt={item.name}
              className="w-full h-40 object-cover rounded mb-2"
              onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
            />
            <h3 className="text-lg font-bold">{item.name}</h3>
            <p className="text-gray-600 text-sm">{item.description}</p>
            <p className="mt-2 text-green-600 font-semibold">{parseFloat(item.price).toFixed(2)} €</p>
          </div>
        ))}
      </div>
    </div>
  );
}
