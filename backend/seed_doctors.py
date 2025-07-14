from backend.database import SessionLocal
from backend.models import Doctor

db = SessionLocal()

sample_doctors = [
    Doctor(name="Dr. Alice Smith", specialty="Cardiologist", location="Boston", contact_info="alice.smith@hospital.com"),
    Doctor(name="Dr. John Doe", specialty="Endocrinologist", location="New York", contact_info="john.doe@clinic.com"),
    Doctor(name="Dr. Priya Kumar", specialty="Dermatologist", location="Boston", contact_info="priya.kumar@clinic.com"),
]

db.add_all(sample_doctors)
db.commit()
db.close()

print("Doctors seeded successfully.")
