import React from "react";

export default function DoctorCardList({ doctors }) {
  return (
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
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doctor.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800 block mt-2"
          >
            View on Map
          </a>
        </div>
      ))}
    </div>
  );
}
