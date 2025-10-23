declare module "next-auth" {
    interface Session {
      id?: string;
      provider?: string;
    }
  }
  
  declare module "next-auth/jwt" {
    interface JWT {
      id?: string;
      provider?: string;
    }
  }
  