import * as db from '../fake-db'

export const getUserByEmailAndPassword = async(uname: string, password: string)=>{
	let user = db.getUserByUsername(uname)
	if(user){
		if(user.password === password){
			return user;
		} else{
			return null
		}
	}
}
export const getUserById = async (id: number)=>{
	let user = db.getUser(id)
	return user ? user : null
}