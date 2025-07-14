import React, { useState } from "react";
import axios from "axios";

export default function DoctorRecommendation() {
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDoctors = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDoctors([]);

    try {
      const response = await axios.get(
        `http://localhost:8000/doctors/?specialty=${specialty}&location=${location}`
      );
      setDoctors(response.data);
    } catch (err) {
      setError("Unable to fetch doctors. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Doctor Finder</h2>


      <form
        onSubmit={fetchDoctors}
        className="flex flex-col gap-4 bg-white p-4 rounded-2xl shadow-md"
      >
        <input
          type="text"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          placeholder="Enter Specialty (e.g., Cardiologist)"
          className="border p-2 rounded-lg"
          required
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter Location (e.g., New York)"
          className="border p-2 rounded-lg"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"

        >
          {loading ? "Searching..." : "Find Doctors"}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {!loading && !error && doctors.length === 0 && (
        <p className="text-gray-500 mt-4">No doctors found. Try a different search.</p>
      )}

      <div className="grid gap-4 mt-6 grid-cols-1 md:grid-cols-2">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="border rounded-2xl p-4 shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold">{doctor.name}</h3>
            <p className="text-gray-700">{doctor.specialty}</p>
            <p className="text-gray-700">{doctor.location}</p>
            <p className="text-gray-700">Contact: {doctor.contact_info}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
