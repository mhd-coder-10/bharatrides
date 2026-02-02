import { supabase } from '@/integrations/supabase/client';

type VehicleAction = 'added' | 'updated' | 'deleted';

export async function createVehicleNotification(
  vehicleName: string,
  vehicleBrand: string,
  action: VehicleAction
): Promise<void> {
  try {
    // Get all admin user IDs
    const { data: adminRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');

    if (rolesError) {
      console.error('Error fetching admin roles:', rolesError);
      return;
    }

    if (!adminRoles || adminRoles.length === 0) {
      console.log('No admins found to notify');
      return;
    }

    const actionMessages: Record<VehicleAction, string> = {
      added: `New vehicle added: ${vehicleBrand} ${vehicleName}`,
      updated: `Vehicle updated: ${vehicleBrand} ${vehicleName}`,
      deleted: `Vehicle deleted: ${vehicleBrand} ${vehicleName}`,
    };

    const message = actionMessages[action];

    // Insert notification for each admin
    const notifications = adminRoles.map((admin) => ({
      user_id: admin.user_id,
      message,
      type: 'vehicle',
      related_entity_type: 'vehicle',
      related_entity_id: null,
    }));

    // Use service role through edge function or direct insert with admin privileges
    // Since notifications table doesn't allow regular INSERT, we need to use an edge function
    const { error: insertError } = await supabase.functions.invoke('create-vehicle-notification', {
      body: { notifications },
    });

    if (insertError) {
      console.error('Error creating vehicle notification:', insertError);
    }
  } catch (error) {
    console.error('Error in createVehicleNotification:', error);
  }
}
