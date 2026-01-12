import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const adminEmail = "adminbharatrides@gmail.com";
    const adminPassword = "admin1122";

    // Check if admin user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingAdmin = existingUsers?.users?.find(u => u.email === adminEmail);

    if (existingAdmin) {
      // Check if admin role already exists for this user
      const { data: existingRole } = await supabaseAdmin
        .from("user_roles")
        .select("*")
        .eq("user_id", existingAdmin.id)
        .eq("role", "admin")
        .maybeSingle();

      if (existingRole) {
        return new Response(
          JSON.stringify({ message: "Admin user already exists with admin role", userId: existingAdmin.id }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Add admin role to existing user
      const { error: roleError } = await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: existingAdmin.id, role: "admin" }, { onConflict: "user_id,role" });

      if (roleError) {
        throw roleError;
      }

      return new Response(
        JSON.stringify({ message: "Admin role added to existing user", userId: existingAdmin.id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create new admin user
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: "Admin BharatRides",
      },
    });

    if (createError) {
      throw createError;
    }

    // The trigger will create profile and default 'user' role
    // Now add admin role
    const { error: adminRoleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: newUser.user.id, role: "admin" });

    if (adminRoleError) {
      throw adminRoleError;
    }

    return new Response(
      JSON.stringify({ 
        message: "Admin user created successfully", 
        userId: newUser.user.id,
        email: adminEmail 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating admin:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
