
export const ADMIN_STATS = [
  { title: "Total Patients", value: "12,482", trend: "+12%", icon: "Users", color: "#6C3BFF", status: "up" },
  { title: "Active Doctors", value: "84", trend: "+2", icon: "Stethoscope", color: "#3B82F6", status: "up" },
  { title: "Emergency Cases", value: "12", trend: "-4", icon: "Siren", color: "#EF4444", status: "down" },
  { title: "Appointments Today", value: "156", trend: "+18%", icon: "Calendar", color: "#10B981", status: "up" },
  { title: "Branch Count", value: "8", trend: "0", icon: "Building2", color: "#F59E0B", status: "neutral" },
];

export const ACTIVITY_FEED = [
  { id: 1, user: "Dr. Sarah Chen", action: "signed off the ICU rotation", time: "2m ago", role: "doctor", type: "update" },
  { id: 2, user: "Ambulance Unit-04", action: "dispatched to Sector 7", time: "5m ago", role: "ambulance", type: "emergency" },
  { id: 3, user: "James Wilson", action: "registered as new patient", time: "12m ago", role: "reception", type: "registration" },
  { id: 4, user: "Security Head", action: "completed midnight perimeter check", time: "45m ago", role: "security", type: "security" },
  { id: 5, user: "Dr. Michael Ross", action: "updated surgery schedule", time: "1h ago", role: "doctor", type: "update" },
];

export const PATIENTS_DATA = [
  { id: "P-10024", name: "Alice Thompson", age: 34, gender: "Female", condition: "Stable", ward: "Ward 4B", admission: "2026-05-14", status: "Active" },
  { id: "P-10025", name: "Robert Miller", age: 52, gender: "Male", condition: "Critical", ward: "ICU-2", admission: "2026-05-15", status: "Active" },
  { id: "P-10026", name: "Elena Rodriguez", age: 28, gender: "Female", condition: "Recovering", ward: "General", admission: "2026-05-10", status: "Discharged" },
  { id: "P-10027", name: "David Kim", age: 45, gender: "Male", condition: "Under Obs", ward: "Ward 1A", admission: "2026-05-16", status: "Active" },
  { id: "P-10028", name: "Sophia Lewis", age: 61, gender: "Female", condition: "Stable", ward: "Ward 3C", admission: "2026-05-15", status: "Active" },
];

export const STAFF_DATA = [
  { id: "S-501", name: "Dr. Sarah Chen", role: "Senior Surgeon", department: "Cardiology", status: "On Duty", joinDate: "2022-03-12" },
  { id: "S-502", name: "Dr. Michael Ross", role: "Specialist", department: "Neurology", status: "Away", joinDate: "2023-01-20" },
  { id: "S-503", name: "Nurse Jessica", role: "Head Nurse", department: "Emergency", status: "On Duty", joinDate: "2021-11-05" },
  { id: "S-504", name: "Security Sam", role: "Security Chief", department: "Security", status: "On Duty", joinDate: "2020-06-15" },
];

export const BRANCHES_DATA = [
  { id: 1, name: "City Center Hub", location: "Downtown Metro", status: "Operational", doctors: 45, patients: 2100 },
  { id: 2, name: "North Wing", location: "Suburban North", status: "Maintenance", doctors: 20, patients: 850 },
  { id: 3, name: "Westside Clinic", location: "Industrial Zone", status: "Operational", doctors: 12, patients: 400 },
  { id: 4, name: "Southside Express", location: "Residential South", status: "Operational", doctors: 8, patients: 320 },
];

export const BIRTHDAYS = [
  { name: "Nurse Emily", role: "Emergency", date: "Today" },
  { name: "Dr. John Doe", role: "Surgery", date: "Tomorrow" },
];

export const BILLING_DATA = [
  { id: "INV001", patient: "Ravi Kumar", amount: "₹2,500", status: "Paid", date: "2026-05-14" },
  { id: "INV002", patient: "Anjali Verma", amount: "₹5,400", status: "Pending", date: "2026-05-15" },
  { id: "INV003", patient: "Suresh Raina", amount: "₹1,200", status: "Paid", date: "2026-05-15" },
  { id: "INV004", patient: "Meera Bai", amount: "₹12,000", status: "Pending", date: "2026-05-16" },
];

export const PHARMACY_DATA = [
  { id: "M-001", name: "Paracetamol", qty: 120, status: "Available", category: "Analgesic" },
  { id: "M-002", name: "Insulin", qty: 5, status: "Low", category: "Antidiabetic" },
  { id: "M-003", name: "Amoxicillin", qty: 45, status: "Available", category: "Antibiotic" },
  { id: "M-004", name: "Cetirizine", qty: 2, status: "Low", category: "Antihistamine" },
  { id: "M-005", name: "Metformin", qty: 200, status: "Available", category: "Antidiabetic" },
];

export const LAB_REPORTS_DATA = [
  { id: "LAB-990", patient: "Vikram Seth", test: "Complete Blood Count", status: "Completed", date: "2026-05-14" },
  { id: "LAB-991", patient: "Priyanka Chopra", test: "Lipid Profile", status: "Pending", date: "2026-05-15" },
  { id: "LAB-992", patient: "Rahul Dravid", test: "HbA1c", status: "Completed", date: "2026-05-15" },
  { id: "LAB-993", patient: "Sakshi Malik", test: "Thyroid Profile", status: "Pending", date: "2026-05-16" },
];

export const CHART_DATA = [
  { name: 'Mon', patients: 400, cases: 240 },
  { name: 'Tue', patients: 300, cases: 139 },
  { name: 'Wed', patients: 200, cases: 980 },
  { name: 'Thu', patients: 278, cases: 390 },
  { name: 'Fri', patients: 189, cases: 480 },
  { name: 'Sat', patients: 239, cases: 380 },
  { name: 'Sun', patients: 349, cases: 430 },
];
