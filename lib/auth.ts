import * as Linking from 'expo-linking'
import { fetchAPI } from './fetch';
import { supabase } from '~/utils/supabase';

export const googleOAuth = async (startOAuthFlow: any) => {
    try {
      const { createdSessionId, signUp, signIn, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/(onboarding)/School', { scheme: 'myapp' }),
      })

      if (createdSessionId) {
        if(setActive) {
          await setActive!({session: createdSessionId})

          if(signUp.createdUserId) {
            const {data, error, statusText} = await supabase.from('test_users').insert({
                email: signUp.email,
                name: signUp.name,
                clerk_id: signUp.createdUserId,
            })

            if(error) {
              return {
                success: false,
                code: 'failed',
                message: error.message,
              }
            }
          }

          return {
            success: true,
            code: "success",
            message: "You have successfully authenticated",
          }
        }
      }

      return {
        success: false,
        code: "cancelled",
        message: "An error occurred while authenticating",
      }
        
    } catch (error: any) {
        console.error('OAuth error', error)

        return {
          success: false,
          code: error.code,
          message: error?.errors[0]?.longMessage || "An error occurred while authenticating",
    }
  }
}