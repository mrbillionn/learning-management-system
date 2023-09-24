"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Form, 
    FormItem,
    FormControl,
    FormDescription,
    FormField,
    FormLabel,
    FormMessage,

} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionFormProps {
    initialData: {
        description: string;
    };
    courseId: string;
}

const formSchema = z.object({
    description: z.string().min(1, {message: "description is required"}),
})

export const DescriptionForm = ({
    initialData,
    courseId,
} : DescriptionFormProps
) => {

    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current)=> !current);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });
    const { isSubmitting, isValid} = form.formState;
    const router = useRouter();


    const onSubmit = async ( values: z.infer<typeof formSchema> ) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course updated successfully");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
            
        }
        
    }
    return(
        <div className=" mt-6 border bg-slate-100 rounded-md p-4">
            <div className=" font-medium flex items-center justify-between">
                Course description
                <Button onClick={toggleEdit} variant="ghost">
                    { isEditing ? (<> Cancel</>) :
                        (<>
                            <Pencil className=" h-4 w-4 mr-2"/>
                            Edit description
                        </>
                        )
                    }
                </Button>
            </div>
            {
                !isEditing && (
                    <p className={cn(
                        " text-sm mt-2",
                        !initialData.description && "text-slate-500 italic"
                    )}>
                        {initialData.description || "No description"}
                    </p>
                )
            }
            {isEditing && (
                <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 mt-4"
                >
                    <FormField
                        control={form.control}
                        name="description"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>
                                    Course description
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        disabled={isSubmitting}
                                        placeholder=" e.g 'This course is about ...'"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    What will you teach in this course ?
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                     />
                     <div className=" flex items-center gap-x-2" >
                        <Button  disabled={!isValid || isSubmitting} type="submit">
                            Save changes
                        </Button>
                     </div>
                </form>
            </Form>
            )}
        
        </div>
    )
    }