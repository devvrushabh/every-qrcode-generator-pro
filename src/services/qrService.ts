import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';
import { QRCustomization, QRPayload, QRTypeID } from '../types/qr';

export type QRCodeRow = Database['public']['Tables']['qr_codes']['Row'];

export interface CreateQRCodeInput {
  name: string;
  type: QRTypeID;
  mode?: string;
  payload: string | QRPayload;
  configuration: QRCustomization;
  image_url?: string | null;
  short_code?: string | null;
  folder_id?: string | null;
  status?: string;
}

export const qrService = {
  async getUserQRCodes(userId: string): Promise<QRCodeRow[]> {
    try {
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching QR codes:', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('QR codes fetch exception:', err);
      return [];
    }
  },

  async getQRCodeById(qrId: string): Promise<QRCodeRow | null> {
    try {
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('id', qrId)
        .single();

      if (error) {
        console.error('Error fetching QR code by ID:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('QR code fetch exception:', err);
      return null;
    }
  },

  async createQRCode(userId: string, input: CreateQRCodeInput): Promise<QRCodeRow | null> {
    try {
      const payloadString = typeof input.payload === 'string' ? input.payload : JSON.stringify(input.payload);
      
      const { data, error } = await supabase
        .from('qr_codes')
        .insert({
          user_id: userId,
          name: input.name.trim() || 'My QR Code',
          type: input.type,
          mode: input.mode || 'static',
          payload: payloadString,
          configuration: input.configuration as any,
          image_url: input.image_url || null,
          short_code: input.short_code || null,
          folder_id: input.folder_id || null,
          status: input.status || 'active',
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating QR code:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('QR code create exception:', err);
      return null;
    }
  },

  async updateQRCode(qrId: string, updates: Partial<CreateQRCodeInput>): Promise<QRCodeRow | null> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (updates.name !== undefined) updateData.name = updates.name.trim();
      if (updates.type !== undefined) updateData.type = updates.type;
      if (updates.mode !== undefined) updateData.mode = updates.mode;
      if (updates.payload !== undefined) {
        updateData.payload = typeof updates.payload === 'string' ? updates.payload : JSON.stringify(updates.payload);
      }
      if (updates.configuration !== undefined) updateData.configuration = updates.configuration;
      if (updates.image_url !== undefined) updateData.image_url = updates.image_url;
      if (updates.short_code !== undefined) updateData.short_code = updates.short_code;
      if (updates.folder_id !== undefined) updateData.folder_id = updates.folder_id;
      if (updates.status !== undefined) updateData.status = updates.status;

      const { data, error } = await supabase
        .from('qr_codes')
        .update(updateData)
        .eq('id', qrId)
        .select()
        .single();

      if (error) {
        console.error('Error updating QR code:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('QR code update exception:', err);
      return null;
    }
  },

  async deleteQRCode(qrId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('qr_codes')
        .delete()
        .eq('id', qrId);

      if (error) {
        console.error('Error deleting QR code:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('QR code delete exception:', err);
      return false;
    }
  },

  async duplicateQRCode(qrId: string): Promise<QRCodeRow | null> {
    try {
      const original = await this.getQRCodeById(qrId);
      if (!original) return null;

      const { data, error } = await supabase
        .from('qr_codes')
        .insert({
          user_id: original.user_id,
          folder_id: original.folder_id,
          name: `${original.name} Copy`,
          type: original.type,
          mode: original.mode,
          payload: original.payload,
          configuration: original.configuration,
          status: original.status,
        })
        .select()
        .single();

      if (error) {
        console.error('Error duplicating QR code:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('QR code duplicate exception:', err);
      return null;
    }
  },

  async uploadQRImage(userId: string, qrId: string, imageFile: Blob | File, fileExt: string = 'png'): Promise<string | null> {
    try {
      const filePath = `${userId}/${qrId}/qr-code.${fileExt}`;
      const contentType = fileExt === 'svg' ? 'image/svg+xml' : 'image/png';

      const { error: uploadError } = await supabase.storage
        .from('qr-images')
        .upload(filePath, imageFile, {
          contentType,
          upsert: true,
        });

      if (uploadError) {
        console.error('Error uploading QR image file to Supabase Storage:', uploadError);
        return null;
      }

      const { data } = supabase.storage.from('qr-images').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err: any) {
      console.error('QR image upload exception:', err);
      return null;
    }
  },

  async recordScanEvent(qrId: string, metadata: { device_type?: string; browser?: string; os?: string; country?: string; city?: string; ip_address?: string }) {
    try {
      const { error } = await supabase
        .from('qr_scans')
        .insert({
          qr_code_id: qrId,
          scanned_at: new Date().toISOString(),
          device_type: metadata.device_type || 'Desktop',
          browser: metadata.browser || 'Chrome',
          os: metadata.os || 'Windows',
          country: metadata.country || 'United States',
          city: metadata.city || 'San Francisco',
          ip_address: metadata.ip_address || '127.0.0.1',
        });

      if (error) {
        console.error('Error recording scan event:', error);
      }
    } catch (err) {
      console.error('Scan event recording exception:', err);
    }
  },
};
