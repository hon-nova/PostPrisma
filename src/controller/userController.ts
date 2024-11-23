import * as db from '../db'

export const getUserByEmailIdAndPassword = async(uname: string, password: string)=>{
	let user = await db.getUserByUsername(uname)
	if(user){
		if(user.password === password){
			return user;
		} else{
			return null
		}
	}
}
export const getUserById = async (id: number)=>{
	let user = await db.getUser(id)
	return user ? user : null
}