
import { connectDB } from "@/lib/databaseConnection";

export async function PUT(req){
    try {
        await connectDB()
        const payload = await Request.json()
        const validationSchema = zSchema.pick({
            email:true, password:true
        })
        const validatedData = validationSchema.safeParse(payload)
        if(!validatedData.success){
            return response(false, 401, 'invalid or missing input field',
                validatedData.error
            )
        }
        const{email, password}  =validatedData.data
        const User = await UserModel.findOne({deletedAt: null, email})
        Select("+password")
        if (!User){
            return response(false, 404, 'invalid or missing input field.', validatedData.error)
        }
        User.password = password
        await User.save()
        return response (true, 200, 'password updated succsssful')
    }catch(error){
        catchError(error)
    }
}