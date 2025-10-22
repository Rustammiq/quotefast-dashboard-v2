import { createClient } from './supabase/client';
import { logger } from './logger';
import { User } from '../types/user';
import { PostgrestError, SupabaseClient } from '@supabase/supabase-js';

const supabase = createClient() as SupabaseClient;

// Type definities
export interface AuthResponse {
  user: User | null;
  error: string | null;
  status: number;
}

// Authenticatie service met verbeterde error handling en sessie management

export const authServiceConfig = {
  pollIntervalMs: 2000,
  maxPollAttempts: 6,
  initialProfileWaitMs: 1000,
  getOrCreateProfileWaitMs: 2000
}

// Registreren van een nieuwe gebruiker
export const authService = {
  // Inloggen met email en wachtwoord
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      // Validatie
      if (!email || !password) {
        return {
          user: null,
          error: 'Email en wachtwoord zijn verplicht',
          status: 400
        };
      }

      // Inloggen bij Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        logger.error('Login error', 'auth', error);
        
        // Gebruiksvriendelijke foutmeldingen
        if (error.message.includes('Invalid login credentials')) {
          return {
            user: null,
            error: 'Ongeldige inloggegevens. Controleer je email en wachtwoord.',
            status: 401
          };
        }
        
        return {
          user: null,
          error: error.message,
          status: error.status || 500
        };
      }

      if (!data.user) {
        return {
          user: null,
          error: 'Inloggen mislukt. Probeer het later opnieuw.',
          status: 500
        };
      }

      // Haal gebruikersgegevens op met fallback voor ontbrekende profielen
      const userData = await authService.getOrCreateUserProfile(data.user.id, data.user.email || '', data.user.user_metadata);

      if (!userData) {
        return {
          user: null,
          error: 'Fout bij het ophalen van gebruikersgegevens',
          status: 500
        };
      }

      // Stel gebruiker samen
      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: userData.full_name || '',
        company: userData.company_name,
        subscription: userData.subscription
      };

      return {
        user,
        error: null,
        status: 200
      };
    } catch (error: any) {
      logger.error('Unexpected login error', 'auth', error);
      return {
        user: null,
        error: 'Er is een onverwachte fout opgetreden bij het inloggen',
        status: 500
      };
    }
  },

  register: async (email: string, password: string, name: string, company?: string): Promise<AuthResponse> => {
    try {
      // Validatie
      if (!email || !password || !name) {
        return {
          user: null,
          error: 'Email, wachtwoord en naam zijn verplicht',
          status: 400
        };
      }

      // Registreren bij Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            company_name: company
          }
        }
      });

      if (error) {
        logger.error('Registration error:', 'service', error);
        
        // Gebruiksvriendelijke foutmeldingen
        if (error.message.includes('already registered')) {
          return {
            user: null,
            error: 'Dit emailadres is al geregistreerd. Probeer in te loggen.',
            status: 409
          };
        }
        
        return {
          user: null,
          error: error.message,
          status: error.status || 500
        };
      }


      // Als Supabase e-mailbevestiging vereist, bevat de response soms geen `user`.
      // We proberen in dat geval het profiel op te halen via de `profiles` tabel (fallback)
      let userId: string | undefined = data.user?.id;

      if (!userId) {
        logger.info('No user returned from signUp response; attempting to find profile by email', 'auth');

          // Poll kort voor het aanmaken van het profiel door DB-trigger
          const maxAttempts = authServiceConfig.maxPollAttempts;
          for (let attempt = 0; attempt < maxAttempts && !userId; attempt++) {
            const { data: profileByEmail, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('email', email)
              .maybeSingle();

          if (profileError) {
            // bij tijdelijke fouten: wacht en retry
            logger.info(`Profile lookup error (attempt ${attempt + 1}): ${profileError.message || profileError}`, 'auth');
          }

          if (profileByEmail && profileByEmail.id) {
            userId = profileByEmail.id;
            break;
          }

          // Wacht tussen pogingen
          await new Promise(resolve => setTimeout(resolve, authServiceConfig.pollIntervalMs));
        }

        // Als we na polling nog geen userId hebben, vraag gebruiker te bevestigen via e-mail
        if (!userId) {
          return {
            user: null,
            error: 'Registratie succesvol gestart — controleer je e-mail om je account te activeren.',
            status: 202
          };
        }
      }

  // Wacht even voor de database trigger (nu langer omdat we niet meer handmatig aanmaken)
  await new Promise(resolve => setTimeout(resolve, authServiceConfig.initialProfileWaitMs));

      // Probeer het profiel op te halen of aan te maken
  const userData = await authService.getOrCreateUserProfile(userId, data.user?.email || email, { full_name: name, company_name: company });

      if (!userData) {
        return {
          user: null,
          error: 'Fout bij het aanmaken van gebruikersprofiel',
          status: 500
        };
      }

      // Stel gebruiker samen
      const user: User = {
        id: userId,
        email: data.user?.email || email,
        name,
        company
      };

      return {
        user,
        error: null,
        status: 200
      };
    } catch (error: any) {
      logger.error('Unexpected registration error:', 'service', error);
      return {
        user: null,
        error: 'Er is een onverwachte fout opgetreden bij het registreren',
        status: 500
      };
    }
  },

  // Helper functie om profiel op te halen of aan te maken
  getOrCreateUserProfile: async (userId: string, email: string, metadata?: any): Promise<any> => {
    try {
      // Wacht even voor de database trigger om het profile aan te maken
      await new Promise(resolve => setTimeout(resolve, authServiceConfig.getOrCreateProfileWaitMs));
      
      // Probeer het profiel op te halen (trigger zou het moeten hebben aangemaakt)
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) {
        logger.error('User data fetch error:', 'service', userError);
        
        // Als het profiel nog steeds niet bestaat na de trigger, probeer meerdere keren
        if (userError.code === 'PGRST116') {
          logger.info('Profile not found, attempting manual creation...', 'auth');
          
          // Probeer handmatig profiel aan te maken via RPC functie
          const { data: createResult, error: createError } = await supabase
            .rpc('create_user_profile', {
              user_id: userId,
              user_email: email,
              user_name: metadata?.full_name || metadata?.name,
              user_company: metadata?.company_name
            });
          
          if (createError) {
            logger.error('Manual profile creation failed:', 'service', createError);
            
            // Als RPC faalt, probeer directe insert als laatste redmiddel
            const { data: directInsertData, error: directInsertError } = await supabase
              .from('profiles')
              .insert({
                id: userId,
                email: email,
                full_name: metadata?.full_name || metadata?.name || 'User',
                company_name: metadata?.company_name,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .select()
              .single();
            
            if (directInsertError) {
              logger.error('Direct profile insert failed:', 'service', directInsertError);
              return null;
            }
            
            return directInsertData;
          }
          
          // Haal het zojuist aangemaakte profiel op
          if (createResult) {
            const { data: newProfileData, error: newProfileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single();
            
            if (newProfileError) {
              logger.error('Failed to fetch newly created profile:', 'service', newProfileError);
              return null;
            }
            
            return newProfileData;
          }
        }
        
        return null;
      }

      return userData;
    } catch (error) {
      logger.error('Error in getOrCreateUserProfile:', 'service', error);
      return null;
    }
  },

  // Uitloggen
  logout: async (): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        logger.error('Logout error:', 'service', error);
        return { error: error.message };
      }
      
      return { error: null };
    } catch (error: any) {
      logger.error('Unexpected logout error:', 'service', error);
      return { error: 'Er is een fout opgetreden bij het uitloggen' };
    }
  },

  // Huidige gebruiker ophalen
  getCurrentUser: async (): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error || !data.user) {
        return {
          user: null,
          error: error?.message || 'Geen gebruiker gevonden',
          status: 401
        };
      }

      // Haal gebruikersgegevens op
      const userData = await authService.getOrCreateUserProfile(data.user.id, data.user.email || '', data.user.user_metadata);

      if (!userData) {
        return {
          user: null,
          error: 'Fout bij het ophalen van gebruikersgegevens',
          status: 500
        };
      }

      // Stel gebruiker samen
      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: userData.full_name || '',
        company: userData.company_name,
        subscription: userData.subscription
      };

      return {
        user,
        error: null,
        status: 200
      };
    } catch (error: any) {
      logger.error('Unexpected getCurrentUser error:', 'service', error);
      return {
        user: null,
        error: 'Er is een fout opgetreden bij het ophalen van de gebruiker',
        status: 500
      };
    }
  },

  // Gebruikersgegevens bijwerken
  updateUser: async (userId: string, userData: Partial<User>): Promise<AuthResponse> => {
    try {
      // Validatie
      if (!userId) {
        return {
          user: null,
          error: 'Gebruikers-ID is verplicht',
          status: 400
        };
      }

      // Update gebruikersgegevens
      const updateData = {
        full_name: userData.name,
        company_name: userData.company,
        updated_at: new Date().toISOString(),
        ...userData
      };
      delete updateData.name;
      delete updateData.company;
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        logger.error('User update error:', 'service', error);
        return {
          user: null,
          error: error.message,
          status: 500
        };
      }

      // Stel bijgewerkte gebruiker samen
      const user: User = {
        id: data.id,
        email: data.email,
        name: data.full_name,
        company: data.company_name,
        subscription: data.subscription
      };

      return {
        user,
        error: null,
        status: 200
      };
    } catch (error: any) {
      logger.error('Unexpected updateUser error:', 'service', error);
      return {
        user: null,
        error: 'Er is een onverwachte fout opgetreden bij het bijwerken van de gebruiker',
        status: 500
      };
    }
  },

  // Wachtwoord reset
  resetPassword: async (email: string): Promise<{ error: string | null }> => {
    try {
      // Validatie
      if (!email) {
        return { error: 'Email is verplicht' };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        logger.error('Password reset error:', 'service', error);
        return { error: error.message };
      }

      return { error: null };
    } catch (error: any) {
      logger.error('Unexpected password reset error:', 'service', error);
      return { error: 'Er is een fout opgetreden bij het resetten van het wachtwoord' };
    }
  },

  // Wachtwoord wijzigen
  updatePassword: async (password: string): Promise<{ error: string | null }> => {
    try {
      // Validatie
      if (!password || password.length < 6) {
        return { error: 'Wachtwoord moet minimaal 6 tekens bevatten' };
      }

      const { error } = await supabase.auth.updateUser({
        password
      });

      if (error) {
        logger.error('Password update error:', 'service', error);
        return { error: error.message };
      }

      return { error: null };
    } catch (error: any) {
      logger.error('Unexpected password update error:', 'service', error);
      return { error: 'Er is een fout opgetreden bij het wijzigen van het wachtwoord' };
    }
  }
};
