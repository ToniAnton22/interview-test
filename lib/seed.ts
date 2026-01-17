import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

// For seeding, we use the service role key (run locally only!)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
console.log(supabaseUrl, supabaseServiceKey);
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const teamMembers = [
  "Alice Johnson",
  "Bob Smith",
  "Carol Williams",
  "David Brown",
  "Emma Davis",
];

const projectNames = [
  "Website Redesign",
  "Mobile App Development",
  "Database Migration",
  "API Integration",
  "Security Audit",
  "Performance Optimization",
  "User Research Study",
  "Marketing Dashboard",
  "Payment Gateway Integration",
  "Analytics Platform",
  "Customer Portal",
  "Inventory System",
  "HR Management Tool",
  "Email Campaign System",
  "Social Media Tracker",
];

const descriptions = [
  "Complete overhaul of the existing system with modern technologies.",
  "Building new features based on customer feedback.",
  "Migrating legacy systems to cloud infrastructure.",
  "Integrating third-party services for enhanced functionality.",
  "Comprehensive review and improvement of security measures.",
  "Optimizing system performance and reducing load times.",
  "Conducting user interviews and analyzing behavior patterns.",
  "Creating dashboards for real-time metrics visualization.",
  "Implementing secure payment processing solutions.",
  "Building data analytics and reporting capabilities.",
  null,
  null,
];

function randomDate(start: Date, end: Date): string {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
  return date.toISOString().split("T")[0];
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBudget(): number {
  return Math.round((Math.random() * 95000 + 5000) / 100) * 100;
}

async function seed() {
  console.log("🌱 Seeding database...\n");

  // Clear existing data
  const { error: deleteError } = await supabase
    .from("projects")
    .delete()
    .neq("id", crypto.randomUUID());

  if (deleteError) {
    console.error("Error clearing data:", deleteError);
    return;
  }

  const projects = projectNames.map((name) => ({
    name,
    description: randomElement(descriptions),
    status: randomElement(["active", "on_hold", "completed"] as const),
    deadline: randomDate(new Date(), new Date("2025-12-31")),
    assigned_to: randomElement(teamMembers),
    budget: randomBudget(),
  }));

  const { data, error } = await supabase
    .from("projects")
    .insert(projects)
    .select();

  if (error) {
    console.error("Error seeding:", error);
    return;
  }

  console.log(`✅ Seeded ${data.length} projects:\n`);
  data.forEach((p) => {
    console.log(`  - ${p.name} (${p.status}) - $${p.budget.toLocaleString()}`);
  });
  console.log("\n🎉 Seeding complete!");
}

seed();
