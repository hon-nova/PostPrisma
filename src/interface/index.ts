export interface TUser {
	id: number; 
	uname: string;
	password: string
}

declare global{
	namespace Express {
	  interface User {
		 id: number,
		 uname: string,		 
		 password?:string,		 
	  }
	}
 }