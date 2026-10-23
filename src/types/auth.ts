/**
 * Interface que representa o usuário autenticado.
 * Mapeado do objeto `User` do Firebase, contendo apenas as propriedades utilizadas.
 */
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

/**
 * Interface de retorno do hook `useAuth`.
 */
export interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

/**
 * Tipo do contexto de autenticação (mesmo que UseAuthReturn).
 */
export type AuthContextType = UseAuthReturn;