import { ProjectView } from "@/types/project";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

// For seeding, we use the service role key (run locally only!)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const users = [
  { name: "Alice Johnson", email: "alice@example.com" },
  { name: "Bob Smith", email: "bob@example.com" },
  { name: "Carol Williams", email: "carol@example.com" },
  { name: "David Brown", email: "david@example.com" },
  { name: "Emma Davis", email: "emma@example.com" },
];

const password = "password123";

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

async function seedUsers(): Promise<Map<string, string>> {
  console.log("👤 Creating users...\n");
  const userMap = new Map<string, string>(); // name -> user_id

  for (const user of users) {
    // Check if user already exists in auth
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existing = existingUsers?.users?.find((u) => u.email === user.email);

    if (existing) {
      console.log(`  ⏭️  ${user.name} (${user.email}) already exists`);
      userMap.set(user.name, existing.id);

      // Ensure user profile exists in users table
      const { data: profile } = await supabase
        .from("users")
        .select("id")
        .eq("id", existing.id)
        .single();

      if (!profile) {
        await supabase.from("users").insert({
          id: existing.id,
          name: user.name,
          email: user.email,
        });
        console.log(`    ↳ Created missing profile for ${user.name}`);
      }

      continue;
    }

    // Create new user in auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: password,
      email_confirm: true,
      user_metadata: { name: user.name },
    });

    if (error) {
      console.error(`  ❌ Failed to create ${user.name}:`, error.message);
      continue;
    }

    // The trigger should auto-create the profile, but let's ensure it exists
    const { data: profile } = await supabase
      .from("users")
      .select("id")
      .eq("id", data.user.id)
      .single();

    if (!profile) {
      await supabase.from("users").insert({
        id: data.user.id,
        name: user.name,
        email: user.email,
      });
    }

    console.log(`  ✅ Created ${user.name} (${user.email})`);
    userMap.set(user.name, data.user.id);
  }

  return userMap;
}

async function seedProjects(userMap: Map<string, string>) {
  console.log("\n📁 Seeding projects...\n");

  // Clear existing projects
  const { error: deleteError } = await supabase
    .from("projects")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (deleteError) {
    console.error("Error clearing projects:", deleteError);
    return;
  }

  const userIds = Array.from(userMap.values());

  const projects = projectNames.map((name, index) => {
    // Distribute projects among users
    const userIndex = index % userIds.length;
    const userId = userIds[userIndex];

    return {
      name,
      description: randomElement(descriptions),
      status: randomElement(["active", "on_hold", "completed"] as const),
      deadline: randomDate(new Date(), new Date("2025-12-31")),
      assigned_to: userId, // UUID of the owner
      budget: randomBudget(),
    };
  });

  const { data, error } = await supabase.from("projects").insert(projects)
    .select(`
      *,
      assigned_user:users!assigned_to (name)
    `);

  if (error) {
    console.error("Error seeding projects:", error);
    return;
  }

  console.log(`✅ Seeded ${data.length} projects:\n`);
  data.forEach((project: ProjectView) => {
    console.log(
      `  - ${project.name} (${project.status}) - ${project.assigned_user?.name || "Unknown"} - $${project.budget.toLocaleString()}`,
    );
  });
}

async function seed() {
  console.log("🌱 Seeding database...\n");
  console.log("=".repeat(50) + "\n");

  const userMap = await seedUsers();

  if (userMap.size === 0) {
    console.error("No users created, aborting project seeding.");
    return;
  }

  await seedProjects(userMap);

  console.log("\n" + "=".repeat(50));
  console.log("\n🎉 Seeding complete!\n");
  console.log("📧 Login credentials:");
  users.forEach((u) => {
    console.log(`  - ${u.email} / ${password}`);
  });
}

seed();
