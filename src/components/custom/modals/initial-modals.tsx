"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { useForm } from "react-hook-form"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Server name is required"
    }),
    imageUrl: z.string().min(1, {
        message: "Server name is required"
    }),

})

export default function InitialModal() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "Octavius The Server",
            imageUrl: " "
        }
    })

    const loading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
    }

    return (
        <Dialog open>
            <DialogContent className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-50 overflow-hidden" >
                <DialogHeader>
                    <DialogTitle>Customize your server Anon!</DialogTitle>
                    <DialogDescription>
                        Give your server a personality with a name and an image, you can always change it later.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="">
                        <div>
                            <div>
                                TODO: IMAGE UPLOAD
                            </div>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-slate-700 dark:text-slate-100">
                                            Server name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="Enter server name."
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            ></FormField>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
