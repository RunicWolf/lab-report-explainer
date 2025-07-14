from backend.database import SessionLocal
from backend.models import Doctor

db = SessionLocal()

db.query(Doctor).delete()
db.commit()

sample_doctors = [
    Doctor(name="Dr. Alice Smith", specialty="Cardiologist", location="Boston", contact_info="alice.smith@hospital.com"),
    Doctor(name="Dr. John Doe", specialty="Endocrinologist", location="New York", contact_info="john.doe@clinic.com"),
    Doctor(name="Dr. Priya Kumar", specialty="Dermatologist", location="Boston", contact_info="priya.kumar@clinic.com"),
    Doctor(name="Dr. Maria Lopez", specialty="General Physician", location="Chicago", contact_info="maria.lopez@healthcare.com"),
    Doctor(name="Dr. Lee Chen", specialty="Neurologist", location="San Francisco", contact_info="lee.chen@neurology.com"),
    Doctor(name="Dr. Ahmed Khan", specialty="Pediatrician", location="New York", contact_info="ahmed.khan@hospital.com"),
    Doctor(name="Dr. Emily Zhang", specialty="Orthopedic", location="Los Angeles", contact_info="emily.zhang@clinic.com"),
    Doctor(name="Dr. Ravi Patel", specialty="General Physician", location="Boston", contact_info="ravi.patel@healthcenter.com"),
    Doctor(name="Dr. Ana Silva", specialty="Gynecologist", location="Chicago", contact_info="ana.silva@health.org"),
    Doctor(name="Dr. Max Müller", specialty="Psychiatrist", location="New York", contact_info="max.muller@mindclinic.com"),
]

db.add_all(sample_doctors)
db.commit()
db.close()

print("Doctors seeded successfully.")
