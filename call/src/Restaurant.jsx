import { useEffect, useState } from "react";

function Restaurant() {
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [zipcodes, setZipcodes] = useState([]);
  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/restaurantdetail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId: "1231231234",
          latitude: "7435242355",
          longitude: "774635423r",
          restid: "1",
          restname: "Sushi Sensei",
          user: "123456",
          ipadd: "122.122.122.122",
        }),
      });

      const data = await response.json();
      console.log("API response:", data);

      const main = data.Restaurant_Detail?.[0] || {};
      setRestaurant(main);
      setMenu(data.MenuItem?.MenuHead || []);
      setZipcodes(data.Zipcodes || []);
      setHours(data.hours || []);
    } catch (err) {
      console.error("Failed to fetch restaurant data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!restaurant) return <div className="p-4">No restaurant data found.</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Restaurant Info */}
      <section className="bg-white shadow rounded-lg p-4">
        <h1 className="text-2xl font-bold">{restaurant.name || "Unnamed Restaurant"}</h1>
        {restaurant.image && (
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full max-h-64 object-cover rounded my-4"
          />
        )}
        <p className="text-gray-700 mb-2">{restaurant.address}</p>
        <p><strong>Phone:</strong> {restaurant.phone || "N/A"}</p>
        <p><strong>Mobile:</strong> {restaurant.mobile || "N/A"}</p>
        <p><strong>Email:</strong> {restaurant.email || "N/A"}</p>
        <p><strong>Cuisine:</strong> {restaurant.cuisine || "N/A"}</p>
        <p><strong>Established:</strong> {restaurant.yearestablished || "N/A"}</p>
        <p><strong>Minimum Delivery Amount:</strong> €{restaurant.minimumdeliveryamount || "0"}</p>
        <p><strong>Minimum Delivery Time:</strong> {restaurant.minimumdeliverytime || "N/A"} mins</p>
      </section>

      {/* Opening Hours */}
      <section className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Opening Hours</h2>
        {hours.length > 0 ? (
          <ul className="space-y-1">
            {hours.map((hour, i) => (
              <li key={i}>
                <strong>{hour.Day}:</strong> {hour.FirstOrder} - {hour.LastOrder}
              </li>
            ))}
          </ul>
        ) : (
          <p>No opening hours available.</p>
        )}
      </section>

      {/* Menu */}
      <section className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Menu</h2>
        {menu.length > 0 ? (
          menu.map((category) => (
            <div key={category.category_id} className="mb-6">
              <h3 className="text-lg font-bold border-b mb-2">{category.category}</h3>
              <ul className="grid md:grid-cols-2 gap-4">
                {category.category_products.map((item) => (
                  <li key={item.id} className="border p-3 rounded hover:shadow">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Price: €{item.price}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No menu items available.</p>
        )}
      </section>

      {/* Zipcode Service Areas */}
      <section className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Delivery Areas</h2>
        {zipcodes.length > 0 ? (
          <ul className="space-y-1">
            {zipcodes.map((zip, i) => (
              <li key={i}>
                <strong>{zip.area_name}</strong> ({zip.zip_code}) – Minimum Order: €{zip["minimumorder "] || "N/A"}
              </li>
            ))}
          </ul>
        ) : (
          <p>No delivery areas listed.</p>
        )}
      </section>
    </div>
  );
}

export default Restaurant;
