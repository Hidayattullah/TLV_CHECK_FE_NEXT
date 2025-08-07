
"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  nik: z.string().min(1, { message: "NIK tidak boleh kosong." }),
  nama: z.string().min(1, { message: "Nama tidak boleh kosong." }),
  email: z.string().email({ message: "Format email tidak valid." }).optional().or(z.literal('')),
  telepon: z.string().min(1, { message: "Nomor telepon tidak boleh kosong." }),
  alamat: z.string().min(1, { message: "Alamat tidak boleh kosong." }),
  tanggalLahir: z.string().min(1, { message: "Tanggal lahir tidak boleh kosong." }),
  jenisKelamin: z.enum(["laki-laki", "perempuan"], { required_error: "Jenis kelamin harus dipilih." }),
  password: z.string().min(1, { message: "Password tidak boleh kosong." }),
  ulangiPassword: z.string().min(1, { message: "Ulangi password tidak boleh kosong." }),
}).refine(data => data.password === data.ulangiPassword, {
  message: "Password tidak cocok.",
  path: ["ulangiPassword"],
});


export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nik: "",
      nama: "",
      email: "",
      telepon: "",
      alamat: "",
      tanggalLahir: "",
      password: "",
      ulangiPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Registrasi Berhasil",
      description: "Akun Anda telah berhasil dibuat.",
    });
  }

  return (
    <div className="bg-background min-h-screen">
      <header className="bg-primary text-primary-foreground p-4 flex items-center gap-4 sticky top-0 z-10">
        <Link href="/login" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Registrasi</h1>
      </header>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-6 pb-24">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="nik"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="NIK" {...field} className="bg-accent/50 border-0 placeholder:text-foreground/60 h-12 rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Nama" {...field} className="bg-accent/50 border-0 placeholder:text-foreground/60 h-12 rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" placeholder="Email (Opsional)" {...field} className="bg-accent/50 border-0 placeholder:text-foreground/60 h-12 rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telepon"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="tel" placeholder="Nomor Telepon" {...field} className="bg-accent/50 border-0 placeholder:text-foreground/60 h-12 rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alamat"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Alamat" {...field} className="bg-accent/50 border-0 placeholder:text-foreground/60 h-12 rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tanggalLahir"
              render={({ field }) => (
                <FormItem>
                   <div className="relative">
                      <FormLabel className="absolute left-3 top-[-0.6rem] bg-background px-1 text-xs text-foreground/60">Tanggal Lahir</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="bg-accent/50 border-0 placeholder:text-foreground/60 h-12 rounded-lg text-foreground/60" />
                      </FormControl>
                    </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="jenisKelamin"
              render={({ field }) => (
                <FormItem className="space-y-2 pt-2">
                  <FormLabel className="text-foreground/60">Jenis Kelamin</FormLabel>
                   <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-6 pt-2"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="laki-laki" id="r1" />
                          </FormControl>
                          <Label htmlFor="r1" className="font-normal">Laki-laki</Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                           <FormControl>
                            <RadioGroupItem value="perempuan" id="r2" />
                           </FormControl>
                          <Label htmlFor="r2" className="font-normal">Perempuan</Label>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password" 
                        {...field}
                        className="bg-accent/50 border-0 placeholder:text-foreground/60 h-12 rounded-lg pr-12" 
                      />
                    </FormControl>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-1/2 right-2 -translate-y-1/2 text-foreground/60 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                   <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="ulangiPassword"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <Input 
                         type={showConfirmPassword ? "text" : "password"} 
                         placeholder="Ulangi Password" 
                        {...field}
                        className="bg-accent/50 border-0 placeholder:text-foreground/60 h-12 rounded-lg pr-12" 
                      />
                    </FormControl>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-1/2 right-2 -translate-y-1/2 text-foreground/60 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
            <Button type="submit" className="w-full h-12 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-semibold">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
